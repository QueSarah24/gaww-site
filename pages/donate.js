import { useState } from 'react'
import Layout from '../components/Layout'

export default function Donate() {
  const [amount, setAmount] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [comment, setComment] = useState('')

  return (
    <Layout>
      {/* Hero */}
      <div style={{ background: 'var(--black)', padding: '80px 0 90px' }}>
        <div className="container">
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(56px, 9vw, 110px)',
            fontWeight: 900, textTransform: 'uppercase', marginBottom: 14,
            lineHeight: 0.92, letterSpacing: '-0.01em', color: 'var(--white)',
          }}>Help Support Georgia<br />Animal Welfare Network</h1>
          <p style={{ fontSize: 17, opacity: 0.6, maxWidth: 540, lineHeight: 1.6 }}>
            Your support helps fund our reporting platform, interactive map, moderation efforts,
            and public education initiatives.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div style={{ background: 'var(--black)' }}>
        <div className="container" style={{ paddingTop: 64, paddingBottom: 80 }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 60, alignItems: 'start',
          }}>

            {/* Left: mission */}
            <div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, lineHeight: 1.8, marginBottom: 20 }}>
                Georgia Animal Welfare Network is a community-driven initiative dedicated to documenting
                animal sale activity, increasing transparency, and promoting animal welfare throughout
                our state.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, lineHeight: 1.8, marginBottom: 32 }}>
                Every report submitted, photo reviewed, and map update maintained requires time,
                resources, and ongoing support. Your donation helps us continue providing a platform
                where community members can safely document and track animal sale activity.
              </p>

              <p style={{
                fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 900,
                textTransform: 'uppercase', color: 'var(--lime)',
                letterSpacing: '0.04em', marginBottom: 16,
              }}>Your Donation Helps Fund:</p>
              <ul style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, lineHeight: 2, marginLeft: 20 }}>
                <li>Website hosting and maintenance</li>
                <li>Secure photo storage and data management</li>
                <li>Interactive mapping tools and reporting systems</li>
                <li>Public education and outreach efforts</li>
                <li>Volunteer and moderation resources</li>
                <li>Future animal welfare research and advocacy initiatives</li>
              </ul>

              <div style={{
                marginTop: 40, padding: 24,
                borderLeft: '3px solid var(--lime)',
                background: 'rgba(200,240,53,0.06)',
              }}>
                <p style={{
                  fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900,
                  textTransform: 'uppercase', color: 'var(--white)', marginBottom: 10,
                }}>Make A Difference Today</p>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, lineHeight: 1.75 }}>
                  Together, we can build a more informed community and support efforts that promote
                  the humane treatment and responsible care of animals throughout Georgia.
                </p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 12, fontStyle: 'italic' }}>
                  Thank you for supporting Georgia Animal Welfare Network.
                </p>
              </div>
            </div>

            {/* Right: donation form */}
            <div style={{
              background: 'var(--black-soft)',
              borderTop: '3px solid var(--lime)',
              padding: 36,
            }}>
              <p style={{
                fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 900,
                textTransform: 'uppercase', color: 'var(--white)', marginBottom: 6,
              }}>Make a Donation</p>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginBottom: 28 }}>
                All amounts welcome. Every contribution makes a difference.
              </p>

              <div style={{ marginBottom: 20 }}>
                <label className="form-label">Donation Amount</label>
                <div style={{
                  display: 'flex', alignItems: 'center',
                  background: 'rgba(255,255,255,0.05)',
                  border: '2px solid rgba(255,255,255,0.12)',
                }}>
                  <span style={{ padding: '12px 14px', color: 'rgba(255,255,255,0.4)', fontSize: 18, fontWeight: 700 }}>$</span>
                  <input
                    type="number" value={amount} onChange={e => setAmount(e.target.value)}
                    placeholder="Enter amount" min="1"
                    style={{
                      flex: 1, background: 'transparent', border: 'none',
                      color: 'var(--white)', fontSize: 18, fontWeight: 700,
                      padding: '12px 8px', outline: 'none', fontFamily: 'var(--font-body)',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label className="form-label">Name (optional)</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  className="form-input" placeholder="Your name" />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label className="form-label">Email (optional)</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="form-input" placeholder="your@email.com" />
              </div>

              <div style={{ marginBottom: 28 }}>
                <label className="form-label">Comment (optional)</label>
                <textarea value={comment} onChange={e => setComment(e.target.value)}
                  className="form-textarea"
                  placeholder="Leave a message or note with your donation…"
                  rows={3} />
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', fontSize: 17, padding: 15 }}
                onClick={() => alert('Donation flow will connect to Stripe or PayPal. Amount: $' + (amount || '0'))}
              >
                Donate Now →
              </button>
              <p style={{
                fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center',
                marginTop: 14, textTransform: 'uppercase', letterSpacing: '0.04em',
              }}>
                Georgia Animal Welfare Network is a community-driven initiative.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
