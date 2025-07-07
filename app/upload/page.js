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

  let videoList = [];
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/videos/user?userId=${userId}`);
    if (response.ok) {
      videoList = await response.json();
    }
  } catch (err) {
    console.error("Failed to fetch videos:", err);
  }

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

      </main>
    </div>
  );
}
