import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { medusa } from '../lib/medusa.js'
import styles from './ProductPage.module.css'

export default function ProductPage() {
  const { handle } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    medusa.store.product.list({ handle }).then(({ products }) => {
      setProduct(products[0] || null)
      setLoading(false)
    })
  }, [handle])

  if (loading) return <div className={styles.loading}>Laddar...</div>
  if (!product) return <div className={styles.loading}>Produkten hittades inte.</div>

  const variant = product.variants?.[0]
  const price = variant?.calculated_price?.calculated_amount
  const stock = variant?.inventory_quantity ?? 0

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.back}>← Tillbaka till butiken</Link>
      <div className={styles.layout}>
        <div className={styles.imgCol}>
          {product.thumbnail
            ? <img src={product.thumbnail} alt={product.title} className={styles.img} />
            : <div className={styles.imgPlaceholder}>🔧</div>
          }
        </div>
        <div className={styles.infoCol}>
          <h1 className={styles.title}>{product.title}</h1>
          {variant?.sku && <div className={styles.sku}>Art.nr: {variant.sku}</div>}
          {product.tags?.length > 0 && (
            <div className={styles.models}>
              <span className={styles.modelsLabel}>Passar:</span>
              {product.tags.map(t => (
                <span key={t.id} className={styles.modelBadge}>{t.value}</span>
              ))}
            </div>
          )}
          {product.description && <p className={styles.desc}>{product.description}</p>}
          <div className={styles.price}>
            {price != null ? `${Math.round(price / 100)} kr` : '–'}
          </div>
          <div className={`${styles.stock} ${stock > 0 ? styles.inStock : styles.outOfStock}`}>
            {stock > 3 ? `✓ ${stock} i lager` : stock > 0 ? `⚠ Endast ${stock} kvar` : 'Slutsåld'}
          </div>
          {stock > 0 && (
            <button className={styles.addBtn}>Lägg i kundvagn</button>
          )}
        </div>
      </div>
    </div>
  )
}
