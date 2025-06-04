import { useState } from 'react';
import styles from '/styles/Login.module.css';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Show loading toast
    const toastId = toast.loading('Нэвтэрч байна...');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Амжилттай нэвтэрлээ!', { id: toastId });
        router.push('/home'); // redirect to homepage
      } else {
        toast.error(data.message || 'Нэвтрэхэд алдаа гарлаа', { id: toastId });
      }
    } catch (err) {
      toast.error('Сервертэй холбогдож чадсангүй!', { id: toastId });
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
          />
          <input
            type="password"
            placeholder="12345678"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className={styles.submitBtn}>Нэвтрэх</button>
        </form>

        <button className={styles.socialBtn} style={{ marginTop: '20px' }}>
          <img src="/google-icon.svg" alt="Google" />
          Sign in with Google
        </button>

        <button className={styles.socialBtn}>
          <img src="/facebook-icon.svg" alt="Facebook" />
          Sign in with Facebook
        </button>

        <button className={styles.socialBtn}>
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
