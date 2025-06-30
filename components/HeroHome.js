"use client"

import styles from "../styles/HeroHome.module.css"

export default function HeroHome() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>WELCOME TO THE RETRO AI PLAYER</h1>
        <p className={styles.heroSubtitle}>Enjoy the nostalgic experience</p>
      </div>
    </section>
  )
}
