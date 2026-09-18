export function generateOrderId() {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `RM-${stamp}-${rand}`
}

export function formatOrderItems(items) {
  return items
    .map(p => {
      const name = p.beskrivning || p.artnr || 'Okänd del'
      const label = p.artnr && p.beskrivning ? `${name} (${p.artnr})` : name
      return `- ${label} — ${p.pris || 'pris ej satt'}`
    })
    .join('\n')
}

// "pris" är fritext i produktdatan (t.ex. "60€", "45$", "OOP") — inte alltid
// ett rent tal eller en enhetlig valuta. Vi summerar bara det vi säkert kan
// tolka, per valuta, och redovisar resten som "utan angivet pris".
function parsePrice(pris) {
  if (!pris) return null
  const match = String(pris).trim().match(/^(\d+(?:[.,]\d+)?)\s*(kr|sek|€|eur|\$|usd)?$/i)
  if (!match) return null
  const amount = parseFloat(match[1].replace(',', '.'))
  const rawCurrency = (match[2] || 'kr').toLowerCase()
  const currency = rawCurrency === 'sek' ? 'kr' : rawCurrency === 'eur' ? '€' : rawCurrency === 'usd' ? '$' : rawCurrency
  return { amount, currency }
}

export function formatTotal(items) {
  const sums = {}
  let unpriced = 0

  for (const p of items) {
    const parsed = parsePrice(p.pris)
    if (!parsed) {
      unpriced++
      continue
    }
    sums[parsed.currency] = (sums[parsed.currency] || 0) + parsed.amount
  }

  const parts = Object.entries(sums).map(([currency, sum]) => `${sum} ${currency}`)
  if (parts.length === 0) return 'Pris meddelas av säljaren'

  let text = parts.join(' + ')
  if (unpriced > 0) text += ` (exkl. ${unpriced} del${unpriced > 1 ? 'ar' : ''} utan angivet pris)`
  return text
}
