'use client';

import { useEffect, useState } from 'react';
import styles from '../../styles/admin.module.css';
import Header from '../../components/header';

export default function AdminPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingVideos, setProcessingVideos] = useState(new Set());

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching videos from /api/videos...");
      const res = await fetch("/api/videos");

      console.log("Response status:", res.status);
      console.log("Response headers:", Object.fromEntries(res.headers.entries()));

      if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error Response:", errorText);
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const responseText = await res.text();
        console.error("Non-JSON response:", responseText.substring(0, 200));
        throw new Error(
          `Expected JSON but got ${contentType}. Response starts with: ${responseText.substring(0, 100)}...`
        );
      }

      const data = await res.json();
      console.log("Fetched videos:", data);
      setVideos(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleAction = async (videoKey, action) => {
    setProcessingVideos(prev => new Set(prev).add(videoKey));

    try {
      console.log(`Performing ${action} on video:`, videoKey);
      const res = await fetch(`/api/videos/${encodeURIComponent(videoKey)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      console.log("Action response status:", res.status);

      if (res.ok) {
        setVideos(prev => prev.filter(v => v.key !== videoKey));
        console.log(`Successfully ${action}ed video:`, videoKey);
      } else {
        const errorText = await res.text();
        console.error("Action failed:", errorText);
        throw new Error(`Failed to ${action} video`);
      }
    } catch (err) {
      console.error("Action failed:", err);
      setError(`Failed to ${action} video: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setProcessingVideos(prev => {
        const newSet = new Set(prev);
        newSet.delete(videoKey);
        return newSet;
      });
    }
  };

  const getFileName = (key) => {
    return key.split("/").pop() || key;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString();
  };

  const renderSkeletonCard = (index) => (
    <div key={index} className={styles.skeletonCard}>
      <div className={styles.skeletonHeader}></div>
      <div className={styles.skeletonVideo}></div>
      <div className={styles.skeletonActions}>
        <div className={styles.skeletonButton}></div>
        <div className={styles.skeletonButton}></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1>Video Review Dashboard</h1>
            <p>Loading videos...</p>
          </div>
        </div>
        <div className={styles.videoGrid}>
          {Array.from({ length: 6 }).map((_, i) => renderSkeletonCard(i))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1>Video Review Dashboard</h1>
          </div>
        </div>
        
        <div className={styles.errorContainer}>
          <div className={styles.alert}>
            <div className={styles.alertIcon}>⚠️</div>
            <div className={styles.alertContent}>
              <p><strong>Error loading videos:</strong></p>
              <div className={styles.errorMessage}>{error}</div>
              <button 
                onClick={fetchVideos} 
                className={`${styles.button} ${styles.retryButton}`}
              >
                🔄 Retry
              </button>
            </div>
          </div>

          <div className={styles.debugCard}>
            <h3>Debugging Steps:</h3>
            <div className={styles.debugSteps}>
              <p>1. Check that your API route is at: <code>app/api/videos/route.js</code></p>
              <p>2. Verify your MongoDB connection is working</p>
              <p>3. Check the browser console for detailed error logs</p>
              <p>4. Ensure your Video model is properly imported</p>
              <p>5. Verify environment variables are set (AWS_S3_BUCKET, AWS_REGION)</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <Header />
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Video Review Dashboard</h1>
          <p>Review and moderate uploaded videos</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}>🕐</span>
            {videos.length} pending
          </div>
          <button 
            onClick={fetchVideos} 
            className={`${styles.button} ${styles.refreshButton}`}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Content */}
      {videos.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📹</div>
          <h3>No videos to review</h3>
          <p>All videos have been processed. Check back later for new submissions.</p>
        </div>
      ) : (
        <div className={styles.videoGrid}>
          {videos.map(({ key, url, title, uploadedBy, createdAt }) => {
            const isProcessing = processingVideos.has(key);
            
            return (
              <div key={key} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>
                    <h3 title={title || getFileName(key)}>
                      {title || getFileName(key)}
                    </h3>
                    <span className={styles.pendingBadge}>Pending</span>
                  </div>
                  {(uploadedBy || createdAt) && (
                    <div className={styles.cardMeta}>
                      {uploadedBy && <p>By: {uploadedBy}</p>}
                      {createdAt && <p>Uploaded: {formatDate(createdAt)}</p>}
                    </div>
                  )}
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.videoContainer}>
                    <video
                      src={url}
                      controls
                      className={styles.video}
                      preload="metadata"
                      onError={(e) => {
                        console.error("Video load error for:", url, e);
                      }}
                    />
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.actions}>
                    <button
                      onClick={() => handleAction(key, "accept")}
                      disabled={isProcessing}
                      className={`${styles.button} ${styles.accept} ${isProcessing ? styles.processing : ''}`}
                    >
                      {isProcessing ? (
                        <span className={styles.processingContent}>
                          <span className={styles.spinner}></span>
                          Processing...
                        </span>
                      ) : (
                        <span>✅ Accept</span>
                      )}
                    </button>

                    <button
                      onClick={() => handleAction(key, "reject")}
                      disabled={isProcessing}
                      className={`${styles.button} ${styles.reject} ${isProcessing ? styles.processing : ''}`}
                    >
                      {isProcessing ? (
                        <span className={styles.processingContent}>
                          <span className={styles.spinner}></span>
                          Processing...
                        </span>
                      ) : (
                        <span>❌ Reject</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}