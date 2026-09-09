import bromsok from '../assets/bromsok_nissan_datsun_bluebird.webp'
import bromsslang from '../assets/bromsslang.png'
import bromstrummaFairlady from '../assets/bromstrumma_fairlady.png'
import bromstrummaBluebird from '../assets/bromstrumma_bluebird.png'
import stotdampare from '../assets/stotdampare_fairlady_bluebird.jpg'

// Nyckel = produktens handle i Medusa (slugen i URL:en)
const productImages = {
  'bromsok': bromsok,
  'bromsslang': bromsslang,
  'trummor-fairlady': bromstrummaFairlady,
  'trummor': bromstrummaBluebird,
  'stotdampare': stotdampare,
}

export function getProductImage(handle) {
  if (!handle) return null
  if (productImages[handle]) return productImages[handle]
  // Partiell match — "bromsslang-240z" matchar "bromsslang"
  const key = Object.keys(productImages).find(k => handle.startsWith(k))
  return key ? productImages[key] : null
}
