"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIO } from "@/hooks/useIO";
import { HERO_VIDEO_WEBM_URL, HERO_VIDEO_MP4_URL, HERO_VIDEO_POSTER_URL } from "@/lib/assets";

export default function CinematicStrip() {
  const reducedMotion = usePrefersReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref, v } = useIO(0.15);

  const hasVideo = !reducedMotion && (HERO_VIDEO_WEBM_URL || HERO_VIDEO_MP4_URL);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hasVideo) return;
    // Seek into the middle of the clip for visual variety vs the Hero background
    video.currentTime = 7;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!videoRef.current) return;
        if (entry.isIntersecting) videoRef.current.play().catch(() => {});
        else videoRef.current.pause();
      },
      { threshold: 0.1 }
    );
    obs.observe(video);
    return () => obs.disconnect();
  }, [hasVideo]);

  return (
    <section className="relative overflow-hidden" style={{ height: 260 }} aria-hidden="true">
      {/* useIO requires a div ref */}
      <div ref={ref} className="absolute inset-0">
        {hasVideo ? (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            loop
            playsInline
            poster={HERO_VIDEO_POSTER_URL || undefined}
            preload="none"
            style={{ transform: "scale(1.04)" }}
          >
            {HERO_VIDEO_WEBM_URL && <source src={HERO_VIDEO_WEBM_URL} type="video/webm" />}
            {HERO_VIDEO_MP4_URL && <source src={HERO_VIDEO_MP4_URL} type="video/mp4" />}
          </video>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#111111] to-[#1C1C1C]" />
        )}

        {/* Warm cream overlay — editorial warmth */}
        <div className="absolute inset-0 bg-[#FDFAF6]/62" />

        {/* Brass edge vignettes */}
        <div
          className="absolute inset-y-0 left-0 w-40 pointer-events-none"
          style={{ background: "linear-gradient(to right, rgba(201,151,74,0.14), transparent)" }}
        />
        <div
          className="absolute inset-y-0 right-0 w-40 pointer-events-none"
          style={{ background: "linear-gradient(to left, rgba(201,151,74,0.14), transparent)" }}
        />

        {/* Centred editorial copy */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="text-center px-5"
            style={{
              opacity: v ? 1 : 0,
              transform: v ? "none" : "translateY(14px)",
              transition: "opacity .9s cubic-bezier(.22,1,.36,1), transform .9s cubic-bezier(.22,1,.36,1)",
            }}
          >
            <p
              className="text-[9px] font-semibold tracking-[.28em] uppercase mb-3"
              style={{ color: "rgba(201,151,74,0.70)" }}
            >
              DwellIQ
            </p>
            <p
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(28px, 4vw, 56px)",
                fontWeight: 300,
                color: "#1C1C1C",
                letterSpacing: "-0.01em",
                lineHeight: 1.1,
              }}
            >
              Every room.{" "}
              <em style={{ color: "#C9974A", fontStyle: "italic" }}>One vision.</em>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
