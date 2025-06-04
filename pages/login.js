import styles from '/styles/Login.module.css';
import Link from 'next/link';

export default function Login() {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <img src="/logo.svg" alt="Logo" className={styles.logo} />
        <h1 style={{marginBottom: '10px'}}>Хиймэл контент</h1>

        <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
          <label>Цахим хаяг</label>
          <input type="email" placeholder="name@domain.com" required />
          <input type="password" placeholder="12345678" required />
          <button className={styles.submitBtn}>Нэвтрэх</button>
        </form>

        <button className={styles.socialBtn} style={{marginTop: '20px'}}>
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
