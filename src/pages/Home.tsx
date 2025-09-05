// startsidan
// Visar listan med städer
// Knapp för att öppna "Lägg till stad"-modalen
// Sparar allt i localStorage
// Engångs-migrering: fyller i imageUrl/viewMode om det saknas i redan sparade poster


import React, { useState } from "react";
import Header from "../components/Header";
import AddCityModal from "../components/AddCityModal";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { City } from "../types/City";

const LS_KEY = "worldclock:cities";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [cities, setCities] = useLocalStorage<City[]>(LS_KEY, []);

  const onAdd = (city: City) => setCities(prev => [...prev, city]);

  return (
    <div className="container">
      <Header onAdd={() => setOpen(true)} />
      {/* ...rendera cities... */}
      <AddCityModal open={open} onClose={() => setOpen(false)} onAdd={onAdd} />
    </div>
  );
}