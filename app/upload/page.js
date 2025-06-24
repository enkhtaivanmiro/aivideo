import { cookies as getCookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import fs from 'fs/promises'
import path from 'path'
import Image from 'next/image'
import Header from '../../components/header'
import Uploader from '../../components/Uploader'
import styles from '../../styles/Upload.module.css'
import Link from 'next/link'

export const metadata = {
  title: 'Upload page',
  description: 'User dashboard page',
}

export default async function HomePage() {
  // ✅ Await the cookies function
  const cookieStore = await getCookies()

  const rawToken =
    cookieStore.get('token')?.value ||
    cookieStore.get('CognitoIdentityServiceProvider.2e3iko2tmgo88146l0sqb0nenm.b714aab8-b081-7061-45c7-a4e7b090f343.idToken')?.value

  const decoded = rawToken ? jwt.decode(rawToken) : null
  const userId = decoded?.sub

  // ✅ Load all videos from JSON file
  let videoList = []
  try {
    const data = await fs.readFile(path.join(process.cwd(), 'data', 'videoList.json'), 'utf-8')
    videoList = JSON.parse(data)
  } catch (err) {
    console.error('Could not read video list:', err)
  }

  // ✅ Filter videos uploaded by the current user
  const userVideos = videoList.filter(video => video.userId === userId)

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <Uploader />

        <h1 className={styles.sectionTitle}>Таны контент</h1>
        <div className={styles.carousel}>
          <Link href="/upload">
            <div className={styles.upload}>
              <img src="/upload.svg" alt="Upload" />
            </div>
          </Link>
          {userVideos.map(item => (
            <div key={item.id} className={styles.card}>
              <div className={styles.labelContainer}>
                {item.labels === 'Approved' && (
                  <span className={styles.approvedLabel}>Зөвшөөрсөн</span>
                )}
                {item.labels === 'In Review' && (
                  <span className={styles.inReview}>Шалгагдаж буй</span>
                )}
                {item.labels === 'Rejected' && (
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
            .filter(item => item.labels === 'Approved')
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
              </div>
            ))}
        </div>
      </main>
    </div>
  )
}
