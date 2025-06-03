import { useState, useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styles from '../styles/VideoCard.module.css';

const VideoCard = ({ videoSrc, thumbnailSrc, prompt, onLoad, index }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);

  // Using IntersectionObserver to detect visibility
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  // Combine refs for video card container and inView detection
  const setRefs = (node) => {
    inViewRef(node);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Control autoplay and loop based on visibility & index (only first 2 autoplay)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (inView && index < 2) {
      video.play().catch(() => {});
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [inView, index]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused || videoRef.current.ended) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const handleMuteUnmute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div
      ref={setRefs}
      className={styles.videoCard}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className={styles.videoWrapper}>
        <video
          ref={videoRef}
          src={videoSrc}
          preload={index === 0 ? 'auto' : 'metadata'}
          poster={thumbnailSrc}
          className={styles.videoPlayer}
          loop={inView && index < 2}
          playsInline
          muted
          onLoadedData={onLoad}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          // Remove autoPlay attr because autoplay is controlled manually
        />
        {showControls && (
          <>
            <p className={styles.videoPromptOverlay}>{prompt}</p>
            <div className={styles.controls}>
              <button onClick={handlePlayPause} className={styles.controlButton}>
                {isPlaying ? '❚❚' : '▶'}
              </button>
              <button onClick={handleMuteUnmute} className={styles.controlButton}>
                {isMuted ? '🔇' : '🔊'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoCard;
