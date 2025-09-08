// Enkel analog klocka med SVG.
// epochMs: tiden i millisekunder
// timeZone: vilken tidszon tiden räknas om till

import { useMemo } from 'react'
import type { TimeZone } from '../types/TimeZone'

// räkna ut visarnas vinklar
function computeAngles(epochMs: number, timeZone: TimeZone) {
  // Hämta HH, mm, ss i given tidszon via Intl.DateTimeFormat
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  })
  const parts = dtf.formatToParts(epochMs)
  const data: Record<string, number> = {}
  for (const p of parts) if (p.type !== 'literal') data[p.type] = Number(p.value)

  const hours = data.hour ?? 0
  const minutes = data.minute ?? 0
  const seconds = data.second ?? 0

  // Konvertera till vinklar
  const secAngle = seconds * 6                     // 360 / 60
  const minAngle = (minutes + seconds / 60) * 6
  const hourAngle = ((hours % 12) + minutes / 60 + seconds / 3600) * 30 // 360 / 12

  return { hourAngle, minAngle, secAngle }
}

export function AnalogClock({ epochMs, timeZone, size = 140 }: { epochMs: number; timeZone: TimeZone; size?: number }) {
  const { hourAngle, minAngle, secAngle } = useMemo(() => computeAngles(epochMs, timeZone), [epochMs, timeZone])
  const r = size / 2
  const center = r

  // Helper som ritar en visare (SVG <line>)
  const hand = (length: number, width: number, angle: number, color: string) => (
    <line
      x1={center} y1={center}
      x2={center + length * Math.sin(angle * Math.PI / 180)}
      y2={center - length * Math.cos(angle * Math.PI / 180)}
      stroke={color} strokeWidth={width} strokeLinecap="round"
    />
  )

  // Små markeringar (ticks) runt urtavlan
  const ticks = Array.from({ length: 60 }, (_, i) => i)

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label="Analog clock">
      <circle cx={center} cy={center} r={r - 2} fill="#fff" stroke="rgba(0,0,0,0.15)" />
      {ticks.map(i => {
        const angle = i * 6 * Math.PI / 180
        const inner = r - (i % 5 === 0 ? 14 : 8)
        const outer = r - 4
        return <line key={i}
          x1={center + inner * Math.sin(angle)}
          y1={center - inner * Math.cos(angle)}
          x2={center + outer * Math.sin(angle)}
          y2={center - outer * Math.cos(angle)}
          stroke="rgba(0,0,0,0.4)" strokeWidth={i % 5 === 0 ? 2 : 1} />
      })}
      {hand(r * 0.5, 4, hourAngle, "#111")}
      {hand(r * 0.7, 3, minAngle, "#222")}
      {hand(r * 0.8, 2, secAngle, "#2563EB")}
      <circle cx={center} cy={center} r={3} fill="#111" />
    </svg>
  )
}
