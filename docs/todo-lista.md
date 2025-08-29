# Todo-lista – World Clock Projekt

En översiktlig lista över alla uppgifter jag behöver göra i projektet.  
Jag markerar dem som klara med [x].

## Fas 0 – Setup & versionshantering
- [ ] Skapa repo (`git init`) och första commit: “chore: scaffold”
- [ ] Skapa README med mål, krav och körinstruktioner
- [ ] Skapa mapp `docs/` för loggbok och designmaterial

## Fas 1 – Krav & user stories
- [ ] Ta fram user stories och få dem godkända av läraren
- [ ] Skriv acceptanskriterier (AC) för varje story

## Fas 2 – Design
- [ ] Göra grafiska skisser för **mobil** (smartphone)
- [ ] Göra grafiska skisser för **desktop** (datorskärm)
- [ ] Välja färgpalett, typsnitt och ikonstil
- [ ] Rita in digital och analog klocka i skisserna
- [ ] Visa detaljvy med bakgrundsbild i skisserna

## Fas 3 – Arkitektur & datamodell
- [ ] Bestäm routes (`/` och `/city/:id`)
- [ ] Definiera TypeScript-interfaces (City, TimeZone, ClockSettings)
- [ ] Planera hantering av localStorage

## Fas 4 – Implementering (MVP)
- [ ] Bygga lista med städer (förval + egna)
- [ ] Visa digital klocka
- [ ] Implementera React Router med `/` och `/city/:id`
- [ ] Ladda/spara val i localStorage
- [ ] Göra sajten responsiv (mobil + desktop)

## Fas 5 – Utökning
- [ ] Lägg till analog klocka
- [ ] Visa bakgrundsbild i detaljvy
- [ ] Lägg till “ta bort stad”
- [ ] Lägg till visning av tidsskillnad mot lokal tid
- [ ] Lägg till sökfunktion i “Lägg till stad”

## Fas 6 – Dokumentation & städ
- [ ] Skriva färdigt loggboken
- [ ] Förklara minst 3 ställen där TypeScript ger fördelar jämfört med JavaScript
- [ ] Beskriva hur TypeScript transpileras till JavaScript
- [ ] Säkerställa att Git-historiken är tydlig (små commits)
- [ ] Tagga release och lämna in
