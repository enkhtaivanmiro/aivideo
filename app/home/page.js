import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Header from '../../components/header';
import Hero from '../../components/hero';
import styles from '../../styles/Home.module.css';
import Link from 'next/link';
import { verifyToken } from '../../lib/auth'; // centralized JWT verification

const videoList = [
  {
    id: 1,
    title: 'Video 1',
    image: '/images/cover.webp',
    labels: ['Approved'],
  },
  {
    id: 2,
    title: 'Video 2',
    image: '/images/cover.webp',
    labels: ['In Review'],
  },
  {
    id: 3,
    title: 'Video 3',
    image: '/images/cover.webp',
    labels: ['Rejected'],
  },
];

export const metadata = {
  title: 'Home',
  description: 'User dashboard page',
};

export default async function HomePage() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  let user;
  try {
    user = await verifyToken(token);
  } catch (err) {
    console.error('Token verification failed:', err);
    redirect('/login');
  }

  return (
    <div className={styles.container}>
      <Header user={user} />
      <Hero />
      <main>
        <h1 className={styles.sectionTitle}>Таны контент</h1>
        <div className={styles.carousel}>
          <Link href="/upload">
            <div className={styles.upload}>
              <img src="/upload.svg" alt="Arrow" />
            </div>
          </Link>
          {videoList
            .filter(item =>
              item.labels.some(label =>
                ['Approved', 'In Review', 'Rejected'].includes(label)
              )
            )
            .map(item => (
              <div key={item.id} className={styles.card}>
                <div className={styles.labelContainer}>
                  {item.labels.includes('Approved') && (
                    <span className={styles.approvedLabel}>Зөвшөөрсөн</span>
                  )}
                  {item.labels.includes('In Review') && (
                    <span className={styles.inReview}>Шалгагдаж буй</span>
                  )}
                  {item.labels.includes('Rejected') && (
                    <span className={styles.rejected}>Татгалзсан</span>
                  )}
                </div>
                <Image
                  src={item.image}
                  alt={item.title}
                  width={250}
                  height={140}
                  className={styles.cardImage}
                  priority
                />
              </div>
            ))}
        </div>

        <h1 className={styles.sectionTitle}>Admin Approved Contents</h1>
        <div className={styles.carousel}>
          {videoList
            .filter(item => item.labels.includes('Approved'))
            .map(item => (
              <div key={item.id} className={styles.card}>
                <div className={styles.labelContainer}>
                  <span className={styles.approvedLabel}>Зөвшөөрсөн</span>
                </div>
                <Image
                  src={item.image}
                  alt={item.title}
                  width={250}
                  height={140}
                  className={styles.cardImage}
                  priority
                />
                <div className={styles.progressBarContainer}>
                  <div
                    className={styles.progressBar}
                    style={{ width: `${item.progress || 0}%` }}
                  />
                </div>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}
