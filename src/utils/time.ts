// Hjälpfunktioner för tid, datum och tidszoner
// Använder Intl.DateTimeFormat för att hantera IANA-zoner korrekt (inkl. sommartid)

import type { TimeZone } from '../types/TimeZone'

/** Returnerar epoch-millis (nu). Som en liten "helper" */
export function nowMs(): number {
  return Date.now()
}

/** Formaterar klockslag i given tidszon, t.ex. 14:05:07 */
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

/** Formaterar datum + veckodag i given zon, t.ex. Wed 21 Aug 2025 */
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

/** Enkel validering: är strängen en giltig IANA-tidszon? */
export function isValidTimeZone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz }).format(0)
    return true
  } catch {
    return false
  }
}

/**
 * Skillnad mot lokal tid i MINUTER (other - local).
 * Används för att visa t.ex. +7h00.
 */
export function diffFromLocalMinutes(timeZone: TimeZone, epochMs: number): number {
  const localOffset = -new Date(epochMs).getTimezoneOffset()
  const other = -zoneOffsetMinutes(timeZone, epochMs)
  return other - localOffset
}

/** Intern: beräkna zonens offset mot UTC i minuter. */
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
  // Skapa UTC-tid av delarna vi fick. Skillnaden mot epochMs visar offset.
  const asUTC = Date.UTC(data.year, (data.month - 1), data.day, data.hour, data.minute, data.second)
  return (asUTC - epochMs) / 60000
}
