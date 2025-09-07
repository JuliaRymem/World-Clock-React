// City beskriver en stad i vår app.
//- id: unikt id för att kunna länka till detaljvy
// - name: visningsnamn
// - timeZone: IANA-tidszon ('Europe/Stockholm')
// - imageUrl: valfri bakgrundsbild till detaljvyn
// - viewMode: 'digital' eller 'analog'

export type ViewMode = "digital" | "analog"

export interface City {
  id: string
  name: string
  timeZone: string   // IANA, t.ex. "Europe/Stockholm"
  imageUrl?: string
  viewMode?: ViewMode
}