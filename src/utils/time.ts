// Utility functions for working with time, date and time zones
// Uses Intl.DateTimeFormat to correctly handle IANA time zones (including daylight saving time)

import type { TimeZone } from '../types/TimeZone'

// Returns the current time as epoch milliseconds (helper function)
export function nowMs(): number {
  return Date.now()
}

// Format a clock time in the given time zone
export function formatTime(epochMs: number, timeZone: TimeZone, withSeconds = true): string {
  const opts: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...(withSeconds ? { second: '2-digit' } : {}),
    hour12: false,
    timeZone
  }
  return new Intl.DateTimeFormat(undefined, opts).format(epochMs)
}

// Format a date + weekday in the given time zone
export function formatDate(epochMs: number, timeZone: TimeZone): string {
  const opts: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    weekday: 'short',
    timeZone
  }
  return new Intl.DateTimeFormat(undefined, opts).format(epochMs)
}

// Simple check is the string a valid IANA time zone?
export function isValidTimeZone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz }).format(0)
    return true
  } catch {
    return false
  }
}

// Calculate the difference from the local time in MINUTES (other - local).
// Example: returns +420 for +7h00 difference.
export function diffFromLocalMinutes(timeZone: TimeZone, epochMs: number): number {
  const localOffset = -new Date(epochMs).getTimezoneOffset()
  const other = -zoneOffsetMinutes(timeZone, epochMs)
  return other - localOffset
}

// Internal helper: calculate the zone offset vs UTC in minutes
function zoneOffsetMinutes(timeZone: TimeZone, epochMs: number = Date.now()): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  })
  const parts = dtf.formatToParts(epochMs)
  const data: Record<string, number> = {}
  for (const p of parts) if (p.type !== 'literal') data[p.type] = Number(p.value)

  // Build a UTC time from the parts we got. The difference vs epochMs shows the offset.
  const asUTC = Date.UTC(data.year, (data.month - 1), data.day, data.hour, data.minute, data.second)
  return (asUTC - epochMs) / 60000
}