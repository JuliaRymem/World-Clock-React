// Sök och välj stad från JSON (cities.json)
//Lägg till egen stad (namn + IANA-tidszon)
//Använder generiska komponenten List<T> från ./List.tsx

// enkel modal öppna/stäng
import React, { useMemo, useState } from "react";
import rawOptions from "../data/cities.json";

type CityOption = {
  id: string;
  name: string;
  timeZone: string;
  imageUrl?: string;
};

interface AddCityModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddCityModal({ open, onClose }: AddCityModalProps) {
  const [query, setQuery] = useState("");
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
            <div key={opt.id} className="list-item">
              <div style={{ fontWeight: 600 }}>{opt.name}</div>
              <div className="meta">{opt.timeZone}</div>
            </div>
          ))}
          {results.length === 0 && <div className="muted">Inga träffar</div>}
        </div>
      </div>
    </div>
  );
}