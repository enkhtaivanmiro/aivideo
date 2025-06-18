'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import styles from '../../styles/Login.module.css';
import { fetchAuthSession, signIn, signInWithRedirect } from 'aws-amplify/auth';
import Cookies from 'js-cookie';

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
      console.log('Attempting signIn with:', email);
      const { isSignedIn, nextStep } = await signIn({
        username: email,
        password: password,
      });

      console.log('SignIn result:', { isSignedIn, nextStep });

      if (isSignedIn) {
        toast.success('Амжилттай нэвтэрлээ!', { id: toastId });
        const idToken = localStorage.getItem('CognitoIdentityServiceProvider.2e3iko2tmgo88146l0sqb0nenm.b714aab8-b081-7061-45c7-a4e7b090f343.idToken');
        const accessToken = localStorage.getItem('CognitoIdentityServiceProvider.2e3iko2tmgo88146l0sqb0nenm.b714aab8-b081-7061-45c7-a4e7b090f343.idToken');
        const refreshToken = localStorage.getItem('CognitoIdentityServiceProvider.2e3iko2tmgo88146l0sqb0nenm.b714aab8-b081-7061-45c7-a4e7b090f343.idToken');
        
        if (idToken) Cookies.set('idToken', idToken, { expires: 7, path: '/' });
        if (accessToken) Cookies.set('accessToken', accessToken, { expires: 7, path: '/' });
        if (refreshToken) Cookies.set('refreshToken', refreshToken, { expires: 7, path: '/' });
        router.push('/home');
      } else if (nextStep) {
        console.log('Additional step required:', nextStep);
        toast.error(`Additional authentication step required: ${nextStep.signInStep}`, { id: toastId });
      }
    } catch (err) {
      console.error('SignIn error:', err);

      let errorMessage = 'Нэвтрэхэд алдаа гарлаа';

      if (err.name === 'UserNotConfirmedException') {
        errorMessage = 'Та эхлээд и-мэйл хаягаа баталгаажуулна уу.';
      } else if (err.name === 'NotAuthorizedException') {
        errorMessage = 'Нэвтрэх нэр эсвэл нууц үг буруу байна.';
      } else if (err.name === 'UserNotFoundException') {
        errorMessage = 'Хэрэглэгч олдсонгүй.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const toastId = toast.loading('OAuth нэвтрэл эхэлж байна...');

    try {
      console.log('Attempting OAuth login with:', provider);
      
      const providerMap = {
        'Google': 'Google',
        'Facebook': 'Facebook',
        'SignInWithApple': 'Apple'
      };

      await signInWithRedirect({ 
        provider: { custom: providerMap[provider] || provider }
      });
      
      toast.dismiss(toastId);
    } catch (err) {
      console.error('OAuth login error:', err);
      toast.error('OAuth нэвтрэхэд алдаа гарлаа: ' + (err.message || err), { id: toastId });
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <img src="/logo.svg" alt="Logo" className={styles.logo} />
        <h1 style={{ marginBottom: '10px' }}>Хиймэл контент</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="email">Цахим хаяг</label>
          <input
            id="email"
            type="email"
            placeholder="name@domain.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
          />

          <label htmlFor="password">Нууц үг</label>
          <input
            id="password"
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
          type="button"
        >
          <img src="/google-icon.svg" alt="Google" />
          Sign in with Google
        </button>

        <button
          className={styles.socialBtn}
          onClick={() => handleOAuthLogin('Facebook')}
          disabled={isSubmitting}
          type="button"
        >
          <img src="/facebook-icon.svg" alt="Facebook" />
          Sign in with Facebook
        </button>

        <button
          className={styles.socialBtn}
          onClick={() => handleOAuthLogin('SignInWithApple')}
          disabled={isSubmitting}
          type="button"
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