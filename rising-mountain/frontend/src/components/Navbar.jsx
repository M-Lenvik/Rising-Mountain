import { Link } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        RISING<span>MOUNTAIN</span>
        <span className={styles.sub}>Nissan · Datsun Parts</span>
      </Link>
      <div className={styles.links}>
        <Link to="/shop">Shop</Link>
        <Link to="/">Om oss</Link>
        <a href="#">Frakt & retur</a>
        <a href="#">Kontakt</a>
      </div>
      <Link to="/cart" className={styles.cartBtn}>🛒 Korg</Link>
    </nav>
  )
}
