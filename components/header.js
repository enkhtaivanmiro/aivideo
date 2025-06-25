"use client";

import React, { useState } from 'react';
import styles from '../styles/header.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'ap-northeast-1_WYgTTo7jA',
  ClientId: '2e3iko2tmgo88146l0sqb0nenm',
};
const userPool = new CognitoUserPool(poolData);

const Header = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { signOut } = await import('aws-amplify/auth');
      await signOut();
      
      await fetch('/api/auth/logout', {
        method: 'POST',
      });

      localStorage.clear();
      sessionStorage.clear();

      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed');
    }
  };

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

        <div
          className={styles.dropdownContainer}
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <div className={styles.avatarWrapper}>
            <img
              src="/profile1.svg"
              alt="Profile"
              className={styles.avatar}
            />
          </div>
          {isDropdownOpen && (
            <div className={styles.dropdownContent}>
              <Link href="/profile">Профайл</Link>
              <Link href="/settings">Тохиргоо</Link>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Гарах
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
