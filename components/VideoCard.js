import { useState, useRef, useEffect, memo } from 'react';
import { useInView } from 'react-intersection-observer';
import styles from '../styles/VideoCard.module.css';

const VideoCard = ({ videoSrc, thumbnailSrc, prompt, onLoad, index, isDesktop }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);

  // Detect visibility with IntersectionObserver
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  // Combine refs if needed
  const setRefs = (node) => {
    inViewRef(node);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Control autoplay and loop based on visibility, index, and device
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (inView && index < 2 && isDesktop) {
      video.play().catch(() => {});
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [inView, index, isDesktop]);

  // Handle Play/Pause manually
  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused || videoRef.current.ended) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  // Handle Mute/Unmute
  const handleMuteUnmute = () => {
    if (!videoRef.current) return;

    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
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
          // preload auto only for first visible video on desktop, else metadata
          preload={index === 0 && isDesktop ? 'auto' : 'metadata'}
          poster={thumbnailSrc}
          className={styles.videoPlayer}
          // loop only on desktop for first 2 videos
          loop={isDesktop && inView && index < 2}
          playsInline
          muted
          onLoadedData={onLoad}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          // no autoPlay attr to control manually
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

// Memoize to reduce unnecessary re-renders
export default memo(VideoCard);
