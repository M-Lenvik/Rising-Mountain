import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo} onClick={closeMenu}>
        RISING<span>MOUNTAIN</span>
        <span className={styles.sub}>Nissan · Datsun Parts</span>
      </Link>

      <button
        type="button"
        className={styles.menuBtn}
        aria-label={menuOpen ? 'Stäng meny' : 'Öppna meny'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(open => !open)}
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      <div className={`${styles.links} ${menuOpen ? styles.linksOpen : ''}`}>
        <Link to="/shop" onClick={closeMenu}>Shop</Link>
        <Link to="/" onClick={closeMenu}>Om oss</Link>
        <a href="#" onClick={closeMenu}>Frakt & retur</a>
        <a href="#" onClick={closeMenu}>Kontakt</a>
      </div>

      <Link to="/cart" className={styles.cartBtn} onClick={closeMenu}>🛒 Korg</Link>
    </nav>
  )
}
