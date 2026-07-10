import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function Layout({ children }) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/map', label: 'Map' },
    { href: '/reports', label: 'Reports' },
    { href: '/about', label: 'About' },
    { href: '/donate', label: 'Donate' },
  ]

  return (
    <>
      {/* ── Navbar ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--indigo)', color: 'var(--white)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 64, maxWidth: 1120, margin: '0 auto', padding: '0 20px',
        }}>
          {/* Logo */}
          <Link href="/" onClick={() => setMenuOpen(false)} style={{
            fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 900,
            color: 'var(--white)', textDecoration: 'none', textTransform: 'uppercase',
            letterSpacing: '0.03em', display: 'flex', alignItems: 'center', gap: 8,
            flexShrink: 0,
          }}>
            <img src="/LOGO.png" alt="Georgia Animal Welfare Network" style={{ height: 44, width: 44, borderRadius: '50%', flexShrink: 0 }} />
            <span className="nav-title-text">Georgia <span style={{ color: 'var(--lime)' }}>Animal Welfare Network</span></span>
          </Link>

          {/* Desktop nav links */}
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {navItems.map(({ href, label }) => (
              <Link key={href} href={href} style={{
                background: 'none', border: 'none',
                color: router.pathname === href ? 'var(--lime)' : 'rgba(255,255,255,0.8)',
                padding: '8px 12px', fontSize: 14, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.04em',
                fontFamily: 'var(--font-display)', textDecoration: 'none',
              }}>
                {label}
              </Link>
            ))}
            <Link href="/submit" style={{
              background: 'var(--lime)', color: 'var(--black)',
              marginLeft: 6, padding: '8px 16px', fontSize: 13,
              fontFamily: 'var(--font-display)', fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: '0.05em',
              textDecoration: 'none', whiteSpace: 'nowrap',
            }}>
              Submit Report
            </Link>
            <Link href="/admin" style={{
              background: 'rgba(255,255,255,0.12)', color: 'var(--white)',
              marginLeft: 6, padding: '8px 12px', fontSize: 13,
              fontFamily: 'var(--font-display)', fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: '0.05em',
              textDecoration: 'none', whiteSpace: 'nowrap',
            }}>
              Moderator
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{
              display: 'none', background: 'none', border: 'none',
              color: 'var(--white)', fontSize: 26, cursor: 'pointer',
              padding: 4, flexShrink: 0,
            }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="mobile-menu" style={{
            background: 'var(--indigo-dark)',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', flexDirection: 'column', padding: '8px 0',
          }}>
            {navItems.map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)} style={{
                padding: '14px 24px', fontSize: 15, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.04em',
                color: router.pathname === href ? 'var(--lime)' : 'rgba(255,255,255,0.85)',
                fontFamily: 'var(--font-display)', textDecoration: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}>
                {label}
              </Link>
            ))}
            <Link href="/submit" onClick={() => setMenuOpen(false)} style={{
              margin: '12px 24px 6px', padding: '12px 0', textAlign: 'center',
              background: 'var(--lime)', color: 'var(--black)',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14,
              textTransform: 'uppercase', letterSpacing: '0.05em', textDecoration: 'none',
            }}>
              Submit Report
            </Link>
            <Link href="/admin" onClick={() => setMenuOpen(false)} style={{
              margin: '0 24px 12px', padding: '12px 0', textAlign: 'center',
              background: 'rgba(255,255,255,0.12)', color: 'var(--white)',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14,
              textTransform: 'uppercase', letterSpacing: '0.05em', textDecoration: 'none',
            }}>
              Moderator
            </Link>
          </div>
        )}
      </nav>

      {/* ── Page content ── */}
      <main>{children}</main>

      {/* ── Footer ── */}
      <footer style={{
        background: 'var(--black)', color: 'rgba(255,255,255,0.5)',
        padding: '48px 0 28px', borderTop: '3px solid var(--indigo)',
      }}>
        <div className="container">
          <div className="footer-grid" style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: 32, marginBottom: 36,
          }}>
            <div>
              <h3 style={{
                fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 900,
                textTransform: 'uppercase', color: 'var(--white)', marginBottom: 12,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <img src="/LOGO.png" alt="logo" style={{ height: 36, width: 36, borderRadius: '50%' }} />
                Georgia <span style={{ color: 'var(--lime)' }}>Animal Welfare Network</span>
              </h3>
              <p style={{ fontSize: 13, lineHeight: 1.7 }}>
                A community-driven platform for documenting animal sale activity across Georgia. Anonymous reporting. Public transparency.
              </p>
            </div>
            <div>
              <h4 style={{
                fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 800,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.25)', marginBottom: 14,
              }}>Platform</h4>
              {[['Submit a Report', '/submit'], ['View the Map', '/map'], ['Browse Reports', '/reports']].map(([label, href]) => (
                <Link key={href} href={href} style={{ display: 'block', fontSize: 14, marginBottom: 10, color: 'rgba(255,255,255,0.5)' }}>{label}</Link>
              ))}
            </div>
            <div>
              <h4 style={{
                fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 800,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.25)', marginBottom: 14,
              }}>Organization</h4>
              {[['About Us', '/about'], ['Reporting Guidelines', '/about'], ['Disclaimer', '/about'], ['Contact', '/about#contact']].map(([label, href]) => (
                <Link key={href} href={href} style={{ display: 'block', fontSize: 14, marginBottom: 10, color: 'rgba(255,255,255,0.5)' }}>{label}</Link>
              ))}
            </div>
            <div>
              <h4 style={{
                fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 800,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.25)', marginBottom: 14,
              }}>Support</h4>
              {[['Donate', '/donate'], ['Volunteer', '/about#contact'], ['Share the Platform', '/about']].map(([label, href]) => (
                <Link key={href} href={href} style={{ display: 'block', fontSize: 14, marginBottom: 10, color: 'rgba(255,255,255,0.5)' }}>{label}</Link>
              ))}
            </div>
          </div>
          <div className="footer-bottom" style={{
            borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 18,
            display: 'flex', justifyContent: 'space-between', fontSize: 12,
            textTransform: 'uppercase', letterSpacing: '0.05em', flexWrap: 'wrap', gap: 8,
          }}>
            <span>© {new Date().getFullYear()} Georgia Animal Welfare Network. All rights reserved.</span>
            <span>Built for transparency. Powered by community.</span>
          </div>
        </div>
      </footer>

      {/* Mobile responsive styles */}
      <style jsx global>{`
        @media (max-width: 880px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: block !important; }
          .nav-title-text { display: none; }
        }
        @media (max-width: 700px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
          .footer-bottom { flex-direction: column; text-align: center; }
        }
      `}</style>
    </>
  )
}
