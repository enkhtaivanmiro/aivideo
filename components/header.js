import React from 'react';
import styles from '../styles/header.module.css'; // Create this CSS file
import Link from 'next/link';

const Header = () => {
  return (
        <header className={styles.header}>
        <div className={styles.headerLeft}>
            <Link href="/home" className={styles.logo}>Logo</Link>
        </div>

        <div className={styles.headerRight}>
            <nav className={styles.navLinks}>
            <Link href="/home">Нүүр</Link>
            <Link href="#">Ангилал</Link>
            </nav>
            <img src="/profile1.svg" alt="Profile" className={styles.avatar} />
        </div>
        </header>

  );
};

export default Header;
