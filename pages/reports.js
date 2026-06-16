import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

function animalEmoji(type) {
  const map = { 'Dog': '🐕', 'Cat': '🐱', 'Other': '🐾' }
  return map[type] || '🐾'
}

function formatDate(str) {
  if (!str) return ''
  return new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function Reports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [animalFilter, setAnimalFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  useEffect(() => {
    loadReports()
  }, [])

  async function loadReports() {
    setLoading(true)
    const { data, error } = await supabase
      .from('public_reports')
      .select('*')
      .order('date_observed', { ascending: false })
      .limit(50)

    if (!error && data) setReports(data)
    setLoading(false)
  }

  const filtered = reports.filter(r => {
    const matchSearch = !search ||
      r.description?.toLowerCase().includes(search.toLowerCase()) ||
      r.city?.toLowerCase().includes(search.toLowerCase()) ||
      r.county?.toLowerCase().includes(search.toLowerCase())
    const matchAnimal = !animalFilter || r.animal_type === animalFilter
    const matchType = !typeFilter || r.report_type === typeFilter
    return matchSearch && matchAnimal && matchType
  })

  return (
    <Layout>
      <div style={{ background: 'var(--black)', minHeight: '100vh' }}>
        <div className="container" style={{ paddingTop: 56, paddingBottom: 80 }}>

          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'space-between', marginBottom: 36, gap: 24,
          }}>
            <div>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(42px, 6vw, 70px)',
                fontWeight: 900, textTransform: 'uppercase', color: 'var(--white)',
                lineHeight: 0.95, marginBottom: 4,
              }}>Reports Directory</h1>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>
                Browse approved, publicly visible reports across Georgia.
              </p>
            </div>
            <Link href="/submit" className="btn btn-primary">+ Submit Report</Link>
          </div>

          {/* Filters */}
          <div style={{
            display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28,
            padding: 20, background: 'var(--black-soft)',
            borderTop: '3px solid var(--indigo)', alignItems: 'flex-end',
          }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label className="form-label">Search</label>
              <input type="text" className="form-input" placeholder="Search reports…"
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ padding: '8px 10px', fontSize: 13 }} />
            </div>
            <div style={{ minWidth: 140 }}>
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
            <div style={{ minWidth: 140 }}>
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
            <button className="btn btn-sm btn-indigo" onClick={loadReports}>Refresh</button>
          </div>

          {/* Results */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.35)' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 900, textTransform: 'uppercase' }}>
                Loading reports…
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr',
              background: 'rgba(255,255,255,0.06)',
            }}>
              <div style={{ padding: 60, textAlign: 'center', color: 'rgba(255,255,255,0.35)' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 900, textTransform: 'uppercase', marginBottom: 8 }}>
                  No reports yet
                </p>
                <p style={{ fontSize: 14 }}>Approved reports will appear here once submitted and reviewed.</p>
              </div>
            </div>
          ) : (
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 2, background: 'rgba(255,255,255,0.06)',
            }}>
              {filtered.map(r => (
                <div key={r.id} style={{
                  background: 'var(--black-soft)', overflow: 'hidden',
                  transition: 'background 0.12s', cursor: 'pointer',
                  borderTop: '3px solid transparent',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--gray-light)'
                    e.currentTarget.style.borderTopColor = 'var(--lime)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'var(--black-soft)'
                    e.currentTarget.style.borderTopColor = 'transparent'
                  }}
                >
                  <div style={{
                    height: 200, background: 'var(--gray-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 64,
                  }}>
                    {animalEmoji(r.animal_type)}
                  </div>
                  <div style={{ padding: 20 }}>
                    <h3 style={{
                      fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900,
                      textTransform: 'uppercase', color: 'var(--white)', marginBottom: 6, lineHeight: 1.1,
                    }}>{r.report_type}</h3>
                    <div style={{
                      fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 10,
                      textTransform: 'uppercase', letterSpacing: '0.04em',
                    }}>
                      📍 {r.city || r.county || 'Georgia'} &nbsp;·&nbsp; {formatDate(r.date_observed)}
                    </div>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.55 }}>
                      {r.description?.slice(0, 160)}{r.description?.length > 160 ? '…' : ''}
                    </p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 14 }}>
                      <span className="tag tag-amber">{r.animal_type}</span>
                      <span className="tag tag-gray">{r.report_type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </Layout>
  )
}