import bromsok from '../assets/bromsok_nissan_datsun_bluebird.webp'
import bromsskiva from '../assets/bromsskiva.jfif'
import bromsslang from '../assets/bromsslang.png'
import bromstrummaFairlady from '../assets/bromstrumma_fairlady.png'
import bromstrummaBluebird from '../assets/bromstrumma_bluebird.png'
import grenror from '../assets/grenror.jfif'
import stotdampare from '../assets/stotdampare_fairlady_bluebird.jpg'

// Nyckel = produktens handle i Medusa (slugen i URL:en)
const productImages = {
  'bromsok': bromsok,
  'bromsskiva': bromsskiva,
  'bromsslang': bromsslang,
  'bromstrumma-fairlady': bromstrummaFairlady,
  'bromstrumma-bluebird': bromstrummaBluebird,
  'grenror': grenror,
  'stotdampare': stotdampare,
}

export function getProductImage(handle) {
  if (!handle) return null
  if (productImages[handle]) return productImages[handle]
  // Partiell match — "bromsslang-240z" matchar "bromsslang"
  const key = Object.keys(productImages).find(k => handle.startsWith(k))
  return key ? productImages[key] : null
}
