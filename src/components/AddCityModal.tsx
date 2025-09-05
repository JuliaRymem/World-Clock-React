// Sök och välj stad från JSON (cities.json)
//Lägg till egen stad (namn + IANA-tidszon)
//Använder generiska komponenten List<T> från ./List.tsx

import React, { useMemo, useState } from "react";
import rawOptions from "../data/cities.json";
import type { City } from "../types/City";
import { isValidTimeZone } from "../utils/time";

type CityOption = Pick<City, "id" | "name" | "timeZone" | "imageUrl">;
type NewCityInput = Omit<City, "id" | "viewMode" | "imageUrl">;

function uuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2);
}

interface AddCityModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (city: City) => void;
}

export default function AddCityModal({ open, onClose, onAdd }: AddCityModalProps) {
  const [query, setQuery] = useState("");
  const [name, setName] = useState("");
  const [tz, setTz] = useState("");
  const [error, setError] = useState<string | null>(null);

  const allOptions = useMemo<CityOption[]>(() => rawOptions as CityOption[], []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allOptions.filter(opt =>
      q.length === 0 ||
      opt.name.toLowerCase().includes(q) ||
      opt.timeZone.toLowerCase().includes(q)
    );
  }, [allOptions, query]);

  if (!open) return null;

  const addFromList = (opt: CityOption) => {
    const newCity: City = {
      id: `${opt.id}-${uuid()}`,
      name: opt.name,
      timeZone: opt.timeZone,
      imageUrl: opt.imageUrl,
      viewMode: "digital"
    };
    onAdd(newCity);
    onClose();
  };

  const submitCustom: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) { setError("Ange ett namn"); return; }
    if (!tz.trim())   { setError("Ange en IANA-tidszon (t.ex. Europe/Stockholm)"); return; }
    if (!isValidTimeZone(tz)) { setError("Ogiltig IANA-tidszon"); return; }

    const payload: NewCityInput = { name: name.trim(), timeZone: tz as City["timeZone"] };
    const newCity: City = {
      ...payload,
      id: `${name.toLowerCase().replace(/\s+/g, "")}-${uuid()}`,
      viewMode: "digital"
    };
    onAdd(newCity);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>Lägg till stad</h3>
          <button className="btn" onClick={onClose}>Stäng</button>
        </div>

        <input
          className="input"
          placeholder="Sök i listan (namn eller tidszon)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ marginTop: 8 }}
        />

        <div className="list" style={{ marginTop: 8 }}>
          {results.map(opt => (
            <button key={opt.id} className="list-item" onClick={() => addFromList(opt)}>
              <div style={{ fontWeight: 600 }}>{opt.name}</div>
              <div className="meta">{opt.timeZone}</div>
            </button>
          ))}
          {results.length === 0 && <div className="muted">Inga träffar</div>}
        </div>

        <hr style={{ margin: "12px 0", opacity: 0.3 }} />

        <form onSubmit={submitCustom}>
          <div style={{ display: "grid", gap: 8 }}>
            <input
              className="input"
              placeholder="Egen stad (t.ex. Edmonton)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="input"
              placeholder="IANA tidszon (t.ex. America/Edmonton)"
              value={tz}
              onChange={(e) => setTz(e.target.value)}
            />
            {error && <div style={{ color: "var(--danger)" }}>{error}</div>}
            <button className="btn btn-primary" type="submit">Lägg till egen stad</button>
          </div>
        </form>
      </div>
    </div>
  );
}