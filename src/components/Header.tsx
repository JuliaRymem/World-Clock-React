// Header rubrik + knapp

import React from "react";

export default function Header({ onAdd }: { onAdd: () => void }) {
  return (
    <header className="header header--center">
      <h1 className="title title--xl">World Clock</h1>
      <button className="btn btn-primary header__add" onClick={onAdd}>
        + Lägg till stad
      </button>
    </header>
  );
}