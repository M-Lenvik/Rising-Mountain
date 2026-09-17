import { Link } from 'react-router-dom'
import risingMountainImg from '../assets/RisingMountain_landingpage.png'
import styles from './LandingPage.module.css'

export default function LandingPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <img
          src={risingMountainImg}
          alt="Rising Mountain — Nissan och Datsun-delar"
          className={styles.heroImg}
        />
      </section>

      <section className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            RISING<span>MOUNTAIN</span>
          </h1>
          <p className={styles.tagline}>Nissan · Datsun · begagnade originaldelar</p>
        </div>
        <p className={styles.intro}>
          Här hittar du begagnade bildelar — framför allt till Nissan och Datsun,
          men det finns också en del delar till andra märken.
        </p>

        <Link to="/shop" className={styles.shopBtn}>
          Se alla delar →
        </Link>
      </section>
    </div>
  )
}
