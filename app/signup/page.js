'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../styles/SignUp.module.css';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  CognitoUserPool,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'ap-northeast-1_WYgTTo7jA',
  ClientId: '2e3iko2tmgo88146l0sqb0nenm',
};

const userPool = new CognitoUserPool(poolData);

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setLoading(true);
      const toastId = toast.loading('Бүртгүүлж байна...');

      // Use email as username
      const username = email;

      // Add email as a user attribute
      const attributeList = [
        new CognitoUserAttribute({
          Name: 'email',
          Value: email,
        }),
      ];

      userPool.signUp(username, password, attributeList, null, (err, result) => {
        setLoading(false);
        if (err) {
          console.error(err);
          toast.error(err.message || 'Бүртгэхэд алдаа гарлаа', { id: toastId });
          return;
        }

        toast.success('Амжилттай бүртгэгдлээ! И-мэйлээ шалган баталгаажуулна уу.', { id: toastId });

        // Navigate to email verification page with username in query
        router.push(`/verification?username=${encodeURIComponent(username)}`);
      });
    },
    [email, password, router]
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
