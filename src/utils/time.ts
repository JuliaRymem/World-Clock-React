// Hjälpfunktioner för tid, datum och tidszoner
// Använder Intl.DateTimeFormat för att hantera IANA-zoner korrekt (inkl. sommartid)

export function formatTime(epochMs: number, timeZone: string, withSeconds = true) {
    const opts: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      ...(withSeconds ? { second: "2-digit" } : {}),
      hour12: false,
      timeZone
    }
    return new Intl.DateTimeFormat(undefined, opts).format(epochMs)
  }
  
  export function formatDate(epochMs: number, timeZone: string) {
    const opts: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      weekday: "short",
      timeZone
    }
    return new Intl.DateTimeFormat(undefined, opts).format(epochMs)
  }