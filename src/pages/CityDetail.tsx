// A simple page that shows the details for one city
// - Loads city data from localStorage
// - Finds the city based on the id in the URL
// - Displays the time (digital or analog), date, and timezone
// - Allows toggling between digital/analog and removing the city

import { useParams, Link, useNavigate } from 'react-router-dom'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { City } from '../types/City'
import { useNow } from '../hooks/useNow'
import { formatDate, formatTime } from '../utils/time'
import { AnalogClock } from '../components/AnalogClock'

const LS_KEY = 'worldclock:cities'

export default function CityDetail() {
  // Read the "id" from the URL, e.g. /city/stockholm
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const now = useNow(1000) // current time that updates every second

  // Load cities from localStorage
  const [cities, setCities] = useLocalStorage<City[]>(LS_KEY, [])

  // Find the city that matches the id in the URL
  const city = cities.find(c => c.id === id)

  // If no city is found, show an error message + back link
  if (!city) {
    return (
      <div className="container">
        <Link className="back-link" to="/">← Back to start</Link>
        <h2 style={{ textAlign: 'center' }}>City not found</h2>
        <p className="muted" style={{ textAlign: 'center' }}>
          Check the link or add the city again from the homepage.
        </p>
      </div>
    )
  }

  // Helpers to switch between digital/analog
  const setDigital = () =>
    setCities(prev => prev.map(c => (c.id === city.id ? { ...c, viewMode: 'digital' } : c)))
  const setAnalog = () =>
    setCities(prev => prev.map(c => (c.id === city.id ? { ...c, viewMode: 'analog' } : c)))

  // Remove the city and go back to homepage
  const removeCity = () => {
    if (confirm('Remove this city?')) {
      setCities(prev => prev.filter(c => c.id !== city.id))
      navigate('/')
    }
  }

  // Base id (without random suffix) just for showing the route
  const baseId = city.id.split('-')[0]

  return (
    <div className="container">
      {/* Back link to homepage */}
      <Link className="back-link" to="/" style={{ display: 'block', textAlign: 'center' }}>
        ← Tillbaka
      </Link>

      <div className="detail-section">
        {/* Title and info above the image */}
        <header className="detail-header">
          <h2 className="detail-title detail-title--top">{city.name}</h2>
          <div className="detail-meta-top">
            Time zone: {city.timeZone} • Route: /city/{baseId}
          </div>
        </header>

        {/* Hero image */}
        <section className="detail-hero" aria-label={`Photo of ${city.name}`}>
          <div
            className="detail-bg"
            style={{
              backgroundImage: `url(${
                city.imageUrl ??
                'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1600&auto=format&fit=crop'
              })`
            }}
          />
        </section>

        {/* Card under the image with clock, date and actions */}
        <div className="detail-card">
          {/* Show clock (analog or digital) */}
          <div className="detail-clock">
            {city.viewMode === 'analog' ? (
              <AnalogClock epochMs={now} timeZone={city.timeZone} size={220} />
            ) : (
              <div className="detail-time">{formatTime(now, city.timeZone)}</div>
            )}
            <div className="detail-meta">{formatDate(now, city.timeZone)}</div>
          </div>

          {/* Toggle buttons */}
          <div className="segmented" role="tablist" aria-label="Choose clock view">
            <button
              role="tab"
              aria-selected={city.viewMode !== 'analog'}
              className={`segmented__btn ${city.viewMode !== 'analog' ? 'is-active' : ''}`}
              onClick={setDigital}
            >
              Digital
            </button>
            <button
              role="tab"
              aria-selected={city.viewMode === 'analog'}
              className={`segmented__btn ${city.viewMode === 'analog' ? 'is-active' : ''}`}
              onClick={setAnalog}
            >
              Analog
            </button>
          </div>

          {/* Remove button */}
          <div className="detail-actions">
            <button className="btn btn-danger" onClick={removeCity}>Ta bort</button>
          </div>
        </div>
      </div>
    </div>
  )
}