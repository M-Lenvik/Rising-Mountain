import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCart, removeFromCart, clearCart } from '../lib/cart.js'
import styles from './CartPage.module.css'

export default function CartPage() {
  const [items, setItems] = useState(() => getCart())

  useEffect(() => {
    function sync() {
      setItems(getCart())
    }
    window.addEventListener('cart-updated', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('cart-updated', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  function handleRemove(id) {
    setItems(removeFromCart(id))
  }

  function handleClear() {
    clearCart()
    setItems([])
  }

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <h1>Kundkorg</h1>
        <p>Kundkorgen är tom.</p>
        <Link to="/shop" className={styles.back}>← Fortsätt handla</Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <h1>Kundkorg</h1>

      <ul className={styles.list}>
        {items.map(product => (
          <li key={product.id} className={styles.item}>
            <div className={styles.itemImg}><span>🔧</span></div>
            <div className={styles.itemInfo}>
              <Link to={`/products/${product.id}`} className={styles.itemName}>
                {product.beskrivning || product.artnr || '–'}
              </Link>
              {product.artnr && <div className={styles.itemSku}>{product.artnr}</div>}
              {product.modeller?.length > 0 && (
                <div className={styles.itemModels}>{product.modeller.join(', ')}</div>
              )}
            </div>
            <div className={styles.itemPrice}>{product.pris || '–'}</div>
            <button
              type="button"
              className={styles.removeBtn}
              onClick={() => handleRemove(product.id)}
              aria-label={`Ta bort ${product.beskrivning || product.artnr || 'vara'} från kundkorgen`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <div className={styles.actions}>
        <span className={styles.count}>{items.length} {items.length === 1 ? 'vara' : 'varor'}</span>
        <button type="button" className={styles.clearBtn} onClick={handleClear}>Rensa kundkorg</button>
      </div>

      <Link to="/shop" className={styles.back}>← Fortsätt handla</Link>
    </div>
  )
}
