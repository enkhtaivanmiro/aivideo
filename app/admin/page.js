'use client';

import { useEffect, useState } from 'react';
import styles from '../../styles/admin.module.css';

export default function AdminPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch videos (replace with real API)
    async function fetchVideos() {
      const res = await fetch('/api/admin/videos'); // Fake endpoint
      const data = await res.json();
      setVideos(data);
      setLoading(false);
    }

    fetchVideos();
  }, []);

  const handleAction = async (videoId, action) => {
    const res = await fetch(`/api/admin/videos/${videoId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });

    if (res.ok) {
      setVideos((prev) => prev.filter((v) => v.id !== videoId));
    } else {
      alert('Action failed');
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
            <div key={video.id} className={styles.card}>
              <video src={video.url} controls className={styles.video}></video>
              <p>{video.title}</p>
              <div className={styles.actions}>
                <button onClick={() => handleAction(video.id, 'accept')}>Accept</button>
                <button onClick={() => handleAction(video.id, 'reject')}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
