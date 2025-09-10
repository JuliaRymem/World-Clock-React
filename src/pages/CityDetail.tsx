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
      {/* Länk tillbaka */}
      <Link className="back-link" to="/" style={{ display: 'block', textAlign: 'center' }}>
        ← Tillbaka
      </Link>

      {/* En sektion med titel över bild + “kort” under */}
      <div className="detail-section">
        {/* NY: Titel/meta över bilden */}
        <header className="detail-header">
          <h2 className="detail-title detail-title--top">{city.name}</h2>
          <div className="detail-meta-top">
            Tidszon: {city.timeZone} • Route: /city/{baseId}
          </div>
        </header>

        {/* Bilden (hero) utan titel överlagrad */}
        <section className="detail-hero" aria-label={`Bild på ${city.name}`}>
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

        {/* Rutan under bilden */}
        <div className="detail-card">
          <div className="detail-clock">
            {city.viewMode === 'analog' ? (
              <AnalogClock epochMs={now} timeZone={city.timeZone} size={220} />
            ) : (
              <div className="detail-time">{formatTime(now, city.timeZone)}</div>
            )}
            <div className="detail-meta">{formatDate(now, city.timeZone)}</div>
          </div>

          {/* Toggle digital/analog */}
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

          {/* Åtgärder */}
          <div className="detail-actions">
            <button className="btn btn-danger" onClick={removeCity}>Ta bort</button>
          </div>
        </div>
      </div>
    </div>
  )
}