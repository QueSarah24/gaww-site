import Layout from '../components/Layout'

export default function About() {
  return (
    <Layout>
      <div style={{ background: 'var(--black)', minHeight: '100vh' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '64px 32px' }}>

          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(48px, 7vw, 80px)',
            fontWeight: 900, textTransform: 'uppercase', color: 'var(--white)',
            lineHeight: 0.95, marginBottom: 10, letterSpacing: '-0.01em',
          }}>About Us</h1>

          <p style={{
            fontSize: 17, color: 'rgba(255,255,255,0.55)',
            marginBottom: 40, lineHeight: 1.65,
          }}>
            Georgia Animal Welfare Watch is a community-driven reporting platform dedicated to
            increasing transparency around animal sale activity across the State of Georgia.
          </p>

          <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, marginBottom: 16 }}>
            The website allows members of the public to document and report observed animal sales,
            including online animal sales, parking lot transactions and other public animal sale activity.
          </p>

          <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, marginBottom: 40 }}>
            Our goal is to help identify patterns and trends in animal sales, support animal welfare
            efforts, and provide communities, advocates, and policymakers with better information
            about where and how animals are being sold.
          </p>

          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 900,
            textTransform: 'uppercase', color: 'var(--andromeda)', margin: '44px 0 14px',
          }}>Our Mission</h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, marginBottom: 16 }}>
            Georgia Animal Welfare Watch helps communities document and better understand animal
            sale activity throughout Georgia. By collecting public observations, we can identify
            trends, support animal welfare efforts, and promote responsible treatment of animals.
          </p>

          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 900,
            textTransform: 'uppercase', color: 'var(--andromeda)', margin: '44px 0 14px',
          }}>Reporting Guidelines</h2>
          <ul style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.9, marginLeft: 22, marginBottom: 16 }}>
            <li>Report only what you personally observed.</li>
            <li>Be factual and objective.</li>
            <li>Describe actions and observations rather than assumptions.</li>
            <li>Upload screenshots/photos whenever possible.</li>
            <li>Respect the privacy of individuals.</li>
          </ul>

          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 900,
            textTransform: 'uppercase', color: 'var(--andromeda)', margin: '44px 0 14px',
          }}>What Should Be Reported?</h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, marginBottom: 8 }}>
            You may submit a report if you observe:
          </p>
          <ul style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.9, marginLeft: 22, marginBottom: 16 }}>
            <li>Animals being sold in parking lots</li>
            <li>Animals being sold online such as Facebook, Craigslist, Nextdoor, etc.</li>
            <li>Roadside animal sales</li>
            <li>Animal sales at flea markets</li>
            <li>Public sales of puppies, kittens, rabbits, birds, reptiles, livestock, or other animals</li>
            <li>Repeated animal sale activity at the same location</li>
          </ul>

          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 900,
            textTransform: 'uppercase', color: 'var(--andromeda)', margin: '44px 0 14px',
          }}>Privacy and Data Use</h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, marginBottom: 16 }}>
            We collect no identifying information about report submitters. Exact location data
            submitted with a report is visible only to moderators and is never published.
            Public maps display approximate locations only.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, marginBottom: 16 }}>
            Approved reports are made publicly available for research and educational use.
          </p>

          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 900,
            textTransform: 'uppercase', color: 'var(--andromeda)', margin: '44px 0 14px',
          }}>Disclaimer</h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, marginBottom: 16 }}>
            Georgia Animal Welfare Watch does not determine whether any individual, business,
            or organization has violated any law. Reports represent community-submitted observations
            and are published for informational and educational purposes only.
          </p>

          <h2 id="contact" style={{
            fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 900,
            textTransform: 'uppercase', color: 'var(--andromeda)', margin: '44px 0 14px',
          }}>Contact Us</h2>
          <div style={{
            background: 'var(--black-soft)', borderTop: '3px solid var(--indigo)',
            padding: 32, marginTop: 8,
          }}>
            <div style={{ marginBottom: 16 }}>
              <label className="form-label">Name (optional)</label>
              <input type="text" className="form-input" placeholder="Your name" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="form-label">Email <span className="req">*</span></label>
              <input type="email" className="form-input" placeholder="your@email.com" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="form-label">Subject</label>
              <select className="form-select">
                <option>General inquiry</option>
                <option>Report a technical issue</option>
                <option>Media inquiry</option>
                <option>Partnership</option>
                <option>Other</option>
              </select>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label className="form-label">Message <span className="req">*</span></label>
              <textarea className="form-textarea" placeholder="Write your message here…" />
            </div>
            <button className="btn btn-primary">Send Message</button>
          </div>

        </div>
      </div>
    </Layout>
  )
}