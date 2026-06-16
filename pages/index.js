import Layout from '../components/Layout'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

export default function Home({ stats }) {
  return (
    <Layout>
      {/* ── Hero ── */}
      <section style={{
        background: 'var(--indigo)', color: 'var(--white)',
        padding: '100px 0 110px', position: 'relative', overflow: 'hidden',
      }}>
        <div className="container">
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 800,
            textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--lime)',
            marginBottom: 20, display: 'block',
          }}>
            🐾 Community-Powered Documentation
          </span>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(60px, 9vw, 110px)',
            fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.01em',
            textTransform: 'uppercase', marginBottom: 24, color: 'var(--white)',
          }}>
            Documenting Animal<br />
            Sales Across <span style={{ color: 'var(--lime)' }}>Georgia</span>
          </h1>
          <p style={{
            fontSize: 18, color: 'rgba(255,255,255,0.75)',
            maxWidth: 560, marginBottom: 36, lineHeight: 1.6,
          }}>
            Georgia Animal Welfare Watch is a public platform for reporting and tracking
            animal sale activity. Together, we build the data needed to protect animals statewide.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/submit" className="btn btn-primary btn-lg">Submit a Report</Link>
            <Link href="/map" className="btn btn-secondary btn-lg">View the Map</Link>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 1, marginTop: 80, background: 'rgba(255,255,255,0.1)',
          }}>
            {[
              { num: stats.total || 0, label: 'Reports submitted' },
              { num: stats.counties || 0, label: 'Counties covered' },
              { num: stats.thisMonth || 0, label: 'Reports this month' },
            ].map(({ num, label }) => (
              <div key={label} style={{
                background: 'var(--indigo)', padding: '28px 24px',
                borderTop: '3px solid rgba(255,255,255,0.15)',
              }}>
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 900,
                  color: 'var(--lime)', display: 'block', lineHeight: 1,
                  letterSpacing: '-0.02em',
                }}>{num.toLocaleString()}</span>
                <div style={{
                  fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)',
                  marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission strip ── */}
      <section style={{ background: 'var(--black-soft)', padding: '60px 0' }}>
        <div className="container">
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center',
          }}>
            <div>
              <div className="section-title">Our Mission</div>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16, lineHeight: 1.75, marginTop: 16 }}>
                Georgia Animal Welfare Watch helps communities document and better understand
                animal sale activity throughout Georgia. By collecting public observations,
                we can identify trends, support animal welfare efforts, and promote responsible
                treatment of animals.
              </p>
            </div>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2,
              background: 'rgba(255,255,255,0.06)',
            }}>
              {[
                { icon: '📋', label: 'Anonymous reporting' },
                { icon: '🗺️', label: 'Interactive map' },
                { icon: '🔍', label: 'Searchable database' },
                { icon: '🔒', label: 'Privacy protected' },
              ].map(({ icon, label }) => (
                <div key={label} style={{
                  background: 'var(--black)', padding: '28px 24px',
                  borderTop: '3px solid var(--indigo)',
                }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 900,
                    textTransform: 'uppercase', color: 'var(--white)',
                  }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: 'var(--lime)', padding: '60px 56px' }}>
        <div className="container" style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 32, flexWrap: 'wrap',
        }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5vw, 60px)',
              fontWeight: 900, textTransform: 'uppercase', color: 'var(--black)',
              lineHeight: 0.95, marginBottom: 10,
            }}>See something?<br />Report it.</h2>
            <p style={{ color: 'rgba(0,0,0,0.65)', fontSize: 15, maxWidth: 480 }}>
              Anyone can submit an anonymous report. No account required.
              Your observation helps build a clearer picture of animal sale
              activity across Georgia.
            </p>
          </div>
          <Link href="/submit" className="btn btn-lg" style={{
            background: 'var(--black)', color: 'var(--lime)', flexShrink: 0,
          }}>
            Submit a Report →
          </Link>
        </div>
      </section>

    </Layout>
  )
}

export async function getServerSideProps() {
  try {
    const { count: total } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')

    const { data: counties } = await supabase
      .from('reports')
      .select('county')
      .eq('status', 'approved')

    const uniqueCounties = new Set((counties || []).map(r => r.county).filter(Boolean)).size

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { count: thisMonth } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')
      .gte('created_at', startOfMonth.toISOString())

    return {
      props: {
        stats: {
          total: total || 0,
          counties: uniqueCounties || 0,
          thisMonth: thisMonth || 0,
        }
      }
    }
  } catch {
    return { props: { stats: { total: 0, counties: 0, thisMonth: 0 } } }
  }
}