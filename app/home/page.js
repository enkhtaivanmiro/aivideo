'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Header from '../../components/header';
import Hero from '../../components/hero';
import styles from '../../styles/Home.module.css';
import Link from 'next/link';

export default function HomePage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch('/api/videos');
        if (!res.ok) throw new Error('Failed to fetch videos');
        const data = await res.json();
        setVideos(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          color: 'white',
        }}
      >
        Loading videos...
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header />
      <Hero />
      <main>
        <h1 className={styles.sectionTitle}>Таны контент</h1>
        <div className={styles.carousel}>
          <Link href="/upload">
            <div className={styles.upload}>
              <img src="/upload.svg" alt="Upload" />
            </div>
          </Link>
          <Link href="/admin">
                      <div className={styles.upload}>
              <img src="/upload.svg" alt="Upload" />
            </div>
          </Link>

          {videos.length === 0 && <p style={{ color: 'white' }}>No videos found.</p>}

          {videos.map((video) => (
            <div key={video.key} className={styles.card}>
              <video
                src={video.url}
                width={250}
                height={140}
                controls
                className={styles.cardImage}
              />
              <p style={{ color: 'white', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                {video.key.split('/').pop()}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
