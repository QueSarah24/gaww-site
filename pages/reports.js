import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

function formatDate(str) {
  if (!str) return ''
  return new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function animalColor(type) {
  if (type === 'Dog') return { bg: 'rgba(193,216,47,0.15)', border: '#C1D82F', text: '#6b8a00' }
  if (type === 'Cat') return { bg: 'rgba(75,62,136,0.2)', border: '#4B3E88', text: '#A793C6' }
  return { bg: 'rgba(247,26,89,0.12)', border: '#F71A59', text: '#F71A59' }
}

function typeColor(type) {
  if (type === 'Online Listing') return '#1F448A'
  if (type === 'Public Sale') return '#C1D82F'
  return '#A793C6'
}

export default function Reports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [animalFilter, setAnimalFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  useEffect(() => { loadReports() }, [])

  async function loadReports() {
    setLoading(true)
    const { data, error } = await supabase
      .from('public_reports')
      .select('*')
      .order('date_observed', { ascending: false })
      .limit(100)
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
            justifyContent: 'space-between', marginBottom: 36, gap: 24, flexWrap: 'wrap',
          }}>
            <div>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(42px, 6vw, 70px)',
                fontWeight: 900, textTransform: 'uppercase', color: 'var(--white)',
                lineHeight: 0.95, marginBottom: 6,
              }}>Reports Directory</h1>
              <p style={{ color: 'var(--orbit)', fontSize: 14 }}>
                Browse approved, publicly visible reports across Georgia.
              </p>
            </div>
            <Link href="/submit" className="btn btn-primary">+ Submit Report</Link>
          </div>

          {/* Filters */}
          <div style={{
            display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 4,
            padding: '16px 20px', background: 'var(--black-soft)',
            borderTop: '3px solid var(--indigo)', alignItems: 'flex-end',
          }}>
            <div style={{ flex: 1, minWidth: 180 }}>
              <label className="form-label">Search</label>
              <input type="text" className="form-input" placeholder="Search reports…"
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ padding: '8px 10px', fontSize: 13 }} />
            </div>
            <div style={{ minWidth: 130 }}>
              <label className="form-label">Animal</label>
              <select className="form-select" value={animalFilter}
                onChange={e => setAnimalFilter(e.target.value)}
                style={{ padding: '8px 10px', fontSize: 13 }}>
                <option value="">All animals</option>
                <option>Dog</option>
                <option>Cat</option>
                <option>Other</option>
              </select>
            </div>
            <div style={{ minWidth: 150 }}>
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

          {/* Count */}
          <div style={{
            fontSize: 12, color: 'var(--orbit)', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.06em',
            padding: '10px 0 16px',
          }}>
            {loading ? 'Loading…' : `${filtered.length} report${filtered.length !== 1 ? 's' : ''}`}
          </div>

          {/* List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--orbit)' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, textTransform: 'uppercase' }}>Loading reports…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{
              padding: '60px 40px', textAlign: 'center',
              background: 'var(--black-soft)', borderTop: '3px solid var(--indigo)',
            }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 900, textTransform: 'uppercase', color: 'var(--orbit)', marginBottom: 8 }}>
                No reports yet
              </p>
              <p style={{ fontSize: 14, color: 'var(--orbit)', opacity: 0.6 }}>
                Approved reports will appear here once submitted and reviewed.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {filtered.map(r => {
                const aColor = animalColor(r.animal_type)
                const tColor = typeColor(r.report_type)
                return (
                  <div key={r.id} style={{
                    display: 'flex', gap: 16, padding: '18px 20px',
                    background: 'var(--black-soft)', alignItems: 'flex-start',
                    borderLeft: `4px solid ${tColor}`,
                    transition: 'background 0.1s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-light)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--black-soft)'}
                  >
                    {/* Icon box */}
                    <div style={{
                      width: 44, height: 44, borderRadius: 6, flexShrink: 0,
                      background: aColor.bg, border: `1.5px solid ${aColor.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 900,
                        textTransform: 'uppercase', color: aColor.text, letterSpacing: '0.02em',
                      }}>
                        {r.animal_type?.slice(0, 3) || 'OTH'}
                      </span>
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                        <h3 style={{
                          fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 900,
                          textTransform: 'uppercase', color: 'var(--white)', lineHeight: 1,
                        }}>{r.report_type}</h3>
                        <span style={{
                          fontSize: 11, fontWeight: 700, color: 'var(--orbit)',
                          textTransform: 'uppercase', letterSpacing: '0.06em',
                        }}>
                          {r.animal_type}
                        </span>
                      </div>
                      <div style={{
                        fontSize: 12, color: 'var(--orbit)', marginBottom: 6,
                        textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600,
                      }}>
                        📍 {r.city || r.county || 'Georgia'} &nbsp;·&nbsp; {formatDate(r.date_observed)}
                      </div>
                      <p style={{
                        fontSize: 14, color: 'rgba(255,243,231,0.6)', lineHeight: 1.55,
                        overflow: 'hidden', display: '-webkit-box',
                        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                      }}>
                        {r.description}
                      </p>
                    </div>

                    {/* Type badge */}
                    <div style={{
                      flexShrink: 0, padding: '4px 10px',
                      fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                      letterSpacing: '0.05em', color: tColor,
                      border: `1.5px solid ${tColor}`,
                      whiteSpace: 'nowrap', alignSelf: 'center',
                    }}>
                      {r.report_type === 'Online Listing' ? 'Online' : r.report_type === 'Public Sale' ? 'Public Sale' : 'Other'}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

        </div>
      </div>
    </Layout>
  )
}
