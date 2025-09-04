// startsidan
// Visar listan med städer
// Knapp för att öppna "Lägg till stad"-modalen
// Sparar allt i localStorage
// Engångs-migrering: fyller i imageUrl/viewMode om det saknas i redan sparade poster


import CityCard from "../components/CityCard"

export default function Home() {
  return (
    <div className="container">
      <h1>World Clock</h1>
      <CityCard />
    </div>
  )
}