
"use client";

import { useRef, useState } from "react";
import styles from "./ICSVideoBackground.module.css";

const videos = [
  "/videos/ICS-background.mp4",
  "/videos/ICS-background2.mp4",
];

const FADE_DURATION = 1.5;
const FADE_BEFORE_END = 1.5;

export default function ICSVideoBackground() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const activeVideoRef = useRef(0);
  const transitionStarted = useRef(false);

  const [activeVideo, setActiveVideo] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const startTransition = (index: number) => {
    if (index !== activeVideoRef.current || transitionStarted.current) {
      return;
    }

    const nextIndex = (index + 1) % videos.length;
    const nextVideo = videoRefs.current[nextIndex];

    if (!nextVideo) return;

    transitionStarted.current = true;

    // The incoming video is reset only before it starts playing.
    nextVideo.currentTime = 0;

    void nextVideo.play().then(() => {
      setTransitioning(true);
    }).catch((error) => {
      console.error("Unable to play next ICS background video:", error);
      transitionStarted.current = false;
    });
  };

  const handleTimeUpdate = (index: number) => {
    if (index !== activeVideoRef.current || transitionStarted.current) {
      return;
    }

    const video = videoRefs.current[index];

    if (!video || !Number.isFinite(video.duration)) return;

    if (video.currentTime >= video.duration - FADE_BEFORE_END) {
      startTransition(index);
    }
  };

  const finishTransition = (index: number) => {
    const currentIndex = activeVideoRef.current;
    const nextIndex = (currentIndex + 1) % videos.length;

    if (
      !transitionStarted.current ||
      index !== nextIndex
    ) {
      return;
    }

    const previousVideo = videoRefs.current[currentIndex];

    if (previousVideo) {
      previousVideo.pause();
      previousVideo.currentTime = 0;
    }

    // The incoming video keeps playing from its current position.
    activeVideoRef.current = nextIndex;
    transitionStarted.current = false;

    setActiveVideo(nextIndex);
    setTransitioning(false);
  };

  return (
    <div className={styles.container} aria-hidden="true">
      {videos.map((src, index) => {
        const isActive = index === activeVideo;

        const className = isActive
          ? transitioning
            ? styles.fadeOut
            : styles.visible
          : transitioning
            ? styles.fadeIn
            : styles.hidden;

        return (
          <video
            key={src}
            ref={(element) => {
              videoRefs.current[index] = element;
            }}
            muted
            playsInline
            preload="auto"
            autoPlay={index === 0}
            onTimeUpdate={() => handleTimeUpdate(index)}
            onEnded={() => startTransition(index)}
            onTransitionEnd={(event) => {
              if (
                event.propertyName === "opacity" &&
                transitioning &&
                index !== activeVideo
              ) {
                finishTransition(index);
              }
            }}
            className={`${styles.video} ${className}`}
            style={{ transitionDuration: `${FADE_DURATION}s` }}
          >
            <source src={src} type="video/mp4" />
          </video>
        );
      })}
    </div>
  );
}
