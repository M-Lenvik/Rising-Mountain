import { useState, useEffect, useMemo } from 'react'
import { fetchProducts } from '../lib/inventory.js'
import styles from './ListPage.module.css'

export default function ListPage() {
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchProducts().then(data => {
      setAllProducts(data)
      setLoading(false)
    })
  }, [])

  const filtered = useMemo(() => {
    if (!search) return allProducts
    const q = search.toLowerCase()
    return allProducts.filter(p =>
      p.artnr?.toLowerCase().includes(q) ||
      p.beskrivning?.toLowerCase().includes(q) ||
      p.kommentar?.toLowerCase().includes(q) ||
      p.modeller?.some(m => m.toLowerCase().includes(q)) ||
      p.kategori?.toLowerCase().includes(q)
    )
  }, [allProducts, search])

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Den kompletta listan</h1>

      <div className={styles.searchBar}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Sök artikelnummer, beskrivning, modell..."
        />
        {search && <button onClick={() => setSearch('')}>✕ Rensa</button>}
      </div>

      <p className={styles.count}>{filtered.length} artiklar</p>

      {loading ? (
        <div className={styles.loading}>Laddar...</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Art.nr</th>
                <th>Beskrivning</th>
                <th>Antal</th>
                <th>Modell</th>
                <th>Detaljer</th>
                <th>Kategori</th>
                <th>Pris</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td className={styles.artnr}>{p.artnr || '–'}</td>
                  <td>{p.beskrivning || '–'}</td>
                  <td className={styles.antal}>{p.antal ?? '–'}</td>
                  <td className={styles.modeller}>
                    {p.modeller?.length > 0 ? p.modeller.join(', ') : '–'}
                  </td>
                  <td>{p.kommentar || '–'}</td>
                  <td className={styles.kategori}>{p.kategori || '–'}</td>
                  <td className={styles.pris}>{p.pris || '–'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
