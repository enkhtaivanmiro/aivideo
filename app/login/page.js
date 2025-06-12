// app/login/page.js - Simplified login page
'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import styles from '../../styles/Login.module.css';

export default function LoginPage() {
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
      const { signIn } = await import('aws-amplify/auth');
      
      console.log('Attempting signIn with:', email);
      
      const { isSignedIn, nextStep } = await signIn({
        username: email,
        password: password,
      });
      
      console.log('SignIn result:', { isSignedIn, nextStep });
      
      if (isSignedIn) {
        toast.success('Амжилттай нэвтэрлээ!', { id: toastId });
        // Use window.location for a hard redirect to ensure auth state is properly updated
        window.location.href = '/home';
      } else if (nextStep) {
        console.log('Additional step required:', nextStep);
        toast.error('Additional authentication step required', { id: toastId });
      }
    } catch (err) {
      console.error('SignIn error:', err);
      let errorMessage = 'Нэвтрэхэд алдаа гарлаа';
      
      // Handle specific error cases
      if (err.name === 'UserNotConfirmedException') {
        errorMessage = 'Please confirm your email address';
      } else if (err.name === 'NotAuthorizedException') {
        errorMessage = 'Incorrect username or password';
      } else if (err.name === 'UserNotFoundException') {
        errorMessage = 'User not found';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    setIsSubmitting(true);
    const toastId = toast.loading('OAuth нэвтрэл эхэлж байна...');
    
    try {
      const { signInWithRedirect } = await import('aws-amplify/auth');
      console.log('Attempting OAuth login with:', provider);
      
      await signInWithRedirect({
        provider: provider.toLowerCase()
      });
      
      // Note: signInWithRedirect will redirect the page, so this might not execute
      toast.success('Амжилттай нэвтэрлээ!', { id: toastId });
    } catch (err) {
      console.error('OAuth login error:', err);
      toast.error('OAuth нэвтрэхэд алдаа гарлаа: ' + err.message, { id: toastId });
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

        <button
          className={styles.socialBtn}
          style={{ marginTop: '20px' }}
          onClick={() => handleOAuthLogin('Google')}
          disabled={isSubmitting}
        >
          <img src="/google-icon.svg" alt="Google" />
          Sign in with Google
        </button>

        <button
          className={styles.socialBtn}
          onClick={() => handleOAuthLogin('Facebook')}
          disabled={isSubmitting}
        >
          <img src="/facebook-icon.svg" alt="Facebook" />
          Sign in with Facebook
        </button>

        <button
          className={styles.socialBtn}
          onClick={() => handleOAuthLogin('SignInWithApple')}
          disabled={isSubmitting}
        >
          <img src="/apple-icon.svg" alt="Apple" />
          Sign in with Apple
        </button>

        <p className={styles.loginText}>
          Бүртгэлгүй юу? <a href="/signup">Бүртгүүлэх</a>
        </p>
      </div>
    </div>
  );
}