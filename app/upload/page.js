import { cookies as getCookies } from "next/headers";
import jwt from "jsonwebtoken";
import styles from "../../styles/Upload.module.css";
import Header from "../../components/header";
import Uploader from "../../components/Uploader";
import Link from "next/link";
import Image from "next/image";

const BUCKET = process.env.NEXT_PUBLIC_AWS_S3_BUCKET;
const REGION = process.env.NEXT_PUBLIC_AWS_REGION;

export const metadata = {
  title: "Upload page",
  description: "User dashboard page",
};

export default async function HomePage() {
  const cookieStore = await getCookies();

  const rawToken =
    cookieStore.get("token")?.value ||
    cookieStore.get(
      "CognitoIdentityServiceProvider.2e3iko2tmgo88146l0sqb0nenm.b714aab8-b081-7061-45c7-a4e7b090f343.idToken"
    )?.value;

  const decoded = rawToken ? jwt.decode(rawToken) : null;
  const userId = decoded?.sub;

  // Fetch your videos from your DB or API - for demo I’m using a placeholder empty array
  let videoList = [];
  try {
    // Replace this with your real DB call to get all videos
    // For example, fetch('/api/videos/user') or from your DB directly
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/videos/user?userId=${userId}`);
    if (response.ok) {
      videoList = await response.json();
    }
  } catch (err) {
    console.error("Failed to fetch videos:", err);
  }

  // Filter user videos
  const userVideos = videoList.filter((video) => video.userId === userId);

  const getStatusClass = (status) => {
    switch (status) {
      case "Accepted":
        return styles.approvedLabel;
      case "In Review":
        return styles.inReview;
      case "Rejected":
        return styles.rejected;
      default:
        return styles.statusLabel;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "Accepted":
        return "Зөвшөөрсөн";
      case "In Review":
        return "Шалгагдаж буй";
      case "Rejected":
        return "Татгалзсан";
      default:
        return status;
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.uploadSection}>
          <div className={styles.uploadCard}>
            <div className={styles.uploadHeader}>
              <h2 className={styles.uploadTitle}>
                <img src="/upload-icon.svg" alt="Upload" width="24" height="24" />
                Контент оруулах
              </h2>
              <p className={styles.uploadSubtitle}>
                Сонирхолтой хиймэл оюун ухаанаар бүтээсэн контентоо хуваалцаарай
              </p>
            </div>
            <div className={styles.uploadContent}>
              <Uploader />
            </div>
          </div>
        </div>

        {/* User Content Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIndicator}></div>
            <h1 className={styles.sectionTitle}>Таны контент</h1>
            <div className={styles.sectionDivider}></div>
          </div>

          <div className={styles.carousel}>
            {/* Upload Card */}
            <Link href="/upload" className={styles.upload}>
              <div className={styles.uploadIcon}>
                <img src="/upload.svg" alt="Upload" width="24" height="24" />
              </div>
              <span className={styles.uploadText}>Контент оруулах</span>
            </Link>

            {/* User Videos */}
            {userVideos.map((item) => (
              <div key={item.videoKey} className={styles.card}>
                <div className={styles.cardImageContainer}>
                  <Image
                    src={item.url || `/placeholder.svg`}
                    alt={item.title}
                    width={250}
                    height={140}
                    className={styles.cardImage}
                    priority
                  />
                  <div className={styles.labelContainer}>
                    <div className={`${styles.statusLabel} ${getStatusClass(item.labels)}`}>
                      {getStatusLabel(item.labels)}
                    </div>
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                </div>
              </div>
            ))}
          </div>

          {userVideos.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <img src="/upload.svg" alt="Upload" width="32" height="32" />
              </div>
              <h3 className={styles.emptyTitle}>Контент оруулаагүй байна</h3>
              <p className={styles.emptyDescription}>Одоогоор контент оруулаагүй байна </p>
            </div>
          )}
        </section>

        {/* Admin Approved Content Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIndicator}></div>
            <h1 className={styles.sectionTitle}>Зөвшөөрөгдсөн контентууд</h1>
            <div className={styles.sectionDivider}></div>
          </div>

          <div className={styles.carousel}>
            {videoList
              .filter((item) => item.labels === "Accepted")
              .map((item) => (
                <div key={item.videoKey} className={styles.card}>
                  <div className={styles.cardImageContainer}>
                    <Image
                      src={item.url || `/placeholder.svg`}
                      alt={item.title}
                      width={250}
                      height={140}
                      className={styles.cardImage}
                      priority
                    />
                    <div className={styles.labelContainer}>
                      <div className={`${styles.statusLabel} ${styles.approvedLabel}`}>
                        Зөвшөөрсөн
                      </div>
                    </div>
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                  </div>
                </div>
              ))}
          </div>

          {videoList.filter((item) => item.labels === "Accepted").length === 0 && (
            <div className={styles.emptyState}>
              <div className={`${styles.emptyIcon} ${styles.approvedEmptyIcon}`}>
                <img src="/check-circle.svg" alt="Approved" width="32" height="32" />
              </div>
              <h3 className={styles.emptyTitle}>Зөвшөөрөгдсөн контент одоогоор байхгүй байна</h3>
              <p className={styles.emptyDescription}>Энд таны зөвшөөрөгдсөн контентууд харагдана</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
