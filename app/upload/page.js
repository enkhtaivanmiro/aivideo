import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Header from '../../components/header'
import Uploader from '../../components/Uploader'
import styles from '../../styles/Upload.module.css'
import Link from 'next/link';

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
]

export const metadata = {
  title: 'Upload page',
  description: 'User dashboard page',
}

export default function HomePage() {
  // Get cookies on server side
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    // No token — redirect to login
    redirect('/login')
  }

  let user
  try {
    user = jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    redirect('/login')
  }

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <Uploader />
        <>
        <h1 className={styles.sectionTitle}>Таны контент</h1>
        <div className={styles.carousel}>
          <Link href="/upload"><div className={styles.upload}><img src="/upload.svg" alt="Arrow" /></div></Link>
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
        </>

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
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
        </div>
      </main>
    </div>
  )
}
