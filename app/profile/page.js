'use client'

import { useState, useEffect } from 'react';
import Header from '../../components/header';
import styles from '../../styles/Profile.module.css';

export default function ProfilePage() {
    const [profileData, setProfileData] = useState({
        name: '',
        title: '',
        location: '',
        about: '',
        stats: {
            Uploaded: '',
            Accepted: '',
            Review: '',
        },
        contact: {
            email: '',
            phone: '',
        },
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Default/fallback data for display
    const defaultData = {
        name: 'Нэр',
        title: 'Ажил мэргэжил',
        location: 'Ulaanbaatar, Mongolia',
        about: 'Тохиргоо хэсгээс өөрийн мэдээллийг оруулна уу.',
        stats: {
            Uploaded: '0',
            Accepted: '0',
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
                console.log('ProfilePage: Fetching user profile data');
                
                const user = await getCurrentUser();
                console.log('ProfilePage: User found:', user.username);
                
                const attributes = await fetchUserAttributes();
                console.log('ProfilePage: User attributes:', attributes);
                
                // Convert attributes to the expected format
                const attrMap = Object.keys(attributes).reduce((acc, key) => {
                    const cleanKey = key.replace('custom:', '');
                    acc[cleanKey] = attributes[key];
                    return acc;
                }, {});

                // Update profile data with fetched attributes
                setProfileData({
                    name: attrMap.name || defaultData.name,
                    title: attrMap.title || defaultData.title,
                    location: attrMap.location || defaultData.location,
                    about: attrMap.about || defaultData.about,
                    stats: {
                        Uploaded: attrMap.uploaded || defaultData.stats.Uploaded,
                        Accepted: attrMap.accepted || defaultData.stats.Accepted,
                        Review: attrMap.review || defaultData.stats.Review,
                    },
                    contact: {
                        email: attrMap.email || attributes.email || defaultData.contact.email,
                        phone: attrMap.phone || defaultData.contact.phone,
                    },
                });

                console.log('ProfilePage: Profile data loaded successfully');
            } catch (error) {
                console.error('ProfilePage: Failed to load user profile:', error);
                setError(error.message);
                // Use default data if loading fails
                setProfileData(defaultData);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    // Show loading state
    if (loading) {
        return (
            <div className={styles.container}>
                <Header />
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '50vh',
                    color: 'white'
                }}>
                    Loading profile...
                </div>
            </div>
        );
    }

    // Show error state (but still display default data)
    if (error) {
        console.warn('ProfilePage: Displaying with default data due to error:', error);
    }

    return (
        <div className={styles.container}>
            <Header />
            
            <div className={styles.wrapper}>
                {/* Profile Header */}
                <div className={styles.profileHeader}>
                    <div className={styles.avatar}>
                        👤
                    </div>
                    
                    <h1 className={styles.name}>
                        {profileData.name}
                    </h1>
                    
                    <p className={styles.title}>
                        {profileData.title}
                    </p>
                    
                    <p className={styles.location}>
                        📍 {profileData.location}
                    </p>
                </div>

                {/* Stats Section */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={`${styles.statNumber} ${styles.blue}`}>
                            {profileData.stats.Uploaded}
                        </div>
                        <div className={styles.statLabel}>
                            Оруулсан
                        </div>
                    </div>
                    
                    <div className={styles.statCard}>
                        <div className={`${styles.statNumber} ${styles.green}`}>
                            {profileData.stats.Accepted}
                        </div>
                        <div className={styles.statLabel}>
                            Зөвшөөрсөн
                        </div>
                    </div>
                    
                    <div className={styles.statCard}>
                        <div className={`${styles.statNumber} ${styles.orange}`}>
                            {profileData.stats.Review}
                        </div>
                        <div className={styles.statLabel}>
                            Шалгагдсан
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        Миний тухай
                    </h2>
                    <p className={styles.aboutText}>
                        {profileData.about}
                    </p>
                </div>

                {/* Contact Info */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        Холбогдох мэдээлэл
                    </h2>
                    
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