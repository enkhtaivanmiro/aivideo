// components/Preloader.js
import styles from '../styles/Preloader.module.css';

export default function Preloader() {
  return (
    <div className={styles.preloader}>
      <div className={styles.spinner}></div>
    </div>
  );
}
