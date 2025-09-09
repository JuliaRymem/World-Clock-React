// Sök och välj stad från JSON (cities.json)
//Lägg till egen stad (namn + IANA-tidszon)
//Använder generiska komponenten List<T> från ./List.tsx

import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { City } from '../types/City'
import { isValidTimeZone } from '../utils/time'
import rawOptions from '../data/cities.json'
import { List } from './List'

type CityOption = Pick<City, 'id' | 'name' | 'timeZone' | 'imageUrl'>
type NewCityInput = Omit<City, 'id' | 'viewMode' | 'imageUrl'>

// enkel uuid så varje tillagd instans blir unik
function uuid() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return Math.random().toString(36).slice(2)
}

interface AddCityModalProps {
  open: boolean
  onClose: () => void
  onAdd: (city: City) => void
  /** Bas-id (utan suffix) som redan finns – används för att dölja dubbletter i listan */
  existingIds: Set<string>
}

export const AddCityModal: React.FC<AddCityModalProps> = ({
  open,
  onClose,
  onAdd,
  existingIds,
}) => {
  const [query, setQuery] = useState<string>('') // sök i listan
  const [name, setName] = useState<string>('')   // egen stad
  const [tz, setTz] = useState<string>('')       // egen IANA-tidszon
  const [error, setError] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement | null>(null)

  // Autofokus när modalen öppnas
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 0)
  }, [open])

  // Stäng på Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // JSON är av rätt typ 
  const allOptions = useMemo<CityOption[]>(() => rawOptions as CityOption[], [])

  // Filtrera träffar: göm redan tillagda (via bas-id) + matcha söksträng
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

  // Lägg till vald stad från listan 
  const addFromList = (opt: CityOption) => {
    const newCity: City = {
      id: `${opt.id}-${uuid()}`, // gör unik
      name: opt.name,
      timeZone: opt.timeZone,
      imageUrl: opt.imageUrl,    // följer med om finns i JSON
      // viewMode sätts i Home.tsx (default 'digital')
    }
    onAdd(newCity)
    onClose()
  }

  // Lägg till egen stad
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
      // imageUrl lämnas tom för egen stad – kan kompletteras senare
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
      {/* stopPropagation så klick inne i modalen inte stänger den */}
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 id="add-city-title" style={{ margin: 0 }}>Lägg till stad</h3>
          <button className="btn" onClick={onClose} aria-label="Stäng">Stäng</button>
        </div>

        {/* Sökfält */}
        <input
          ref={inputRef}
          className="input"
          placeholder="Sök i listan (namn eller tidszon)"
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />

        {/* Resultatlista – använder generiska List<T> */}
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

        {/*Inga träffar*/}
        {results.length === 0 && (
          <div className="muted" style={{ padding: 8 }}>Inga träffar</div>
        )}

        <hr style={{ margin: '12px 0', opacity: 0.3 }} />

        {/* Formulär för egen stad */}
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
            <button className="btn btn-primary" type="submit">Lägg till egen stad</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddCityModal