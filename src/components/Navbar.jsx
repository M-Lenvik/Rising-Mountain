import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import logoImg from '../assets/RisingMountain_logga.webp'
import { getCart } from '../lib/cart.js'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(() => getCart().length)

  useEffect(() => {
    function sync() {
      setCartCount(getCart().length)
    }
    window.addEventListener('cart-updated', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('cart-updated', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo} onClick={closeMenu}>
        <img src={logoImg} alt="Rising Mountain" className={styles.logoImg} />
        <span className={styles.logoText}>
          <span className={styles.logoName}>RISING<span className={styles.gold}>MOUNTAIN</span></span>
          <span className={styles.sub}>Nissan · Datsun Parts</span>
        </span>
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
        <Link to="/shop" onClick={closeMenu}>Delar</Link>
        <Link to="/list" onClick={closeMenu}>Kompletta listan</Link>
        <Link to="/shipping" onClick={closeMenu}>Frakt & retur</Link>
        <Link to="/about" onClick={closeMenu}>Om Rising Mountain</Link>
        <Link to="/contact" onClick={closeMenu}>Kontakt</Link>
        <Link to="/cart" className={styles.cartBtnMobile} onClick={closeMenu}>
          🛒 Korg{cartCount > 0 && <span className={styles.cartCount}>{cartCount}</span>}
        </Link>
      </div>

      <Link to="/cart" className={styles.cartBtn} onClick={closeMenu}>
        🛒 Korg{cartCount > 0 && <span className={styles.cartCount}>{cartCount}</span>}
      </Link>
    </nav>
  )
}
