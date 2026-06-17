import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Layout({ children }) {
  const router = useRouter()

  return (
    <>
      {/* ── Navbar ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--indigo)', color: 'var(--white)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 64, maxWidth: 1120, margin: '0 auto', padding: '0 32px',
        }}>
          {/* Logo */}
          <Link href="/" style={{
            fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 900,
            color: 'var(--white)', textDecoration: 'none', textTransform: 'uppercase',
            letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <img src="/LOGO.png" alt="Georgia Animal Welfare Network" style={{ height: 56, width: 56, borderRadius: '50%' }} />
<span>Georgia <span style={{ color: 'var(--lime)' }}>Animal Welfare Network</span></span>
          </Link>

          {/* Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {[
              { href: '/', label: 'Home' },
              { href: '/map', label: 'Map' },
              { href: '/reports', label: 'Reports' },
              { href: '/about', label: 'About' },
              { href: '/donate', label: 'Donate' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{
                background: 'none', border: 'none',
                color: router.pathname === href ? 'var(--lime)' : 'rgba(255,255,255,0.8)',
                padding: '8px 14px', fontSize: 14, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.04em',
                fontFamily: 'var(--font-display)', textDecoration: 'none',
                transition: 'color 0.1s',
              }}>
                {label}
              </Link>
            ))}
            <Link href="/submit" style={{
              background: 'var(--lime)', color: 'var(--black)',
              marginLeft: 8, padding: '8px 18px', fontSize: 13,
              fontFamily: 'var(--font-display)', fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              textDecoration: 'none',
            }}>
              Submit Report
            </Link>
            <Link href="/admin" style={{
              background: 'rgba(255,255,255,0.12)', color: 'var(--white)',
              marginLeft: 6, padding: '8px 14px', fontSize: 13,
              fontFamily: 'var(--font-display)', fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              textDecoration: 'none',
            }}>
              Moderator
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Page content ── */}
      <main>{children}</main>

      {/* ── Footer ── */}
      <footer style={{
        background: 'var(--black)', color: 'rgba(255,255,255,0.5)',
        padding: '56px 0 32px', borderTop: '3px solid var(--indigo)',
      }}>
        <div className="container">
          <div style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: 40, marginBottom: 44,
          }}>
            <div>
              <h3 style={{
                fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900,
                textTransform: 'uppercase', color: 'var(--white)', marginBottom: 12,
              }}>
                <img src="/LOGO.png" alt="Georgia Animal Welfare Network" style={{ height: 56, width: 56, borderRadius: '50%' }} />
<span>Georgia <span style={{ color: 'var(--lime)' }}>Animal Welfare Network</span></span>
              </h3>
              <p style={{ fontSize: 13, lineHeight: 1.7 }}>
                A community-driven platform for documenting animal sale activity across Georgia. Anonymous reporting. Public transparency.
              </p>
            </div>
            <div>
              <h4 style={{
                fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 800,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.25)', marginBottom: 16,
              }}>Platform</h4>
              {[['Submit a Report', '/submit'], ['View the Map', '/map'], ['Browse Reports', '/reports']].map(([label, href]) => (
                <Link key={href} href={href} style={{ display: 'block', fontSize: 14, marginBottom: 10, color: 'rgba(255,255,255,0.5)' }}>{label}</Link>
              ))}
            </div>
            <div>
              <h4 style={{
                fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 800,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.25)', marginBottom: 16,
              }}>Organization</h4>
              {[['About Us', '/about'], ['Reporting Guidelines', '/about#guidelines'], ['Disclaimer', '/about#disclaimer'], ['Contact', '/about#contact']].map(([label, href]) => (
                <Link key={href} href={href} style={{ display: 'block', fontSize: 14, marginBottom: 10, color: 'rgba(255,255,255,0.5)' }}>{label}</Link>
              ))}
            </div>
            <div>
              <h4 style={{
                fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 800,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.25)', marginBottom: 16,
              }}>Support</h4>
              {[['Donate', '/donate'], ['Volunteer', '/about#contact'], ['Share the Platform', '/about']].map(([label, href]) => (
                <Link key={href} href={href} style={{ display: 'block', fontSize: 14, marginBottom: 10, color: 'rgba(255,255,255,0.5)' }}>{label}</Link>
              ))}
            </div>
          </div>
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20,
            display: 'flex', justifyContent: 'space-between', fontSize: 12,
            textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            <span>© {new Date().getFullYear()} Georgia Animal Welfare Network. All rights reserved.</span>
            <span>Built for transparency. Powered by community.</span>
          </div>
        </div>
      </footer>
    </>
  )
}