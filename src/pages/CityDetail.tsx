// enkel sida
//laddar city via id från localStorage
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useNow } from "../hooks/useNow";
import { formatTime, formatDate } from "../utils/time";
import { AnalogClock } from "../components/AnalogClock";
import type { City } from "../types/City";

const LS_KEY = "worldclock:cities";
const FALLBACK =
  "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1600&auto=format&fit=crop";

export default function CityDetail() {
  const { id } = useParams<{ id: string }>();
  const now = useNow(1000);
  const [cities, setCities] = useLocalStorage<City[]>(LS_KEY, []);
  const city = cities.find(c => c.id === id);

  if (!city) {
    return (
      <div className="container">
        <Link className="back-link" to="/">← Tillbaka</Link>
        <h2>Staden hittades inte</h2>
      </div>
    );
  }

  const setDigital = () =>
    setCities(prev => prev.map(c => c.id === city.id ? { ...c, viewMode: "digital" } : c));
  const setAnalog = () =>
    setCities(prev => prev.map(c => c.id === city.id ? { ...c, viewMode: "analog" } : c));

  return (
    <div className="container">
      <Link className="back-link" to="/">← Tillbaka</Link>

      <div className="detail-section">
        <section className="detail-hero">
          <div
            className="detail-bg"
            style={{ backgroundImage: `url(${city.imageUrl || FALLBACK})` }}
          />
          <div className="detail-content">
            <div className="detail-title">{city.name}</div>
            <div className="detail-meta-top">{city.timeZone}</div>
          </div>
        </section>

        <div className="detail-card">
          <div className="detail-clock">
            {city.viewMode === "analog" ? (
              <AnalogClock epochMs={now} timeZone={city.timeZone} size={220} />
            ) : (
              <div className="detail-time">{formatTime(now, city.timeZone)}</div>
            )}
            <div className="detail-meta">{formatDate(now, city.timeZone)}</div>
          </div>

          <div className="segmented" role="tablist" aria-label="Välj visningsläge">
            <button
              role="tab"
              aria-selected={city.viewMode !== "analog"}
              className={`segmented__btn ${city.viewMode !== "analog" ? "is-active" : ""}`}
              onClick={setDigital}
            >
              Digital
            </button>
            <button
              role="tab"
              aria-selected={city.viewMode === "analog"}
              className={`segmented__btn ${city.viewMode === "analog" ? "is-active" : ""}`}
              onClick={setAnalog}
            >
              Analog
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}