'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '../../components/header';
import styles from '../../styles/Profile.module.css';
import { motion, AnimatePresence } from "framer-motion";

function Preloader() {
  return (
    <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="preloader">
      <div className="preloader-content">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="loading-spinner"
        />
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          className="loading-text"
        >
          Initializing AI System...
        </motion.p>
      </div>
    </motion.div>
  )
}

export default function ProfilePage() {
    const [profileData, setProfileData] = useState({
        name: '',
        title: '',
        location: '',
        about: '',
        stats: {
            Uploaded: '',
            Accepted: '',
            Rejected: '',
            Review: '',
        },
        contact: {
            email: '',
            phone: '',
        },
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dvdRef = useRef(null);

    const defaultData = {
        name: 'Нэр',
        title: 'Ажил мэргэжил',
        location: 'Ulaanbaatar, Mongolia',
        about: 'Тохиргоо хэсгээс өөрийн мэдээллийг оруулна уу.',
        stats: {
            Uploaded: '0',
            Accepted: '0',
            Rejected: '0',
            Review: '0',
        },
        contact: {
            email: 'example@example.com',
            phone: '+976 98765432',
        },
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const { getCurrentUser, fetchUserAttributes } = await import('aws-amplify/auth');
                const user = await getCurrentUser();
                const attributes = await fetchUserAttributes();
                const attrMap = Object.keys(attributes).reduce((acc, key) => {
                    const cleanKey = key.replace('custom:', '');
                    acc[cleanKey] = attributes[key];
                    return acc;
                }, {});

                const res = await fetch('/api/videos/stats');
                const stats = await res.json();

                setProfileData({
                    name: attrMap.name || defaultData.name,
                    title: attrMap.title || defaultData.title,
                    location: attrMap.location || defaultData.location,
                    about: attrMap.about || defaultData.about,
                    stats: {
                        Uploaded: stats.Uploaded || '0',
                        Accepted: stats.Accepted || '0',
                        Rejected: stats.Rejected || '0',
                        Review: stats.Review || '0',
                    },
                    contact: {
                        email: attrMap.email || attributes.email || defaultData.contact.email,
                        phone: attrMap.phone || defaultData.contact.phone,
                    },
                });
            } catch (error) {
                console.error('ProfilePage: Failed to load user profile:', error);
                setError(error.message);
                setProfileData(defaultData);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    useEffect(() => {
        const dvd = dvdRef.current;
        if (!dvd) return;

        let x = Math.random() * (window.innerWidth - 100);
        let y = Math.random() * (window.innerHeight - 50);
        let dx = 1.5;
        let dy = 1.5;
        const colors = ['#0f0', '#0c0', '#6f6'];
        let index = 0;

        const animate = () => {
            x += dx;
            y += dy;
            if (x <= 0 || x >= window.innerWidth - 100) {
                dx = -dx;
                index = (index + 1) % colors.length;
                dvd.style.color = colors[index];
            }
            if (y <= 0 || y >= window.innerHeight - 50) {
                dy = -dy;
                index = (index + 1) % colors.length;
                dvd.style.color = colors[index];
            }
            dvd.style.left = `${x}px`;
            dvd.style.top = `${y}px`;
            requestAnimationFrame(animate);
        };

        animate();
    }, []);

      if (loading) {
      return (
        <AnimatePresence>
          <Preloader />
        </AnimatePresence>
      );
    }

    return (
        <div className={styles.container}>
            <div className="scanLines" />
            <Header />

            <div className={styles.wrapper}>
                <div className={styles.profileHeader}>
                    <div className={styles.avatar}>👤</div>
                    <h1 className={styles.name}>{profileData.name}</h1>
                    <p className={styles.title}>{profileData.title}</p>
                    <p className={styles.location}>📍 {profileData.location}</p>
                </div>

                <div className={styles.statsGrid}>
                    {['Uploaded', 'Accepted', 'Rejected', 'Review'].map((key) => (
                        <div className={styles.statCard} key={key}>
                            <div className={`${styles.statNumber} ${styles[key.toLowerCase()]}`}>
                                {profileData.stats[key]}
                            </div>
                            <div className={styles.statLabel}>{key}</div>
                        </div>
                    ))}
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Миний тухай</h2>
                    <p className={styles.aboutText}>{profileData.about}</p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Холбогдох мэдээлэл</h2>
                    <div className={styles.contactGrid}>
                        <div className={styles.contactItem}>
                            <span className={styles.contactIcon}>📧</span>
                            <span className={styles.contactText}>{profileData.contact.email}</span>
                        </div>
                        <div className={styles.contactItem}>
                            <span className={styles.contactIcon}>📱</span>
                            <span className={styles.contactText}>{profileData.contact.phone}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
