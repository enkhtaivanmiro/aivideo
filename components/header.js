"use client";

import React, { useState } from 'react';
import styles from '../styles/header.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'ap-northeast-1_WYgTTo7jA', // replace with your actual pool ID
  ClientId: '2e3iko2tmgo88146l0sqb0nenm', // replace with your actual client ID
};
const userPool = new CognitoUserPool(poolData);

const Header = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async (e) => {
    e.preventDefault();

    const toastId = toast.loading('Гарч байна...');

    // Clear Cognito session on client
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
    }

    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });

      if (res.ok) {
        toast.success('Амжилттай гарлаа!', { id: toastId });
        router.push('/login');
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      toast.error(error.message || 'Гарахад алдаа гарлаа', { id: toastId });
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
              <a href="#">Профайл</a>
              <a href="#">Тохиргоо</a>
              <a href="#" onClick={handleLogout}>Гарах</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
