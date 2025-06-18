'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../styles/admin.module.css';

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default function AdminPage() {
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken') || '';

    const payload = parseJwt(accessToken);

    if (!payload || !payload['cognito:groups']?.includes('Admin')) {
      router.replace('/home');
      return;
    }

    async function fetchVideos() {
      try {
        const res = await fetch('/api/videos');
        if (!res.ok) throw new Error('Failed to fetch videos');
        const data = await res.json();
        setVideos(data);
      } catch (error) {
        alert('Error loading videos: ' + error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, [router]);

  const handleAction = async (videoKey, action) => {
    try {
      const res = await fetch(`/api/videos/${encodeURIComponent(videoKey)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        setVideos((prev) => prev.filter((v) => v.key !== videoKey));
      } else {
        alert('Action failed');
      }
    } catch (error) {
      alert('Network error: ' + error.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <h1>Admin Video Review</h1>
      {videos.length === 0 ? (
        <p>No videos to review</p>
      ) : (
        <div className={styles.videoGrid}>
          {videos.map((video) => (
            <div key={video.key} className={styles.card}>
              <video src={video.url} controls className={styles.video}></video>
              <p>{video.key.split('/').pop()}</p>
              <div className={styles.actions}>
                <button
                  className={`${styles.button} ${styles.accept}`}
                  onClick={() => handleAction(video.key, 'accept')}
                >
                  Accept
                </button>
                <button
                  className={`${styles.button} ${styles.reject}`}
                  onClick={() => handleAction(video.key, 'reject')}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
