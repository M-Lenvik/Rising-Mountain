import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchProducts } from '../lib/inventory.js'
import BuyButton from '../components/BuyButton.jsx'
import styles from './ProductPage.module.css'

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts().then(data => {
      setProduct(data.find(p => p.id === id) || null)
      setLoading(false)
    })
  }, [id])

  if (loading) return <div className={styles.loading}>Laddar...</div>
  if (!product) return (
    <div className={styles.page}>
      <div className={styles.loading}>
        <p>Produkten hittades inte.</p>
        <Link to="/shop" className={styles.back}>← Tillbaka till butiken</Link>
      </div>
    </div>
  )

  return (
    <div className={styles.page}>
      <Link to="/shop" className={styles.back}>← Tillbaka till butiken</Link>
      <div className={styles.layout}>
        <div className={styles.imgCol}>
          <div className={styles.imgPlaceholder}>🔧</div>
        </div>
        <div className={styles.infoCol}>
          <h1 className={styles.title}>{product.beskrivning || product.artnr || '–'}</h1>
          {product.artnr && <div className={styles.sku}>Art.nr: {product.artnr}</div>}
          {product.modeller?.length > 0 && (
            <div className={styles.models}>
              <span className={styles.modelsLabel}>Passar:</span>
              {product.modeller.map(m => (
                <span key={m} className={styles.modelBadge}>{m}</span>
              ))}
            </div>
          )}
          {product.kommentar && (
            <div className={styles.descBlock}>
              <div className={styles.descLabel}>Beskrivning</div>
              <p className={styles.desc}>{product.kommentar}</p>
            </div>
          )}
          <div className={styles.price}>
            {product.pris || '–'}
          </div>
          {product.antal > 0 && (
            <div className={`${styles.stock} ${product.antal > 3 ? styles.inStock : styles.lowStock}`}>
              {product.antal > 3 ? `✓ ${product.antal} i lager` : `⚠ Endast ${product.antal} kvar`}
            </div>
          )}
          <BuyButton product={product} className={styles.addBtn} />
        </div>
      </div>
    </div>
  )
}
