import { useState } from 'react'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'

export default function Submit() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])

  const [form, setForm] = useState({
    animal_type: '',
    report_type: '',
    date_observed: '',
    city: '',
    address: '',
    description: '',
  })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handlePhotos(e) {
    const selected = Array.from(e.target.files).slice(0, 10)
    setFiles(selected)
    setPreviews(selected.map(f => URL.createObjectURL(f)))
  }

  function removePhoto(idx) {
    const newFiles = files.filter((_, i) => i !== idx)
    const newPreviews = previews.filter((_, i) => i !== idx)
    setFiles(newFiles)
    setPreviews(newPreviews)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: report, error: reportError } = await supabase
        .from('reports')
        .insert({
          animal_type: form.animal_type,
          report_type: form.report_type,
          date_observed: form.date_observed,
          city: form.city,
          county: '',
          address: form.address || null,
          description: form.description,
          status: 'pending',
        })
        .select()
        .single()

      if (reportError) throw reportError

      for (const file of files) {
        const ext = file.name.split('.').pop()
        const path = `${report.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('report-photos')
          .upload(path, file, { contentType: file.type })

        if (!uploadError) {
          await supabase.from('report_photos').insert({
            report_id: report.id,
            file_path: path,
            file_name: file.name,
            file_size: file.size,
            is_public: false,
          })
        }
      }

      setSubmitted(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setSubmitted(false)
    setForm({ animal_type: '', report_type: '', date_observed: '', city: '', address: '', description: '' })
    setFiles([])
    setPreviews([])
  }

  return (
    <Layout>
      <div style={{ background: 'var(--black)', minHeight: '100vh' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '60px 32px' }}>

          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(42px, 7vw, 70px)',
            fontWeight: 900, textTransform: 'uppercase', color: 'var(--white)',
            lineHeight: 0.95, marginBottom: 12, letterSpacing: '-0.01em',
          }}>Submit a Report</h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, marginBottom: 48 }}>
            All reports are anonymous. Your submission will be reviewed before appearing publicly.
          </p>

          {submitted ? (
            <div style={{
              background: 'var(--lime)', padding: 32, textAlign: 'center',
            }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
              <h3 style={{
                fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 900,
                textTransform: 'uppercase', color: 'var(--black)', marginBottom: 8,
              }}>Report Received — Thank You!</h3>
              <p style={{ color: 'rgba(0,0,0,0.7)', fontSize: 14, marginBottom: 20 }}>
                Your submission has been sent to our moderation queue. Approved reports typically appear within 48 hours. No identifying information was collected.
              </p>
              <button className="btn btn-lg" onClick={resetForm}
                style={{ background: 'var(--black)', color: 'var(--lime)' }}>
                Submit Another Report
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>

              {/* Guidelines */}
              <div style={{
                background: 'rgba(200,240,53,0.08)', borderLeft: '3px solid var(--lime)',
                padding: '24px', marginBottom: 32,
              }}>
                <p style={{
                  fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 900,
                  textTransform: 'uppercase', color: 'var(--lime)', marginBottom: 16,
                }}>Reporting Guidelines</p>
                <ul style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.9, marginLeft: 20 }}>
                  <li>Report only what you personally observed.</li>
                  <li>Be factual and objective.</li>
                  <li>Describe actions and observations rather than assumptions.</li>
                  <li>Upload screenshots/photos whenever possible.</li>
                  <li>Respect the privacy of individuals.</li>
                </ul>
              </div>

              {error && (
                <div style={{
                  background: 'rgba(255,51,51,0.1)', border: '2px solid #ff3333',
                  padding: '14px 18px', marginBottom: 20, color: '#ff9999', fontSize: 14,
                }}>
                  Error: {error}
                </div>
              )}

              {/* What did you observe */}
              <div style={{ marginBottom: 36 }}>
                <h2 style={{
                  fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800,
                  color: 'var(--lime)', letterSpacing: '0.08em', textTransform: 'uppercase',
                  marginBottom: 16, paddingBottom: 12,
                  borderBottom: '2px solid rgba(255,255,255,0.1)',
                }}>What did you observe?</h2>

                <div className="form-row-2" style={{ marginBottom: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Animal Type <span className="req">*</span></label>
                    <select name="animal_type" value={form.animal_type} onChange={handleChange}
                      className="form-select" required>
                      <option value="">Select animal type</option>
                      <option>Dog</option>
                      <option>Cat</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Report Type <span className="req">*</span></label>
                    <select name="report_type" value={form.report_type} onChange={handleChange}
                      className="form-select" required>
                      <option value="">Select report type</option>
                      <option>Online Listing</option>
                      <option>Public Sale</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label">Date Observed <span className="req">*</span></label>
                  <input type="date" name="date_observed" value={form.date_observed}
                    onChange={handleChange} className="form-input" required />
                </div>

                <div className="form-group">
                  <label className="form-label">Description <span className="req">*</span></label>
                  <textarea name="description" value={form.description} onChange={handleChange}
                    className="form-textarea" required
                    placeholder="Describe what you observed in as much detail as possible..." />
                </div>
              </div>

              {/* Location */}
              <div style={{ marginBottom: 36 }}>
                <h2 style={{
                  fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800,
                  color: 'var(--lime)', letterSpacing: '0.08em', textTransform: 'uppercase',
                  marginBottom: 16, paddingBottom: 12,
                  borderBottom: '2px solid rgba(255,255,255,0.1)',
                }}>Location</h2>

                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label">City <span className="req">*</span></label>
                  <input type="text" name="city" value={form.city} onChange={handleChange}
                    className="form-input" required placeholder="e.g. Gainesville" />
                </div>

                <div className="form-group">
                  <label className="form-label">Street Address or Landmark (optional — for moderators only)</label>
                  <input type="text" name="address" value={form.address} onChange={handleChange}
                    className="form-input" placeholder="e.g. Corner of Hwy 365 and Duncan Bridge Rd" />
                </div>
              </div>

              {/* Photos */}
              <div style={{ marginBottom: 36 }}>
                <h2 style={{
                  fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800,
                  color: 'var(--lime)', letterSpacing: '0.08em', textTransform: 'uppercase',
                  marginBottom: 16, paddingBottom: 12,
                  borderBottom: '2px solid rgba(255,255,255,0.1)',
                }}>Photos</h2>

                <div className="upload-zone" onClick={() => document.getElementById('photo-input').click()}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>📷</div>
                  <strong style={{ color: 'var(--white)' }}>Click to upload photos</strong>
                  <p>JPG, PNG, HEIC up to 10MB each. Up to 10 photos.</p>
                  <input type="file" id="photo-input" multiple accept="image/*"
                    style={{ display: 'none' }} onChange={handlePhotos} />
                </div>

                {previews.length > 0 && (
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
                    {previews.map((src, i) => (
                      <div key={i} style={{ position: 'relative', width: 80, height: 80 }}>
                        <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button onClick={() => removePhoto(i)} style={{
                          position: 'absolute', top: -6, right: -6, width: 18, height: 18,
                          background: '#ff3333', border: 'none', color: '#fff',
                          fontSize: 11, cursor: 'pointer', borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Disclaimer */}
              <div style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                padding: 16, marginBottom: 28,
              }}>
                <p style={{ fontSize: 12, fontWeight: 800, color: 'var(--lime)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                  Important Disclaimer
                </p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.7 }}>
                  Reports published on Georgia Animal Welfare Watch are community-submitted observations and do not constitute proof of wrongdoing, unlawful activity, or violations of animal welfare laws. Published reports are intended solely for informational, educational, and research purposes.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Report Anonymously'}
                </button>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                  No personal data is collected or stored with this submission.
                </p>
              </div>

            </form>
          )}
        </div>
      </div>
    </Layout>
  )
}