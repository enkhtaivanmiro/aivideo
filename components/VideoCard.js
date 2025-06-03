import { useState, useRef, useEffect } from 'react';
import styles from '../styles/VideoCard.module.css';

const VideoCard = ({ videoSrc, thumbnailSrc, prompt, onLoad }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

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

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const handleVideoEnd = () => setIsPlaying(false);
      videoElement.addEventListener('ended', handleVideoEnd);

      if (!videoElement.paused && !isPlaying) {
        setIsPlaying(true);
      }

      return () => {
        videoElement.removeEventListener('ended', handleVideoEnd);
      };
    }
  }, [isPlaying]);

  return (
    <div className={styles.videoCard}>
      <div
        className={styles.videoWrapper}
        onMouseEnter={() => {
          setShowControls(true);
          if (videoRef.current && !videoRef.current.paused && !isPlaying) {
            setIsPlaying(true);
          }
        }}
        onMouseLeave={() => setShowControls(false)}
      >
        <video
          ref={videoRef}
          src={videoSrc}
          preload="metadata"
          poster={thumbnailSrc} // Optional
          className={styles.videoPlayer}
          loop
          playsInline
          autoPlay
          muted
          onLoadedData={onLoad}  // <-- Important callback here
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

export default VideoCard;
