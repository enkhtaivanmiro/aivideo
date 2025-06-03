// components/VideoCard.js
import { useState, useRef, useEffect } from 'react';
import styles from '../styles/VideoCard.module.css';

const VideoCard = ({ videoSrc, thumbnailSrc, prompt }) => { // Added thumbnailSrc back to props if you want to use it
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]); // This ensures initial muted state from React is applied

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused || videoRef.current.ended) {
        videoRef.current.play();
        // setIsPlaying(true); // onPlay event handler will do this
      } else {
        videoRef.current.pause();
        // setIsPlaying(false); // onPause event handler will do this
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
      const handleVideoEnd = () => setIsPlaying(false); // Correctly sets playing to false on end
      videoElement.addEventListener('ended', handleVideoEnd);
      
      // Sync isPlaying state if video starts playing due to autoPlay
      if (!videoElement.paused && !isPlaying) {
        setIsPlaying(true);
      }

      return () => {
        videoElement.removeEventListener('ended', handleVideoEnd);
      };
    }
  }, [isPlaying]); // Added isPlaying to dependencies to help sync


  return (
    <div className={styles.videoCard}>
      <div
        className={styles.videoWrapper}
        onMouseEnter={() => {
          setShowControls(true);
          // If video is autoplaying and muted, and we want to ensure isPlaying is true on hover
          // (though onPlay should handle it)
          if (videoRef.current && !videoRef.current.paused && !isPlaying) {
            setIsPlaying(true);
          }
        }}
        onMouseLeave={() => setShowControls(false)}
      >
        <video
          ref={videoRef}
          src={videoSrc}
          // If you have thumbnail images, you can add the poster attribute back:
          // poster={thumbnailSrc} 
          className={styles.videoPlayer}
          loop
          playsInline // Important for iOS
          autoPlay  // Video will attempt to autoplay
          muted     // Autoplay typically requires video to be muted initially
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        {showControls && (
          <> {/* Using a Fragment to return multiple elements */}
            <p className={styles.videoPromptOverlay}>{prompt}</p>
            <div className={styles.controls}> {/* This div is for buttons */}
              <button onClick={handlePlayPause} className={styles.controlButton}>
                {isPlaying ? '❚❚' : '▶'}
              </button>
              <button onClick={handleMuteUnmute} className={styles.controlButton}>
                {isMuted ? '🔇' : '🔊'}
              </button>
            </div>
            {/* The prompt is now separate and will be styled as an overlay */}
          </>
        )}
      </div>
      {/* The prompt that was previously rendered outside videoWrapper (in my earlier examples)
          or the one you had inside styles.controls is now replaced by videoPromptOverlay. */}
    </div>
  );
};

export default VideoCard;