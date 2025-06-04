import React from 'react';
import styles from '../styles/hero.module.css'; // Create this CSS file
import Link from 'next/link';

const Header = () => {
  return (
    <main>
        <div className={styles.hero}>Сурталчилгаа эсвэл нэг видёоо</div>
    </main>
  );
};

export default Header;
