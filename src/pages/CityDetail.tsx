// enkel sida
//laddar city via id från localStorage
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { City } from "../types/City";

const LS_KEY = "worldclock:cities";
const FALLBACK =
  "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1600&auto=format&fit=crop";

export default function CityDetail() {
  const { id } = useParams<{ id: string }>();
  const [cities] = useLocalStorage<City[]>(LS_KEY, []);
  const city = cities.find(c => c.id === id);

  if (!city) {
    return (
      <div className="container">
        <Link className="back-link" to="/">← Tillbaka</Link>
        <h2>Staden hittades inte</h2>
      </div>
    );
  }

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
          <p>Mer info kommer här…</p>
        </div>
      </div>
    </div>
  );
}