import { Link } from 'react-router-dom'
import styles from './CartPage.module.css'

export default function CartPage() {
  return (
    <div className={styles.page}>
      <h1>Kundvagn</h1>
      <p>Kundvagnen är tom.</p>
      <Link to="/shop" className={styles.back}>← Fortsätt handla</Link>
    </div>
  )
}
