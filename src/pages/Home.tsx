// startsidan
// Visar listan med städer
// Knapp för att öppna "Lägg till stad"-modalen
// Sparar allt i localStorage
// Engångs-migrering: fyller i imageUrl/viewMode om det saknas i redan sparade poster

import React, { useMemo, useRef, useEffect, useState } from "react";
import Header from "../components/Header";
import CityCard from "../components/CityCard";
import AddCityModal from "../components/AddCityModal";
import { useNow } from "../hooks/useNow";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { City } from "../types/City";

// Använd cities.json som startlista (minst 20 st med imageUrl)
import citiesData from "../data/cities.json";
const DEFAULT_CITIES = citiesData as City[];

const LS_KEY = "worldclock:cities";

// enkel uuid så varje tillagd instans blir unik
function uuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2);
}

// första gången: lägg till viewMode och gör id unika (bas-id + suffix)
function withInitialDefaults(list: City[]): City[] {
  return list.map((c) => ({
    ...c,
    id: `${c.id}-${uuid()}`,
    viewMode: "digital",
  }));
}

export default function Home() {
  const now = useNow(1000);
  const [cities, setCities] = useLocalStorage<City[]>(LS_KEY, withInitialDefaults(DEFAULT_CITIES));
  const [open, setOpen] = useState(false);

  // engångs-migrering av äldre poster i localStorage (fyll på imageUrl/viewMode om saknas)
  const didMigrate = useRef(false);
  useEffect(() => {
    if (didMigrate.current) return;
    let changed = false;
    const updated = cities.map((c) => {
      const baseId = c.id.split("-")[0];
      const fromDefaults = DEFAULT_CITIES.find((d) => d.id === baseId);
      let next = { ...c };
      if (!next.imageUrl && fromDefaults?.imageUrl) { next.imageUrl = fromDefaults.imageUrl; changed = true; }
      if (!next.viewMode) { next.viewMode = "digital"; changed = true; }
      return next;
    });
    if (changed) setCities(updated);
    didMigrate.current = true;
  }, [cities, setCities]);

  // bas-id:n (utan suffix) som redan finns → används för att dölja dubbletter i modalen
  const existingBaseIds = useMemo(
    () => new Set(cities.map((c) => c.id.split("-")[0])),
    [cities]
  );

  // handlers
  const onRemove = (id: string) => setCities((prev) => prev.filter((c) => c.id !== id));
  const onToggleView = (id: string) =>
    setCities((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, viewMode: c.viewMode === "analog" ? "digital" : "analog" } : c
      )
    );

  // lägg till (från modal)
  const onAdd = (city: City) => {
    const baseId = city.id.split("-")[0];
    const fromDefaults = DEFAULT_CITIES.find((d) => d.id === baseId);
    setCities((prev) => [
      ...prev,
      {
        ...city,
        id: `${baseId}-${uuid()}`,
        viewMode: "digital",
        imageUrl: city.imageUrl ?? fromDefaults?.imageUrl,
      },
    ]);
  };

  return (
    <div className="container">
      <Header onAdd={() => setOpen(true)} />

      {cities.length === 0 ? (
        <div className="empty">
          Inga klockor än.
          <div style={{ marginTop: 8 }}>
            <button className="btn btn-primary" onClick={() => setOpen(true)}>
              + Lägg till din första
            </button>
          </div>
        </div>
      ) : (
        <div className="grid">
          {cities.map((c) => (
            <CityCard
              key={c.id}
              city={c}
              now={now}
              onToggleView={onToggleView}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}

      <AddCityModal
        open={open}
        onClose={() => setOpen(false)}
        onAdd={onAdd}
        existingIds={existingBaseIds}
      />
    </div>
  );
}