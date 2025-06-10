'use client'

import { useState } from 'react';
import Header from '../../components/header';
import styles from '../../styles/Settings.module.css';

export default function SettingsPage() {
    const [profileData, setProfileData] = useState({
        name: 'John Doe',
        title: 'Full Stack Developer',
        location: 'San Francisco, CA',
        about: 'Passionate full-stack developer with 5+ years of experience building scalable web applications. I love working with modern technologies like React, Node.js, and cloud platforms. When I\'m not coding, you can find me exploring new coffee shops or hiking in the mountains.',
        stats: {
            projects: '156',
            followers: '2.4k',
            reviews: '89'
        },
        contact: {
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567',
            github: 'github.com/johndoe',
            linkedin: 'linkedin.com/in/johndoe'
        }
    });

    const handleInputChange = (section, field, value) => {
        if (section === 'stats' || section === 'contact') {
            setProfileData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
        } else {
            setProfileData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleSave = () => {
        // Here you would typically save to a database or API
        alert('Profile settings saved successfully!');
        console.log('Saved profile data:', profileData);
    };

    const handleReset = () => {
        setProfileData({
            name: 'John Doe',
            title: 'Full Stack Developer',
            location: 'San Francisco, CA',
            about: 'Passionate full-stack developer with 5+ years of experience building scalable web applications. I love working with modern technologies like React, Node.js, and cloud platforms. When I\'m not coding, you can find me exploring new coffee shops or hiking in the mountains.',
            stats: {
                projects: '156',
                followers: '2.4k',
                reviews: '89'
            },
            contact: {
                email: 'john.doe@example.com',
                phone: '+1 (555) 123-4567',
                github: 'github.com/johndoe',
                linkedin: 'linkedin.com/in/johndoe'
            }
        });
    };

    return (
        <div className={styles.container}>
            <Header />
            
            <div className={styles.wrapper}>
                {/* Page Header */}
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>
                        ⚙️ Profile Settings
                    </h1>
                    <p className={styles.pageSubtitle}>
                        Update your profile information and preferences
                    </p>
                </div>

                {/* Personal Information */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        👤 Personal Information
                    </h2>
                    
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={profileData.name}
                                onChange={(e) => handleInputChange(null, 'name', e.target.value)}
                                className={styles.input}
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Job Title
                            </label>
                            <input
                                type="text"
                                value={profileData.title}
                                onChange={(e) => handleInputChange(null, 'title', e.target.value)}
                                className={styles.input}
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Location
                            </label>
                            <input
                                type="text"
                                value={profileData.location}
                                onChange={(e) => handleInputChange(null, 'location', e.target.value)}
                                className={styles.input}
                            />
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        📊 Profile Stats
                    </h2>
                    
                    <div className={styles.statsGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Projects Count
                            </label>
                            <input
                                type="text"
                                value={profileData.stats.projects}
                                onChange={(e) => handleInputChange('stats', 'projects', e.target.value)}
                                className={styles.input}
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Followers Count
                            </label>
                            <input
                                type="text"
                                value={profileData.stats.followers}
                                onChange={(e) => handleInputChange('stats', 'followers', e.target.value)}
                                className={styles.input}
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Reviews Count
                            </label>
                            <input
                                type="text"
                                value={profileData.stats.reviews}
                                onChange={(e) => handleInputChange('stats', 'reviews', e.target.value)}
                                className={styles.input}
                            />
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        📝 About Me
                    </h2>
                    
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Bio Description
                        </label>
                        <textarea
                            value={profileData.about}
                            onChange={(e) => handleInputChange(null, 'about', e.target.value)}
                            rows={5}
                            className={styles.textarea}
                        />
                    </div>
                </div>

                {/* Contact Information */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        📞 Contact Information
                    </h2>
                    
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                📧 Email Address
                            </label>
                            <input
                                type="email"
                                value={profileData.contact.email}
                                onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                                className={styles.input}
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                📱 Phone Number
                            </label>
                            <input
                                type="tel"
                                value={profileData.contact.phone}
                                onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
                                className={styles.input}
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                🐙 GitHub Profile
                            </label>
                            <input
                                type="text"
                                value={profileData.contact.github}
                                onChange={(e) => handleInputChange('contact', 'github', e.target.value)}
                                className={styles.input}
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                💼 LinkedIn Profile
                            </label>
                            <input
                                type="text"
                                value={profileData.contact.linkedin}
                                onChange={(e) => handleInputChange('contact', 'linkedin', e.target.value)}
                                className={styles.input}
                            />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className={styles.actionSection}>
                    <div className={styles.buttonGroup}>
                        <button
                            onClick={handleSave}
                            className={`${styles.button} ${styles.saveButton}`}
                        >
                            💾 Save Changes
                        </button>
                        
                        <button
                            onClick={handleReset}
                            className={`${styles.button} ${styles.resetButton}`}
                        >
                            🔄 Reset
                        </button>
                    </div>
                    
                    <p className={styles.actionNote}>
                        Changes will be applied to your profile immediately after saving.
                    </p>
                </div>
            </div>
        </div>
    );
}