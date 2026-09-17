const STORAGE_KEY = 'rising-mountain-cart'

export function getCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveCart(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // localStorage otillgänglig (privat läge e.d.) — kundkorgen går inte att spara
  }
  window.dispatchEvent(new Event('cart-updated'))
}

export function isInCart(id) {
  return getCart().some(item => item.id === id)
}

export function addToCart(product) {
  const cart = getCart()
  if (cart.some(item => item.id === product.id)) return cart
  const next = [...cart, product]
  saveCart(next)
  return next
}

export function removeFromCart(id) {
  const next = getCart().filter(item => item.id !== id)
  saveCart(next)
  return next
}

export function clearCart() {
  saveCart([])
}
