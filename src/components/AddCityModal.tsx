/**
 * - Search and pick a city from cities.json
 * - Add a custom city (name + IANA time zone)
 * - Uses the generic <List<T>> component for rendering results
 */

import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { City } from '../types/City'
import { isValidTimeZone } from '../utils/time'
import rawOptions from '../data/cities.json'
import { List } from './List'

type CityOption = Pick<City, 'id' | 'name' | 'timeZone' | 'imageUrl'>
type NewCityInput = Omit<City, 'id' | 'viewMode' | 'imageUrl'>

/** Minimal UUID helper so each added instance becomes unique */
function uuid() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return Math.random().toString(36).slice(2)
}

/** Props for AddCityModal */
interface AddCityModalProps {
  /** When the modal is visible */
  open: boolean
  /** Called when the modal should close */
  onClose: () => void
  /** Called with the City to add */
  onAdd: (city: City) => void
  /**
   * Set of already-added base IDs (without the unique suffix).
   * Used to hide duplicates from the selection list.
   */
  existingIds: Set<string>
}

export const AddCityModal: React.FC<AddCityModalProps> = ({
  open,
  onClose,
  onAdd,
  existingIds,
}) => {
  const [query, setQuery] = useState<string>('') // search text
  const [name, setName] = useState<string>('')   // custom city name
  const [tz, setTz] = useState<string>('')       // custom IANA time zone
  const [error, setError] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement | null>(null)

  // Autofocus the search input when the modal opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 0)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Strongly type JSON as CityOption[]
  const allOptions = useMemo<CityOption[]>(() => rawOptions as CityOption[], [])

  // Filter: hide already-added (by base id) + match search text
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allOptions
      .filter(opt => !existingIds.has(opt.id))
      .filter(opt =>
        q.length === 0 ||
        opt.name.toLowerCase().includes(q) ||
        opt.timeZone.toLowerCase().includes(q)
      )
      .slice(0, 50)
  }, [allOptions, existingIds, query])

  if (!open) return null

  /** Add a city chosen from the predefined list */
  const addFromList = (opt: CityOption) => {
    const newCity: City = {
      id: `${opt.id}-${uuid()}`, // make unique
      name: opt.name,
      timeZone: opt.timeZone,
      imageUrl: opt.imageUrl,    // carry over image if present in JSON
      // viewMode is set in Home.tsx (default 'digital')
    }
    onAdd(newCity)
    onClose()
  }

  /** Submit a custom city with IANA zone (validated) */
  const submitCustom: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) { setError('Ange ett namn'); return }
    if (!tz.trim())   { setError('Ange en IANA-tidszon (t.ex. Europe/Stockholm)'); return }
    if (!isValidTimeZone(tz)) { setError('Ogiltig IANA-tidszon'); return }

    const payload: NewCityInput = {
      name: name.trim(),
      timeZone: tz as City['timeZone'],
    }

    const newCity: City = {
      ...payload,
      id: `${name.toLowerCase().replace(/\s+/g, '')}-${uuid()}`,
      // imageUrl intentionally left undefined for custom cities
    }

    onAdd(newCity)
    onClose()
  }

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-city-title"
    >
      {/* Prevent clicks inside the modal from closing it */}
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 id="add-city-title" style={{ margin: 0 }}>Lägg till stad</h3>
          <button className="btn" onClick={onClose} aria-label="Stäng">Stäng</button>
        </div>

        {/* Search input */}
        <input
          ref={inputRef}
          className="input"
          placeholder="Sök i listan (namn eller tidszon)"
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />

        {/* Results list – rendered via generic List<T> */}
        <List<CityOption>
          className="list"
          items={results}
          keyOf={(opt) => opt.id}
          render={(opt) => (
            <button
              className="list-item"
              onClick={() => addFromList(opt)}
              aria-label={`Lägg till ${opt.name}`}
            >
              <div style={{ fontWeight: 600 }}>{opt.name}</div>
              <div className="meta">{opt.timeZone}</div>
            </button>
          )}
        />

        {/* Empty state */}
        {results.length === 0 && (
          <div className="muted" style={{ padding: 8 }}>Inga träffar</div>
        )}

        <hr style={{ margin: '12px 0', opacity: 0.3 }} />

        {/* Custom city form */}
        <form onSubmit={submitCustom}>
          <div style={{ display: 'grid', gap: 8 }}>
            <input
              className="input"
              placeholder="Egen stad (t.ex. Edmonton)"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
            <input
              className="input"
              placeholder="IANA tidszon (t.ex. America/Edmonton)"
              value={tz}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTz(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
            {error && <div style={{ color: 'var(--danger)' }} aria-live="polite">{error}</div>}
            <button className="btn btn-primary" type="submit">Lägg till en egen stad</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddCityModal