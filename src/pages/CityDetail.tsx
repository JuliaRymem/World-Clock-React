// enkel sida
//laddar city via id från localStorage
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { City } from "../types/City";

const LS_KEY = "worldclock:cities";

export default function CityDetail() {
  const { id } = useParams<{ id: string }>();
  const [cities] = useLocalStorage<City[]>(LS_KEY, []);
  const city = cities.find(c => c.id === id);

  if (!city) {
    return (
      <div className="container">
        <Link className="back-link" to="\/">← Tillbaka</Link>
        <h2>Staden hittades inte</h2>
      </div>
    );
  }

  return (
    <div className="container">
      <Link className="back-link" to="/">← Tillbaka</Link>
      <h2>{city.name}</h2>
      <p>{city.timeZone}</p>
    </div>
  );
}