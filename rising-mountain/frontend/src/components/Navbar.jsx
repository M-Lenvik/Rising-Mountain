import { useState } from 'react'
import { Link } from 'react-router-dom'
import logoImg from '../assets/RisingMountain_logga.png'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

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
        <Link to="/shipping" onClick={closeMenu}>Frakt & retur</Link>
        <Link to="/about" onClick={closeMenu}>Om Rising Mountain</Link>
        <Link to="/contact" onClick={closeMenu}>Kontakt</Link>
        <Link to="/cart" className={styles.cartBtnMobile} onClick={closeMenu}>🛒 Korg</Link>
      </div>

      <Link to="/cart" className={styles.cartBtn} onClick={closeMenu}>🛒 Korg</Link>
    </nav>
  )
}
