import Head from 'next/head';
import Image from 'next/image'; 
import styles from '../styles/Home.module.css';

const continueWatchingData = [
  {
    id: 1,
    title: 'Hunter x Hunter',
    image: '/images/hunter.webp', 
    progress: 80, 
    labels: [],
  },
  {
    id: 2,
    title: 'Too Hot To Handle',
    image: '/images/hunter.webp',
    progress: 60,
    labels: [],
  },
  {
    id: 3,
    title: 'My Hero Academia',
    image: '/images/hunter.webp',
    progress: 0,
    labels: ['New Episode', 'Watch Now'],
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
    labels: [],
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
        <h1 className={styles.sectionTitle}>Continue Watching for Miro</h1>

        <div className={styles.carousel}>
          {continueWatchingData.map((item) => (
            <div key={item.id} className={styles.card}>
              <div className={styles.labelContainer}>
                {item.labels.includes('New Episode') && (
                  <span className={styles.newEpisodeLabel}>New Episode</span>
                )}
                {item.labels.includes('Watch Now') && (
                  <span className={styles.watchNowLabel}>Watch Now</span>
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

        {/* You can add more sections here following a similar pattern */}
      </main>
    </div>
  );
}