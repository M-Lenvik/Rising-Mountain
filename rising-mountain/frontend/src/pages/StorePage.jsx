import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { medusa } from '../lib/medusa.js'
import styles from './StorePage.module.css'

// Kategorihierarki — speglar det vi satt upp i Medusa
const CATEGORIES = {
  'Bromsar': ['Bromsok', 'Bromshydraulik', 'Bromsskivor', 'Bromsbelägg'],
  'Motor': ['Kolvar', 'Kamaxlar', 'Packning', 'Tändning'],
  'Styrning': ['Styrväxel', 'Styrleder', 'Rattstång'],
  'Fjädring': ['Stötdämpare', 'Fjädrar', 'Bussningar'],
  'Kaross & interiör': ['Dörrtätningar', 'Emblem', 'Instrumentpanel'],
}

export default function StorePage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([]) // { id, handle, name }
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [activeCategories, setActiveCategories] = useState([])
  const [activeModels, setActiveModels] = useState([])
  const [openParents, setOpenParents] = useState({})

  // Hämta kategorier en gång för att få deras ID:n
  useEffect(() => {
    fetch(`${import.meta.env.VITE_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/store/product-categories?limit=100`, {
      headers: { 'x-publishable-api-key': import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY }
    })
      .then(r => r.json())
      .then(data => {
        console.log('Kategorier:', data.product_categories)
        setCategories(data.product_categories || [])
      })
      .catch(e => console.error('Kategorifel:', e))
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [search, activeCategories, categories])

  async function fetchProducts() {
    setLoading(true)
    try {
      const params = { limit: 100, fields: '+images,+thumbnail' }
      if (search) params.q = search
      if (activeCategories.length > 0) {
        const ids = activeCategories
          .map(name => categories.find(c => c.name.toLowerCase() === name.toLowerCase())?.id)
          .filter(Boolean)
        console.log('Aktiva kategorier:', activeCategories, '→ IDs:', ids)
        if (ids.length > 0) params.category_id = ids
      }
      const { products: data } = await medusa.store.product.list(params)
      // Filtrera bort produkter utan lager
      const inStock = data.filter(p =>
        p.variants?.some(v => (v.inventory_quantity ?? 1) > 0)
      )
      setProducts(inStock)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  function toggleCategory(cat) {
    setActiveCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  function toggleModel(model) {
    setActiveModels(prev =>
      prev.includes(model) ? prev.filter(m => m !== model) : [...prev, model]
    )
  }

  function toggleParent(parent) {
    setOpenParents(prev => ({ ...prev, [parent]: !prev[parent] }))
  }

  // Filtrera på modell via product tags
  const filtered = activeModels.length === 0
    ? products
    : products.filter(p =>
        p.tags?.some(t => activeModels.includes(t.value))
      )

  const models = ['240Z', '260Z', '280Z', '280ZX', '510', '521', '620', '720', 'Sunny', 'Bluebird', 'Fairlady']

  return (
    <div className={styles.layout}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <h3>Kategori</h3>
        {categories.map(cat => (
          <label key={cat.id} className={styles.filterChild}>
            <input
              type="checkbox"
              checked={activeCategories.includes(cat.name)}
              onChange={() => toggleCategory(cat.name)}
            />
            {cat.name}
          </label>
        ))}

        <h3 style={{ marginTop: '20px' }}>Modell</h3>
        <div className={styles.modelTags}>
          {models.map(m => (
            <span
              key={m}
              className={`${styles.modelTag} ${activeModels.includes(m) ? styles.activeTag : ''}`}
              onClick={() => toggleModel(m)}
            >{m}</span>
          ))}
        </div>
      </aside>

      {/* MAIN */}
      <main className={styles.main}>
        {/* SEARCH */}
        <div className={styles.searchBar}>
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && setSearch(searchInput)}
            placeholder='Sök på del, artikelnummer, modell... ex. "bromsok 240Z"'
          />
          <button onClick={() => setSearch(searchInput)}>Sök</button>
          {search && <button className={styles.clearBtn} onClick={() => { setSearch(''); setSearchInput('') }}>✕ Rensa</button>}
        </div>

        {/* ACTIVE FILTERS */}
        {(activeCategories.length > 0 || activeModels.length > 0) && (
          <div className={styles.activeFilters}>
            {activeCategories.map(c => (
              <span key={c} className={styles.filterTag}>
                {c} <span onClick={() => toggleCategory(c)}>✕</span>
              </span>
            ))}
            {activeModels.map(m => (
              <span key={m} className={styles.filterTag}>
                {m} <span onClick={() => toggleModel(m)}>✕</span>
              </span>
            ))}
          </div>
        )}

        <div className={styles.header}>
          <span>{filtered.length} delar</span>
        </div>

        {loading ? (
          <div className={styles.loading}>Laddar...</div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>Inga delar hittades.</div>
        ) : (
          <div className={styles.grid}>
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function ProductCard({ product }) {
  const variant = product.variants?.[0]
  const price = variant?.calculated_price?.calculated_amount
  const stock = variant?.inventory_quantity

  return (
    <Link to={`/products/${product.handle}`} className={styles.card}>
      <div className={styles.cardImg}>
        {product.thumbnail
          ? <img src={product.thumbnail} alt={product.title} />
          : <span>🔧</span>
        }
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardName}>{product.title}</div>
        {variant?.sku && <div className={styles.cardSku}>{variant.sku}</div>}
        {product.tags?.length > 0 && (
          <div className={styles.cardModels}>
            {product.tags.slice(0, 4).map(t => (
              <span key={t.id} className={styles.modelBadge}>{t.value}</span>
            ))}
          </div>
        )}
        <div className={styles.cardFooter}>
          <div>
            <div className={styles.price}>
              {price != null ? `${Math.round(price / 100)} kr` : '–'}
            </div>
            <div className={`${styles.stock} ${stock > 3 ? styles.inStock : styles.lowStock}`}>
              {stock > 3 ? `✓ ${stock} i lager` : stock > 0 ? `⚠ ${stock} kvar` : 'Slutsåld'}
            </div>
          </div>
          <button className={styles.addBtn} onClick={e => e.preventDefault()}>+ Korg</button>
        </div>
      </div>
    </Link>
  )
}
