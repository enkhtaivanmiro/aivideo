import { useState, useRef, useEffect, memo, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import styles from '../styles/VideoCard.module.css';

const VideoCard = ({ videoSrc, thumbnailSrc, prompt, onLoad, index, isDesktop }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);

  // Observe full visibility
  const { ref: inViewRef, inView } = useInView({
    threshold: 1,
    triggerOnce: false,
  });

  const setRefs = useCallback((node) => {
    inViewRef(node);
  }, [inViewRef]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (inView) {
      video.play().catch(() => {});
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [inView]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const handleMuteUnmute = () => {
    const video = videoRef.current;
    if (!video) return;

    const newMuted = !video.muted;
    video.muted = newMuted;
    setIsMuted(newMuted);
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
          loop
          playsInline
          muted
          onLoadedData={onLoad}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
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

export default memo(VideoCard);
