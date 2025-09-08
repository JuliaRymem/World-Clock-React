// CityCard – klickbart kort som öppnar detaljvy.

import React from 'react'
import { useNavigate } from 'react-router-dom'
import type { City } from '../types/City'
import { formatDate, formatTime, diffFromLocalMinutes } from '../utils/time'
import { AnalogClock } from './AnalogClock'

export function CityCard({
  city,
  now,
  onRemove,
  onToggleView
}: {
  city: City
  now: number
  onRemove: (id: string) => void
  onToggleView: (id: string) => void
}) {
  const navigate = useNavigate()

  const minutesDiff = diffFromLocalMinutes(city.timeZone, now)
  const sign = minutesDiff === 0 ? '±' : minutesDiff > 0 ? '+' : '−'
  const absMin = Math.abs(minutesDiff)
  const h = Math.floor(absMin / 60)
  const m = absMin % 60
  const diffLabel = `${sign}${h}h${String(m).padStart(2, '0')}`

  const goToDetail = () => navigate(`/city/${encodeURIComponent(city.id)}`)

  // Hjälpare: stoppa att klicket bubblar upp till kortet
  const stop: React.MouseEventHandler = (e) => e.stopPropagation()

  return (
    <div
      className="card card--column card--clickable"
      onClick={goToDetail}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          goToDetail()
        }
      }}
      aria-label={`Öppna detaljvy för ${city.name}`}
    >
      {/* Stadens namn */}
      <div className="city-name">{city.name}</div>

      {/* Klocka (centrerad) */}
      <div className="card__clock">
        {city.viewMode === 'analog' ? (
          <AnalogClock epochMs={now} timeZone={city.timeZone} />
        ) : (
          <div className="time">{formatTime(now, city.timeZone)}</div>
        )}
      </div>

      {/* Info-rad */}
      <div className="meta">
        {formatDate(now, city.timeZone)} • {city.timeZone} • diff {diffLabel}
      </div>

      {/* Knappar för stoppa propagation så kortet inte klickas */}
      <div className="toolbar toolbar--center">
        <button className="btn" onClick={(e) => { stop(e); onToggleView(city.id) }}>
          {city.viewMode === 'analog' ? 'Byt till digital' : 'Byt till analog'}
        </button>
        <button className="btn btn-danger" onClick={(e) => { stop(e); onRemove(city.id) }}>
          Ta bort
        </button>
      </div>
    </div>
  )
}

export default CityCard