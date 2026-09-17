import { Link } from 'react-router-dom'
import styles from './InfoPage.module.css'

export default function NotFoundPage() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1>Sidan hittades inte</h1>
        <p>Sidan du letar efter finns inte, eller så har den flyttats.</p>
        <p><Link to="/">← Till startsidan</Link> eller <Link to="/shop">se alla delar</Link></p>
      </div>
    </div>
  )
}
