"use client"

import { useState } from "react"
import styles from "../styles/header.module.css"
import Link from "next/link"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { CognitoUserPool } from "amazon-cognito-identity-js"

const poolData = {
  UserPoolId: "ap-northeast-1_WYgTTo7jA",
  ClientId: "2e3iko2tmgo88146l0sqb0nenm",
}
const userPool = new CognitoUserPool(poolData)

const Header = ({ currentTime }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const { signOut } = await import("aws-amplify/auth")
      await signOut()

      await fetch("/api/auth/logout", {
        method: "POST",
      })

      localStorage.clear()
      sessionStorage.clear()

      window.location.href = "/login"
    } catch (error) {
      console.error("Logout failed:", error)
      toast.error("Logout failed")
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <div className={styles.dvdPlayerDisplay}>
          <span className={styles.dvdPlayerText}>AI Контент</span>
        </div>
      </div>

      <div className={styles.headerCenter}>
        <div className={styles.controlButtons}>
          <button className={styles.controlBtn}>⏮</button>
          <button className={styles.controlBtn}>▶</button>
          <button className={styles.controlBtn}>⏸</button>
          <button className={styles.controlBtn}>⏭</button>
        </div>
      </div>

      <div className={styles.headerRight}>
        <nav className={styles.navLinks}>
          <Link href="/home">НҮҮР</Link>
          <Link href="#">АНГИЛАЛ</Link>
        </nav>

        <div
          className={styles.dropdownContainer}
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <div className={styles.avatarWrapper}>
            <div className={styles.avatar}>👤</div>
          </div>
          {isDropdownOpen && (
            <div className={styles.dropdownContent}>
              <Link href="/profile">ПРОФАЙЛ</Link>
              <Link href="/settings">ТОХИРГОО</Link>
              <button onClick={handleLogout} className={styles.logoutButton}>
                ГАРАХ
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
