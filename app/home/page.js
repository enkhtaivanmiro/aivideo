"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Play, MoreHorizontal } from "lucide-react";
import styles from "../../styles/Home.module.css";
import Header from "../../components/header";
import HeroHome from "../../components/HeroHome";

export default function HomePage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const dvdRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const dvd = dvdRef.current;
    if (!dvd) return;

    let x = Math.random() * (window.innerWidth - 100);
    let y = Math.random() * (window.innerHeight - 50);
    let dx = 2;
    let dy = 2;
    const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"];
    let colorIndex = 0;

    const animate = () => {
      x += dx;
      y += dy;

      if (x <= 0 || x >= window.innerWidth - 100) {
        dx = -dx;
        colorIndex = (colorIndex + 1) % colors.length;
        dvd.style.color = colors[colorIndex];
      }
      if (y <= 0 || y >= window.innerHeight - 50) {
        dy = -dy;
        colorIndex = (colorIndex + 1) % colors.length;
        dvd.style.color = colors[colorIndex];
      }

      dvd.style.left = `${x}px`;
      dvd.style.top = `${y}px`;

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/videos");
        if (!res.ok) throw new Error("Failed to fetch videos");
        const data = await res.json();
        setVideos(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.scanLines}></div>
        <div className={styles.loadingContent}>
          <div className={styles.loadingSpinner}>📀</div>
          <div className={styles.loadingText}>LOADING...</div>
          <div className={styles.loadingBar}>████████████████████ 100%</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header />
      <HeroHome />
      <main className={styles.mainContent}>
        <div className={styles.titleScreen}>
          <div ref={dvdRef} className={styles.titleText}>
            ▶ AI VIDEO COLLECTION ◀
          </div>
          <div className={styles.subtitle}>SELECT TITLE TO PLAY</div>
          <div className={styles.statusLeds}>
            <div className={`${styles.led} ${styles.ledRed}`}></div>
            <div className={`${styles.led} ${styles.ledYellow}`}></div>
            <div className={`${styles.led} ${styles.ledGreen}`}></div>
          </div>
        </div>

        <h1 className={styles.sectionTitle}>═══ AI CONTENT COLLECTION ═══</h1>

        <div className={styles.carousel}>
          <Link href="/upload">
            <div className={styles.upload}>
              <div className={styles.uploadContent}>
                <div className={styles.uploadIcon}>📀</div>
                <div className={styles.uploadText}>INSERT VIDEO</div>
                <div className={styles.uploadSubtext}>Add new content</div>
              </div>
            </div>
          </Link>

          <Link href="/admin">
            <div className={styles.upload}>
              <div className={styles.uploadContent}>
                <div className={styles.uploadIcon}>⚙️</div>
                <div className={styles.uploadText}>SETUP MENU</div>
                <div className={styles.uploadSubtext}>Configuration</div>
              </div>
            </div>
          </Link>

          {videos.length === 0 && (
            <div className={styles.noVideos}>
              <div className={styles.noVideosIcon}>📀</div>
              <div className={styles.noVideosText}>NO VIDEO INSERTED</div>
            </div>
          )}

          {videos.map((video, index) => (
            <div key={video.key} className={styles.card}>
              <div className={styles.dvdCase}>
                <video
                  src={video.url}
                  width={250}
                  height={140}
                  className={styles.cardImage}
                  poster="/placeholder.svg?height=140&width=250"
                  preload="metadata"
                />

                <div className={styles.caseReflection}></div>

                {video.status && (
                  <div className={styles.statusLed}>
                    <div
                      className={`${styles.statusIndicator} ${
                        video.status === "approved"
                          ? styles.statusApproved
                          : video.status === "rejected"
                          ? styles.statusRejected
                          : styles.statusReview
                      }`}
                    ></div>
                  </div>
                )}

                <div className={styles.playOverlay}>
                  <div className={styles.playButton}>▶</div>
                </div>
              </div>

              <div className={styles.dvdLabel}>
                <div className={styles.titleNumber}>TITLE {String(index + 1).padStart(2, "0")}</div>
                <div className={styles.videoTitle}>
                  {video.key.split("/").pop()?.replace(/\.[^/.]+$/, "") || "UNTITLED"}
                </div>
                <div className={styles.controlsText}>● REC ● PLAY ● STOP</div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footerDisplay}>
          <div className={styles.footerLeft}>● REC ● TOTAL: {videos.length} TITLES</div>
          <div className={styles.footerCenter}>DVD PLAYER v2.1 ● READY</div>
          <div className={styles.footerRight}>{currentTime.toLocaleDateString()}</div>
        </div>
      </main>
    </div>
  );
}
