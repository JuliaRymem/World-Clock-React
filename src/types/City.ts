// City describes a city and its time zone
// - id: unique id so we can link to the detail view
// - name: display name of the city
// - timeZone: IANA time zone string (e.g. 'Europe/Stockholm')
// - imageUrl: optional background image shown in the detail view
// - viewMode: 'digital' or 'analog' (how the clock is shown)

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

// Type guard: checks if some unknown value is a City object
// Useful when reading data from localStorage (which returns "any")
export function isCity(value: unknown): value is City {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return (
    typeof v.id === 'string' &&
    typeof v.name === 'string' &&
    typeof v.timeZone === 'string'
  )
}