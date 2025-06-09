'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CognitoIdentityProviderClient, ConfirmSignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import toast from 'react-hot-toast';

import styles from '../../styles/verify.module.css';

const client = new CognitoIdentityProviderClient({
  region: 'ap-northeast-1',
});

const USER_POOL_CLIENT_ID = '2e3iko2tmgo88146l0sqb0nenm';

function VerifyEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    const u = searchParams.get('username');
    if (u) setUsername(u);
  }, [searchParams]);

  const handleVerify = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Баталгаажуулж байна...');

    try {
      const command = new ConfirmSignUpCommand({
        ClientId: USER_POOL_CLIENT_ID,
        Username: username,
        ConfirmationCode: code,
      });
      await client.send(command);
      toast.success('Амжилттай баталгаажлаа!', { id: toastId });
      router.push('/home');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Баталгаажуулахад алдаа гарлаа', { id: toastId });
    }
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

export default function VerificationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmail />
    </Suspense>
  );
}
