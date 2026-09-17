import { useState } from 'react'
import { addToCart, isInCart } from '../lib/cart.js'

export default function BuyButton({ product, className }) {
  const [added, setAdded] = useState(() => isInCart(product.id))

  if (!(product.antal > 0)) {
    return <button type="button" className={className} disabled>Slut i lager</button>
  }

  function handleClick(e) {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
    setAdded(true)
  }

  return (
    <button type="button" className={className} onClick={handleClick} disabled={added}>
      {added ? '✓ I kundkorgen' : 'Köp'}
    </button>
  )
}
