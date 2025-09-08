// startsidan
// Visar listan med städer
// Knapp för att öppna "Lägg till stad"-modalen
// Sparar allt i localStorage
// Engångs-migrering: fyller i imageUrl/viewMode om det saknas i redan sparade poster

import { useMemo, useRef, useEffect, useState } from 'react'
import { Header } from '../components/Header'
import { CityCard } from '../components/CityCard'
import { AddCityModal } from '../components/AddCityModal'
import { useNow } from '../hooks/useNow'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { City } from '../types/City'
import { isCity } from '../types/City'

// Använder inbyggd JSON med städer
import citiesData from '../data/cities.json'
const DEFAULT_CITIES = citiesData as City[]

const LS_KEY = 'worldclock:cities'

function uuid() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return Math.random().toString(36).slice(2)
}

function withInitialDefaults(list: City[]): City[] {
  return list.map(c => ({
    ...c,
    id: `${c.id}-${uuid()}`,
    viewMode: 'digital',
  }))
}

export default function Home() {
  const now = useNow(1000)

  // Läs in från localStorage eller fall tillbaka på DEFAULT_CITIES
  const [cities, setCities] = useLocalStorage<City[]>(
    LS_KEY,
    withInitialDefaults(DEFAULT_CITIES)
  )
  const [modalOpen, setModalOpen] = useState(false)

  // Validera data från localStorage med type guard
  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.every(isCity)) {
          // alla poster är av rätt typ
          setCities(parsed)
        } else {
          console.warn('Ogiltiga poster i localStorage, återställer till standardlistan')
          setCities(withInitialDefaults(DEFAULT_CITIES))
        }
      } catch {
        console.warn('Fel vid JSON.parse av localStorage')
        setCities(withInitialDefaults(DEFAULT_CITIES))
      }
    }
  }, [setCities])

  // migrera gamla poster som saknar imageUrl eller viewMode
  const didMigrate = useRef(false)
  useEffect(() => {
    if (didMigrate.current) return

    let changed = false
    const updated = cities.map(c => {
      const baseId = c.id.split('-')[0]
      const fromDefaults = DEFAULT_CITIES.find((d: City) => d.id === baseId)

      let next: City = { ...c }
      if (!next.imageUrl && fromDefaults?.imageUrl) {
        next = { ...next, imageUrl: fromDefaults.imageUrl }
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

  const existingBaseIds = useMemo(
    () => new Set(cities.map(c => c.id.split('-')[0])),
    [cities]
  )

  const onRemove = (id: string) => setCities(prev => prev.filter(c => c.id !== id))

  const onToggleView = (id: string) =>
    setCities(prev =>
      prev.map(c =>
        c.id === id ? { ...c, viewMode: c.viewMode === 'analog' ? 'digital' : 'analog' } : c
      )
    )

  const onAdd = (city: City) => {
    const baseId = city.id.split('-')[0]
    const fromDefaults = DEFAULT_CITIES.find((d: City) => d.id === baseId)

    setCities(prev => [
      ...prev,
      {
        ...city,
        id: `${baseId}-${uuid()}`,
        viewMode: 'digital',
        imageUrl: city.imageUrl ?? fromDefaults?.imageUrl,
      },
    ])
  }

  return (
    <div className="container">
      <Header onAdd={() => setModalOpen(true)} />

      {cities.length === 0 ? (
        <div className="empty">
          Inga klockor än.
          <div style={{ marginTop: 8 }}>
            <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
              + Lägg till din första
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

      <AddCityModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={onAdd}
        existingIds={existingBaseIds}
      />
    </div>
  )
}