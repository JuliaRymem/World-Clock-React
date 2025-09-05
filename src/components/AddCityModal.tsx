// Sök och välj stad från JSON (cities.json)
//Lägg till egen stad (namn + IANA-tidszon)
//Använder generiska komponenten List<T> från ./List.tsx

// enkel modal öppna/stäng
import React from "react";

interface AddCityModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddCityModal({ open, onClose }: AddCityModalProps) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0 }}>Lägg till stad</h3>
        <p>Här kommer innehållet sen…</p>
        <button className="btn" onClick={onClose}>Stäng</button>
      </div>
    </div>
  );
}