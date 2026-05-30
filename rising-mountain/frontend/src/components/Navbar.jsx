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
        <Link to="/about" onClick={closeMenu}>Om oss</Link>
        <Link to="/shipping" onClick={closeMenu}>Frakt & retur</Link>
        <Link to="/contact" onClick={closeMenu}>Kontakt</Link>
      </div>

      <Link to="/cart" className={styles.cartBtn} onClick={closeMenu}>🛒 Korg</Link>
    </nav>
  )
}
