// A list of the most common IANA time zones.
// By writing them as a "string literal union" we get autocomplete in TypeScript.
// Example typing "Europe/" will suggest all matching zones.

export type CommonTimeZone =
  | 'Europe/Stockholm'
  | 'Europe/London'
  | 'Europe/Berlin'
  | 'Europe/Paris'
  | 'Europe/Madrid'
  | 'Europe/Helsinki'
  | 'Europe/Kyiv'
  | 'Europe/Lisbon'
  | 'America/New_York'
  | 'America/Chicago'
  | 'America/Denver'
  | 'America/Los_Angeles'
  | 'America/Toronto'
  | 'America/Vancouver'
  | 'America/Mexico_City'
  | 'America/Sao_Paulo'
  | 'America/Argentina/Buenos_Aires'
  | 'Asia/Tokyo'
  | 'Asia/Seoul'
  | 'Asia/Shanghai'
  | 'Asia/Hong_Kong'
  | 'Asia/Singapore'
  | 'Asia/Kolkata'
  | 'Asia/Bangkok'
  | 'Asia/Dubai'
  | 'Australia/Sydney'
  | 'Australia/Perth'
  | 'Pacific/Auckland'

// TimeZone type
// - Either one of the predefined common zones above
// - Or *any* string (must be a valid IANA zone at runtime)
// This allows autocomplete for common zones, but still supports custom input.
export type TimeZone = CommonTimeZone | (string & { readonly __brand?: unique symbol })