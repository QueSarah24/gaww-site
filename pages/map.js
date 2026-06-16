import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'

function animalEmoji(type) {
  const map = { 'Dog': '🐕', 'Cat': '🐱', 'Other': '🐾' }
  return map[type] || '🐾'
}

function formatDate(str) {
  if (!str) return ''
  return new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Georgia bounding box
const GA_LAT_MIN = 30.36, GA_LAT_MAX = 35.00
const GA_LNG_MIN = -85.61, GA_LNG_MAX = -80.84

export default function MapPage() {
  const [reports, setReports] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [countyFilter, setCountyFilter] = useState('')
  const [animalFilter, setAnimalFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  useEffect(() => { loadReports() }, [])

  async function loadReports() {
    setLoading(true)
    const { data, error } = await supabase
      .from('public_reports')
      .select('*')
      .limit(200)
    if (!error && data) setReports(data)
    setLoading(false)
  }

  const filtered = reports.filter(r => {
    const matchCounty = !countyFilter || r.county === countyFilter
    const matchAnimal = !animalFilter || r.animal_type === animalFilter
    const matchType = !typeFilter || r.report_type === typeFilter
    return matchCounty && matchAnimal && matchType
  })

  function getMarkerPosition(r) {
    if (!r.latitude || !r.longitude) return null
    const x = ((r.longitude - GA_LNG_MIN) / (GA_LNG_MAX - GA_LNG_MIN)) * 100
    const y = ((GA_LAT_MAX - r.latitude) / (GA_LAT_MAX - GA_LAT_MIN)) * 100
    if (x < 0 || x > 100 || y < 0 || y > 100) return null
    return { x, y }
  }

  return (
    <Layout>
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', height: 'calc(100vh - 64px)' }}>

        {/* Sidebar */}
        <aside style={{
          background: 'var(--black-soft)',
          borderRight: '2px solid rgba(255,255,255,0.08)',
          overflowY: 'auto', padding: 20,
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900,
            textTransform: 'uppercase', color: 'var(--white)', marginBottom: 20,
          }}>Filter Reports</h2>

          <div style={{ marginBottom: 16 }}>
            <label className="form-label">Animal type</label>
            <select className="form-select" value={animalFilter}
              onChange={e => setAnimalFilter(e.target.value)}
              style={{ padding: '8px 10px', fontSize: 13 }}>
              <option value="">All animals</option>
              <option>Dog</option>
              <option>Cat</option>
              <option>Other</option>
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="form-label">Report type</label>
            <select className="form-select" value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              style={{ padding: '8px 10px', fontSize: 13 }}>
              <option value="">All types</option>
              <option>Online Listing</option>
              <option>Public Sale</option>
              <option>Other</option>
            </select>
          </div>

          {/* Results list */}
          <div style={{ marginTop: 20 }}>
            <div style={{
              fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 12,
              fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              {loading ? 'Loading…' : `Showing ${filtered.length} report${filtered.length !== 1 ? 's' : ''}`}
            </div>

            {filtered.length === 0 && !loading && (
              <div style={{ padding: '24px 8px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
                No approved reports yet
              </div>
            )}

            {filtered.map(r => (
              <div key={r.id}
                onClick={() => setSelected(r)}
                style={{
                  padding: 12,
                  borderLeft: `3px solid ${selected?.id === r.id ? 'var(--lime)' : 'rgba(255,255,255,0.1)'}`,
                  marginBottom: 8, cursor: 'pointer',
                  background: selected?.id === r.id ? 'rgba(200,240,53,0.1)' : 'rgba(255,255,255,0.03)',
                  transition: 'all 0.12s',
                }}
              >
                <h4 style={{
                  fontSize: 13, fontWeight: 700, color: 'var(--white)',
                  marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.02em',
                }}>
                  {animalEmoji(r.animal_type)} {r.report_type}
                </h4>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {r.city || r.county || 'Georgia'} · {formatDate(r.date_observed)}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Map area */}
        <div style={{ position: 'relative', background: '#0a0a0a', overflow: 'hidden' }}>

          {/* Georgia map image */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <img
                src="/georgia-map.png"
                alt="Georgia Counties Map"
                style={{
                  width: '100%', height: '100%', objectFit: 'contain',
                  filter: 'hue-rotate(200deg) saturate(0.6) brightness(0.55) contrast(1.2)',
                  display: 'block',
                }}
              />

              {/* Markers */}
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                {filtered.map(r => {
                  const pos = getMarkerPosition(r)
                  if (!pos) return null
                  const color = r.report_type === 'Online Listing' ? 'var(--indigo)' :
                    r.report_type === 'Public Sale' ? 'var(--lime)' : 'rgba(255,255,255,0.7)'
                  return (
                    <div
                      key={r.id}
                      onClick={() => setSelected(r)}
                      style={{
                        position: 'absolute',
                        left: `${pos.x}%`, top: `${pos.y}%`,
                        width: 12, height: 12,
                        background: color,
                        border: '2px solid #fff',
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                        cursor: 'pointer',
                        pointerEvents: 'all',
                        zIndex: 5,
                      }}
                      title={`${r.report_type} — ${r.city || r.county}`}
                    />
                  )
                })}
              </div>
            </div>
          </div>

          {/* No reports message */}
          {!loading && filtered.length === 0 && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none',
            }}>
              <div style={{
                background: 'rgba(0,0,0,0.75)', border: '2px solid rgba(255,255,255,0.1)',
                padding: '20px 32px', textAlign: 'center',
              }}>
                <p style={{
                  fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 900,
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 4,
                }}>No approved reports yet</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>
                  Reports will appear as pins once approved
                </p>
              </div>
            </div>
          )}

          {/* Popup */}
          {selected && (
            <div style={{
              position: 'absolute', background: 'var(--black)',
              border: '2px solid var(--lime)', padding: 18, width: 270,
              zIndex: 10, top: '10%', left: '50%', transform: 'translateX(-50%)',
            }}>
              <button
                onClick={() => setSelected(null)}
                style={{
                  position: 'absolute', top: 10, right: 10,
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 18, color: 'rgba(255,255,255,0.5)',
                }}>✕</button>
              <h4 style={{
                fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 900,
                textTransform: 'uppercase', color: 'var(--white)', marginBottom: 6,
              }}>{animalEmoji(selected.animal_type)} {selected.report_type}</h4>
              <div style={{
                fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 10,
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>
                📍 {selected.city || selected.county || 'Georgia'} &nbsp;·&nbsp; {formatDate(selected.date_observed)}
              </div>
              <div style={{ marginBottom: 8 }}>
                <span className="tag tag-gray" style={{ fontSize: 11 }}>{selected.animal_type}</span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                {selected.description?.slice(0, 180)}{selected.description?.length > 180 ? '…' : ''}
              </p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
                📍 Approximate location only.
              </p>
            </div>
          )}

          {/* Legend */}
          <div style={{
            position: 'absolute', bottom: 16, left: 16,
            background: 'var(--black)', border: '2px solid rgba(255,255,255,0.15)',
            padding: 14, fontSize: 12,
          }}>
            <h5 style={{
              fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 800,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'var(--lime)', marginBottom: 10,
            }}>Legend</h5>
            {[
              { color: 'var(--lime)', label: 'Public Sale' },
              { color: 'var(--indigo)', label: 'Online Listing' },
              { color: 'rgba(255,255,255,0.5)', label: 'Other' },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5, color: 'rgba(255,255,255,0.65)' }}>
                <div style={{ width: 10, height: 10, background: color, borderRadius: '50%' }} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}