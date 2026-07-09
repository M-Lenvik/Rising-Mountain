const BASE = import.meta.env.BASE_URL || '/'

let cache = null

export async function fetchProducts() {
  if (cache) return cache
  const res = await fetch(`${BASE}products.json`)
  cache = await res.json()
  return cache
}

export function filterProducts({ products, search = '', modeller = [], kategorier = [] }) {
  let result = products

  if (search) {
    const q = search.toLowerCase()
    result = result.filter(p =>
      p.artnr?.toLowerCase().includes(q) ||
      p.beskrivning?.toLowerCase().includes(q) ||
      p.kommentar?.toLowerCase().includes(q) ||
      p.soktermer?.toLowerCase().includes(q) ||
      p.modeller?.some(m => m.toLowerCase().includes(q))
    )
  }

  if (modeller.length > 0) {
    result = result.filter(p =>
      p.modeller?.some(m => modeller.includes(m))
    )
  }

  if (kategorier.length > 0) {
    result = result.filter(p =>
      kategorier.some(k => p.soktermer?.toLowerCase().includes(k.toLowerCase()) ||
        p.kommentar?.toLowerCase().includes(k.toLowerCase()))
    )
  }

  return result
}
