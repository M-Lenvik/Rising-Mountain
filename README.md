# Rising Mountain — Nissan Datsun Parts

Webbshop för veteranbildelar. Ren frontend byggd med React/Vite — produktdatan kommer från en statisk `products.json`, ingen databas eller backend krävs.

---

## Projektstruktur

```
src/        ← React-butiken
public/     ← statiska filer, bl.a. products.json
scripts/    ← verktyg för att generera products.json från kalkylbladet
```

---

## Kom igång

```bash
npm install
npm run dev
```

Öppnas på: http://localhost:5173

---

## Bygga för produktion

```bash
npm run build
```

Publiceras till GitHub Pages med:

```bash
npm run deploy
```

---

## Viktiga inställningar

- Produkter utan lager (quantity = 0) visas **inte** i butiken
- Varje produkt har taggar för kompatibla bilmodeller (ex: `240Z`, `510`)
- Kategorier: Bromsar, Motor, Styrning, Fjädring, Kaross & interiör
