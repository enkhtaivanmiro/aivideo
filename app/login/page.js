'use client';

import { useState } from 'react';
import styles from '@/styles/Login.module.css';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    const toastId = toast.loading('Нэвтэрч байна...');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Нэвтрэхэд алдаа гарлаа');
      }

      // Store token in sessionStorage for immediate client-side access
      if (data.token) {
        sessionStorage.setItem('authToken', data.token);
      }

      toast.success('Амжилттай нэвтэрлээ!', { id: toastId });
      
      // Force full page reload to ensure middleware picks up the cookie
      window.location.href = '/home';
    } catch (err) {
      toast.error(err.message, { id: toastId });
      setPassword('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <img src="/logo.svg" alt="Logo" className={styles.logo} />
        <h1 style={{ marginBottom: '10px' }}>Хиймэл контент</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label>Цахим хаяг</label>
          <input
            type="email"
            placeholder="name@domain.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
          />
          <input
            type="password"
            placeholder="12345678"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
          />
          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
          </button>
        </form>

        <button className={styles.socialBtn} style={{ marginTop: '20px' }} disabled={isSubmitting}>
          <img src="/google-icon.svg" alt="Google" />
          Sign in with Google
        </button>

        <button className={styles.socialBtn} disabled={isSubmitting}>
          <img src="/facebook-icon.svg" alt="Facebook" />
          Sign in with Facebook
        </button>

        <button className={styles.socialBtn} disabled={isSubmitting}>
          <img src="/apple-icon.svg" alt="Apple" />
          Sign in with Apple
        </button>

        <p className={styles.loginText}>
          Бүртгэлгүй юу? <Link href="/signup">Бүртгүүлэх</Link>
        </p>
      </div>
    </div>
  );
}