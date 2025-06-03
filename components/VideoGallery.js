import React, { useEffect, useRef, useMemo, useState } from 'react';
import VideoCard from './VideoCard';
import styles from '../styles/VideoGallery.module.css';

const CARD_WIDTH = 400;
const CARD_GAP = 0;

const VideoGallery = ({ videos, onVideoLoad }) => {
  const trackRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth > 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const videosToDisplay = useMemo(() => {
    if (isDesktop && videos && videos.length > 1) {
      const originalTotalWidth = videos.length * (CARD_WIDTH + CARD_GAP);
      if (originalTotalWidth > (typeof window !== 'undefined' ? window.innerWidth * 0.8 : 1000)) {
        const secondSet = videos.map(video => ({
          ...video,
          id: `${video.id}-loop-${Math.random().toString(36).substring(2, 9)}`
        }));
        return [...videos, ...secondSet];
      }
    }
    return videos || [];
  }, [videos, isDesktop]);

  useEffect(() => {
    const currentTrack = trackRef.current;

    if (isDesktop && currentTrack && videos && videos.length > 0 && videosToDisplay.length > videos.length) {
      const numOriginalVideos = videos.length;
      const scrollWidth = numOriginalVideos * (CARD_WIDTH + CARD_GAP);

      currentTrack.style.setProperty('--total-scroll-width', `${scrollWidth}px`);

      const animationSpeed = 40;
      const duration = scrollWidth / animationSpeed;
      currentTrack.style.setProperty('--scroll-duration', `${duration}s`);
      currentTrack.classList.add(styles.animateTrack);
    } else if (currentTrack) {
      currentTrack.classList.remove(styles.animateTrack);
      currentTrack.style.removeProperty('--total-scroll-width');
      currentTrack.style.removeProperty('--scroll-duration');
    }

    return () => {
      if (currentTrack) {
        currentTrack.classList.remove(styles.animateTrack);
      }
    };
  }, [videos, videosToDisplay, isDesktop]);

  if (!videos || videos.length === 0) {
    return <p>No videos to display.</p>;
  }

  return (
    <div className={styles.galleryViewport}>
      <div className={styles.videoGallery} ref={trackRef}>
        {videosToDisplay.map((video) => (
          <VideoCard
            key={video.id}
            videoSrc={video.videoSrc}
            thumbnailSrc={video.thumbnailSrc}
            prompt={video.prompt}
            onLoad={onVideoLoad}  // Pass down the loading callback here!
          />
        ))}
      </div>
    </div>
  );
};

export default VideoGallery;
