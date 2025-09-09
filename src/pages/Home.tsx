// startsidan
// Visar listan med städer
// Knapp för att öppna "Lägg till stad"-modalen
// Sparar allt i localStorage
// Engångs-migrering: fyller i imageUrl/viewMode om det saknas i redan sparade poster

import { useMemo, useRef, useEffect, useState } from 'react'
import Header from '../components/Header'
import CityCard from '../components/CityCard'
import AddCityModal from '../components/AddCityModal'
import { useNow } from '../hooks/useNow'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { City } from '../types/City'
import { isCity } from '../types/City'

// Hämta alla städer från JSON
import citiesData from '../data/cities.json'
const ALL_CITIES = citiesData as City[]

// Välj bara de tre första som standard (första gången användaren besöker sidan)
const DEFAULT_CITIES = ALL_CITIES.slice(0, 3)

const LS_KEY = 'worldclock:cities'

function uuid() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return Math.random().toString(36).slice(2)
}

/** Gör id unika + sätt startläge (analog) */
function withInitialDefaults(list: City[]): City[] {
  return list.map(c => ({
    ...c,
    id: `${c.id}-${uuid()}`,    // bas-id + suffix så vi kan lägga till samma stad flera gånger
    viewMode: 'analog',       // startläge
  }))
}

export default function Home() {
  const now = useNow(1000)

  // Läs in från localStorage, annars använd BARA de tre första
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
          setCities(parsed)
        } else {
          console.warn('Ogiltiga poster i localStorage, återställer till standardlistan (3 städer).')
          setCities(withInitialDefaults(DEFAULT_CITIES))
        }
      } catch {
        console.warn('Fel vid JSON.parse av localStorage. Återställer till standardlistan (3 städer).')
        setCities(withInitialDefaults(DEFAULT_CITIES))
      }
    }
    // Om raw saknas gör hooken redan seed med 3 städer via initialvärdet ovan
  }, [setCities])

  // Engångs-migrering för äldre poster (fyll i imageUrl / viewMode om det saknas)
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

  // Bas-id:n (utan suffix) för att dölja dubbletter i AddCityModal
  const existingBaseIds = useMemo(
    () => new Set(cities.map(c => c.id.split('-')[0])),
    [cities]
  )

  const onRemove = (id: string) =>
    setCities(prev => prev.filter(c => c.id !== id))

  const onToggleView = (id: string) =>
    setCities(prev =>
      prev.map(c =>
        c.id === id ? { ...c, viewMode: c.viewMode === 'analog' ? 'digital' : 'analog' } : c
      )
    )

  // Lägg till stad (från listan eller egen)
  const onAdd = (city: City) => {
    const baseId = city.id.split('-')[0]
    const fromAll = ALL_CITIES.find((d: City) => d.id === baseId)

    setCities(prev => [
      ...prev,
      {
        ...city,
        id: `${baseId}-${uuid()}`,               // gör unik
        viewMode: 'digital',                     // startläge
        imageUrl: city.imageUrl ?? fromAll?.imageUrl, // sätt bild om saknas
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

      <AddCityModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={onAdd}
        existingIds={existingBaseIds}  // ta bort denna prop ?
      />
    </div>
  )
}