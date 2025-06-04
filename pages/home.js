import Head from 'next/head';
import Image from 'next/image'; 
import styles from '../styles/Home.module.css';

const continueWatchingData = [
  {
    id: 1,
    title: 'Hunter x Hunter',
    image: '/images/hunter.webp', 
    progress: 80, 
    labels: ['Approved'],
  },
  {
    id: 2,
    title: 'Too Hot To Handle',
    image: '/images/hunter.webp',
    progress: 60,
    labels: ['In Review'],
  },
  {
    id: 3,
    title: 'My Hero Academia',
    image: '/images/hunter.webp',
    progress: 0,
    labels: ['Rejected'],
  },
  {
    id: 4,
    title: 'How to Sell Drugs Online (Fast)',
    image: '/images/hunter.webp',
    progress: 45,
    labels: [],
  },
  {
    id: 5,
    title: 'When Life Gives You Tangerines',
    image: '/images/hunter.webp',
    progress: 70,
    labels: [],
  },
  {
    id: 6,
    title: 'Brilliant Healers',
    image: '/images/hunter.webp',
    progress: 0,
    labels: ['New Episode', 'Watch Now'],
  },
  {
    id: 7,
    title: 'Another Show', 
    image: '/images/hunter.webp',
    progress: 30,
    labels: ['Approved'],
  },
];

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Home</title>
        <meta name="description" content="A basic Netflix-like homepage" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.sectionTitle}>Таны контент</h1>
        <div className={styles.carousel}>
        {continueWatchingData
            .filter(item =>
            item.labels.some(label =>
                ['Approved', 'In Review', 'Rejected'].includes(label)
            )
            )
            .map((item) => (
            <div key={item.id} className={styles.card}>
                <div className={styles.labelContainer}>
                {/* Optional: dynamically show the actual label */}
                {item.labels.includes('Approved') && (
                    <span className={styles.approvedLabel}>Approved</span>
                )}
                {item.labels.includes('In Review') && (
                    <span className={styles.inReview}>In Review</span>
                )}
                {item.labels.includes('Rejected') && (
                    <span className={styles.rejected}>Rejected</span>
                )}
                </div>

                <Image
                src={item.image}
                alt={item.title}
                width={250}
                height={140}
                className={styles.cardImage}
                priority={true}
                />

                <div className={styles.progressBarContainer}>
                <div
                    className={styles.progressBar}
                    style={{ width: `${item.progress}%` }}
                ></div>
                </div>
            </div>
            ))}
        </div>

        <h1 className={styles.sectionTitle}>Admin Approved Contents</h1>
        <div className={styles.carousel}>
        {continueWatchingData
            .filter(item => item.labels.includes('Approved'))
            .map((item) => (
            <div key={item.id} className={styles.card}>
                <div className={styles.labelContainer}>
                <span className={styles.approvedLabel}>Approved</span>
                </div>
                <Image
                src={item.image}
                alt={item.title}
                width={250} 
                height={140} 
                className={styles.cardImage}
                priority={true} 
                />
                <div className={styles.progressBarContainer}>
                <div
                    className={styles.progressBar}
                    style={{ width: `${item.progress}%` }}
                ></div>
                </div>
            </div>
            ))}
        </div>
      </main>
    </div>
  );
}