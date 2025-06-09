'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';
import toast from 'react-hot-toast';

import styles from '../../styles/verify.module.css';

const poolData = {
  UserPoolId: 'ap-northeast-1_WYgTTo7jA',
  ClientId: '2e3iko2tmgo88146l0sqb0nenm',
};

const userPool = new CognitoUserPool(poolData);

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    const u = searchParams.get('username');
    if (u) setUsername(u);
  }, [searchParams]);

  const handleVerify = (e) => {
    e.preventDefault();
    const toastId = toast.loading('Баталгаажуулж байна...');

    const userData = { Username: username, Pool: userPool };
    const cognitoUser = new CognitoUser(userData);

    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        console.error(err);
        toast.error(err.message || 'Баталгаажуулахад алдаа гарлаа', { id: toastId });
        return;
      }
      toast.success('Амжилттай баталгаажлаа!', { id: toastId });
      router.push('/home');
    });
  };

  return (
    <div className={styles.back}>
      <div className={styles.container}>
        <h2 className={styles.heading}>И-мэйл баталгаажуулах</h2>
        <form onSubmit={handleVerify} className={styles.form}>
          <label className={`${styles.label} ${styles.hidden}`}>Username</label>
          <input
            type="text"
            value={username}
            disabled
            className={`${styles.input} ${styles.hidden}`}
          />
          <label className={styles.label}>Баталгаажуулах код</label>
          <input
            type="text"
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Баталгаажуулах
          </button>
        </form>
      </div>
    </div>
  );
}
