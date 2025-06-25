'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/header';
import styles from '../../styles/Settings.module.css';
import toast from 'react-hot-toast';

export default function SettingsPage() {
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

  const placeholders = {
    name: 'Жишээ: Б. Энхтайван',
    title: 'Жишээ: Програм хангамжийн инженер',
    location: 'Жишээ: Ulaanbaatar, Mongolia',
    about: 'Та өөрийнхөө тухай товч мэдээлэл оруулна уу...',
    stats: {
      Uploaded: 'Жишээ: 156',
      Accepted: 'Жишээ: 2.4k',
      Review: 'Жишээ: 89',
    },
    contact: {
      email: 'Жишээ: example@example.com',
      phone: 'Жишээ: +976 80166962',
    },
  };

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchUserAttributes = async () => {
      try {
        const { getCurrentUser, fetchUserAttributes } = await import('aws-amplify/auth');
        console.log('SettingsPage: Fetching user attributes');
        
        const user = await getCurrentUser();
        console.log('SettingsPage: User found:', user.username);
        
        const attributes = await fetchUserAttributes();
        console.log('SettingsPage: Attributes:', attributes);
        
        const attrMap = Object.keys(attributes).reduce((acc, key) => {
          const cleanKey = key.replace('custom:', '');
          acc[cleanKey] = attributes[key];
          return acc;
        }, {});

        setProfileData((prev) => ({
          ...prev,
          name: attrMap.name || '',
          title: attrMap.title || '',
          location: attrMap.location || '',
          about: attrMap.about || '',
          stats: {
            Uploaded: attrMap.uploaded || '',
            Accepted: attrMap.accepted || '',
            Review: attrMap.review || '',
          },
          contact: {
            email: attrMap.email || attributes.email || '',
            phone: attrMap.phone || '',
          },
        }));
        console.log('SettingsPage: User attributes loaded:', attrMap);
      } catch (error) {
        console.error('SettingsPage: Failed to load user attributes:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchUserAttributes();
  }, []);

  const handleInputChange = (section, field, value) => {
    if (section === 'stats' || section === 'contact') {
      setProfileData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setProfileData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSave = async () => {
    if (loading) return;
    
    setLoading(true);
    const toastId = toast.loading('Saving profile...');

    try {
      const { updateUserAttributes } = await import('aws-amplify/auth');
      
      const attributes = {
        'custom:name': profileData.name,
        'custom:title': profileData.title,
        'custom:location': profileData.location,
        'custom:about': profileData.about,
        'custom:email': profileData.contact.email,
        'custom:phone': profileData.contact.phone,
        'custom:uploaded': profileData.stats.Uploaded,
        'custom:accepted': profileData.stats.Accepted,
        'custom:review': profileData.stats.Review,
      };

      console.log('SettingsPage: Updating attributes:', attributes);

      await updateUserAttributes({
        userAttributes: attributes
      });

      toast.success('✅ Profile settings saved successfully!', { id: toastId });
    } catch (error) {
      console.error('SettingsPage: Failed to update attributes:', error);
      
      let errorMessage = 'Failed to update profile';
      if (error.name === 'NotAuthorizedException') {
        errorMessage = 'Not authorized. Please log in again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error('❌ ' + errorMessage, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setProfileData({
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
    toast.success('Profile reset to empty fields');
  };

  if (initialLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: 'white'
      }}>
        Loading profile data...
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.wrapper}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>⚙️ Профайл тохиргоо</h1>
          <p className={styles.pageSubtitle}>Хэрэглэгчийн мэдээлэл шинэчлэх хэсэг</p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>👤 Хувийн мэдээлэл</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Бүтэн нэр</label>
              <input
                type="text"
                value={profileData.name}
                placeholder={placeholders.name}
                onChange={(e) => handleInputChange(null, 'name', e.target.value)}
                className={styles.input}
                disabled={loading}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Ажил мэргэжил</label>
              <input
                type="text"
                value={profileData.title}
                placeholder={placeholders.title}
                onChange={(e) => handleInputChange(null, 'title', e.target.value)}
                className={styles.input}
                disabled={loading}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Хаяг</label>
              <input
                type="text"
                value={profileData.location}
                placeholder={placeholders.location}
                onChange={(e) => handleInputChange(null, 'location', e.target.value)}
                className={styles.input}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>📊 Статистик</h2>
          <div className={styles.statsGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Оруулсан тоо</label>
              <input
                type="text"
                value={profileData.stats.Uploaded}
                placeholder={placeholders.stats.Uploaded}
                onChange={(e) => handleInputChange('stats', 'Uploaded', e.target.value)}
                className={styles.input}
                disabled={loading}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Зөвшөөрсөн тоо</label>
              <input
                type="text"
                value={profileData.stats.Accepted}
                placeholder={placeholders.stats.Accepted}
                onChange={(e) => handleInputChange('stats', 'Accepted', e.target.value)}
                className={styles.input}
                disabled={loading}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Шалгуулсан тоо</label>
              <input
                type="text"
                value={profileData.stats.Review}
                placeholder={placeholders.stats.Review}
                onChange={(e) => handleInputChange('stats', 'Review', e.target.value)}
                className={styles.input}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>📝 Миний тухай</h2>
          <div className={styles.formGroup}>
            <label className={styles.label}>Тайлбар</label>
            <textarea
              value={profileData.about}
              placeholder={placeholders.about}
              onChange={(e) => handleInputChange(null, 'about', e.target.value)}
              rows={5}
              className={styles.textarea}
              disabled={loading}
            />
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>📞 Холбогдох мэдээлэл</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>📧 Цахим хаяг</label>
              <input
                type="email"
                value={profileData.contact.email}
                placeholder={placeholders.contact.email}
                onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                className={styles.input}
                disabled={loading}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>📱 Утасны дугаар</label>
              <input
                type="tel"
                value={profileData.contact.phone}
                placeholder={placeholders.contact.phone}
                onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
                className={styles.input}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div className={styles.actionSection}>
          <div className={styles.buttonGroup}>
            <button
              onClick={handleSave}
              className={`${styles.button} ${styles.saveButton}`}
              disabled={loading}
            >
              {loading ? '💾 Saving...' : '💾 Хадгалах'}
            </button>
            <button
              onClick={handleReset}
              className={`${styles.button} ${styles.resetButton}`}
              disabled={loading}
            >
              🔄 Сэргээх
            </button>
          </div>
          <p className={styles.actionNote}>
            Хадгалсан тохиолдолд хэрэглэгчийн өмнөх мэдээлэл устахыг анхаарна уу.
          </p>
        </div>
      </div>
    </div>
  );
}