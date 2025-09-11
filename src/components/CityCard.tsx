// CityCard - a single "card" that shows a city and its clock

import React from 'react'
import { useNavigate } from 'react-router-dom'
import type { City } from '../types/City'
import { formatDate, formatTime, diffFromLocalMinutes } from '../utils/time'
import { AnalogClock } from './AnalogClock'

type CityCardProps = {
  city: City
  now: number                         // current time in milliseconds
  onRemove: (id: string) => void      // remove city by id
  onToggleView: (id: string) => void  //switch between digital/analog
}

export function CityCard({ city, now, onRemove, onToggleView }: CityCardProps) {
  const navigate = useNavigate()

  // Calculate how many hours and minutes this city is ahead/behind local time
  const minutesDiff = diffFromLocalMinutes(city.timeZone, now)
  const sign = minutesDiff === 0 ? '±' : minutesDiff > 0 ? '+' : '−'
  const absMin = Math.abs(minutesDiff)
  const h = Math.floor(absMin / 60)
  const m = absMin % 60
  const diffLabel = `${sign}${h}h${String(m).padStart(2, '0')}`

  // Function to go to the "detail page" for this city
  const goToDetail = () => navigate(`/city/${encodeURIComponent(city.id)}`)
  // Stop click bubbling so that when you click a button,
  // it doesn’t also open the detail page
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
      {/* City name */}
      <div className="city-name" style={{ textAlign: 'center' }}>
        {city.name}
      </div>

      {/* Clock */}
      <div className="card__clock">
        {city.viewMode === 'analog' ? (
          <AnalogClock epochMs={now} timeZone={city.timeZone} />
        ) : (
          <div className="time">{formatTime(now, city.timeZone)}</div>
        )}
      </div>

      {/* Info row */}
      <div className="meta">
        {formatDate(now, city.timeZone)} • {city.timeZone} • diff {diffLabel}
      </div>

      {/* Controls */}
      <div className="toolbar toolbar--center" style={{ flexDirection: 'column', gap: '10px' }}>
        {/* Toggle */}
        <div className="segmented" role="tablist" aria-label="Välj visningsläge">
          <button
            role="tab"
            aria-selected={city.viewMode !== 'analog'}
            className={`segmented__btn ${city.viewMode !== 'analog' ? 'is-active' : ''}`}
            onClick={(e) => {
              stop(e)
              onToggleView(city.id)
            }}
          >
            Digital
          </button>
          <button
            role="tab"
            aria-selected={city.viewMode === 'analog'}
            className={`segmented__btn ${city.viewMode === 'analog' ? 'is-active' : ''}`}
            onClick={(e) => {
              stop(e)
              onToggleView(city.id)
            }}
          >
            Analog
          </button>
        </div>

        {/* Remove button */}
        <button
          className="btn btn-danger"
          onClick={(e) => {
            stop(e)
            onRemove(city.id)
          }}
        >
          Ta bort
        </button>
      </div>
    </div>
  )
}

export default CityCard