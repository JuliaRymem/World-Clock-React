# World Clock React

En webbapplikation byggd i React med TypeScript som låter användaren hålla koll på lokal tid i olika städer världen över.
Användaren kan lägga till städer från en färdig lista eller skriva in egna, växla mellan digital/analog visning och öppna en detaljvy med bild, datum och tidszon.

---

## Funktionalitet

- Lägg till städer från lista (minst 20 fördefinierade) eller manuellt via IANA-tidszoner.
- Visa klockor i digitalt eller analogt läge.
- Detaljvy för varje stad (egen route med React Router) med bakgrundsbild och tid.
- Ta bort städer från listan.
- Inställningar (valda städer och vy-läge) sparas i localStorage och laddas vid nästa besök.
- Responsiv design (mobil/desktop).

---

## Skisser och design

Jag började med att göra skisser i Figma för både mobil och desktop. Jag gjorde även en styleguide med färger, typsnitt och layout.

Min tanke bakom gränssnittet var att jag ville ha en enkel och tydlig sida. Korten med klockor placerades i ett grid, 1 per rad på mobil och upp till 3 på desktop. Detaljsidan har en Hero-bild och en ruta under för klocka och knappar.

*Länk till Figma:* https://www.figma.com/design/oHbTt9iYLGD75C8868ME4o/World-Clock-App?node-id=27-379&t=FOO3bYPaYiDqEGlz-1

---

## Struktur och komponenter

Jag ville göra så att logik och komponenter är tydligt separerade. Återanvändbar logik, som hooks, kan användas i flera komponenter. Genom att lägga typerna i separata filer blir det lättare att hålla ordning och upptäcka fel tidigt.

**Komponenter i projektet:**

- `Header` - Titel + knapp för att lägga till stad.
- `CityCard` - Kort för varje stad med tid, datum och knappar.
- `AddCityModal` - Modal för att välja/skriva in städer.
- `AnalogClock` - SVG-klocka som visar tiden med visare.
- `CityDetail` - Sida med hero-bild, klocka och knappar.
- `Home` - Startsida med grid av städer.

**Logik utanför komponenter:**

- `hooks/useLocalStorage.ts` - Generisk hook för att läsa/spara till localStorage.
- `hooks/useNow.ts` - Hook för att uppdatera tiden varje sekund.
- `utils/time.ts` - Hjälpfunktioner för att formatera tid/datum, validera tidszoner och beräkna tidsskillnader.

**Typer och interfaces i egna filer:**

- `types/City.ts` - Definierar `City`, `CityId`, `ViewMode` och type guard `isCity`.
- `types/TimeZone.ts` - Definierar string literal union för vanliga IANA-tidszoner + möjlighet till egna strängar.

---

## Git och arbetsprocess

Jag har använt Git under hela projektet. Från början satte jag upp ett repo på GitHub och har sedan arbetat med små och frekventa commits, där varje commit har ett tydligt meddelande som beskriver vad som ändrats.

Under arbetet har jag kontinuerligt testat koden genom att köra projektet i terminalen och i webbläsaren. När problem har uppstått har jag felsökt genom att framförallt (vilket jag tydligt lärde mig i projektet) titta i `localStorage`, använda console.log-utskrifter och kontrollera komponenterna i React DevTools.

---

## TypeScript-fördelar

I mitt projekt finns flera exempel där TypeScript gör koden säkrare och lättare att förstå jämfört med om jag bara hade använt JavaScript.

1. **`City.ts`** (typer för städer)

   - Här har jag definierat ett City-interface som innehåller `id`, `name`, `timeZone`, `imageUrl` och `viewMode`.
   - Fördelen är att jag får fel direkt i editorn om jag glömmer ett fält eller råkar skriva fel typ (exempelvis om jag försöker sätta en siffra i `name` som ska vara en text).
2. **`useLocalStorage.ts`** (generisk hook)

   - Funktionen `useLocalStorage<T>` använder *generics.*
   - Fördelen är att jag kan återanvända hooken för olika typer av data, t.ex. `City[]` eller bara en `string`. TypeScript ser alltid till att rätt typ sparas och hämtas från `localStorage`.
3. **`TimeZone.ts` **(string literal types)

   - Här använder jag *string literal types* för tidszoner, t.ex. `'Europe/Stockholm'` eller `'America/New_York'`.
   - Fördelen: Editorn ger mig autocomplete när jag skriver tidszoner och varnar också direkt om jag försöker använda en ogiltig sträng.
4. **Type guards** (`isCity`)

   - I `City.ts` har jag skrivit en *type guard* (`isCity`) som kontrollerar om ett objekt verkligen är en `City`.
   - Fördelen är att när jag läser från `localStorage` (där datan kan vara fel eller saknas) kan jag försäkra mig om att det faktiskt är en stad innan jag använder datan.

---

### Hur TypeScript blir JavaScript

TypeScript är som ett extra lager ovanpå JavaScript. Webbläsare kan inte köra TypeScript direkt, därför måste koden transpileras, alltså översättas, till vanlig JavaScript när projektet byggs.
I det här projektet används Vite och TypeScript tillsammans för att hantera det.

- När jag kör `npm run dev` startar Vite en utvecklingsserver och transpilerar TypeScript-filerna i bakgrunden.
- När jag kör `npm run build` kompileras hela projektet till ren JavaScript som då sparas i en dist/-mapp.

Alla typer och typmarkeringar (exempelvis interface, type eller : string) används bara under utvecklingen för att ge stöd och kontroll. När koden byggs tas de bort, så att bara den vanliga JavaScript-koden blir kvar.

```ts
// TypeScript
export interface City {
  id: string
  name: string
  timeZone: string
}

const city: City = { id: "1", name: "Stockholm", timeZone: "Europe/Stockholm" }
```

Det transpileras till:

```js
// JavaScript
const city = { id: "1", name: "Stockholm", timeZone: "Europe/Stockholm" };
```

Fördelen är att jag under tiden jag kodar får hjälp av TypeScript med att upptäcka fel i förväg och få förslag via autocomplete. Men när koden väl körs i webbläsaren är det bara vanlig JavaScript

---

## Installation & körning

1. Klona repo:

   ```bash
   git clone https://github.com/JuliaRymem/World-Clock-React.git
   cd world-clock-react
   ```
2. Installera dependencies:

   ```bash
   npm install
   ```
3. Starta utvecklingsservern:

   ```bash
   npm run dev
   ```
4. Bygg för produktion:

   ```bash
   npm run build
   ```

---

## Uppfyllda krav

* React + TypeScript med hooks
* Tydliga interfaces (City, TimeZone, ClockSettings)
* Typade props, events och hooks
* String literal types för tidszoner
* Lägg till städer (från lista eller manuellt)
* Detaljvy per stad (egen route, med bild och tid)
* Digital/analog klocka
* Sparar val i localStorage
* Responsiv design (mobil och desktop)
* Loggbok + todo-lista dokumenterad
* TypeScript-fördjupning: generics, type guards, utility types

---

Julia Rasmusson, KYHA-FE24 2025
