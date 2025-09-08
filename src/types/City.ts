// City beskriver en stad och dess tidszon
//- id: unikt id för att kunna länka till detaljvy
// - name: visningsnamn
// - timeZone: IANA-tidszon ('Europe/Stockholm')
// - imageUrl: valfri bakgrundsbild till detaljvyn
// - viewMode: 'digital' eller 'analog'

import type { TimeZone } from './TimeZone'

export type CityId = string
export type ViewMode = 'digital' | 'analog'

export interface City {
  id: CityId
  name: string
  timeZone: TimeZone
  imageUrl?: string
  viewMode?: ViewMode
}

// Type guard: kontrollerar att ett okänt värde är en City.
// Gör det säkert att t.ex. läsa från localStorage.
export function isCity(value: unknown): value is City {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return (
    typeof v.id === 'string' &&
    typeof v.name === 'string' &&
    typeof v.timeZone === 'string'
  )
}