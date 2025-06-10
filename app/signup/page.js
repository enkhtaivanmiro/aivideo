'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../styles/SignUp.module.css';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (loading) return;

      setLoading(true);
      const toastId = toast.loading('Бүртгүүлж байна...');

      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Бүртгэхэд алдаа гарлаа');
        }

        toast.success(
          'Амжилттай бүртгэгдлээ! И-мэйлээ шалган баталгаажуулна уу.',
          { id: toastId }
        );
        router.push(`/verification?username=${encodeURIComponent(email)}`);
      } catch (err) {
        toast.error(err.message || 'Алдаа гарлаа', { id: toastId });
      } finally {
        setLoading(false);
      }
    },
    [email, password, router, loading]
  );

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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="12345678"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Түр хүлээнэ үү...' : 'Бүртгүүлэх'}
          </button>
        </form>

        <button className={styles.socialBtn} style={{ marginTop: '20px' }}>
          <img src="/google-icon.svg" alt="Google" />
          Sign up with Google
        </button>

        <button className={styles.socialBtn}>
          <img src="/facebook-icon.svg" alt="Facebook" />
          Sign up with Facebook
        </button>

        <button className={styles.socialBtn}>
          <img src="/apple-icon.svg" alt="Apple" />
          Sign up with Apple
        </button>

        <p className={styles.loginText}>
          Бүртгэлтэй юу? <Link href="/login">Нэвтрэх</Link>
        </p>
      </div>
    </div>
  );
}
