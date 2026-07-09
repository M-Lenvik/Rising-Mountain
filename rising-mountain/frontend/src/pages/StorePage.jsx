import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../lib/inventory.js'
import { getProductImage } from '../lib/productImages.js'
import styles from './StorePage.module.css'

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={styles.filterSection}>
      <button type="button" className={styles.filterSectionBtn} onClick={() => setOpen(o => !o)}>
        {title} <span>{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className={styles.filterSectionBody}>{children}</div>}
    </div>
  )
}

export default function StorePage() {
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [activeKategorier, setActiveKategorier] = useState([])
  const [activeModels, setActiveModels] = useState([])
  const [activeArtnr, setActiveArtnr] = useState([])
  const [artnrSearch, setArtnrSearch] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    fetchProducts().then(data => {
      setAllProducts(data)
      setLoading(false)
    })
  }, [])

  const kategorier = useMemo(() =>
    [...new Set(allProducts.map(p => p.kategori).filter(Boolean))].sort()
  , [allProducts])

  const modeller = useMemo(() =>
    [...new Set(allProducts.flatMap(p => p.modeller || []))].sort()
  , [allProducts])

  const artnrLista = useMemo(() =>
    allProducts.map(p => p.artnr).filter(Boolean).sort()
  , [allProducts])

  const filtreradeArtnr = useMemo(() =>
    artnrSearch
      ? artnrLista.filter(a => a.toLowerCase().includes(artnrSearch.toLowerCase()))
      : artnrLista
  , [artnrLista, artnrSearch])

  const filtered = useMemo(() => {
    let result = allProducts
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        p.artnr?.toLowerCase().includes(q) ||
        p.beskrivning?.toLowerCase().includes(q) ||
        p.kommentar?.toLowerCase().includes(q) ||
        p.soktermer?.toLowerCase().includes(q) ||
        p.modeller?.some(m => m.toLowerCase().includes(q))
      )
    }
    if (activeKategorier.length > 0)
      result = result.filter(p => activeKategorier.includes(p.kategori))
    if (activeModels.length > 0)
      result = result.filter(p => p.modeller?.some(m => activeModels.includes(m)))
    if (activeArtnr.length > 0)
      result = result.filter(p => activeArtnr.includes(p.artnr))
    return result
  }, [allProducts, search, activeKategorier, activeModels, activeArtnr])

  function toggleKategori(k) {
    setActiveKategorier(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k])
  }
  function toggleModel(m) {
    setActiveModels(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])
  }
  function toggleArtnr(a) {
    setActiveArtnr(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])
  }
  function clearAll() {
    setSearch(''); setSearchInput(''); setActiveKategorier([]); setActiveModels([]); setActiveArtnr([])
  }

  const hasActiveFilters = search || activeKategorier.length > 0 || activeModels.length > 0 || activeArtnr.length > 0

  return (
    <div className={styles.layout}>
      <button
        type="button"
        className={styles.filterToggle}
        aria-expanded={filtersOpen}
        onClick={() => setFiltersOpen(open => !open)}
      >
        {filtersOpen ? 'Dölj filter ▲' : 'Visa filter ▼'}
      </button>

      {/* SIDEBAR */}
      <aside className={`${styles.sidebar} ${filtersOpen ? styles.sidebarOpen : ''}`}>

        <FilterSection title="Kategori" defaultOpen={false}>
          {kategorier.map(k => (
            <label key={k} className={styles.filterChild}>
              <input type="checkbox" checked={activeKategorier.includes(k)} onChange={() => toggleKategori(k)} />
              {k}
            </label>
          ))}
        </FilterSection>

        <FilterSection title="Modell" defaultOpen={false}>
          <div className={styles.modelTags}>
            {modeller.map(m => (
              <span
                key={m}
                className={`${styles.modelTag} ${activeModels.includes(m) ? styles.activeTag : ''}`}
                onClick={() => toggleModel(m)}
              >{m}</span>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Artikelnummer" defaultOpen={false}>
          <input
            className={styles.artnrSearch}
            placeholder="Sök artikelnummer..."
            value={artnrSearch}
            onChange={e => setArtnrSearch(e.target.value)}
          />
          <div className={styles.artnrLista}>
            {filtreradeArtnr.map(a => (
              <label key={a} className={styles.filterChild}>
                <input type="checkbox" checked={activeArtnr.includes(a)} onChange={() => toggleArtnr(a)} />
                {a}
              </label>
            ))}
          </div>
        </FilterSection>

      </aside>

      {/* MAIN */}
      <main className={styles.main}>
        <div className={styles.searchBar}>
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && setSearch(searchInput)}
            placeholder='Sök på del, artikelnummer, modell...'
          />
          <button onClick={() => setSearch(searchInput)}>Sök</button>
          {search && <button className={styles.clearBtn} onClick={() => { setSearch(''); setSearchInput('') }}>✕</button>}
        </div>

        {hasActiveFilters && (
          <div className={styles.activeFilters}>
            {activeKategorier.map(k => (
              <span key={k} className={styles.filterTag}>{k} <span onClick={() => toggleKategori(k)}>✕</span></span>
            ))}
            {activeModels.map(m => (
              <span key={m} className={styles.filterTag}>{m} <span onClick={() => toggleModel(m)}>✕</span></span>
            ))}
            {activeArtnr.map(a => (
              <span key={a} className={styles.filterTag}>{a} <span onClick={() => toggleArtnr(a)}>✕</span></span>
            ))}
            {search && (
              <span className={styles.filterTag}>"{search}" <span onClick={() => { setSearch(''); setSearchInput('') }}>✕</span></span>
            )}
            <button className={styles.clearAllBtn} onClick={clearAll}>Rensa alla</button>
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
  const img = getProductImage(product.id) || getProductImage(product.artnr)

  return (
    <Link to={`/products/${product.id}`} className={styles.card}>
      <div className={styles.cardImg}>
        {img
          ? <img src={img} alt={product.beskrivning || product.artnr} />
          : <span>🔧</span>
        }
      </div>
      <div className={styles.cardBody}>
        {product.kategori && <div className={styles.cardKategori}>{product.kategori}</div>}
        <div className={styles.cardName}>{product.beskrivning || '–'}</div>
        {product.artnr && <div className={styles.cardSku}>{product.artnr}</div>}
        {product.modeller?.length > 0 && (
          <div className={styles.cardModels}>
            {product.modeller.slice(0, 4).map(m => (
              <span key={m} className={styles.modelBadge}>{m}</span>
            ))}
          </div>
        )}
        {product.kommentar && <div className={styles.cardDesc}><strong>Beskrivning:</strong> {product.kommentar}</div>}
        <div className={styles.cardFooter}>
          <div>
            <div className={styles.price}>{product.pris || '–'}</div>
            {product.antal > 0 && (
              <div className={`${styles.stock} ${product.antal > 3 ? styles.inStock : styles.lowStock}`}>
                {product.antal > 3 ? `✓ Finns ${product.antal} st` : `⚠ ${product.antal} st kvar`}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
