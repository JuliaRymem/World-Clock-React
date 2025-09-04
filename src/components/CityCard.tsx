// CityCard – klickbart kort som öppnar detaljvy.

import React from "react"
import type { City } from "../types/City"

export function CityCard({ city }: { city: City }) {
    return (
      <div className="card">
        <div className="city-name">{city.name}</div>
      </div>
    )
  }

export default CityCard