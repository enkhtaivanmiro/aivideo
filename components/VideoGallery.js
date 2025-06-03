// components/VideoGallery.js
import React, { useEffect, useRef, useMemo, useState } from 'react';
import VideoCard from './VideoCard';
import styles from '../styles/VideoGallery.module.css';

// --- Constants for animation calculation ---
const CARD_WIDTH = 400; // Must match .videoCard width AND grid-auto-columns
const CARD_GAP = 0;     // Assumes no 'gap' in the base .videoGallery style for desktop.
                        // If you add a 'gap' to the desktop .videoGallery style, update this value.
// ---

const VideoGallery = ({ videos }) => {
  const trackRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth > 768);
    };
    checkScreenSize(); // Initial check
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const videosToDisplay = useMemo(() => {
    if (isDesktop && videos && videos.length > 1) {
      // Only duplicate if on desktop and more than one video
      // Ensure total width of original videos is substantial enough to warrant scrolling
      // This is a simple heuristic; you might refine it.
      const originalTotalWidth = videos.length * (CARD_WIDTH + CARD_GAP);
      if (originalTotalWidth > (typeof window !== 'undefined' ? window.innerWidth * 0.8 : 1000)) { // e.g., exceeds 80% of viewport
        const secondSet = videos.map(video => ({ ...video, id: `${video.id}-loop-${Math.random().toString(36).substring(2, 9)}` }));
        return [...videos, ...secondSet];
      }
    }
    return videos || [];
  }, [videos, isDesktop]);

  useEffect(() => {
    const currentTrack = trackRef.current;

    if (isDesktop && currentTrack && videos && videos.length > 0 && videosToDisplay.length > videos.length) {
      // Animate only if on desktop and videos were duplicated (meaning animation is intended)
      const numOriginalVideos = videos.length;
      const scrollWidth = numOriginalVideos * (CARD_WIDTH + CARD_GAP);

      currentTrack.style.setProperty('--total-scroll-width', `${scrollWidth}px`);

      const animationSpeed = 40; // Pixels per second, adjust for desired speed
      const duration = scrollWidth / animationSpeed;
      currentTrack.style.setProperty('--scroll-duration', `${duration}s`);
      currentTrack.classList.add(styles.animateTrack);
    } else if (currentTrack) {
      // Not desktop, or not enough videos to animate/loop, or videos is empty
      currentTrack.classList.remove(styles.animateTrack);
      currentTrack.style.removeProperty('--total-scroll-width');
      currentTrack.style.removeProperty('--scroll-duration');
    }

    // Cleanup class if component unmounts or dependencies change
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
            thumbnailSrc={video.thumbnailSrc} // Pass thumbnailSrc if available
            prompt={video.prompt}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoGallery;