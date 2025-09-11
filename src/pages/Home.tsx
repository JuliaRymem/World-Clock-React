// - Shows a grid of city cards
// - Has a button to open the "Add City" modal
// - Saves everything in localStorage
// - Seeds the app with 3 default cities on first visit
// - One-time migration: fills in missing imageUrl/viewMode for old saved data

import { useMemo, useRef, useEffect, useState } from 'react'
import Header from '../components/Header'
import CityCard from '../components/CityCard'
import AddCityModal from '../components/AddCityModal'
import { useNow } from '../hooks/useNow'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { City } from '../types/City'
import { isCity } from '../types/City'

// Load all cities from the JSON file (used for defaults + images)
import citiesData from '../data/cities.json'
const ALL_CITIES = citiesData as City[]

// First-time seed: only take the first 3 cities
const DEFAULT_CITIES = ALL_CITIES.slice(0, 3)

const LS_KEY = 'worldclock:cities'

// Simple unique id helper
function uuid() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return Math.random().toString(36).slice(2)
}

/**
 * Prepare initial list:
 * - attach a unique id (baseId + random suffix)
 * - set a starting viewMode (analog)
 */
function withInitialDefaults(list: City[]): City[] {
  return list.map(c => ({
    ...c,
    id: `${c.id}-${uuid()}`,
    viewMode: 'analog',
  }))
}

export default function Home() {
  const now = useNow(1000) // current time that ticks every second

  // Load cities from localStorage. if nothing is saved yet, seed with 3 defaults
  const [cities, setCities] = useLocalStorage<City[]>(
    LS_KEY,
    withInitialDefaults(DEFAULT_CITIES)
  )
  const [modalOpen, setModalOpen] = useState(false)

  // Validate what we read from localStorage.
  // If it's broken or not the right shape, reset to the 3 default cities.
  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.every(isCity)) {
          setCities(parsed)
        } else {
          console.warn('Invalid items in localStorage. Resetting to 3 default cities.')
          setCities(withInitialDefaults(DEFAULT_CITIES))
        }
      } catch {
        console.warn('Failed to parse localStorage. Resetting to 3 default cities.')
        setCities(withInitialDefaults(DEFAULT_CITIES))
      }
    }
    // If "raw" is missing, the hook already seeded 3 cities via the initial value above.
  }, [setCities])

  // One-time migration: if older saved items are missing imageUrl or viewMode,
  // fill them in so the UI looks consistent.
  const didMigrate = useRef(false)
  useEffect(() => {
    if (didMigrate.current) return

    let changed = false
    const updated = cities.map(c => {
      const baseId = c.id.split('-')[0]
      const fromAll = ALL_CITIES.find((d: City) => d.id === baseId)

      let next: City = { ...c }
      if (!next.imageUrl && fromAll?.imageUrl) {
        next = { ...next, imageUrl: fromAll.imageUrl }
        changed = true
      }
      if (!next.viewMode) {
        next = { ...next, viewMode: 'digital' }
        changed = true
      }
      return next
    })

    if (changed) setCities(updated)
    didMigrate.current = true
  }, [cities, setCities])

  // Base ids (without the random suffix). We use this to hide duplicates
  // inside the AddCityModal, so the user doesn't add the same base city twice by mistake.
  const existingBaseIds = useMemo(
    () => new Set(cities.map(c => c.id.split('-')[0])),
    [cities]
  )

  // Remove a city by its unique id (the one with the suffix)
  const onRemove = (id: string) =>
    setCities(prev => prev.filter(c => c.id !== id))

  // Switch a single card between analog/digital
  const onToggleView = (id: string) =>
    setCities(prev =>
      prev.map(c =>
        c.id === id ? { ...c, viewMode: c.viewMode === 'analog' ? 'digital' : 'analog' } : c
      )
    )

  // Add a city (from the list or a custom one)
  // - give it a fresh unique id
  // - set a starting view
  // - if no imageUrl was provided, try to copy it from the defaults
  const onAdd = (city: City) => {
    const baseId = city.id.split('-')[0]
    const fromAll = ALL_CITIES.find((d: City) => d.id === baseId)

    setCities(prev => [
      ...prev,
      {
        ...city,
        id: `${baseId}-${uuid()}`,
        viewMode: 'digital',
        imageUrl: city.imageUrl ?? fromAll?.imageUrl,
      },
    ])
  }

  return (
    <div className="container">
      {/* Header with big "Add City" button */}
      <Header onAdd={() => setModalOpen(true)} />

      {/* Either show an empty state or the grid of cards */}
      {cities.length === 0 ? (
        <div className="empty">
          Hoppsan! Här fanns det inga klockor än. Börja med att lägga till en stad.
          <div style={{ marginTop: 8 }}>
            <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
              + Lägg till en stad
            </button>
          </div>
        </div>
      ) : (
        <div className="grid">
          {cities.map(c => (
            <CityCard
              key={c.id}
              city={c}
              now={now}
              onRemove={onRemove}
              onToggleView={onToggleView}
            />
          ))}
        </div>
      )}

      {/* Modal used to pick from the list or add a custom city */}
      <AddCityModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={onAdd}
        existingIds={existingBaseIds}  // to hide duplicates
      />
    </div>
  )
}