import styles from './InfoPage.module.css'

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1>Om Rising Mountain</h1>
        <p>
          Rising Mountain är ingen butik i traditionell mening — snarare resultatet av ett långt
          liv med Nissan och Datsun. Genom åren har jag samlat på mig ett större antal delar
          som det visat sig att jag inte längre behöver, och istället för att låta dem samla damm
          känns det rätt att ge dem en chans att komma till nytta igen.
        </p>
        <p>
          Delarna förvaras på mitt lantställe dit jag åker ofta, men det kan också dröja mellan
          besöken. Jag skickar delarna så snart som möjligt efter beställning — har man tur går
          paketet iväg redan dagen efter, men ibland kan det ta ett par veckor.
        </p>
        <p>
          Du är självklart välkommen att komma förbi och hämta på plats om du föredrar det.
          Hör av dig så kommer vi överens om en tid.
        </p>
      </div>
    </div>
  )
}
