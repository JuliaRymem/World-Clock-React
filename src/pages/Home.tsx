// startsidan
// Visar listan med städer
// Knapp för att öppna "Lägg till stad"-modalen
// Sparar allt i localStorage
// Engångs-migrering: fyller i imageUrl/viewMode om det saknas i redan sparade poster


import { useNow } from "../hooks/useNow";
import CityCard from "../components/CityCard";

export default function Home() {
    const now = useNow(1000);
  
    // tillfälligt testCity om du inte har listan igång än
    const testCity = { id: "test", name: "Teststad", timeZone: "Europe/Stockholm", viewMode: "digital" as const };
  
    return (
      <div className="container">
        <h1>World Clock</h1>
        <CityCard city={testCity} now={now} />
      </div>
    );
  }