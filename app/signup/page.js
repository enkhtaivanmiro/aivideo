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
        const { signUp } = await import('aws-amplify/auth');
        
        console.log('Attempting signUp with:', email);
        
        const { isSignUpComplete, userId, nextStep } = await signUp({
          username: email,
          password: password,
          options: {
            userAttributes: {
              email: email,
            },
          },
        });
        
        console.log('SignUp result:', { isSignUpComplete, userId, nextStep });
        
        if (nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
          toast.success(
            'Амжилттай бүртгэгдлээ! И-мэйлээ шалган баталгаажуулна уу.',
            { id: toastId }
          );
          router.push(`/verification?username=${encodeURIComponent(email)}`);
        } else if (isSignUpComplete) {
          toast.success('Амжилттай бүртгэгдлээ!', { id: toastId });
          router.push('/login');
        } else {
          console.log('Unexpected signup result:', { isSignUpComplete, nextStep });
          toast.error('Бүртгэхэд алдаа гарлаа', { id: toastId });
        }
      } catch (err) {
        console.error('SignUp error:', err);
        let errorMessage = 'Бүртгэхэд алдаа гарлаа';
        
        // Handle specific error cases
        if (err.name === 'UsernameExistsException') {
          errorMessage = 'Энэ и-мэйл хаяг аль хэдийн бүртгэгдсэн байна';
        } else if (err.name === 'InvalidPasswordException') {
          errorMessage = 'Нууц үг хангалттай хүчтэй биш байна';
        } else if (err.name === 'InvalidParameterException') {
          errorMessage = 'И-мэйл хаяг буруу форматтай байна';
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        toast.error(errorMessage, { id: toastId });
      } finally {
        setLoading(false);
      }
    },
    [email, password, router, loading]
  );

  const handleOAuthSignUp = async (provider) => {
    setLoading(true);
    const toastId = toast.loading('OAuth бүртгэл эхэлж байна...');
    
    try {
      const { signInWithRedirect } = await import('aws-amplify/auth');
      console.log('Attempting OAuth signup with:', provider);
      
      await signInWithRedirect({
        provider: provider.toLowerCase()
      });
      
      // Note: signInWithRedirect will redirect the page, so this might not execute
      toast.success('Амжилттай бүртгэгдлээ!', { id: toastId });
    } catch (err) {
      console.error('OAuth signup error:', err);
      toast.error('OAuth бүртгэхэд алдаа гарлаа: ' + err.message, { id: toastId });
      setLoading(false);
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
          <input
            type="password"
            placeholder="12345678"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <button 
            type="submit" 
            disabled={loading} 
            className={styles.submitBtn}
          >
            {loading ? 'Түр хүлээнэ үү...' : 'Бүртгүүлэх'}
          </button>
        </form>

        <button 
          className={styles.socialBtn} 
          style={{ marginTop: '20px' }}
          onClick={() => handleOAuthSignUp('Google')}
          disabled={loading}
        >
          <img src="/google-icon.svg" alt="Google" />
          Sign up with Google
        </button>

        <button 
          className={styles.socialBtn}
          onClick={() => handleOAuthSignUp('Facebook')}
          disabled={loading}
        >
          <img src="/facebook-icon.svg" alt="Facebook" />
          Sign up with Facebook
        </button>

        <button 
          className={styles.socialBtn}
          onClick={() => handleOAuthSignUp('SignInWithApple')}
          disabled={loading}
        >
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