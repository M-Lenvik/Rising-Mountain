import styles from './InfoPage.module.css'

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1>Kontakt</h1>
        <p><strong>Rising Mountain</strong></p>
        <p>
          <a href="mailto:risingmountain@gmail.com">risingmountain@gmail.com</a>
        </p>
      </div>
    </div>
  )
}
