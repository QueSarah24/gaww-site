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

// Georgia county centers [lat, lng]
const COUNTY_COORDS = {
  'Appling': [31.749, -82.289], 'Atkinson': [31.296, -82.874], 'Bacon': [31.549, -82.454],
  'Baker': [31.327, -84.440], 'Baldwin': [33.070, -83.249], 'Banks': [34.349, -83.499],
  'Barrow': [33.993, -83.722], 'Bartow': [34.241, -84.851], 'Ben Hill': [31.757, -83.222],
  'Berrien': [31.272, -83.232], 'Bibb': [32.800, -83.692], 'Bleckley': [32.429, -83.330],
  'Brantley': [31.181, -82.042], 'Brooks': [30.836, -83.578], 'Bryan': [31.988, -81.439],
  'Bulloch': [32.397, -81.779], 'Burke': [32.996, -81.983], 'Butts': [33.286, -83.952],
  'Calhoun': [31.537, -84.615], 'Camden': [30.933, -81.634], 'Candler': [32.398, -82.072],
  'Carroll': [33.581, -85.080], 'Catoosa': [34.894, -85.141], 'Charlton': [30.780, -82.137],
  'Chatham': [31.972, -81.093], 'Chattahoochee': [32.351, -84.779], 'Chattooga': [34.474, -85.349],
  'Cherokee': [34.241, -84.472], 'Clarke': [33.951, -83.369], 'Clay': [31.627, -84.989],
  'Clayton': [33.541, -84.357], 'Clinch': [30.918, -82.700], 'Cobb': [33.940, -84.577],
  'Coffee': [31.548, -82.849], 'Colquitt': [31.172, -83.778], 'Columbia': [33.546, -82.269],
  'Cook': [31.147, -83.430], 'Coweta': [33.353, -84.769], 'Crawford': [32.717, -83.985],
  'Crisp': [31.924, -83.773], 'Dade': [34.857, -85.498], 'Dawson': [34.440, -84.171],
  'DeKalb': [33.771, -84.230], 'Decatur': [30.876, -84.578], 'Dodge': [32.174, -83.174],
  'Dooly': [32.166, -83.790], 'Dougherty': [31.535, -84.221], 'Douglas': [33.699, -84.763],
  'Early': [31.330, -84.896], 'Echols': [30.692, -83.009], 'Effingham': [32.371, -81.337],
  'Elbert': [34.112, -82.847], 'Emanuel': [32.584, -82.293], 'Evans': [32.167, -81.893],
  'Fannin': [34.854, -84.317], 'Fayette': [33.415, -84.497], 'Floyd': [34.267, -85.213],
  'Forsyth': [34.227, -84.127], 'Franklin': [34.369, -83.226], 'Fulton': [33.795, -84.466],
  'Gilmer': [34.690, -84.448], 'Glascock': [33.228, -82.601], 'Glynn': [31.212, -81.493],
  'Gordon': [34.499, -84.868], 'Grady': [30.872, -84.229], 'Greene': [33.578, -83.162],
  'Gwinnett': [33.960, -84.022], 'Habersham': [34.631, -83.527], 'Hall': [34.320, -83.808],
  'Hancock': [33.271, -83.003], 'Haralson': [33.793, -85.208], 'Harris': [32.734, -84.904],
  'Hart': [34.347, -82.961], 'Heard': [33.297, -85.127], 'Henry': [33.452, -84.158],
  'Houston': [32.468, -83.650], 'Irwin': [31.601, -83.274], 'Jackson': [34.131, -83.566],
  'Jasper': [33.312, -83.688], 'Jeff Davis': [31.804, -82.637], 'Jefferson': [33.057, -82.415],
  'Jenkins': [32.796, -81.965], 'Johnson': [32.697, -82.664], 'Jones': [33.024, -83.561],
  'Lamar': [33.073, -84.143], 'Lanier': [31.038, -83.069], 'Laurens': [32.458, -82.928],
  'Lee': [31.784, -84.140], 'Liberty': [31.832, -81.459], 'Lincoln': [33.795, -82.476],
  'Long': [31.754, -81.742], 'Lowndes': [30.833, -83.267], 'Lumpkin': [34.572, -83.996],
  'Macon': [32.357, -84.047], 'Madison': [34.118, -83.209], 'Marion': [32.354, -84.530],
  'McDuffie': [33.479, -82.478], 'McIntosh': [31.499, -81.371], 'Meriwether': [33.068, -84.680],
  'Miller': [31.163, -84.733], 'Mitchell': [31.215, -84.175], 'Monroe': [33.004, -83.921],
  'Montgomery': [32.180, -82.532], 'Morgan': [33.590, -83.489], 'Murray': [34.794, -84.748],
  'Muscogee': [32.510, -84.874], 'Newton': [33.551, -83.854], 'Oconee': [33.836, -83.434],
  'Oglethorpe': [33.877, -83.077], 'Paulding': [33.922, -84.874], 'Peach': [32.573, -83.818],
  'Pickens': [34.464, -84.468], 'Pierce': [31.352, -82.208], 'Pike': [33.092, -84.387],
  'Polk': [34.000, -85.188], 'Pulaski': [32.237, -83.470], 'Putnam': [33.319, -83.378],
  'Quitman': [31.868, -85.017], 'Rabun': [34.878, -83.400], 'Randolph': [31.768, -84.757],
  'Richmond': [33.359, -82.076], 'Rockdale': [33.649, -84.021], 'Schley': [32.261, -84.316],
  'Screven': [32.736, -81.607], 'Seminole': [30.943, -84.876], 'Spalding': [33.267, -84.297],
  'Stephens': [34.556, -83.302], 'Stewart': [32.076, -84.831], 'Sumter': [32.040, -84.192],
  'Talbot': [32.699, -84.529], 'Taliaferro': [33.564, -82.882], 'Tattnall': [31.988, -82.058],
  'Taylor': [32.555, -84.251], 'Telfair': [31.917, -82.940], 'Terrell': [31.769, -84.430],
  'Thomas': [30.859, -83.916], 'Tift': [31.460, -83.521], 'Toombs': [32.119, -82.327],
  'Towns': [34.917, -83.734], 'Treutlen': [32.401, -82.573], 'Troup': [33.034, -85.029],
  'Turner': [31.714, -83.626], 'Twiggs': [32.673, -83.426], 'Union': [34.834, -83.995],
  'Upson': [32.887, -84.295], 'Walker': [34.724, -85.298], 'Walton': [33.781, -83.726],
  'Ware': [31.052, -82.415], 'Warren': [33.411, -82.688], 'Washington': [32.966, -82.797],
  'Wayne': [31.551, -81.904], 'Webster': [31.978, -84.551], 'Wheeler': [32.118, -82.722],
  'White': [34.638, -83.752], 'Whitfield': [34.799, -84.970], 'Wilcox': [31.974, -83.426],
  'Wilkes': [33.793, -82.736], 'Wilkinson': [32.799, -83.170], 'Worth': [31.548, -83.852],
  // City fallbacks for common Georgia cities
  'Atlanta': [33.749, -84.388], 'Savannah': [32.0835, -81.0998], 'Augusta': [33.4735, -82.0105],
  'Columbus': [32.4610, -84.9877], 'Macon': [32.8407, -83.6324], 'Albany': [31.5785, -84.1557],
  'Athens': [33.9519, -83.3576], 'Gainesville': [34.2979, -83.8241], 'Jonesboro': [33.5218, -84.3541],
  'Marietta': [33.9526, -84.5499], 'Roswell': [34.0232, -84.3616], 'Alpharetta': [34.0754, -84.2941],
}

// Georgia bounding box
const GA_LAT_MIN = 30.36, GA_LAT_MAX = 35.00
const GA_LNG_MIN = -85.61, GA_LNG_MAX = -80.84

function getPositionForReport(r) {
  // Try county first, then city
  const key = r.county || r.city
  if (key && COUNTY_COORDS[key]) {
    const [lat, lng] = COUNTY_COORDS[key]
    // Add small random offset so markers don't stack exactly
    const jitter = 0.05
    const jLat = lat + (Math.random() - 0.5) * jitter
    const jLng = lng + (Math.random() - 0.5) * jitter
    const x = ((jLng - GA_LNG_MIN) / (GA_LNG_MAX - GA_LNG_MIN)) * 100
    const y = ((GA_LAT_MAX - jLat) / (GA_LAT_MAX - GA_LAT_MIN)) * 100
    if (x >= 0 && x <= 100 && y >= 0 && y <= 100) return { x, y }
  }
  // Try city name directly
  if (r.city && COUNTY_COORDS[r.city]) {
    const [lat, lng] = COUNTY_COORDS[r.city]
    const x = ((lng - GA_LNG_MIN) / (GA_LNG_MAX - GA_LNG_MIN)) * 100
    const y = ((GA_LAT_MAX - lat) / (GA_LAT_MAX - GA_LAT_MIN)) * 100
    if (x >= 0 && x <= 100 && y >= 0 && y <= 100) return { x, y }
  }
  return null
}

export default function MapPage() {
  const [reports, setReports] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
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
    const matchAnimal = !animalFilter || r.animal_type === animalFilter
    const matchType = !typeFilter || r.report_type === typeFilter
    return matchAnimal && matchType
  })

  return (
    <Layout>
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', height: 'calc(100vh - 64px)' }}>

        {/* Sidebar */}
        <aside style={{ background: 'var(--black-soft)', borderRight: '2px solid rgba(255,255,255,0.08)', overflowY: 'auto', padding: 20 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, textTransform: 'uppercase', color: 'var(--white)', marginBottom: 20 }}>Filter Reports</h2>

          <div style={{ marginBottom: 16 }}>
            <label className="form-label">Animal type</label>
            <select className="form-select" value={animalFilter} onChange={e => setAnimalFilter(e.target.value)} style={{ padding: '8px 10px', fontSize: 13 }}>
              <option value="">All animals</option>
              <option>Dog</option><option>Cat</option><option>Other</option>
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="form-label">Report type</label>
            <select className="form-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ padding: '8px 10px', fontSize: 13 }}>
              <option value="">All types</option>
              <option>Online Listing</option><option>Public Sale</option><option>Other</option>
            </select>
          </div>

          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {loading ? 'Loading…' : `Showing ${filtered.length} report${filtered.length !== 1 ? 's' : ''}`}
            </div>

            {filtered.length === 0 && !loading && (
              <div style={{ padding: '24px 8px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>No approved reports yet</div>
            )}

            {filtered.map(r => (
              <div key={r.id} onClick={() => setSelected(r)} style={{
                padding: 12,
                borderLeft: `3px solid ${selected?.id === r.id ? 'var(--lime)' : 'rgba(255,255,255,0.1)'}`,
                marginBottom: 8, cursor: 'pointer',
                background: selected?.id === r.id ? 'rgba(200,240,53,0.1)' : 'rgba(255,255,255,0.03)',
                transition: 'all 0.12s',
              }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--white)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
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

          {/* UltiMaps iframe */}
          <div style={{ position: 'absolute', inset: 0 }}>
            <iframe
              src="https://ultimaps.com/player/aac27158-a12e-4105-b1d9-7bf7b9ba1f1f"
              title="Interactive Map"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              style={{ width: '100%', height: '100%', border: 0 }}
            />
          </div>

          {/* Markers overlay */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {filtered.map(r => {
              const pos = getPositionForReport(r)
              if (!pos) return null
              const color = r.report_type === 'Online Listing' ? '#2a2aee' :
                r.report_type === 'Public Sale' ? '#c8f035' : 'rgba(255,255,255,0.7)'
              return (
                <div
                  key={r.id}
                  onClick={() => setSelected(r)}
                  title={`${r.report_type} — ${r.city || r.county}`}
                  style={{
                    position: 'absolute',
                    left: `${pos.x}%`, top: `${pos.y}%`,
                    width: 14, height: 14,
                    background: color,
                    border: '2px solid #fff',
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    cursor: 'pointer',
                    pointerEvents: 'all',
                    zIndex: 5,
                    boxShadow: '0 0 6px rgba(0,0,0,0.5)',
                  }}
                />
              )
            })}
          </div>

          {/* Popup */}
          {selected && (
            <div style={{
              position: 'absolute', background: 'var(--black)',
              border: '2px solid var(--lime)', padding: 18, width: 280,
              zIndex: 10, top: '10%', left: '50%', transform: 'translateX(-50%)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            }}>
              <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'rgba(255,255,255,0.5)' }}>✕</button>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 900, textTransform: 'uppercase', color: 'var(--white)', marginBottom: 6 }}>
                {animalEmoji(selected.animal_type)} {selected.report_type}
              </h4>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                📍 {selected.city || selected.county || 'Georgia'} &nbsp;·&nbsp; {formatDate(selected.date_observed)}
              </div>
              <div style={{ marginBottom: 8 }}>
                <span className="tag tag-gray" style={{ fontSize: 11 }}>{selected.animal_type}</span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                {selected.description?.slice(0, 200)}{selected.description?.length > 200 ? '…' : ''}
              </p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 10 }}>
                📍 Approximate county location shown.
              </p>
            </div>
          )}

          {/* Legend */}
          <div style={{ position: 'absolute', bottom: 16, left: 16, background: 'var(--black)', border: '2px solid rgba(255,255,255,0.15)', padding: 14, fontSize: 12, zIndex: 6 }}>
            <h5 style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--lime)', marginBottom: 10 }}>Legend</h5>
            {[
              { color: '#c8f035', label: 'Public Sale' },
              { color: '#2a2aee', label: 'Online Listing' },
              { color: 'rgba(255,255,255,0.5)', label: 'Other' },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5, color: 'rgba(255,255,255,0.65)' }}>
                <div style={{ width: 10, height: 10, background: color, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.3)' }} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

