// enkel sida
//laddar city via id från localStorage

import { useParams, Link, useNavigate } from 'react-router-dom'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { City } from '../types/City'
import { useNow } from '../hooks/useNow'
import { formatDate, formatTime } from '../utils/time'
import { AnalogClock } from '../components/AnalogClock'

const LS_KEY = 'worldclock:cities'

export default function CityDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const now = useNow(1000)

  const [cities, setCities] = useLocalStorage<City[]>(LS_KEY, [])
  const city = cities.find(c => c.id === id)

  if (!city) {
    return (
      <div className="container">
        <Link className="back-link" to="/">← Tillbaka</Link>
        <h2 style={{ textAlign: 'center' }}>Staden hittades inte</h2>
        <p className="muted" style={{ textAlign: 'center' }}>
          Kontrollera länken eller lägg till staden på startsidan.
        </p>
      </div>
    )
  }

  const setDigital = () =>
    setCities(prev => prev.map(c => (c.id === city.id ? { ...c, viewMode: 'digital' } : c)))
  const setAnalog = () =>
    setCities(prev => prev.map(c => (c.id === city.id ? { ...c, viewMode: 'analog' } : c)))
  const removeCity = () => {
    if (confirm('Ta bort stad?')) {
      setCities(prev => prev.filter(c => c.id !== city.id))
      navigate('/')
    }
  }

  const baseId = city.id.split('-')[0]

  return (
    <div className="container">
      {/* centrerad länk tillbaka till startsidan */}
      <Link className="back-link" to="/" style={{ display: 'block', textAlign: 'center' }}>
        ← Tillbaka
      </Link>

      {/* En stor detaljvy med bild, stadens namn, klocka, datum, tidszon, knappar */}
      <div className="detail-section">
        {/* Hero-sektionen med bakgrundsbild och stadens namn */}
        <section className="detail-hero">
          <div
            className="detail-bg"
            style={{
              backgroundImage: `url(${
                city.imageUrl ??
                'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1600&auto=format&fit=crop'
              })`
            }}
          />
          <div className="detail-content">
            <div className="detail-meta-top">
              Tidszon: {city.timeZone}<br />
              Route: /city/{baseId}
            </div>
            <div className="detail-title">{city.name}</div>
          </div>
        </section>

        {/* Rutan under med klocka + knappar */}
        <div className="detail-card">
          <div className="detail-clock">
            {city.viewMode === 'analog' ? (
              <AnalogClock epochMs={now} timeZone={city.timeZone} size={220} />
            ) : (
              <div className="detail-time">{formatTime(now, city.timeZone)}</div>
            )}
            <div className="detail-meta">{formatDate(now, city.timeZone)}</div>
          </div>

          {/* Segmenterad kontroll för visningsläge */}
          <div className="segmented" role="tablist" aria-label="Välj visningsläge">
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

          {/* Knappar */}
          <div className="detail-actions">
            <button className="btn btn-danger" onClick={removeCity}>Ta bort</button>
          </div>
        </div>
      </div>
    </div>
  )
}