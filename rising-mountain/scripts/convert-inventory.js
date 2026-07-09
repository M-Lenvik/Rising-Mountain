const fs = require('fs')
const path = require('path')

const inputFile = process.argv[2]
if (!inputFile) {
  console.error('Användning: node scripts/convert-inventory.js <fil>')
  process.exit(1)
}

const raw = fs.readFileSync(inputFile, 'utf-8')
const lines = raw.split('\n').map(l => l.trimEnd())

const dataLines = lines.filter(l => {
  const first = l.split('\t')[0].toLowerCase().trim()
  return l.trim() && !first.startsWith('art nummer') && !first.startsWith('art nr')
})

let okandCounter = 0
const usedIds = {}

const products = dataLines.map(line => {
  const cols = line.split('\t')
  const artnr      = cols[0]?.trim() || null
  const beskrivning = cols[1]?.trim() || null
  const antalRaw   = cols[2]?.trim() || null
  const modelRaw   = cols[3]?.trim() || null
  const kommentar  = cols[4]?.trim() || null
  // cols[5] = färg (ej på webb)
  const lagerplats = cols[6]?.trim() || null
  const pris       = cols[7]?.trim() || null

  const artnrClean = (!artnr || artnr === '?' || artnr === '') ? null : artnr

  let baseId = artnrClean || `okand-${String(++okandCounter).padStart(3, '0')}`
  usedIds[baseId] = (usedIds[baseId] || 0) + 1
  const id = usedIds[baseId] > 1 ? `${baseId}-${usedIds[baseId]}` : baseId

  let antal = null
  if (antalRaw) {
    const num = parseInt(antalRaw.replace(/[^0-9]/g, ''), 10)
    if (!isNaN(num)) antal = num
  }

  const modeller = modelRaw
    ? modelRaw.split(/[,/]/).map(m => m.trim().replace(/\s*(mm|mfl|m fl)$/i, '').trim()).filter(m => m && m !== '?')
    : []

  const soktermer = genSoktermer(beskrivning, kommentar)

  const kategori = getKategori(artnrClean, beskrivning, kommentar)

  return { id, artnr: artnrClean, beskrivning, antal, modeller, kommentar, lagerplats, pris, kategori, soktermer }
})

function getKategori(artnr, beskrivning, kommentar) {
  const combined = ((beskrivning || '') + ' ' + (kommentar || '')).toLowerCase()

  // Försök matcha på beskrivning/kommentar först
  if (/bromsok|caliper/i.test(combined)) return 'Bromsar'
  if (/bromstrumma|brake drum/i.test(combined)) return 'Bromsar'
  if (/bromsskiva|brake disc|brake disk/i.test(combined)) return 'Bromsar'
  if (/bromsbelägg|brake pad/i.test(combined)) return 'Bromsar'
  if (/bromsslang|brake hose/i.test(combined)) return 'Bromsar'
  if (/bromscylinder|wheel cyl|master cyl|brake master|tandem master/i.test(combined)) return 'Bromsar'
  if (/handbromswire|brake cable|parking brake/i.test(combined)) return 'Bromsar'
  if (/stötdämpare|shock abs/i.test(combined)) return 'Fjädring'
  if (/fjäder|spring/i.test(combined)) return 'Fjädring'
  if (/bussning|bushing/i.test(combined)) return 'Fjädring'
  if (/koppling|clutch/i.test(combined)) return 'Koppling'
  if (/startmotor|starter motor/i.test(combined)) return 'Elektrisk'
  if (/generator|alternator/i.test(combined)) return 'Elektrisk'
  if (/fördelare|distributor/i.test(combined)) return 'Elektrisk'
  if (/tändstift|spark plug/i.test(combined)) return 'Elektrisk'
  if (/relä|relay/i.test(combined)) return 'Elektrisk'
  if (/säkring|fuse|fusible/i.test(combined)) return 'Elektrisk'
  if (/spänningsregulator|voltage reg/i.test(combined)) return 'Elektrisk'
  if (/bakljus|rear lamp|rear light/i.test(combined)) return 'Belysning'
  if (/strålkastare|headlamp|head lamp/i.test(combined)) return 'Belysning'
  if (/blinkers|turn|sidolykta|side lamp/i.test(combined)) return 'Belysning'
  if (/innerbelysning|interior lamp/i.test(combined)) return 'Belysning'
  if (/nummerskylt|licence lamp/i.test(combined)) return 'Belysning'
  if (/lampa|bulb|lamp/i.test(combined)) return 'Belysning'
  if (/torkare|wiper/i.test(combined)) return 'Torkare & spolare'
  if (/spolare|washer/i.test(combined)) return 'Torkare & spolare'
  if (/kylare|radiator/i.test(combined)) return 'Kylsystem'
  if (/vattenpump|water pump/i.test(combined)) return 'Kylsystem'
  if (/kylarslang|vattenslang|coolant hose/i.test(combined)) return 'Kylsystem'
  if (/termostat|thermostat/i.test(combined)) return 'Kylsystem'
  if (/bränslefilter|fuel filter/i.test(combined)) return 'Bränslesystem'
  if (/bränslepump|fuel pump|feed pump/i.test(combined)) return 'Bränslesystem'
  if (/förgasare|carburetor|carburettor/i.test(combined)) return 'Bränslesystem'
  if (/luftfilter|air element|air cleaner/i.test(combined)) return 'Bränslesystem'
  if (/avgasupphängning|avgasrör|exhaust/i.test(combined)) return 'Avgassystem'
  if (/motorfäste|motor mount|engine mount/i.test(combined)) return 'Motor'
  if (/topplockspackning|head gasket/i.test(combined)) return 'Motor'
  if (/oljetrågspackning|sump gasket/i.test(combined)) return 'Motor'
  if (/kolvring|piston ring/i.test(combined)) return 'Motor'
  if (/kamaxel|camshaft|sprocket/i.test(combined)) return 'Motor'
  if (/vevaxel|crankshaft/i.test(combined)) return 'Motor'
  if (/oljefilter|oil filter/i.test(combined)) return 'Motor'
  if (/stötfångare|bumper/i.test(combined)) return 'Kaross'
  if (/skärm|fender/i.test(combined)) return 'Kaross'
  if (/grill/i.test(combined)) return 'Kaross'
  if (/huv|motorhuv|hood/i.test(combined)) return 'Kaross'
  if (/dörr|door/i.test(combined)) return 'Kaross'
  if (/list|moulding/i.test(combined)) return 'Kaross'
  if (/emblem/i.test(combined)) return 'Kaross'
  if (/spegel|mirror/i.test(combined)) return 'Kaross'
  if (/rattstång|ratt|steering|styrning/i.test(combined)) return 'Styrning'
  if (/växellåda|gearbox|transmission/i.test(combined)) return 'Växellåda'
  if (/drivaxel|drive shaft/i.test(combined)) return 'Drivlina'
  if (/antenn|antenna/i.test(combined)) return 'Interiör'
  if (/säkerhetsbälte|seat belt/i.test(combined)) return 'Interiör'
  if (/klocka|clock/i.test(combined)) return 'Interiör'
  if (/matta|carpet/i.test(combined)) return 'Interiör'

  // Fallback på artikelnummer-prefix
  if (!artnr) return 'Övrigt'
  const num = parseInt(artnr.replace(/\D.*/, ''), 10)
  if (num >= 1000 && num <= 9999) return 'Skruv & mutter'
  if (num >= 10000 && num <= 19999) return 'Motor'
  if (num >= 20000 && num <= 21999) return 'Avgassystem & kylsystem'
  if (num >= 22000 && num <= 25999) return 'Elektrisk'
  if (num >= 26000 && num <= 29999) return 'Belysning & torkare'
  if (num >= 30000 && num <= 35999) return 'Koppling & växellåda'
  if (num >= 36000 && num <= 45999) return 'Bromsar & drivlina'
  if (num >= 46000 && num <= 59999) return 'Bromsar & styrning'
  if (num >= 62000 && num <= 89999) return 'Kaross & interiör'
  if (num >= 90000 && num <= 99999) return 'Kaross & interiör'
  return 'Övrigt'
}

function genSoktermer(beskrivning, kommentar) {
  const combined = ((beskrivning || '') + ' ' + (kommentar || '')).toLowerCase()
  const parts = []
  const map = [
    [/bolt|screw|skruv/,         'bult skruv'],
    [/\bnut\b|mutter/,           'mutter'],
    [/clip/,                     'clips klämma'],
    [/gasket|packning|packing/,  'packning tätning'],
    [/\bseal\b|packbox/,         'tätning packbox'],
    [/bearing/,                  'lager'],
    [/\bpump\b/,                 'pump'],
    [/\bbelt\b|fläktrem/,        'rem fläktrem'],
    [/cable|wire|kabel|sladd/,   'kabel wire'],
    [/\bhose\b|slang/,           'slang'],
    [/thermostat/,               'termostat'],
    [/clutch|koppling/,          'koppling'],
    [/brake|broms/,              'broms'],
    [/drum|trumma/,              'bromstrumma trumma'],
    [/pad|belägg/,               'bromsbelägg'],
    [/cylinder/,                 'cylinder'],
    [/spring|fjäder/,            'fjäder'],
    [/shock|stötdämpare/,        'stötdämpare'],
    [/switch|relay|brytare|relä/,'brytare relä'],
    [/sensor|givare|sending/,    'givare sensor'],
    [/lamp|bulb|lampa/,          'lampa belysning'],
    [/lens|\bglas\b/,            'glas lins'],
    [/moulding|\blist\b/,        'list'],
    [/cover|\bkåpa\b|\block\b/,  'kåpa lock'],
    [/bracket|fäste|konsol/,     'fäste konsol'],
    [/handle|handtag/,           'handtag'],
    [/bumper|stötfångare/,       'stötfångare'],
    [/fender|skärm/,             'skärm'],
    [/\bhood\b|motorhuv/,        'huv motorhuv'],
    [/emblem|märke/,             'emblem märke'],
    [/distributor|fördelare/,    'fördelare tändning'],
    [/alternator|generator/,     'generator'],
    [/starter|startmotor/,       'startmotor'],
    [/radiator|kylare/,          'kylare'],
    [/piston|\bkolv\b/,          'kolv'],
    [/\bvalve\b|ventil/,         'ventil'],
    [/\bchain\b|kedja/,          'kedja'],
    [/\bgear\b|kugghjul/,        'kugghjul drev'],
    [/mirror|spegel/,            'spegel'],
    [/wiper|torkare/,            'torkare'],
    [/antenna|antenn/,           'antenn'],
    [/fuel|bränsle/,             'bränsle'],
    [/spark|tändstift/,          'tändstift tändning'],
    [/grille|grill/,             'grill'],
    [/motorfäste/,               'motorfäste motor'],
    [/avgas/,                    'avgas avgassystem'],
    [/hastighetsmätare/,         'hastighetsmätare'],
    [/bakljus|rear lamp/,        'bakljus'],
    [/blinkers|blinker/,         'blinkers'],
    [/strålkastare|headlamp/,    'strålkastare'],
    [/oljefilter/,               'oljefilter olja'],
    [/oljetätning/,              'oljetätning olja'],
  ]
  for (const [pattern, term] of map) {
    if (pattern.test(combined)) parts.push(term)
  }
  return parts.join(' ') || null
}

const outPath = path.join(__dirname, '..', 'frontend', 'public', 'products.json')
fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, JSON.stringify(products, null, 2), 'utf-8')
console.log(`✓ ${products.length} artiklar skrivna till ${outPath}`)
