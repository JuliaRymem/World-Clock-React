// CityCard – klickbart kort som öppnar detaljvy.

import React from "react";
import type { City } from "../types/City";
import { formatTime, formatDate } from "../utils/time";
import { AnalogClock } from "./AnalogClock";

export default function CityCard({
    city,
    now,
    onToggleView,
    onRemove,
  }: {
    city: City;
    now: number;
    onToggleView: (id: string) => void;
    onRemove: (id: string) => void;
  }) {
    const isAnalog = city.viewMode === "analog";
  
    return (
      <div className="card">
        <div className="city-name">{city.name}</div>
  
        <div className="card__clock">
          {isAnalog ? (
            <AnalogClock epochMs={now} timeZone={city.timeZone} />
          ) : (
            <div className="time">{formatTime(now, city.timeZone)}</div>
          )}
        </div>
  
        <div className="meta">
          {formatDate(now, city.timeZone)} • {city.timeZone}
        </div>
  
        <div className="toolbar toolbar--center">
          <button
            className="btn"
            onClick={() => onToggleView(city.id)}
          >
            {isAnalog ? "Byt till digital" : "Byt till analog"}
          </button>
          <button
            className="btn btn-danger"
            onClick={() => onRemove(city.id)}
          >
            Ta bort
          </button>
        </div>
      </div>
    );
  }
    /** </div>
    );
  }

<div className="city-name">{city.name}</div>


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


<div className="toolbar toolbar--center">
  <button className="btn">Byt visning</button>
  <button className="btn btn-danger">Ta bort</button>
</div> 
}

export default CityCard