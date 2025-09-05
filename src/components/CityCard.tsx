// CityCard – klickbart kort som öppnar detaljvy.

import React from "react";
import { useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();
    const isAnalog = city.viewMode === "analog";
  
    const goToDetail = () => navigate(`/city/${encodeURIComponent(city.id)}`);
  
    return (
      <div
        className="card card--column card--clickable"
        onClick={goToDetail}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            goToDetail();
          }
        }}
        aria-label={`Öppna detaljvy för ${city.name}`}
      >
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
            onClick={(e) => {
              e.stopPropagation();
              onToggleView(city.id);
            }}
          >
            {isAnalog ? "Byt till digital" : "Byt till analog"}
          </button>
  
          <button
            className="btn btn-danger"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(city.id);
            }}
          >
            Ta bort
          </button>
        </div>
      </div>
    );
  }

export default CityCard