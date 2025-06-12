'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import styles from '../../styles/verify.module.css';

function VerifyEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const u = searchParams.get('username');
    if (u) setUsername(u);
  }, [searchParams]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (isVerifying) return;
    
    setIsVerifying(true);
    const toastId = toast.loading('Баталгаажуулж байна...');

    try {
      const { confirmSignUp, signIn } = await import('aws-amplify/auth');
      
      console.log('Confirming signup for:', username);
      
      // First, confirm the signup
      const { isSignUpComplete } = await confirmSignUp({
        username: username,
        confirmationCode: code,
      });
      
      console.log('Signup confirmed:', isSignUpComplete);
      
      if (isSignUpComplete) {
        toast.success('Амжилттай баталгаажлаа!', { id: toastId });
        
        // Now automatically sign the user in
        // We'll need to get the password from somewhere or redirect to login
        // For security reasons, we should redirect to login instead of storing password
        toast.success('Баталгаажуулалт амжилттай! Одоо нэвтэрнэ үү.');
        router.push('/login?verified=true');
      } else {
        throw new Error('Signup confirmation failed');
      }
    } catch (err) {
      console.error('Verification error:', err);
      let errorMessage = 'Баталгаажуулахад алдаа гарлаа';
      
      // Handle specific error cases
      if (err.name === 'CodeMismatchException') {
        errorMessage = 'Баталгаажуулах код буруу байна';
      } else if (err.name === 'ExpiredCodeException') {
        errorMessage = 'Баталгаажуулах кодын хугацаа дууссан байна';
      } else if (err.name === 'NotAuthorizedException') {
        errorMessage = 'Баталгаажуулах эрх алга';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (isVerifying) return;
    
    setIsVerifying(true);
    const toastId = toast.loading('Код дахин илгээж байна...');
    
    try {
      const { resendSignUpCode } = await import('aws-amplify/auth');
      
      await resendSignUpCode({
        username: username,
      });
      
      toast.success('Шинэ код илгээгдлээ!', { id: toastId });
    } catch (err) {
      console.error('Resend code error:', err);
      toast.error(err.message || 'Код илгээхэд алдаа гарлаа', { id: toastId });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className={styles.back}>
      <div className={styles.container}>
        <h2 className={styles.heading}>И-мэйл баталгаажуулах</h2>
        <p style={{ marginBottom: '20px', color: '#666', textAlign: 'center' }}>
          {username} хаягт илгээсэн баталгаажуулах кодыг оруулна уу
        </p>
        
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
            disabled={isVerifying}
            required
            className={styles.input}
            maxLength={6}
          />
          <button 
            type="submit" 
            className={styles.button}
            disabled={isVerifying}
          >
            {isVerifying ? 'Баталгаажуулж байна...' : 'Баталгаажуулах'}
          </button>
        </form>
        
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={handleResendCode}
            disabled={isVerifying}
            style={{
              background: 'none',
              border: 'none',
              color: '#007bff',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Код дахин илгээх
          </button>
        </div>
        
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => router.push('/login')}
            style={{
              background: 'none',
              border: 'none',
              color: '#666',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Нэвтрэх хуудас руу буцах
          </button>
        </div>
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