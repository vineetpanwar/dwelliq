"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface Props {
  webmSrc: string;
  mp4Src: string;
  posterSrc: string;
}

export default function CinematicHeroVideo({ webmSrc, mp4Src, posterSrc }: Props) {
  const reducedMotion = usePrefersReducedMotion();
  const [isMobile, setIsMobile] = useState(true);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!videoRef.current) return;
        if (entry.isIntersecting) {
          if (!paused) videoRef.current.play().catch(() => {});
        } else {
          videoRef.current.pause();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(video);
    return () => obs.disconnect();
  }, [paused]);

  const togglePause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) { video.play().catch(() => {}); setPaused(false); }
    else { video.pause(); setPaused(true); }
  };

  const showPosterOnly = reducedMotion || isMobile || (!webmSrc && !mp4Src);
  if (showPosterOnly) {
    if (!posterSrc) return null;
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={posterSrc} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" decoding="async" />;
  }

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay muted loop playsInline
        poster={posterSrc || undefined}
        preload="auto"
        aria-hidden="true"
      >
        {webmSrc && <source src={webmSrc} type="video/webm" />}
        {mp4Src && <source src={mp4Src} type="video/mp4" />}
      </video>
      <button
        onClick={togglePause}
        onFocus={() => setHovering(true)}
        onBlur={() => setHovering(false)}
        aria-label={paused ? "Play background video" : "Pause background video"}
        className="absolute bottom-8 right-8 z-20 flex items-center gap-2 bg-[#0A0908]/55 text-[#FDFAF6]/90 text-[10px] font-medium px-3.5 py-2 rounded-full select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9974A]"
        style={{ backdropFilter: "blur(8px)", opacity: hovering ? 1 : 0, transition: "opacity .25s ease", pointerEvents: hovering ? "auto" : "none" }}
      >
        {paused ? (
          <><svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true"><path d="M2 1.5 9.5 5 2 8.5V1.5Z" /></svg>Play</>
        ) : (
          <><svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true"><rect x="1.5" y="1.5" width="2.5" height="7" rx=".5" /><rect x="6" y="1.5" width="2.5" height="7" rx=".5" /></svg>Pause motion</>
        )}
      </button>
    </div>
  );
}
