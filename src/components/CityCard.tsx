// CityCard – klickbart kort som öppnar detaljvy.

import React from "react"
import type { City } from "../types/City"
import { formatTime } from "../utils/time"
import { AnalogClock } from "./AnalogClock"

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


export default CityCard