'use client'

import Header from '../../components/header';
import styles from '../../styles/Profile.module.css';

export default function ProfilePage() {
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
                        Б. Энхтайван
                    </h1>
                    
                    <p className={styles.title}>
                        Example Role
                    </p>
                    
                    <p className={styles.location}>
                        📍 Ulaanbaatar, Mongolia
                    </p>
                </div>

                {/* Stats Section */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={`${styles.statNumber} ${styles.blue}`}>
                            156
                        </div>
                        <div className={styles.statLabel}>
                            Оруулсан
                        </div>
                    </div>
                    
                    <div className={styles.statCard}>
                        <div className={`${styles.statNumber} ${styles.green}`}>
                            2.4k
                        </div>
                        <div className={styles.statLabel}>
                            Зөвшөөрсөн
                        </div>
                    </div>
                    
                    <div className={styles.statCard}>
                        <div className={`${styles.statNumber} ${styles.orange}`}>
                            89
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
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sed erat lorem. Phasellus tincidunt, nisl eu sodales condimentum, mauris sapien tempus elit, non venenatis sapien augue at purus. 
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
                            <span className={styles.contactText}>example@example.com</span>
                        </div>
                        
                        <div className={styles.contactItem}>
                            <span className={styles.contactIcon}>📱</span>
                            <span className={styles.contactText}>+976 80166962</span>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}