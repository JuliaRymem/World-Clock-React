// CityCard – klickbart kort som öppnar detaljvy.

import React from "react"
import type { City } from "../types/City"
import { formatTime } from "../utils/time"
import { AnalogClock } from "./AnalogClock"
import { formatDate } from "../utils/time"

export function CityCard({ city }: { city: City }) {
    return (
      <div className="card">
        <div className="city-name">{city.name}</div>
      </div>
    )
  }
{/* Stadens namn */}
<div className="city-name">{city.name}</div>

{/* Klocka (centrerad) */}
<div className="card__clock">
  {city.viewMode === 'analog' ? (
    <AnalogClock epochMs={now} timeZone={city.timeZone} />
  ) : (
    <div className="time">{formatTime(now, city.timeZone)}</div>
  )}
</div>

<div className="meta">
  {formatDate(Date.now(), city.timeZone)} • {city.timeZone}
</div>
export default CityCard