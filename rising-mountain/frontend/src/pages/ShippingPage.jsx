import styles from './InfoPage.module.css'

export default function ShippingPage() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1>Frakt & retur</h1>
        <h2>Frakt</h2>
        <p>
          Köparen står för fraktkostnaden. Jag skickar med PostNord eller DHL beroende på
          paketets storlek och vikt. Fraktkostnaden beräknas och meddelas innan avsändning.
        </p>
        <p>
          Du är varmt välkommen att hämta din beställning på plats istället — det kostar
          ingenting och du slipper väntan. Kontakta mig så bokar vi in en tid.
        </p>
        <h2>Retur</h2>
        <p>
          Eftersom det rör sig om begagnade bildelar säljs de i befintligt skick. Jag beskriver
          varje del så noggrant som möjligt. Har du frågor om en specifik del är du alltid
          välkommen att höra av dig innan köp.
        </p>
      </div>
    </div>
  )
}
