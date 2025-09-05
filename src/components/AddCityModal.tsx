// Sök och välj stad från JSON (cities.json)
//Lägg till egen stad (namn + IANA-tidszon)
//Använder generiska komponenten List<T> från ./List.tsx

// enkel modal öppna/stäng
import React, { useState } from "react";

interface AddCityModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddCityModal({ open, onClose }: AddCityModalProps) {
  const [query, setQuery] = useState("");

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

        {/* hit kommer resultat senare */}
      </div>
    </div>
  );
}