import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import emailjs from '@emailjs/browser'
import { getCart, removeFromCart, clearCart } from '../lib/cart.js'
import { generateOrderId, formatOrderItems, formatTotal } from '../lib/order.js'
import styles from './CartPage.module.css'

const EMPTY_FORM = {
  namn: '',
  epost: '',
  leverans: 'hamta',
  gatuadress: '',
  postnummer: '',
  ort: '',
  meddelande: '',
}

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export default function CartPage() {
  const [items, setItems] = useState(() => getCart())
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

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

  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.namn.trim() || !form.epost.trim()) {
      setError('Fyll i namn och e-post.')
      return
    }
    if (form.leverans === 'skicka' && (!form.gatuadress.trim() || !form.postnummer.trim() || !form.ort.trim())) {
      setError('Fyll i gatuadress, postnummer och ort, eller välj hämta på plats.')
      return
    }

    setError('')
    setSending(true)

    const templateParams = {
      customerName: form.namn,
      customerEmail: form.epost,
      order_id: generateOrderId(),
      delivery: form.leverans === 'hamta' ? 'Hämta på plats' : 'Skicka hem',
      customerAddress: form.leverans === 'skicka'
        ? `${form.gatuadress.trim()}, ${form.postnummer.trim()} ${form.ort.trim()}`
        : '–',
      order_items: formatOrderItems(items),
      message: form.meddelande.trim() || '–',
      total_order_cost: formatTotal(items),
    }

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, { publicKey: PUBLIC_KEY })
      clearCart()
      setItems([])
      setForm(EMPTY_FORM)
      setSent(true)
    } catch (err) {
      console.error('EmailJS-fel:', err)
      setError('Något gick fel när beställningen skulle skickas. Försök igen om en liten stund, eller maila mig direkt på rising.mountain.datsunparts@gmail.com.')
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div className={styles.page}>
        <h1>Tack för din förfrågan!</h1>
        <p>En bekräftelse har skickats till din e-post. Jag återkommer så snart som möjligt.</p>
        <p>Eftersom jag har delarna på mitt lantställe kan det dröja en tid innan jag kan skicka dem.</p>
        <p>Om du inte får ett bekräftelsemail är det troligt att det fastnat i din skräppost. Om du inte får ett bekräftelsemail inom 24 timmar är det bäst att maila mig på rising.mountain.datsunparts@gmail.com.</p>
        <Link to="/shop" className={styles.back}>← Fortsätt handla</Link>
      </div>
    )
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
          <>
            <label className={styles.formField}>
              <span>Gatuadress</span>
              <input
                type="text"
                value={form.gatuadress}
                onChange={e => updateField('gatuadress', e.target.value)}
                required
              />
            </label>

            <div className={styles.formRow}>
              <label className={styles.formField}>
                <span>Postnummer</span>
                <input
                  type="text"
                  value={form.postnummer}
                  onChange={e => updateField('postnummer', e.target.value)}
                  required
                />
              </label>

              <label className={styles.formField}>
                <span>Ort</span>
                <input
                  type="text"
                  value={form.ort}
                  onChange={e => updateField('ort', e.target.value)}
                  required
                />
              </label>
            </div>
          </>
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

        <button type="submit" className={styles.submitBtn} disabled={sending}>
          {sending ? 'Skickar...' : 'Skicka beställning'}
        </button>
      </form>
    </div>
  )
}
