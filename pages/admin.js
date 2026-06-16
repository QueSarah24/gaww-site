import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'

function formatDate(str) {
  if (!str) return ''
  return new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function Admin() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState(null)
  const [loginLoading, setLoginLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('queue')
  const [reports, setReports] = useState([])
  const [allReports, setAllReports] = useState([])
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, counties: 0 })
  const [selectedReport, setSelectedReport] = useState(null)
  const [modNote, setModNote] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
      if (session) { loadQueue(); loadStats() }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) { loadQueue(); loadStats() }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleLogin(e) {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError(null)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setLoginError(error.message); setLoginLoading(false); return }
    const { data: mod } = await supabase.from('moderators').select('*').eq('id', data.user.id).eq('is_active', true).maybeSingle()
    if (!mod) {
      await supabase.auth.signOut()
      setLoginError('Your account does not have moderator access.')
      setLoginLoading(false)
      return
    }
    setLoginLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setSession(null)
  }

  async function loadQueue() {
    const { data } = await supabase.from('reports').select('*, report_photos(*)').eq('status', 'pending').order('created_at', { ascending: false })
    setReports(data || [])
  }

  async function loadAllReports() {
    const { data } = await supabase.from('reports').select('*, report_photos(*)').order('created_at', { ascending: false }).limit(100)
    setAllReports(data || [])
  }

  async function loadStats() {
    const { count: total } = await supabase.from('reports').select('*', { count: 'exact', head: true })
    const { count: approved } = await supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'approved')
    const { count: pending } = await supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending')
    const { data: counties } = await supabase.from('reports').select('county').eq('status', 'approved')
    const uniqueCounties = new Set((counties || []).map(r => r.county).filter(Boolean)).size
    setStats({ total: total || 0, approved: approved || 0, pending: pending || 0, counties: uniqueCounties })
  }

  async function updateStatus(id, status) {
    await supabase.from('reports').update({ status, reviewed_at: new Date().toISOString() }).eq('id', id)
    setSelectedReport(null)
    loadQueue()
    loadStats()
    if (activeTab === 'reports') loadAllReports()
  }

  async function saveNote(id) {
    await supabase.from('reports').update({ moderator_notes: modNote }).eq('id', id)
    alert('Notes saved.')
  }

  async function exportCSV() {
    const { data } = await supabase.from('reports').select('id,created_at,animal_type,report_type,date_observed,city,county,status,description').order('created_at', { ascending: false })
    const headers = ['ID', 'Submitted', 'Animal Type', 'Report Type', 'Date Observed', 'City', 'County', 'Status', 'Description']
    const rows = (data || []).map(r => [r.id, r.created_at, r.animal_type, r.report_type, r.date_observed, r.city, r.county, r.status, `"${(r.description || '').replace(/"/g, '""')}"`])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'gaww-reports.csv'; a.click()
  }

  function switchTab(tab) {
    setActiveTab(tab)
    setSelectedReport(null)
    if (tab === 'queue') loadQueue()
    if (tab === 'reports') loadAllReports()
    if (tab === 'analytics') loadStats()
  }

  function getPhotoUrl(filePath) {
    const { data } = supabase.storage.from('report-photos').getPublicUrl(filePath)
    return data.publicUrl
  }

  const statusTag = (status) => {
    const styles = {
      pending: { background: '#ffcc00', color: '#000' },
      approved: { background: 'var(--lime)', color: '#000' },
      rejected: { background: '#ff3333', color: '#fff' },
      archived: { background: 'var(--gray-light)', color: 'rgba(255,255,255,0.6)' },
    }
    return (
      <span style={{ ...styles[status], padding: '3px 8px', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {status}
      </span>
    )
  }

  if (loading) return <Layout><div style={{ padding: 60, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Loading…</div></Layout>

  if (!session) return (
    <Layout>
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--black)' }}>
        <div style={{ background: 'var(--black-soft)', border: '2px solid rgba(255,255,255,0.1)', borderTop: '3px solid var(--lime)', padding: '48px 44px', width: '100%', maxWidth: 420 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔐</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 900, textTransform: 'uppercase', color: 'var(--white)', marginBottom: 4 }}>Moderator Login</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 32 }}>Access the GAWW moderation dashboard. Authorized personnel only.</p>
          {loginError && (
            <div style={{ background: 'rgba(255,51,51,0.1)', border: '2px solid #ff3333', padding: '12px 16px', marginBottom: 20, color: '#ff9999', fontSize: 14 }}>{loginError}</div>
          )}
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label className="form-label">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-input" placeholder="moderator@gaww.org" required />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label className="form-label">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-input" placeholder="••••••••" required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loginLoading}>
              {loginLoading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: 16, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Authorized moderators only.</p>
        </div>
      </div>
    </Layout>
  )

  return (
    <Layout>
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: 'calc(100vh - 64px)' }}>

        {/* Sidebar */}
        <nav style={{ background: 'var(--black)', borderRight: '2px solid rgba(255,255,255,0.06)', padding: '24px 0', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ padding: '16px 20px 20px', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 900, color: '#fff' }}>🐾 GAWW Admin</div>
          {[
            { id: 'queue', label: '📋 Review Queue', badge: stats.pending },
            { id: 'reports', label: '📁 All Reports' },
            { id: 'analytics', label: '📊 Analytics' },
            { id: 'export', label: '💾 Export Data' },
          ].map(({ id, label, badge }) => (
            <button key={id} onClick={() => switchTab(id)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px',
              fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em',
              color: activeTab === id ? 'var(--lime)' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer', border: 'none', background: 'none', textAlign: 'left',
              fontFamily: 'var(--font-display)',
              borderLeft: `3px solid ${activeTab === id ? 'var(--lime)' : 'transparent'}`,
            }}>
              {label}
              {badge > 0 && <span style={{ marginLeft: 'auto', background: 'var(--lime)', color: 'var(--black)', fontSize: 10, fontWeight: 800, padding: '2px 7px' }}>{badge}</span>}
            </button>
          ))}
          <div style={{ marginTop: 'auto', padding: 20 }}>
            <button onClick={handleLogout} style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase' }}>← Log out</button>
          </div>
        </nav>

        {/* Main */}
        <div style={{ background: 'var(--black-soft)', overflowY: 'auto' }}>
          <div style={{ background: 'var(--black)', borderBottom: '2px solid rgba(255,255,255,0.06)', padding: '18px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, textTransform: 'uppercase', color: 'var(--white)' }}>
              {activeTab === 'queue' && 'Moderation Queue'}
              {activeTab === 'reports' && 'All Reports'}
              {activeTab === 'analytics' && 'Analytics'}
              {activeTab === 'export' && 'Export Data'}
            </h2>
          </div>

          <div style={{ padding: 28 }}>

            {/* QUEUE */}
            {activeTab === 'queue' && (
              <div>
                <div style={{ background: 'var(--black)', border: '2px solid rgba(255,255,255,0.06)', marginBottom: 20, overflow: 'hidden' }}>
                  <table>
                    <thead>
                      <tr><th>ID</th><th>Submitted</th><th>City</th><th>Animal</th><th>Type</th><th>Photos</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {reports.length === 0 && (
                        <tr><td colSpan={8} style={{ textAlign: 'center', padding: 32, color: 'rgba(255,255,255,0.35)' }}>No pending reports — queue is clear ✓</td></tr>
                      )}
                      {reports.map(r => (
                        <tr key={r.id}>
                          <td style={{ fontWeight: 700, color: 'var(--lime)' }}>#{r.id.slice(0, 8)}</td>
                          <td>{formatDate(r.created_at)}</td>
                          <td>{r.city}</td>
                          <td>{r.animal_type}</td>
                          <td>{r.report_type}</td>
                          <td>{r.report_photos?.length || 0}</td>
                          <td>{statusTag(r.status)}</td>
                          <td>
                            <button className="action-btn action-view" onClick={() => { setSelectedReport(r); setModNote(r.moderator_notes || '') }}>View</button>
                            <button className="action-btn action-approve" onClick={() => updateStatus(r.id, 'approved')}>Approve</button>
                            <button className="action-btn action-reject" onClick={() => updateStatus(r.id, 'rejected')}>Reject</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Report detail panel */}
                {selectedReport && (
                  <div style={{ background: 'var(--black)', border: '2px solid rgba(255,255,255,0.08)', borderTop: '3px solid var(--lime)', padding: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 900, textTransform: 'uppercase', color: 'var(--white)' }}>
                        Report #{selectedReport.id.slice(0, 8)}
                      </h3>
                      <button onClick={() => setSelectedReport(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'rgba(255,255,255,0.4)' }}>✕</button>
                    </div>

                    {/* Details grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 20 }}>
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--lime)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>Details</p>
                        <table style={{ fontSize: 13 }}>
                          <tbody>
                            {[
                              ['Animal type', selectedReport.animal_type],
                              ['Report type', selectedReport.report_type],
                              ['Date observed', formatDate(selectedReport.date_observed)],
                              ['City', selectedReport.city],
                              ['Address (private)', selectedReport.address || 'Not provided'],
                              ['Coordinates', selectedReport.latitude ? `${selectedReport.latitude}°N, ${selectedReport.longitude}°W` : 'Not provided'],
                              ['Submitted', formatDate(selectedReport.created_at)],
                              ['Status', selectedReport.status],
                            ].map(([label, value]) => (
                              <tr key={label}>
                                <td style={{ color: 'rgba(255,255,255,0.4)', padding: '4px 16px 4px 0', whiteSpace: 'nowrap' }}>{label}</td>
                                <td style={{ color: label.includes('private') || label === 'Coordinates' ? 'var(--lime)' : 'rgba(255,255,255,0.8)' }}>{value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--lime)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>Description</p>
                        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, background: 'rgba(255,255,255,0.04)', padding: 14, border: '1px solid rgba(255,255,255,0.08)' }}>
                          {selectedReport.description}
                        </p>
                      </div>
                    </div>

                    {/* Photos */}
                    <div style={{ marginBottom: 20 }}>
                      <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--lime)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>
                        Photos ({(selectedReport.report_photos || []).length})
                      </p>
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        {(selectedReport.report_photos || []).length === 0 && (
                          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>No photos submitted</p>
                        )}
                        {(selectedReport.report_photos || []).map(photo => (
                          <img
                            key={photo.id}
                            src={getPhotoUrl(photo.file_path)}
                            alt="Report photo"
                            style={{ width: 150, height: 110, objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
                            onClick={() => window.open(getPhotoUrl(photo.file_path), '_blank')}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Moderator notes */}
                    <div style={{ marginBottom: 20 }}>
                      <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--lime)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Moderator Notes</p>
                      <textarea value={modNote} onChange={e => setModNote(e.target.value)} className="form-textarea" style={{ minHeight: 80 }} placeholder="Add internal notes…" />
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <button className="btn btn-primary btn-sm" onClick={() => updateStatus(selectedReport.id, 'approved')}>✓ Approve</button>
                      <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }} onClick={() => updateStatus(selectedReport.id, 'archived')}>Archive</button>
                      <button className="btn btn-sm" style={{ background: '#ff3333', color: '#fff' }} onClick={() => updateStatus(selectedReport.id, 'rejected')}>✗ Reject</button>
                      <button className="btn btn-sm btn-indigo" onClick={() => saveNote(selectedReport.id)}>Save Notes</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ALL REPORTS */}
            {activeTab === 'reports' && (
              <div style={{ background: 'var(--black)', border: '2px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <table>
                  <thead>
                    <tr><th>ID</th><th>Date</th><th>City</th><th>Animal</th><th>Type</th><th>Photos</th><th>Status</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {allReports.length === 0 && (
                      <tr><td colSpan={8} style={{ textAlign: 'center', padding: 32, color: 'rgba(255,255,255,0.35)' }}>No reports yet</td></tr>
                    )}
                    {allReports.map(r => (
                      <tr key={r.id}>
                        <td style={{ fontWeight: 700, color: 'var(--lime)' }}>#{r.id.slice(0, 8)}</td>
                        <td>{formatDate(r.created_at)}</td>
                        <td>{r.city}</td>
                        <td>{r.animal_type}</td>
                        <td>{r.report_type}</td>
                        <td>{r.report_photos?.length || 0}</td>
                        <td>{statusTag(r.status)}</td>
                        <td>
                          <button className="action-btn action-view" onClick={() => { setSelectedReport(r); setModNote(r.moderator_notes || ''); setActiveTab('queue') }}>View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ANALYTICS */}
            {activeTab === 'analytics' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2, marginBottom: 24, background: 'rgba(255,255,255,0.04)' }}>
                  {[
                    { label: 'Total Reports', value: stats.total },
                    { label: 'Approved', value: stats.approved },
                    { label: 'Pending', value: stats.pending },
                    { label: 'Counties', value: stats.counties },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ background: 'var(--black)', padding: 22, borderTop: '3px solid var(--indigo)' }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 900, color: 'var(--white)', lineHeight: 1 }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EXPORT */}
            {activeTab === 'export' && (
              <div style={{ background: 'var(--black)', border: '2px solid rgba(255,255,255,0.06)', padding: 24 }}>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, marginBottom: 20 }}>
                  Export all reports as a CSV file. Includes report ID, date, animal type, report type, city, county, status, and description.
                </p>
                <button className="btn btn-primary" onClick={exportCSV}>⬇ Export as CSV</button>
              </div>
            )}

          </div>
        </div>
      </div>
    </Layout>
  )
}