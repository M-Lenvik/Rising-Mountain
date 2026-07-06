import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { medusa } from '../lib/medusa.js'
import { getProductImage } from '../lib/productImages.js'
import styles from './ProductPage.module.css'

export default function ProductPage() {
  const { handle } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    medusa.store.product.list({
      handle,
      fields: '+variants.inventory_quantity',
      region_id: 'reg_01KSW8SZAV6K59SW8V71X53A87',
    }).then(({ products }) => {
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
      <Link to="/shop" className={styles.back}>← Tillbaka till butiken</Link>
      <div className={styles.layout}>
        <div className={styles.imgCol}>
          {(() => { const img = product.thumbnail || getProductImage(product.handle); return img
            ? <img src={img} alt={product.title} className={styles.img} />
            : <div className={styles.imgPlaceholder}>🔧</div>
          })()}
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
          {product.description && (
            <div className={styles.descBlock}>
              <div className={styles.descLabel}>Beskrivning</div>
              <p className={styles.desc}>{product.description}</p>
            </div>
          )}
          <div className={styles.price}>
            {price != null ? `${Math.round(price)} kr` : '–'}
          </div>
          {stock > 0 && (
            <div className={`${styles.stock} ${stock > 3 ? styles.inStock : styles.lowStock}`}>
              {stock > 3 ? `✓ ${stock} i lager` : `Finns ${stock} st`}
            </div>
          )}
          <button className={styles.addBtn}>Köp</button>
        </div>
      </div>
    </div>
  )
}
