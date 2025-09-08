// TimeZone som string literal union för vanliga zoner
// tillåter även "vilken som helst" IANA-sträng via ett brandat string-typtrick
// Gör att man får autocomplete för vanliga zoner + kan skriva egna

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

// Tillåt även egna strängar (måste vara giltig IANA vid runtime).
export type TimeZone = CommonTimeZone | (string & { readonly __brand?: unique symbol })
