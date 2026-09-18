import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCart, removeFromCart, clearCart } from '../lib/cart.js'
import styles from './CartPage.module.css'

const EMPTY_FORM = { namn: '', epost: '', leverans: 'hamta', adress: '', meddelande: '' }

export default function CartPage() {
  const [items, setItems] = useState(() => getCart())
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')

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

  function updateField(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (!form.namn.trim() || !form.epost.trim()) {
      setError('Fyll i namn och e-post.')
      return
    }
    if (form.leverans === 'skicka' && !form.adress.trim()) {
      setError('Fyll i leveransadress, eller välj hämta på plats.')
      return
    }

    setError('')
    // Mailutskicket (till säljare + köpare) kopplas in i nästa steg
    console.log('Beställning redo att skickas:', { items, ...form })
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

      <form className={styles.checkoutForm} onSubmit={handleSubmit}>
        <h2 className={styles.formTitle}>Dina uppgifter</h2>

        <label className={styles.formField}>
          <span>Namn</span>
          <input
            type="text"
            value={form.namn}
            onChange={e => updateField('namn', e.target.value)}
            required
          />
        </label>

        <label className={styles.formField}>
          <span>E-post</span>
          <input
            type="email"
            value={form.epost}
            onChange={e => updateField('epost', e.target.value)}
            required
          />
        </label>

        <div className={styles.formField}>
          <span>Leveranssätt</span>
          <div className={styles.radioGroup}>
            <label className={styles.radioOption}>
              <input
                type="radio"
                name="leverans"
                value="hamta"
                checked={form.leverans === 'hamta'}
                onChange={() => updateField('leverans', 'hamta')}
              />
              Hämta på plats
            </label>
            <label className={styles.radioOption}>
              <input
                type="radio"
                name="leverans"
                value="skicka"
                checked={form.leverans === 'skicka'}
                onChange={() => updateField('leverans', 'skicka')}
              />
              Skicka hem
            </label>
          </div>
        </div>

        {form.leverans === 'skicka' && (
          <label className={styles.formField}>
            <span>Leveransadress</span>
            <textarea
              value={form.adress}
              onChange={e => updateField('adress', e.target.value)}
              rows={3}
              placeholder="Namn, gatuadress, postnummer och ort"
              required
            />
          </label>
        )}

        <label className={styles.formField}>
          <span>Meddelande <span className={styles.optional}>(valfritt)</span></span>
          <textarea
            value={form.meddelande}
            onChange={e => updateField('meddelande', e.target.value)}
            rows={3}
            placeholder="T.ex. frågor om delarna eller önskemål kring hämtning/leverans"
          />
        </label>

        {error && <p className={styles.formError}>{error}</p>}

        <button type="submit" className={styles.submitBtn}>Skicka beställning</button>
      </form>
    </div>
  )
}
