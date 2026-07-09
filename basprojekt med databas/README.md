# Rising Mountain — Nissan Datsun Parts

Webbshop för veteranbildelar. Byggd med Medusa v2 (backend) + React/Vite (frontend).

---

## Projektstruktur

```
rising-mountain/
├── backend/    ← Medusa v2 server + admin
└── frontend/   ← React-butiken (detta bygger vi)
```

---

## 1. Sätt upp backend (kör EN gång)

Öppna terminalen i `rising-mountain/` och kör:

```bash
npx create-medusa-app@latest backend
```

Välj när den frågar:
- **Would you like to create the Next.js storefront?** → `No` (vi bygger vår egen)
- **Database** → PostgreSQL (rekommenderas) eller SQLite för att testa lokalt snabbt

När klart:
```bash
cd backend
npx medusa develop
```

Admin-panelen öppnas på: http://localhost:9000/app

---

## 2. Starta frontend (efter backend är uppe)

```bash
cd frontend
npm install
npm run dev
```

Öppnas på: http://localhost:5173

---

## Viktiga inställningar

- Produkter utan lager (quantity = 0) visas **inte** i butiken
- Varje produkt har taggar för kompatibla bilmodeller (ex: `240Z`, `510`)
- Kategorier: Bromsar, Motor, Styrning, Fjädring, Kaross & interiör
