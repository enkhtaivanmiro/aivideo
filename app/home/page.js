// app/home/page.js
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Header from '../../components/header';
import Hero from '../../components/hero';
import styles from '../../styles/Home.module.css';
import Link from 'next/link';

const videoList = [
  {
    id: 1,
    title: 'Video 1',
    image: '/images/cover.webp',
    labels: ['Approved'],
  },
  {
    id: 2,
    title: 'Video 2',
    image: '/images/cover.webp',
    labels: ['In Review'],
  },
  {
    id: 3,
    title: 'Video 3',
    image: '/images/cover.webp',
    labels: ['Rejected'],
  },
];

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('HomePage: Fetching user data');
        
        const { getCurrentUser, fetchUserAttributes } = await import('aws-amplify/auth');
        
        const currentUser = await getCurrentUser();
        console.log('HomePage: Authenticated user:', currentUser.username);
        
        const attributes = await fetchUserAttributes();
        console.log('HomePage: User attributes:', attributes);
        
        // Convert attributes to the expected format
        const userData = Object.keys(attributes).reduce((acc, key) => {
          const cleanKey = key.replace('custom:', '');
          acc[cleanKey] = attributes[key];
          return acc;
        }, {});
        
        // Add username from getCurrentUser
        userData.username = currentUser.username;
        
        console.log('HomePage: Processed user data:', userData);
        setUser(userData);
      } catch (error) {
        console.error('HomePage: Failed to fetch user data:', error);
        // Don't redirect here - AuthGuard will handle authentication
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: 'white'
      }}>
        Loading user data...
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header user={user} />
      <Hero />
      <main>
        <h1 className={styles.sectionTitle}>Таны контент</h1>
        <div className={styles.carousel}>
          <Link href="/upload">
            <div className={styles.upload}>
              <img src="/upload.svg" alt="Arrow" />
            </div>
          </Link>
          {videoList
            .filter((item) =>
              item.labels.some((label) =>
                ['Approved', 'In Review', 'Rejected'].includes(label)
              )
            )
            .map((item) => (
              <div key={item.id} className={styles.card}>
                <div className={styles.labelContainer}>
                  {item.labels.includes('Approved') && (
                    <span className={styles.approvedLabel}>Зөвшөөрсөн</span>
                  )}
                  {item.labels.includes('In Review') && (
                    <span className={styles.inReview}>Шалгаждаж буй</span>
                  )}
                  {item.labels.includes('Rejected') && (
                    <span className={styles.rejected}>Татгалзсан</span>
                  )}
                </div>
                <Image
                  src={item.image}
                  alt={item.title}
                  width={250}
                  height={140}
                  className={styles.cardImage}
                  priority
                />
              </div>
            ))}
        </div>

        <h1 className={styles.sectionTitle}>Admin Approved Contents</h1>
        <div className={styles.carousel}>
          {videoList
            .filter((item) => item.labels.includes('Approved'))
            .map((item) => (
              <div key={item.id} className={styles.card}>
                <div className={styles.labelContainer}>
                  <span className={styles.approvedLabel}>Зөвшөөрсөн</span>
                </div>
                <Image
                  src={item.image}
                  alt={item.title}
                  width={250}
                  height={140}
                  className={styles.cardImage}
                  priority
                />
                <div className={styles.progressBarContainer}>
                  <div
                    className={styles.progressBar}
                    style={{ width: `${item.progress || 0}%` }}
                  />
                </div>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}