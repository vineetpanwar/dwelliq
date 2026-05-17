"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  HERO_VIDEO_WEBM_URL,
  HERO_VIDEO_MP4_URL,
  HERO_VIDEO_POSTER_URL,
  PRESS,
} from "@/lib/assets";

// ── Colour tokens ─────────────────────────────────────────────────────────────
const C = {
  cream: "#FDFAF6", stone: "#F5F2EE", greige: "#EAE6DF",
  ink: "#0A0908", charcoal: "#1C1A17", mid: "#5C5550", light: "#9C948C",
  border: "#D4CFC8", borderLight: "#E8E4DF",
  brass: "#C9974A", brassLight: "#D4A96A", brassDim: "#C9974A22",
  sage: "#7A9E8A", sageDim: "#7A9E8A22",
  terra: "#C4735A", terraDim: "#C4735A22",
  blue: "#4A6A8A", blueDim: "#4A6A8A22",
};

// ── Hooks ─────────────────────────────────────────────────────────────────────
function useSmoothScroll() {
  useEffect(() => {
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let rafId = 0;
    import("lenis").then(({ default: Lenis }) => {
      lenis = new Lenis({ duration: 1.1, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      function raf(t: number) { lenis!.raf(t); rafId = requestAnimationFrame(raf); }
      rafId = requestAnimationFrame(raf);
    });
    return () => { lenis?.destroy(); cancelAnimationFrame(rafId); };
  }, []);
}

function useIO(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, v };
}

function CountUp({ end, trigger, prefix = "", suffix = "", className = "" }: { end: number; trigger: boolean; prefix?: string; suffix?: string; className?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let cur = 0;
    const tick = () => {
      cur += Math.max(1, Math.ceil((end - cur) / 12));
      if (cur >= end) { setN(end); return; }
      setN(cur); setTimeout(tick, 24);
    };
    setTimeout(tick, 150);
  }, [trigger, end]);
  return <span className={className}>{prefix}{n.toLocaleString()}{suffix}</span>;
}

// ── Reduced-motion preference ─────────────────────────────────────────────────
// Tracks the OS/browser "prefers-reduced-motion" media query and live-updates
// if the user changes the setting while the page is open.
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return reduced;
}

// ── Parallax on scroll ────────────────────────────────────────────────────────
function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const update = () => setY(window.scrollY);
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return y;
}

// ── Cinematic hero video ──────────────────────────────────────────────────────
// Behaviour matrix:
//   mobile (<768 px)       → poster image only; video element never created
//   prefers-reduced-motion → poster image only; video element never created
//   no URLs configured     → renders nothing (hero falls back to gradient)
//   desktop / tablet       → <video autoPlay muted loop playsInline>
//                            pauses automatically when scrolled off-screen
//                            exposes an unobtrusive Pause/Play toggle on hover
function CinematicHeroVideo({
  webmSrc,
  mp4Src,
  posterSrc,
}: {
  webmSrc: string;
  mp4Src: string;
  posterSrc: string;
}) {
  const reducedMotion = usePrefersReducedMotion();

  // Default to `true` (mobile) until the effect runs, so we never flash the
  // video element during SSR or on a mobile device before hydration.
  const [isMobile, setIsMobile] = useState(true);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Detect viewport width — re-checks on resize so rotating a tablet works.
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  // Pause when the hero scrolls out of view; resume when it returns.
  // This avoids wasting GPU/CPU compositing an invisible video.
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
    if (video.paused) {
      video.play().catch(() => {});
      setPaused(false);
    } else {
      video.pause();
      setPaused(true);
    }
  };

  // Poster-only paths
  const showPosterOnly = reducedMotion || isMobile || (!webmSrc && !mp4Src);
  if (showPosterOnly) {
    if (!posterSrc) return null;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={posterSrc}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        // Decode off main thread so it doesn't block paint
        decoding="async"
      />
    );
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
        autoPlay
        muted
        loop
        playsInline
        // poster shows instantly — prevents layout shift while video loads
        poster={posterSrc || undefined}
        // preload="auto" lets the browser pipeline the download alongside page
        // resources; combined with the CDN Cache-Control this is fine for a
        // short (<5 MB) hero clip.
        preload="auto"
        aria-hidden="true"
      >
        {/* WebM first: ~30–50 % smaller than MP4 at equal quality */}
        {webmSrc && <source src={webmSrc} type="video/webm" />}
        {/* MP4: universal fallback (Safari < 15, older Android) */}
        {mp4Src && <source src={mp4Src} type="video/mp4" />}
      </video>

      {/* ── Pause / Play control ──
          Visible only on hover or keyboard focus — never obstructs the design.
          Uses direct ref mutation (not setState) so toggling doesn't re-render
          the parent component tree. */}
      <button
        onClick={togglePause}
        onFocus={() => setHovering(true)}
        onBlur={() => setHovering(false)}
        aria-label={paused ? "Play background video" : "Pause background video"}
        className="absolute bottom-8 right-8 z-20 flex items-center gap-2 bg-[#0A0908]/55 text-[#FDFAF6]/90 text-[10px] font-medium px-3.5 py-2 rounded-full select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9974A]"
        style={{
          backdropFilter: "blur(8px)",
          opacity: hovering ? 1 : 0,
          transition: "opacity .25s ease",
          // Always keyboard-reachable even when visually hidden
          pointerEvents: hovering ? "auto" : "none",
        }}
      >
        {paused ? (
          <>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
              <path d="M2 1.5 9.5 5 2 8.5V1.5Z" />
            </svg>
            Play
          </>
        ) : (
          <>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
              <rect x="1.5" y="1.5" width="2.5" height="7" rx=".5" />
              <rect x="6"   y="1.5" width="2.5" height="7" rx=".5" />
            </svg>
            Pause motion
          </>
        )}
      </button>
    </div>
  );
}

// ── Nav links ─────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Rooms", href: "/#rooms" },
  { label: "3D Studio", href: "/studio" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Pricing", href: "/pricing" },
];

// ── Room types ────────────────────────────────────────────────────────────────
const ROOM_TABS = [
  { id: "living", label: "Living Room", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80", principles: ["Anchor with a statement sofa", "Layer textiles for warmth", "Curate a gallery wall", "Balance scale and proportion"] },
  { id: "bedroom", label: "Bedroom", img: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=900&q=80", principles: ["Start with the bed as the focal point", "Use linen for a calm palette", "Add a reading nook", "Blackout with style"] },
  { id: "kitchen", label: "Kitchen", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80", principles: ["Open shelving creates depth", "Contrast countertops with cabinetry", "Hardware finishes tie the room", "Task + ambient lighting layers"] },
  { id: "balcony", label: "Balcony", img: "https://images.unsplash.com/photo-1591825729269-caeb344f6df2?w=900&q=80", principles: ["Weather-resistant materials only", "Vertical gardens save space", "Define zones even in small areas", "String lights set the mood"] },
  { id: "office", label: "Home Office", img: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=900&q=80", principles: ["Ergonomics before aesthetics", "Natural light left or right of screen", "Cable management is design", "One statement piece energises"] },
];

// ── Styles ────────────────────────────────────────────────────────────────────
const STYLES = [
  { name: "Warm Mid-Century", keywords: ["Walnut", "Tapered legs", "Organic curves", "Ochre"], palette: ["#C9974A", "#8B6914", "#4A3728", "#F5EDD4", "#2C5F4A"], img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80" },
  { name: "Scandinavian", keywords: ["White oak", "Linen", "Negative space", "Hygge"], palette: ["#E8E4DF", "#BFBAB4", "#4A4540", "#FFFFFF", "#7A9E8A"], img: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80" },
  { name: "Japandi", keywords: ["Wabi-sabi", "Natural fibre", "Muted earth", "Shoji"], palette: ["#D4C9B8", "#8B7355", "#3D3530", "#F0EBE3", "#7A8C82"], img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80" },
  { name: "Modern Luxury", keywords: ["Marble", "Velvet", "Brass", "Dramatic"], palette: ["#1C1A17", "#C9974A", "#8B7D6B", "#FDFAF6", "#7B68C8"], img: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&q=80" },
  { name: "Biophilic", keywords: ["Living walls", "Natural light", "Stone", "Clay"], palette: ["#7A9E8A", "#4A6A58", "#8B7355", "#EAE6DF", "#C4735A"], img: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80" },
  { name: "Industrial", keywords: ["Exposed brick", "Raw steel", "Edison bulb", "Reclaimed"], palette: ["#3D3530", "#6B5B4E", "#9C8C7C", "#EAE6DF", "#C4735A"], img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80" },
];

// ── Marketplace products ──────────────────────────────────────────────────────
const PRODUCTS = [
  { name: "Rivet Revolve Sofa", retailer: "Amazon", price: 799, match: 98, style: "Mid-Century", delivery: "3 days", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80", tags: ["In stock", "Free delivery"] },
  { name: "West Elm Haven — Linen", retailer: "West Elm", price: 1299, match: 94, style: "Scandinavian", delivery: "2 weeks", img: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=400&q=80", tags: ["Premium", "Local pickup"] },
  { name: "Jaipur Braid Rug 8×10", retailer: "Wayfair", price: 449, match: 96, style: "Japandi", delivery: "5 days", img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80", tags: ["In stock"] },
  { name: "Arco Floor Lamp", retailer: "Lumens", price: 380, match: 91, style: "Modern", delivery: "1 week", img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80", tags: ["Local showroom"] },
];

// ── Testimonials ──────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { quote: "DwellIQ rebuilt our entire apartment — living room, bedroom, dining — inside a single budget envelope. I never thought cross-room coordination was possible this affordably.", name: "Maya R.", role: "Homeowner · Jersey City NJ", initials: "MR", color: C.brass, saved: "$1,240" },
  { quote: "The 3D walkthrough sold my clients before a single piece was purchased. We closed a $28k project in one meeting.", name: "James T.", role: "Interior Designer · Austin TX", initials: "JT", color: C.sage },
  { quote: "I told the AI 'keep the sofa, go more Japandi'. It rerouted the budget across three rooms and updated the 3D model in seconds.", name: "Priya M.", role: "Apartment refresh · Brooklyn NY", initials: "PM", color: C.terra },
];

// ── Engine inputs/outputs data ────────────────────────────────────────────────
const ENGINE_INPUTS = [
  { label: "Room Images", icon: "📸", desc: "Uploaded photos + dimensions" },
  { label: "Style + Lifestyle", icon: "✦", desc: "7 style families · household type" },
  { label: "Budget Mode", icon: "◈", desc: "Fixed · Flexible · Time-constrained" },
  { label: "Location", icon: "◎", desc: "ZIP → lat/long → local inventory" },
];
const ENGINE_OUTPUTS = [
  { label: "Budget-Friendly", pct: 68, color: C.sage, desc: "$2,800 across 3 rooms" },
  { label: "Balanced", pct: 85, color: C.brass, desc: "$4,200 — recommended" },
  { label: "Premium", pct: 100, color: C.terra, desc: "$6,500 — full upgrade" },
];

// ── Film strip images ─────────────────────────────────────────────────────────
const FILM_STRIP_IMAGES = [
  { src: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80", label: "Living Room" },
  { src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80", label: "Japandi" },
  { src: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80", label: "Bedroom" },
  { src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80", label: "Kitchen" },
  { src: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80", label: "Modern Luxury" },
  { src: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80", label: "Industrial" },
  { src: "https://images.unsplash.com/photo-1591825729269-caeb344f6df2?w=800&q=80", label: "Balcony" },
  { src: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80", label: "Biophilic" },
  { src: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80", label: "Scandinavian" },
  { src: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80", label: "Lighting" },
];

function CinematicFilmStrip() {
  const { ref, v } = useIO(0.05);
  const row2 = [...FILM_STRIP_IMAGES.slice(5), ...FILM_STRIP_IMAGES.slice(0, 5)];
  return (
    <div
      ref={ref}
      className="relative overflow-hidden bg-[#0A0908] py-12"
      style={{ opacity: v ? 1 : 0, transition: "opacity 1.4s ease" }}
    >
      {/* Edge fades */}
      <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-[#0A0908] to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-[#0A0908] to-transparent z-10 pointer-events-none" />

      {/* Row 1 — scroll left */}
      <div className="flex gap-3 mb-3" style={{ animation: "filmScroll 55s linear infinite", willChange: "transform" }}>
        {[...FILM_STRIP_IMAGES, ...FILM_STRIP_IMAGES].map((img, i) => (
          <div
            key={i}
            className="relative flex-shrink-0 rounded-xl overflow-hidden"
            style={{ width: 340, height: 220, borderColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderStyle: "solid" }}
          >
            <Image src={img.src} alt={img.label} fill className="object-cover" style={{ opacity: 0.75 }} unoptimized />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908]/60 to-transparent" />
            <span className="absolute bottom-3 left-3 text-[9px] tracking-[.2em] uppercase text-white/40 font-medium">{img.label}</span>
          </div>
        ))}
      </div>

      {/* Row 2 — scroll right, offset images */}
      <div className="flex gap-3" style={{ animation: "filmScrollReverse 65s linear infinite", willChange: "transform" }}>
        {[...row2, ...row2].map((img, i) => (
          <div
            key={i}
            className="relative flex-shrink-0 rounded-xl overflow-hidden"
            style={{ width: 290, height: 186, borderColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderStyle: "solid" }}
          >
            <Image src={img.src} alt={img.label} fill className="object-cover" style={{ opacity: 0.55 }} unoptimized />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908]/50 to-transparent" />
          </div>
        ))}
      </div>

      {/* Centre text overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(90deg, #0A0908 0%, rgba(10,9,8,0.25) 40%, rgba(10,9,8,0.25) 60%, #0A0908 100%)" }}
        />
        <div className="relative text-center px-8">
          <p className="text-[9px] font-semibold tracking-[.3em] uppercase text-[#C9974A] mb-3">24,000+ rooms designed</p>
          <h3
            className="font-[var(--font-cormorant)] font-light text-[#FDFAF6] leading-[.95]"
            style={{ fontSize: "clamp(34px,5vw,62px)", textShadow: "0 2px 40px rgba(10,9,8,0.8)" }}
          >
            Every space,{" "}
            <em style={{ color: C.brass }}>intentionally</em>
            <br />transformed.
          </h3>
        </div>
      </div>
    </div>
  );
}

// ── Hero cinema viewer ────────────────────────────────────────────────────────
const HERO_ROOM_SLIDES = [
  { src: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=85", style: "Warm Mid-Century", room: "Living Room" },
  { src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=85", style: "Japandi", room: "Bedroom" },
  { src: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=900&q=85", style: "Modern Luxury", room: "Master Suite" },
  { src: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&q=85", style: "Industrial", room: "Open Plan" },
  { src: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=900&q=85", style: "Biophilic", room: "Studio" },
];

function HeroCinemaViewer() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive(cur => (cur + 1) % HERO_ROOM_SLIDES.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  const slide = HERO_ROOM_SLIDES[active];

  return (
    <div
      className="relative overflow-hidden"
      style={{
        borderRadius: 28,
        border: "1px solid rgba(212,207,200,0.7)",
        boxShadow: "0 40px 100px rgba(10,9,8,0.18), 0 8px 24px rgba(10,9,8,0.08)",
        aspectRatio: "4/3",
      }}
    >
      {/* Slide progress bar */}
      <div className="absolute top-0 inset-x-0 z-40 h-[2px] overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
        <div
          key={active}
          className="h-full"
          style={{ background: C.brass, animation: "progressAdvance 4.5s linear forwards" }}
        />
      </div>

      {/* macOS-style chrome bar */}
      <div
        className="absolute top-[2px] inset-x-0 z-30 flex items-center justify-between px-4 py-2.5 border-b"
        style={{
          background: "rgba(10,9,8,0.68)",
          backdropFilter: "blur(20px)",
          borderColor: "rgba(255,255,255,0.07)",
        }}
      >
        <div className="flex gap-1.5">
          {["#FF5F57", "#FEBC2E", "#28C840"].map(c => (
            <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
          ))}
        </div>
        <span className="text-[9px] text-white/40 font-mono tracking-wide">
          DwellIQ Studio · {slide.room}
        </span>
        <div className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#28C840]"
            style={{ animation: "pulse 2s ease-in-out infinite" }}
          />
          <span className="text-[9px] text-white/40">Live</span>
        </div>
      </div>

      {/* Room images — all pre-rendered, crossfade via opacity */}
      {HERO_ROOM_SLIDES.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            opacity: i === active ? 1 : 0,
            transition: "opacity .9s ease",
            zIndex: i === active ? 2 : 1,
          }}
        >
          <Image
            src={s.src}
            alt={s.style}
            fill
            className="object-cover"
            unoptimized
            style={{ animation: "kenBurns 12s ease-in-out infinite alternate" }}
          />
        </div>
      ))}

      {/* Bottom vignette */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(10,9,8,0.72) 0%, rgba(10,9,8,0.06) 48%, transparent 100%)",
        }}
      />

      {/* AI analysis chip — re-animates on slide change */}
      <div className="absolute bottom-0 inset-x-0 z-20 px-4 pb-4">
        <div
          key={`chip-${active}`}
          className="flex items-center justify-between rounded-2xl px-4 py-3 mb-3.5 border"
          style={{
            background: "rgba(253,250,246,0.94)",
            borderColor: "rgba(212,207,200,0.5)",
            backdropFilter: "blur(10px)",
            animation: "fadeIn .45s .08s ease both",
          }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-full bg-[#C9974A] flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0">
                AI
              </div>
              <span className="text-[10px] font-semibold text-[#0A0908]">{slide.style}</span>
            </div>
            <p className="text-[10px] text-[#5C5550] leading-none">Budget $4,200 · Balanced · 3 packages ready</p>
          </div>
          <span
            className="text-[10px] font-bold ml-3 flex-shrink-0 px-2.5 py-1 rounded-full"
            style={{ color: C.sage, background: `${C.sage}18` }}
          >
            98% match
          </span>
        </div>

        {/* Room label + dot nav */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-white/55">{slide.room}</span>
          <div className="flex items-center gap-1.5">
            {HERO_ROOM_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`View ${HERO_ROOM_SLIDES[i].room}`}
                style={{
                  height: 5,
                  width: i === active ? 22 : 5,
                  borderRadius: 3,
                  background: i === active ? C.brass : "rgba(255,255,255,0.3)",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  transition: "all 0.35s cubic-bezier(.34,1.56,.64,1)",
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Deck viewer — 5 cards, stacked + auto-cycling ─────────────────────────────
const DECK_CONFIGS: { rotate: number; tx: number; ty: number; scale: number; opacity: number; z: number; shadow: string }[] = [
  { rotate: 0,    tx: 0,    ty: 0,    scale: 1.000, opacity: 1.00, z: 5, shadow: "0 36px 90px rgba(10,9,8,0.24)" },
  { rotate: 3.5,  tx: 18,   ty: -12,  scale: 0.965, opacity: 0.76, z: 4, shadow: "0 16px 44px rgba(10,9,8,0.14)" },
  { rotate: -5.5, tx: -22,  ty: -20,  scale: 0.930, opacity: 0.54, z: 3, shadow: "0 10px 28px rgba(10,9,8,0.10)" },
  { rotate: 7.5,  tx: 24,   ty: -30,  scale: 0.895, opacity: 0.34, z: 2, shadow: "0 6px 16px rgba(10,9,8,0.07)" },
  { rotate: -3,   tx: -14,  ty: -40,  scale: 0.860, opacity: 0.18, z: 1, shadow: "none" },
];

function HeroDeckViewer() {
  const [active, setActive] = useState(0);
  const N = HERO_ROOM_SLIDES.length;

  useEffect(() => {
    const id = setInterval(() => setActive(cur => (cur + 1) % N), 4200);
    return () => clearInterval(id);
  }, [N]);

  return (
    /* paddingTop reserves space so rotated back-cards don't overflow upward */
    <div className="relative" style={{ paddingTop: 48 }}>
      <div style={{ position: "relative", aspectRatio: "4/3" }}>
        {HERO_ROOM_SLIDES.map((s, i) => {
          const pos = (i - active + N) % N;
          const cfg = DECK_CONFIGS[pos];
          const isFront = pos === 0;

          return (
            <div
              key={i}
              className="absolute inset-0 overflow-hidden"
              style={{
                borderRadius: 22,
                border: "1px solid rgba(212,207,200,0.65)",
                transform: `translateX(${cfg.tx}px) translateY(${cfg.ty}px) rotate(${cfg.rotate}deg) scale(${cfg.scale})`,
                opacity: cfg.opacity,
                zIndex: cfg.z,
                boxShadow: cfg.shadow,
                transition: "transform 0.8s cubic-bezier(.34,1.05,.64,1), opacity 0.65s ease",
                willChange: "transform",
              }}
            >
              {/* Room photo */}
              <Image src={s.src} alt={s.style} fill className="object-cover" unoptimized />

              {/* Front-card overlays only */}
              {isFront && (
                <>
                  {/* Vignette */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ zIndex: 2, background: "linear-gradient(to top, rgba(10,9,8,0.75) 0%, rgba(10,9,8,0.05) 48%, transparent 100%)" }}
                  />

                  {/* Gold progress bar — key={active} resets animation on each slide */}
                  <div className="absolute top-0 inset-x-0 overflow-hidden" style={{ height: 2, zIndex: 20, background: "rgba(255,255,255,0.07)" }}>
                    <div
                      key={`pb-${active}`}
                      className="h-full"
                      style={{ background: C.brass, animation: "progressAdvance 4.2s linear forwards" }}
                    />
                  </div>

                  {/* macOS chrome bar */}
                  <div
                    className="absolute inset-x-0 flex items-center justify-between px-4 py-2.5 border-b"
                    style={{ top: 2, zIndex: 10, background: "rgba(10,9,8,0.66)", backdropFilter: "blur(20px)", borderColor: "rgba(255,255,255,0.07)" }}
                  >
                    <div className="flex gap-1.5">
                      {["#FF5F57", "#FEBC2E", "#28C840"].map(c => (
                        <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                      ))}
                    </div>
                    <span className="text-[9px] text-white/40 font-mono tracking-wide">
                      DwellIQ Studio · {s.room}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#28C840]" style={{ animation: "pulse 2s ease-in-out infinite" }} />
                      <span className="text-[9px] text-white/40">Live</span>
                    </div>
                  </div>

                  {/* Bottom info — AI chip + dot nav */}
                  <div className="absolute bottom-0 inset-x-0 px-4 pb-4" style={{ zIndex: 10 }}>
                    {/* AI analysis chip — key re-mounts on slide change for fade-in */}
                    <div
                      key={`ai-${active}`}
                      className="flex items-center justify-between rounded-2xl px-4 py-3 mb-3 border"
                      style={{
                        background: "rgba(253,250,246,0.95)",
                        borderColor: "rgba(212,207,200,0.45)",
                        backdropFilter: "blur(12px)",
                        animation: "fadeIn .4s ease both",
                      }}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <div className="w-5 h-5 rounded-full bg-[#C9974A] flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0">
                            AI
                          </div>
                          <span className="text-[10px] font-semibold text-[#0A0908]">{s.style}</span>
                        </div>
                        <p className="text-[10px] text-[#5C5550] leading-none">Budget $4,200 · Balanced · 3 packages</p>
                      </div>
                      <span
                        className="text-[10px] font-bold ml-3 px-2.5 py-1 rounded-full flex-shrink-0"
                        style={{ color: C.sage, background: `${C.sage}18` }}
                      >
                        98%
                      </span>
                    </div>

                    {/* Dot navigation */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-white/50 font-medium">{s.room}</span>
                      <div className="flex items-center gap-1.5">
                        {HERO_ROOM_SLIDES.map((_, di) => (
                          <button
                            key={di}
                            onClick={() => setActive(di)}
                            aria-label={`View ${HERO_ROOM_SLIDES[di].room}`}
                            style={{
                              height: 5,
                              width: di === active ? 22 : 5,
                              borderRadius: 3,
                              background: di === active ? C.brass : "rgba(255,255,255,0.28)",
                              border: "none",
                              padding: 0,
                              cursor: "pointer",
                              transition: "all 0.35s cubic-bezier(.34,1.56,.64,1)",
                              flexShrink: 0,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export default function V6Landing() {
  useSmoothScroll();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeRoom, setActiveRoom] = useState(0);
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "I've analysed your living room. Budget mode: Balanced · $4,200. What would you like to change?" },
  ]);

  const scrollY = useScrollY();
  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const h = () => setMenuOpen(false);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, [menuOpen]);

  const sendAiMessage = () => {
    if (!aiInput.trim()) return;
    const msg = aiInput.trim();
    setAiMessages(prev => [...prev, { role: "user", text: msg }]);
    setAiInput("");
    setTimeout(() => {
      setAiMessages(prev => [...prev, { role: "ai", text: `Understood — optimising the design for "${msg}". Reallocating budget across rooms and updating the 3D view…` }]);
    }, 900);
  };

  const { ref: statsRef, v: statsV } = useIO(0.2);
  const { ref: stepsRef, v: stepsV } = useIO(0.08);
  const { ref: engineRef, v: engineV } = useIO(0.08);
  const { ref: roomsRef, v: roomsV } = useIO(0.05);
  const { ref: studioRef, v: studioV } = useIO(0.1);
  const { ref: mktRef, v: mktV } = useIO(0.08);
  const { ref: locRef, v: locV } = useIO(0.1);
  const { ref: testiRef, v: testiV } = useIO(0.08);

  return (
    <div className="bg-[#FDFAF6] text-[#0A0908] overflow-x-hidden font-[var(--font-dm-sans)]">
      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes clipUp { from{clip-path:polygon(0 100%,100% 100%,100% 100%,0 100%)} to{clip-path:polygon(0 0,100% 0,100% 100%,0 100%)} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.96)} to{opacity:1;transform:scale(1)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes barGrow { from{width:0} to{width:var(--w)} }
        .do-float{animation:float 6s ease-in-out infinite}
        .do-marquee{animation:marquee 36s linear infinite}
        .ul-link::after{content:'';display:block;height:1px;background:${C.brass};transform:scaleX(0);transform-origin:right;transition:transform .3s cubic-bezier(.22,1,.36,1)}
        .ul-link:hover::after{transform:scaleX(1);transform-origin:left}
        .card-lift{transition:box-shadow .35s ease,transform .35s cubic-bezier(.34,1.56,.64,1)}
        .card-lift:hover{box-shadow:0 24px 64px rgba(10,9,8,.10);transform:translateY(-4px)}
        .btn-shimmer{background:linear-gradient(110deg,${C.brass} 30%,${C.brassLight} 50%,${C.brass} 70%);background-size:200% auto;animation:shimmer 3s linear infinite}
        input[type=range]{-webkit-appearance:none;height:3px;border-radius:2px;outline:none}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:${C.brass};cursor:pointer}
        @keyframes filmScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes filmScrollReverse{from{transform:translateX(-50%)}to{transform:translateX(0)}}
        @keyframes kenBurns{0%{transform:scale(1.07) translate(0.8%,0.4%)}100%{transform:scale(1) translate(0,0)}}
        @keyframes progressAdvance{from{width:0%}to{width:100%}}
        @keyframes heroOrb1{0%,100%{transform:translateY(0px) rotate(-3deg) scale(1)}50%{transform:translateY(-14px) rotate(-1.5deg) scale(1.02)}}
        @keyframes heroOrb2{0%,100%{transform:translateY(0px) rotate(4deg) scale(1)}50%{transform:translateY(-10px) rotate(2.5deg) scale(1.015)}}
        @keyframes heroOrb3{0%,100%{transform:translateY(-8px) rotate(-5deg) scale(1.01)}50%{transform:translateY(8px) rotate(-3deg) scale(1)}}
        @keyframes grainShift{0%{transform:translate(0%,0%)}20%{transform:translate(-4%,-3%)}40%{transform:translate(2%,4%)}60%{transform:translate(-3%,1%)}80%{transform:translate(4%,-4%)}100%{transform:translate(0%,0%)}}
        .grain-overlay{background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-repeat:repeat;background-size:180px;animation:grainShift 0.6s steps(1) infinite}
      `}</style>

      {/* Film grain cinematic overlay */}
      <div
        aria-hidden="true"
        className="grain-overlay pointer-events-none fixed inset-0 z-[200]"
        style={{ opacity: 0.032, mixBlendMode: "overlay" as const }}
      />

      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 inset-x-0 z-50 h-16 flex items-center justify-between px-5 sm:px-10 bg-[#FDFAF6]/88 backdrop-blur-xl border-b border-[#D4CFC8]/60">
        <Link href="/" className="font-[var(--font-cormorant)] text-2xl font-light tracking-[.1em] hover:text-[#C9974A] transition-colors">
          dwelliq
        </Link>

        <div className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href} className="text-[11px] text-[#5C5550] ul-link hover:text-[#0A0908] transition-colors tracking-wide">{label}</a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden sm:block text-[11px] text-[#5C5550] hover:text-[#0A0908] transition-colors">Log in</Link>
          <Link href="/signup" className="hidden sm:block border border-[#D4CFC8] text-[11px] px-4 py-2 rounded-full hover:border-[#C9974A] hover:text-[#C9974A] transition-all">Sign up</Link>
          <Link href="/design" className="btn-shimmer text-[#0A0908] text-[11px] font-semibold px-5 py-2.5 rounded-full shadow-lg shadow-[#C9974A]/20">
            Start Designing →
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 text-[#0A0908]" aria-label="Menu">
            {menuOpen
              ? <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              : <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            }
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMenuOpen(false)}>
          <div className="absolute top-16 inset-x-0 bg-[#FDFAF6] border-b border-[#D4CFC8] shadow-2xl px-6 py-5" onClick={e => e.stopPropagation()} style={{ animation: "fadeIn .15s ease both" }}>
            {NAV_LINKS.map(({ label, href }) => (
              <a key={label} href={href} onClick={() => setMenuOpen(false)} className="flex justify-between items-center py-4 text-[#5C5550] border-b border-[#EAE6DF] last:border-0">
                <span className="text-base">{label}</span><span className="text-[#C9974A]">→</span>
              </a>
            ))}
            <Link href="/design" onClick={() => setMenuOpen(false)} className="block text-center mt-5 bg-[#0A0908] text-[#FDFAF6] py-4 rounded-2xl text-sm font-medium">
              Start Designing Free →
            </Link>
          </div>
        </div>
      )}

      {/* ─── HERO ─── */}
      {/* hasHeroVideo drives the entire background strategy:
            true  → full-bleed cinematic video + directional cream overlay
            false → warm gradient (current design, unchanged) */}
      {(() => {
        const hasHeroVideo = !!(HERO_VIDEO_WEBM_URL || HERO_VIDEO_MP4_URL || HERO_VIDEO_POSTER_URL);
        return (
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">

        {hasHeroVideo ? (
          <>
            {/* Full-bleed cinematic video (or poster on mobile / reduced-motion) */}
            <CinematicHeroVideo
              webmSrc={HERO_VIDEO_WEBM_URL}
              mp4Src={HERO_VIDEO_MP4_URL}
              posterSrc={HERO_VIDEO_POSTER_URL}
            />

            {/* ── Directional overlay ──────────────────────────────────────────
                Desktop split:
                  Left half (text):  cream at 95 % → keeps H1/subhead/CTAs
                                     fully readable with existing dark colours.
                  Right half (video): cream fades to transparent → the cinematic
                                     footage shows through beautifully behind the
                                     floating card stack.
                Bottom edge:        subtle dark vignette improves depth.

                On tablet/mobile the gradient is overridden by the full-width
                poster img; the overlay is still applied as a tint for safety. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 z-[1] pointer-events-none"
              style={{
                background: [
                  // Horizontal direction: cream → transparent
                  "linear-gradient(100deg, rgba(253,250,246,.97) 0%, rgba(253,250,246,.90) 38%, rgba(253,250,246,.50) 62%, rgba(253,250,246,.12) 100%)",
                  // Bottom vignette: always-on depth
                  "linear-gradient(to top, rgba(10,9,8,.30) 0%, transparent 35%)",
                ].join(", "),
              }}
            />
          </>
        ) : (
          /* ── Gradient placeholder (no video configured) ── */
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-[#FDFAF6] via-[#F5F2EE] to-[#EAE6DF]" />
            <div
              className="absolute top-0 right-0 w-1/2 h-full opacity-40"
              style={{ background: `radial-gradient(ellipse at 80% 30%, ${C.brassDim} 0%, transparent 60%)` }}
            />
          </>
        )}

        {/* Content sits above both the video (absolute) and the overlay (z-[1]) */}
        <div className="relative z-[2] max-w-7xl mx-auto px-5 sm:px-10 py-16 sm:py-24 grid lg:grid-cols-[1fr_480px] gap-12 lg:gap-16 items-center w-full">

          {/* Left — copy */}
          <div>
            <div style={{ opacity: mounted ? 1 : 0, transition: "opacity .5s .05s" }}>
              <span className="inline-flex items-center gap-2.5 bg-[#FDFAF6] border border-[#D4CFC8] rounded-full px-4 py-2 mb-7">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7A9E8A]" style={{ animation: "pulse 2s ease-in-out infinite" }} />
                <span className="text-[11px] text-[#5C5550] tracking-wide font-medium">AI interior design + cross-room budget optimization</span>
              </span>
            </div>

            <div className="mb-8" style={{ paddingBottom: "0.25em" }}>
              <h1
                className="font-[var(--font-cormorant)] font-light text-[#0A0908] leading-tight"
                style={{
                  fontSize: "clamp(48px,5.8vw,80px)",
                  animation: mounted ? "clipUp 1.1s .12s cubic-bezier(.77,0,.175,1) both" : "none",
                  opacity: mounted ? 1 : 0,
                }}
              >
                Design every <em style={{ color: C.brass }}>room,</em>
                <br />optimise one <em style={{ color: C.terra }}>budget.</em>
              </h1>
            </div>

            <p style={{ opacity: mounted ? 1 : 0, transition: "opacity .6s .45s" }} className="text-[#5C5550] text-base sm:text-lg leading-relaxed max-w-lg mb-8">
              Upload your room photos, set a budget mode — <strong className="text-[#0A0908]">fixed, flexible, or time-constrained</strong> — and let our AI generate three complete design packages with 3D previews and an instant shopping list. Your location shapes product availability, delivery, and style.
            </p>

            <div style={{ opacity: mounted ? 1 : 0, transition: "opacity .5s .6s" }} className="flex flex-wrap gap-3 mb-7">
              <Link href="/design" className="btn-shimmer text-[#0A0908] font-semibold px-8 py-4 rounded-2xl text-sm shadow-xl shadow-[#C9974A]/25 flex items-center gap-2">
                Upload Your Room →
              </Link>
              <a href="#how-it-works" className="border border-[#D4CFC8] text-[#5C5550] px-7 py-4 rounded-2xl text-sm hover:border-[#C9974A] hover:text-[#C9974A] transition-all">
                See How It Works
              </a>
            </div>

            <div style={{ opacity: mounted ? 1 : 0, transition: "opacity .5s .75s" }} className="flex flex-wrap gap-2">
              {[{ label: "Budget-Friendly", bg: C.sageDim, color: C.sage }, { label: "Balanced", bg: C.brassDim, color: C.brass }, { label: "Premium Upgrade", bg: C.terraDim, color: C.terra }].map(m => (
                <span key={m.label} className="text-[11px] font-medium px-3.5 py-1.5 rounded-full" style={{ background: m.bg, color: m.color }}>{m.label}</span>
              ))}
            </div>
          </div>

          {/* Right — cinema viewer */}
          <div
            className="hidden md:block"
            style={{
              opacity: mounted ? 1 : 0,
              animation: mounted ? "scaleIn .9s .4s both" : "none",
              transform: `translateY(${scrollY * -0.1}px)`,
            }}
          >
            <HeroDeckViewer />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-30">
          <div className="w-5 h-8 rounded-full border border-[#5C5550] flex justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-[#C9974A]" style={{ animation: "float 1.5s ease-in-out infinite" }} />
          </div>
        </div>
      </section>
        ); // end IIFE return
      })()}

      {/* ─── TRUST MARQUEE ─── */}
      <div className="border-y border-[#D4CFC8] py-4 overflow-hidden bg-[#F5F2EE]">
        <div className="flex do-marquee whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex flex-shrink-0">
              {["Upload a photo · get a plan", "3D walkthrough before you buy", "Cross-room budget optimization", "Local vendors · fast delivery", "7 design styles · 200+ products", "AI-powered · always free to start", "Used by designers & homeowners"].map((t, j) => (
                <span key={j} className="inline-flex items-center gap-4 text-[10px] tracking-[.18em] uppercase text-[#5C5550] px-8">
                  {t}<span className="text-[#C9974A]">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ─── PRESS + STATS ─── */}
      <div ref={statsRef} className="max-w-7xl mx-auto px-5 sm:px-10 py-16 sm:py-24">
        {/* Press logos */}
        <div className="flex flex-wrap items-center justify-center gap-8 mb-16 pb-12 border-b border-[#EAE6DF]">
          <p className="w-full text-center text-[10px] tracking-[.2em] uppercase text-[#9C948C] mb-2">Trusted by designers, homeowners, and renters</p>
          {PRESS.map(p => (
            <span key={p.name} className="font-[var(--font-cormorant)] text-lg font-light tracking-wider text-[#9C948C] hover:text-[#5C5550] transition-colors select-none cursor-default">{p.name}</span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { end: 24000, suffix: "+", label: "Rooms designed", color: C.brass },
            { end: 7, suffix: "", label: "Style families", color: C.sage },
            { end: 200, suffix: "+", label: "Products in catalog", color: C.terra },
            { end: 2, suffix: " min", label: "Avg. time to first design", color: C.blue },
          ].map((s, i) => (
            <div key={s.label} className="text-center" style={{ opacity: statsV ? 1 : 0, transition: `opacity .5s ${i * .08}s` }}>
              <div className="font-[var(--font-cormorant)] font-light leading-none mb-2 whitespace-nowrap" style={{ fontSize: "clamp(40px,6vw,80px)", color: s.color }}>
                <CountUp end={s.end} trigger={statsV} suffix={s.suffix} />
              </div>
              <p className="text-[11px] tracking-wider uppercase text-[#9C948C]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-24 sm:py-36 px-5 sm:px-10 bg-[#F5F2EE]">
        <div className="max-w-7xl mx-auto">
          <SectionHeader label="How it works" title="From photo to furnished." subtitle="Four steps from a raw photo to a fully specified, budget-optimised design with 3D preview and shopping list." />

          <div ref={stepsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
            {[
              { num: "01", color: C.sage, icon: "📸", title: "Upload your room", desc: "Share photos and tell us your property type, rooms, and basic dimensions. Our vision model reads the space." },
              { num: "02", color: C.brass, icon: "✦", title: "Set budget mode", desc: "Choose Fixed, Flexible, or Time-Constrained. Add style preferences, hard constraints, and your ZIP code." },
              { num: "03", color: C.terra, icon: "◈", title: "Engine optimises", desc: "The cross-room allocation engine balances furniture, lighting, decor, and storage across your entire property." },
              { num: "04", color: C.blue, icon: "◎", title: "Get 3 packages", desc: "Budget-Friendly, Balanced, and Premium. Each includes a 2D plan, 3D walkthrough, and direct shopping links." },
            ].map((s, i) => (
              <div
                key={s.num}
                className="relative bg-[#FDFAF6] border border-[#D4CFC8] rounded-2xl overflow-hidden p-7 card-lift"
                style={{ opacity: stepsV ? 1 : 0, transition: `opacity .5s ${i * .1}s` }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-5" style={{ background: `${s.color}18` }}>{s.icon}</div>
                <div className="font-[var(--font-cormorant)] text-5xl font-light mb-3 select-none" style={{ color: `${s.color}25` }}>{s.num}</div>
                <h3 className="font-[var(--font-cormorant)] text-2xl font-light text-[#0A0908] mb-2">{s.title}</h3>
                <p className="text-sm text-[#5C5550] leading-relaxed">{s.desc}</p>
                <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, ${s.color}80, transparent)` }} />
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/design" className="inline-flex items-center gap-2 bg-[#0A0908] text-[#FDFAF6] px-8 py-4 rounded-2xl text-sm font-medium hover:bg-[#C9974A] hover:text-[#0A0908] transition-colors">
              Start Designing Free →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CINEMATIC FILM STRIP ─── */}
      <CinematicFilmStrip />

      {/* ─── BUDGET ENGINE ─── */}
      <section className="py-24 sm:py-36 px-5 sm:px-10">
        <div className="max-w-7xl mx-auto">
          <SectionHeader label="The engine" title="Dynamic Cross-Room Optimization." subtitle="A patent-grade allocation engine that balances your entire home's budget across rooms, categories, and constraints simultaneously." />

          <div ref={engineRef} className="mt-14 grid lg:grid-cols-[1fr_auto_1fr] gap-5 lg:gap-8 items-stretch">

            {/* Inputs */}
            <div className="bg-[#F5F2EE] border border-[#D4CFC8] rounded-2xl p-6 sm:p-8" style={{ opacity: engineV ? 1 : 0, transition: "opacity .5s" }}>
              <p className="text-[10px] font-semibold tracking-[.18em] uppercase text-[#9C948C] mb-5">Inputs</p>
              <div className="space-y-4">
                {ENGINE_INPUTS.map((inp, i) => (
                  <div key={inp.label} className="flex items-start gap-4 p-4 bg-[#FDFAF6] rounded-xl border border-[#EAE6DF]" style={{ opacity: engineV ? 1 : 0, transition: `opacity .4s ${i * .08}s` }}>
                    <span className="text-xl flex-shrink-0">{inp.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-[#0A0908]">{inp.label}</p>
                      <p className="text-[11px] text-[#9C948C] mt-0.5">{inp.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Engine box */}
            <div className="flex flex-col items-center justify-center gap-4 py-6" style={{ opacity: engineV ? 1 : 0, transition: "opacity .5s .15s" }}>
              <div className="hidden lg:block w-px h-16 bg-[#D4CFC8]" />
              <div className="bg-[#0A0908] text-[#FDFAF6] rounded-2xl p-6 text-center min-w-[160px]">
                <div className="text-2xl mb-2">◈</div>
                <p className="font-[var(--font-cormorant)] text-xl font-light">Optimization<br />Engine</p>
                <p className="text-[10px] text-[#FDFAF6]/40 mt-2 tracking-wider uppercase">AI · Budget allocation<br />Location enrichment</p>
              </div>
              <div className="hidden lg:block w-px h-16 bg-[#D4CFC8]" />
            </div>

            {/* Outputs */}
            <div className="bg-[#F5F2EE] border border-[#D4CFC8] rounded-2xl p-6 sm:p-8" style={{ opacity: engineV ? 1 : 0, transition: "opacity .5s .25s" }}>
              <p className="text-[10px] font-semibold tracking-[.18em] uppercase text-[#9C948C] mb-5">Design packages</p>
              <div className="space-y-4">
                {ENGINE_OUTPUTS.map((out, i) => (
                  <div key={out.label} className="p-4 bg-[#FDFAF6] rounded-xl border border-[#EAE6DF]" style={{ opacity: engineV ? 1 : 0, transition: `opacity .4s ${.3 + i * .1}s` }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-[#0A0908]">{out.label}</span>
                      <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full" style={{ background: `${out.color}18`, color: out.color }}>{out.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-[#EAE6DF] rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full rounded-full"
                        style={{ width: engineV ? `${out.pct}%` : "0%", background: out.color, transition: `width .8s cubic-bezier(.22,1,.36,1) ${.4 + i * .12}s` }}
                      />
                    </div>
                    <p className="text-[11px] text-[#9C948C]">{out.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 p-4 bg-[#C9974A]/10 rounded-xl border border-[#C9974A]/30">
                <p className="text-[11px] text-[#C9974A] font-medium">Each package includes per-room allocations across furniture, lighting, textiles, storage, and décor — with live recalculation as you change any constraint.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ROOM + STYLE EXPLORER ─── */}
      <section id="rooms" className="py-24 sm:py-36 px-5 sm:px-10 bg-[#F5F2EE]">
        <div className="max-w-7xl mx-auto">
          <SectionHeader label="Room & style explorer" title="Find your space." subtitle="Browse by room type and design style. Every combination generates a unique set of constraints and recommendations." />

          {/* Room tabs */}
          <div ref={roomsRef} className="mt-12" style={{ opacity: roomsV ? 1 : 0, transition: "opacity .5s" }}>
            <div className="flex gap-2 overflow-x-auto pb-3 mb-6" style={{ scrollbarWidth: "none" }}>
              {ROOM_TABS.map((r, i) => (
                <button
                  key={r.id}
                  onClick={() => setActiveRoom(i)}
                  className="flex-shrink-0 text-[11px] font-medium px-5 py-2.5 rounded-full transition-all"
                  style={activeRoom === i ? { background: C.ink, color: "#FDFAF6" } : { background: "#FDFAF6", color: C.mid, border: `1px solid ${C.border}` }}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <div className="grid lg:grid-cols-[1fr_320px] gap-6 rounded-3xl overflow-hidden border border-[#D4CFC8]">
              <div className="relative" style={{ minHeight: 320 }}>
                <Image key={activeRoom} src={ROOM_TABS[activeRoom].img} alt={ROOM_TABS[activeRoom].label} fill className="object-cover" unoptimized style={{ animation: "kenBurns 10s ease-out forwards" }} />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A0908]/30 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="font-[var(--font-cormorant)] text-3xl font-light text-[#FDFAF6] mb-2">{ROOM_TABS[activeRoom].label}</h3>
                  <Link href="/studio" className="inline-flex items-center gap-2 bg-[#FDFAF6]/90 text-[#0A0908] text-[11px] font-semibold px-4 py-2 rounded-full hover:bg-[#C9974A] hover:text-[#FDFAF6] transition-colors">
                    See this in 3D Studio →
                  </Link>
                </div>
              </div>
              <div className="bg-[#FDFAF6] p-7">
                <p className="text-[10px] font-semibold tracking-[.18em] uppercase text-[#9C948C] mb-4">Design principles</p>
                <ul className="space-y-3">
                  {ROOM_TABS[activeRoom].principles.map(p => (
                    <li key={p} className="flex gap-3 text-sm text-[#5C5550]">
                      <span className="text-[#C9974A] flex-shrink-0 mt-0.5">·</span>{p}
                    </li>
                  ))}
                </ul>
                <Link href="/design" className="mt-7 block text-center bg-[#0A0908] text-[#FDFAF6] py-3.5 rounded-xl text-sm font-medium hover:bg-[#C9974A] hover:text-[#0A0908] transition-colors">
                  Design this room →
                </Link>
              </div>
            </div>
          </div>

          {/* Style cards */}
          <div className="mt-14">
            <p className="text-[10px] font-semibold tracking-[.18em] uppercase text-[#9C948C] mb-6">Seven style families</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {STYLES.map((s) => <StyleCard key={s.name} style={s} />)}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3D STUDIO ─── */}
      <section id="studio" className="py-24 sm:py-36 px-5 sm:px-10">
        <div className="max-w-7xl mx-auto">
          <div ref={studioRef} className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div style={{ opacity: studioV ? 1 : 0, transition: "opacity .5s" }}>
              <span className="inline-block text-[10px] font-semibold tracking-[.18em] uppercase text-[#7A9E8A] mb-4">3D Room Studio</span>
              <h2 className="font-[var(--font-cormorant)] text-5xl sm:text-6xl font-light text-[#0A0908] leading-tight mb-6">
                Walk through your
                <br /><em style={{ color: C.brass }}>design</em> before
                <br />you buy anything.
              </h2>
              <p className="text-[#5C5550] leading-relaxed mb-8 max-w-md">
                Our WebGL-powered studio renders your room in real-time 3D. Drag and drop products from the marketplace, switch styles with one click, and preview in VR via WebXR on any headset.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { icon: "⬡", title: "Orbit & walkthrough camera", desc: "Explore from any angle — top-down floorplan or first-person walk" },
                  { icon: "⊞", title: "Drag-and-drop placement", desc: "Products snap to scale with collision detection and fit hints" },
                  { icon: "◈", title: "Live AI updates", desc: "Tell the assistant to change style or budget — the 3D updates instantly" },
                  { icon: "◎", title: "VR mode via WebXR", desc: "Put on a headset and walk through your design before purchasing" },
                ].map(f => (
                  <div key={f.title} className="flex gap-4">
                    <span className="text-lg text-[#C9974A] flex-shrink-0 mt-0.5">{f.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-[#0A0908]">{f.title}</p>
                      <p className="text-[11px] text-[#9C948C] mt-0.5">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/studio" className="inline-flex items-center gap-2 bg-[#0A0908] text-[#FDFAF6] px-8 py-4 rounded-2xl text-sm font-medium hover:bg-[#C9974A] hover:text-[#0A0908] transition-colors">
                Open in 3D Studio →
              </Link>
            </div>

            {/* 3D Studio mockup */}
            <div style={{ opacity: studioV ? 1 : 0, transition: "opacity .6s .15s" }}>
              <div className="relative rounded-3xl overflow-hidden border border-[#D4CFC8] shadow-2xl shadow-[#0A0908]/10 bg-[#1C1A17]">
                {/* Studio chrome bar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                  <div className="flex gap-1.5">
                    {["#EF4444","#F59E0B","#10B981"].map(c => <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />)}
                  </div>
                  <span className="text-[10px] text-white/40 font-mono">DwellIQ 3D Studio — Living Room</span>
                  <div className="flex gap-3">
                    {["2D","3D","VR"].map(v => (
                      <span key={v} className={`text-[10px] px-2 py-0.5 rounded ${v === "3D" ? "bg-[#C9974A] text-[#0A0908] font-semibold" : "text-white/40"}`}>{v}</span>
                    ))}
                  </div>
                </div>

                {/* Room preview */}
                <div className="relative" style={{ aspectRatio: "16/10" }}>
                  <Image src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80" alt="3D room preview" fill className="object-cover opacity-80" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1C1A17]/60" />

                  {/* Floating annotations */}
                  <div className="absolute top-4 right-4 bg-[#FDFAF6]/90 rounded-xl p-3 text-xs max-w-[140px]">
                    <p className="font-semibold text-[#0A0908]">Rivet Sofa</p>
                    <p className="text-[#5C5550]">$799 · Fits ✓</p>
                    <p className="text-[#7A9E8A] text-[10px]">3 days delivery</p>
                  </div>

                  {/* Camera controls hint */}
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    {["Orbit","Pan","Zoom"].map(c => (
                      <span key={c} className="text-[10px] bg-[#0A0908]/60 text-white px-2.5 py-1 rounded-full">{c}</span>
                    ))}
                  </div>
                </div>

                {/* Bottom toolbar */}
                <div className="flex items-center gap-3 px-4 py-3 border-t border-white/10 overflow-x-auto">
                  {["Sofa","Rug","Lamp","Chair","Table","Art"].map(item => (
                    <span key={item} className="flex-shrink-0 text-[10px] bg-white/10 text-white/70 px-3 py-1.5 rounded-full cursor-pointer hover:bg-[#C9974A]/30 hover:text-[#C9974A] transition-colors">{item}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI Assistant embed */}
          <div className="mt-16 grid lg:grid-cols-2 gap-12 items-center">
            {/* AI chat mockup */}
            <div style={{ opacity: studioV ? 1 : 0, transition: "opacity .5s .3s" }}>
              <div className="bg-[#F5F2EE] border border-[#D4CFC8] rounded-3xl overflow-hidden shadow-lg">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-[#EAE6DF] bg-[#FDFAF6]">
                  <div className="w-8 h-8 rounded-full bg-[#C9974A] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">AI</div>
                  <div>
                    <p className="text-sm font-semibold text-[#0A0908]">DwellIQ Design Assistant</p>
                    <p className="text-[10px] text-[#7A9E8A]">Understands your room · budget · style</p>
                  </div>
                </div>

                <div className="p-5 space-y-3 min-h-[220px]">
                  {aiMessages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-snug ${m.role === "user" ? "bg-[#0A0908] text-[#FDFAF6]" : "bg-[#FDFAF6] border border-[#EAE6DF] text-[#0A0908]"}`}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 px-4 pb-4">
                  <input
                    value={aiInput}
                    onChange={e => setAiInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendAiMessage()}
                    placeholder="e.g. Stay under $5,000 · Go more Japandi · Add storage…"
                    className="flex-1 bg-[#FDFAF6] border border-[#D4CFC8] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C9974A] transition-colors placeholder:text-[#9C948C]"
                  />
                  <button onClick={sendAiMessage} className="bg-[#C9974A] text-[#0A0908] px-4 py-3 rounded-xl font-semibold text-sm hover:bg-[#D4A96A] transition-colors">→</button>
                </div>

                <div className="px-4 pb-4 flex flex-wrap gap-1.5">
                  {["More Japandi", "Add storage", "Stay under $5k", "Change the sofa"].map(s => (
                    <button key={s} onClick={() => { setAiInput(s); }} className="text-[10px] px-3 py-1.5 bg-[#EAE6DF] rounded-full text-[#5C5550] hover:bg-[#C9974A]/15 hover:text-[#C9974A] transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ opacity: studioV ? 1 : 0, transition: "opacity .5s .4s" }}>
              <span className="inline-block text-[10px] font-semibold tracking-[.18em] uppercase text-[#C4735A] mb-4">In-room AI assistant</span>
              <h3 className="font-[var(--font-cormorant)] text-4xl sm:text-5xl font-light text-[#0A0908] leading-tight mb-4">
                Talk to your
                <br /><em style={{ color: C.terra }}>designer.</em>
              </h3>
              <p className="text-[#5C5550] leading-relaxed mb-6">The assistant lives inside the 3D Studio and understands your room, budget mode, and current selections. Natural language commands instantly re-optimise the engine and update the 3D view with visual highlights showing what changed.</p>
              <div className="space-y-3">
                {[
                  "Optimise for more storage",
                  "Keep this sofa, change everything else",
                  "Make it more Japandi but stay under $5,000",
                  "Show me a premium upgrade for the bedroom only",
                ].map(cmd => (
                  <div key={cmd} className="flex items-center gap-3 text-sm text-[#5C5550]">
                    <span className="text-[#C4735A]">→</span><span>"{cmd}"</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MARKETPLACE ─── */}
      <section id="marketplace" className="py-24 sm:py-36 px-5 sm:px-10 bg-[#F5F2EE]">
        <div className="max-w-7xl mx-auto">
          <SectionHeader label="Marketplace" title="Every product, scored for your room." subtitle='Filters by room type, style, price, delivery time, and "near me". Every card shows a match score, fit indicator, and delivery estimate.' />

          {/* Filter chips */}
          <div ref={mktRef} className="flex flex-wrap gap-2 mt-10 mb-8" style={{ opacity: mktV ? 1 : 0, transition: "opacity .4s" }}>
            {["All", "Sofas", "Rugs", "Lighting", "Tables", "Storage", "Near me", "Under $500", "Premium"].map((f, i) => (
              <button key={f} className="text-[11px] px-4 py-2 rounded-full border transition-all" style={{ borderColor: i === 0 ? C.ink : C.border, background: i === 0 ? C.ink : "transparent", color: i === 0 ? "#FDFAF6" : C.mid }}>
                {f}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{ opacity: mktV ? 1 : 0, transition: "opacity .5s .1s" }}>
            {PRODUCTS.map((p, i) => (
              <div key={p.name} className="bg-[#FDFAF6] border border-[#D4CFC8] rounded-2xl overflow-hidden card-lift" style={{ opacity: mktV ? 1 : 0, transition: `opacity .4s ${i * .07}s` }}>
                <div className="relative" style={{ aspectRatio: "4/3" }}>
                  <Image src={p.img} alt={p.name} fill className="object-cover" unoptimized />
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                    {p.tags.map(t => <span key={t} className="text-[9px] font-semibold bg-[#FDFAF6]/90 text-[#0A0908] px-2 py-0.5 rounded-full">{t}</span>)}
                  </div>
                  <div className="absolute top-2.5 right-2.5 bg-[#C9974A] text-[#0A0908] text-[10px] font-bold px-2 py-0.5 rounded-full">{p.match}%</div>
                </div>
                <div className="p-4">
                  <p className="text-xs font-semibold text-[#0A0908] leading-snug mb-0.5">{p.name}</p>
                  <p className="text-[10px] text-[#9C948C] mb-2">{p.retailer} · {p.style}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-[var(--font-cormorant)] text-xl text-[#0A0908]">${p.price.toLocaleString()}</span>
                    <span className="text-[10px] text-[#7A9E8A]">🚚 {p.delivery}</span>
                  </div>
                  <Link href="/studio" className="block text-center text-[10px] font-semibold py-2 rounded-lg bg-[#F5F2EE] hover:bg-[#C9974A] hover:text-[#0A0908] transition-colors text-[#5C5550]">
                    See in my room →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/marketplace" className="inline-flex items-center gap-2 border border-[#D4CFC8] text-[#5C5550] px-7 py-3.5 rounded-2xl text-sm hover:border-[#C9974A] hover:text-[#C9974A] transition-all">
              Browse full catalog — 200+ products →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── LOCATION ─── */}
      <section className="py-24 sm:py-36 px-5 sm:px-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div ref={locRef} style={{ opacity: locV ? 1 : 0, transition: "opacity .5s" }}>
            <span className="inline-block text-[10px] font-semibold tracking-[.18em] uppercase text-[#4A6A8A] mb-4">Location intelligence</span>
            <h2 className="font-[var(--font-cormorant)] text-5xl sm:text-6xl font-light text-[#0A0908] leading-tight mb-6">
              Your ZIP code
              <br /><em style={{ color: C.blue }}>shapes</em> your design.
            </h2>
            <p className="text-[#5C5550] leading-relaxed mb-7">
              We geocode your address to lat/long and enrich it with regional climate, local retail inventory, and logistics data. Style and material suggestions adapt to where you live. Delivery estimates are real.
            </p>
            <div className="space-y-4">
              {[
                { label: "Local vendor discovery", desc: "Showrooms and boutiques near your postcode surface in every design package" },
                { label: "Climate-aware materials", desc: "Humid climates get moisture-resistant recommendations; cold climates get insulating textiles" },
                { label: "Real delivery windows", desc: "Google Maps distance matrix gives accurate lead times per product and retailer" },
                { label: "Service radius map", desc: "A live map shows your property, available vendors, and delivery reach" },
              ].map(f => (
                <div key={f.label} className="flex gap-4 p-4 bg-[#F5F2EE] rounded-xl border border-[#EAE6DF]">
                  <span className="text-[#4A6A8A] mt-0.5 flex-shrink-0">◎</span>
                  <div>
                    <p className="text-sm font-semibold text-[#0A0908]">{f.label}</p>
                    <p className="text-[11px] text-[#9C948C] mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map mockup */}
          <div style={{ opacity: locV ? 1 : 0, transition: "opacity .6s .15s" }}>
            <div className="relative rounded-3xl overflow-hidden border border-[#D4CFC8] shadow-xl" style={{ aspectRatio: "1" }}>
              <Image src="https://images.unsplash.com/photo-1569336415962-a4bd9f69c054?w=700&q=80" alt="Map" fill className="object-cover opacity-30" unoptimized />
              <div className="absolute inset-0 bg-gradient-to-b from-[#EAE6DF] to-[#D4CFC8]" style={{ opacity: .7 }} />

              {/* Simulated map pins */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* Center pin */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-[#C9974A] border-2 border-[#FDFAF6] shadow-lg" style={{ animation: "pulse 2s ease-in-out infinite" }} />
                    <div className="mt-1 bg-[#FDFAF6] rounded-lg px-3 py-1.5 text-[10px] font-semibold text-[#0A0908] shadow whitespace-nowrap">Your property</div>
                  </div>
                  {/* Vendor pins */}
                  {[
                    { top: "30%", left: "30%", label: "Design Nest · 1.2 mi" },
                    { top: "65%", left: "62%", label: "Haven Home · 2.4 mi" },
                    { top: "40%", left: "68%", label: "West Elm · 3.1 mi" },
                  ].map(pin => (
                    <div key={pin.label} className="absolute flex flex-col items-center" style={{ top: pin.top, left: pin.left }}>
                      <div className="w-3.5 h-3.5 rounded-full bg-[#7A9E8A] border-2 border-[#FDFAF6] shadow" />
                      <div className="mt-1 bg-[#FDFAF6]/90 rounded-md px-2 py-1 text-[9px] text-[#0A0908] shadow whitespace-nowrap">{pin.label}</div>
                    </div>
                  ))}
                  {/* Radius circle hint */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#C9974A]/40" style={{ width: 180, height: 180 }} />
                </div>
              </div>

              {/* Info panel */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#FDFAF6]/95 rounded-2xl p-4 border border-[#D4CFC8]">
                <p className="text-[10px] tracking-wider uppercase text-[#9C948C] mb-2">Jersey City, NJ 07302</p>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div><p className="font-[var(--font-cormorant)] text-xl text-[#C9974A]">3</p><p className="text-[9px] text-[#9C948C]">local vendors</p></div>
                  <div><p className="font-[var(--font-cormorant)] text-xl text-[#7A9E8A]">2 mi</p><p className="text-[9px] text-[#9C948C]">avg. showroom</p></div>
                  <div><p className="font-[var(--font-cormorant)] text-xl text-[#0A0908]">3 days</p><p className="text-[9px] text-[#9C948C]">avg. delivery</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── RECOMMENDATIONS PREVIEW ─── */}
      <section className="py-24 sm:py-36 px-5 sm:px-10 bg-[#F5F2EE]">
        <div className="max-w-5xl mx-auto">
          <SectionHeader label="Your project" title="Three packages. Every piece." subtitle="Budget-Friendly, Balanced, and Premium — each with a 2D plan, 3D walkthrough, and per-item shopping list." />

          <div className="mt-12 rounded-3xl border border-[#D4CFC8] overflow-hidden shadow-xl bg-[#FDFAF6]">
            {/* Sticky project header mockup */}
            <div className="px-6 py-4 border-b border-[#EAE6DF] flex flex-wrap items-center gap-4">
              <p className="font-[var(--font-cormorant)] text-xl font-light">Rivera Apartment — 3 rooms</p>
              <span className="text-[10px] font-semibold bg-[#C9974A]/15 text-[#C9974A] px-3 py-1 rounded-full">Balanced · $4,200</span>
              <div className="ml-auto flex-1 max-w-[200px]">
                <div className="flex justify-between text-[10px] text-[#9C948C] mb-1"><span>Budget used</span><span>72%</span></div>
                <div className="h-1.5 bg-[#EAE6DF] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-[#C9974A]" style={{ width: "72%" }} />
                </div>
              </div>
              <Link href="/studio" className="flex-shrink-0 text-[11px] bg-[#0A0908] text-[#FDFAF6] px-4 py-2 rounded-xl hover:bg-[#C9974A] hover:text-[#0A0908] transition-colors">Open in 3D →</Link>
            </div>

            {/* Package toggle */}
            <div className="grid sm:grid-cols-3 gap-4 p-6">
              {ENGINE_OUTPUTS.map(pkg => (
                <div key={pkg.label} className={`p-5 rounded-2xl border transition-all cursor-pointer ${pkg.label === "Balanced" ? "border-[#C9974A] bg-[#C9974A]/5" : "border-[#EAE6DF] hover:border-[#D4CFC8]"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-[#0A0908]">{pkg.label}</span>
                    {pkg.label === "Balanced" && <span className="text-[9px] font-semibold bg-[#C9974A] text-[#0A0908] px-2 py-0.5 rounded-full">Recommended</span>}
                  </div>
                  <p className="font-[var(--font-cormorant)] text-2xl text-[#0A0908] mb-1">{pkg.desc.split(" ")[0]}</p>
                  <p className="text-[11px] text-[#9C948C]">{pkg.desc.split("—")[1]?.trim()}</p>
                  <div className="mt-3 h-1 bg-[#EAE6DF] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pkg.pct}%`, background: pkg.color }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Sample product cards */}
            <div className="grid sm:grid-cols-3 gap-4 px-6 pb-6">
              {[
                { cat: "Sofa", name: "Rivet Revolve", price: "$799", retailer: "Amazon", alloc: "35%", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80" },
                { cat: "Rug", name: "Jaipur Braid", price: "$449", retailer: "Wayfair", alloc: "15%", img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&q=80" },
                { cat: "Lighting", name: "Arco Lamp", price: "$380", retailer: "Lumens", alloc: "12%", img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&q=80" },
              ].map(item => (
                <div key={item.cat} className="relative bg-[#F5F2EE] rounded-2xl overflow-hidden border border-[#EAE6DF]">
                  <div className="relative h-32">
                    <Image src={item.img} alt={item.name} fill className="object-cover" unoptimized />
                    <span className="absolute top-2 left-2 text-[9px] font-semibold bg-[#FDFAF6]/90 text-[#0A0908] px-2 py-0.5 rounded-full">{item.cat} · {item.alloc}</span>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-semibold text-[#0A0908]">{item.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-[var(--font-cormorant)] text-lg text-[#C9974A]">{item.price}</span>
                      <span className="text-[10px] text-[#9C948C]">{item.retailer}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-24 sm:py-32 px-5 sm:px-10">
        <div ref={testiRef} className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div style={{ opacity: testiV ? 1 : 0, transition: "opacity .5s" }}>
              <p className="text-[10px] font-semibold tracking-[.18em] uppercase text-[#C9974A] mb-3">Real results</p>
              <h2 className="font-[var(--font-cormorant)] text-5xl sm:text-6xl font-light text-[#0A0908]">What they say.</h2>
            </div>
            <Link href="/design" className="hidden sm:flex items-center gap-2 text-sm text-[#5C5550] ul-link hover:text-[#0A0908] transition-colors" style={{ opacity: testiV ? 1 : 0, transition: "opacity .5s .1s" }}>
              Join 24,000+ homeowners — it&apos;s free →
            </Link>
          </div>

          {/* Featured quote */}
          <div className="bg-[#0A0908] rounded-3xl p-8 sm:p-14 mb-5 relative overflow-hidden" style={{ opacity: testiV ? 1 : 0, transition: "opacity .5s .15s" }}>
            <div className="absolute top-4 left-8 font-[var(--font-cormorant)] text-[100px] leading-none text-white/04 select-none">"</div>
            <div className="relative z-10 flex flex-col sm:flex-row gap-10 items-start">
              <div className="flex-1">
                <div className="flex gap-1 mb-5">{[...Array(5)].map((_, j) => <svg key={j} width="13" height="13" viewBox="0 0 13 13" fill="#C9974A"><path d="M6.5 1l1.4 2.8 3.1.5-2.3 2.2.6 3.1L6.5 8.1 3.7 9.6l.6-3.1L2 3.3l3.1-.5L6.5 1z"/></svg>)}</div>
                <p className="font-[var(--font-cormorant)] text-2xl sm:text-3xl font-light text-[#FDFAF6] leading-relaxed mb-6 italic">
                  &ldquo;{TESTIMONIALS[0].quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-[#FDFAF6] flex-shrink-0" style={{ background: TESTIMONIALS[0].color }}>{TESTIMONIALS[0].initials}</div>
                  <div>
                    <p className="text-[#FDFAF6] text-sm font-medium">{TESTIMONIALS[0].name}</p>
                    <p className="text-[#FDFAF6]/40 text-xs">{TESTIMONIALS[0].role}</p>
                  </div>
                </div>
              </div>
              {TESTIMONIALS[0].saved && (
                <div className="hidden sm:flex flex-col gap-3 flex-shrink-0">
                  <div className="text-center p-5 rounded-2xl border border-[#FDFAF6]/10">
                    <p className="font-[var(--font-cormorant)] text-3xl text-[#C9974A]">{TESTIMONIALS[0].saved}</p>
                    <p className="text-[10px] text-[#FDFAF6]/40 uppercase tracking-wider mt-1">saved vs. designer</p>
                  </div>
                  <div className="text-center p-5 rounded-2xl border border-[#FDFAF6]/10">
                    <p className="font-[var(--font-cormorant)] text-3xl text-[#FDFAF6]">3 rooms</p>
                    <p className="text-[10px] text-[#FDFAF6]/40 uppercase tracking-wider mt-1">one budget</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Secondary quotes */}
          <div className="grid sm:grid-cols-2 gap-5">
            {TESTIMONIALS.slice(1).map((t, i) => (
              <div key={t.name} className="bg-[#F5F2EE] border border-[#D4CFC8] rounded-2xl p-7 card-lift" style={{ opacity: testiV ? 1 : 0, transition: `opacity .5s ${.25 + i * .1}s` }}>
                <div className="flex gap-0.5 mb-4">{[...Array(5)].map((_, j) => <svg key={j} width="11" height="11" viewBox="0 0 11 11" fill="#C9974A"><path d="M5.5 1l1.2 2.4L9.5 4 7.5 6l.4 2.7L5.5 7.4 3.1 8.7l.4-2.7L1.5 4l2.8-.6L5.5 1z"/></svg>)}</div>
                <p className="text-[#5C5550] text-sm leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-[#FDFAF6] flex-shrink-0" style={{ background: t.color }}>{t.initials}</div>
                  <div>
                    <p className="text-[#0A0908] text-sm font-medium">{t.name}</p>
                    <p className="text-[#9C948C] text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING TEASER ─── */}
      <section id="pricing" className="py-24 sm:py-36 px-5 sm:px-10 bg-[#F5F2EE]">
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeader label="Pricing" title="Start free. Always." subtitle="DwellIQ is free for homeowners. Our affiliate model means we earn when you purchase — so there's never a subscription or paymall." />
          <div className="grid sm:grid-cols-3 gap-5 mt-12">
            {[
              { plan: "Free", price: "$0", desc: "1 room · 1 design package · Basic 3D view", cta: "Start for free", primary: false },
              { plan: "Pro", price: "$19/mo", desc: "Unlimited rooms · All 3 packages · Full 3D Studio · AI assistant", cta: "Try Pro free", primary: true },
              { plan: "Studio", price: "$49/mo", desc: "Team access · Client projects · White-label exports · Priority support", cta: "Contact sales", primary: false },
            ].map(p => (
              <div key={p.plan} className={`rounded-3xl border p-7 text-left ${p.primary ? "bg-[#0A0908] border-[#0A0908]" : "bg-[#FDFAF6] border-[#D4CFC8]"}`}>
                <p className={`text-[11px] font-semibold tracking-wider uppercase mb-3 ${p.primary ? "text-[#C9974A]" : "text-[#9C948C]"}`}>{p.plan}</p>
                <p className={`font-[var(--font-cormorant)] text-4xl font-light mb-3 ${p.primary ? "text-[#FDFAF6]" : "text-[#0A0908]"}`}>{p.price}</p>
                <p className={`text-sm leading-relaxed mb-7 ${p.primary ? "text-[#FDFAF6]/60" : "text-[#5C5550]"}`}>{p.desc}</p>
                <Link href="/design" className={`block text-center py-3 rounded-xl text-sm font-medium transition-colors ${p.primary ? "bg-[#C9974A] text-[#0A0908] hover:bg-[#D4A96A]" : "border border-[#D4CFC8] text-[#5C5550] hover:border-[#C9974A] hover:text-[#C9974A]"}`}>
                  {p.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="relative py-40 overflow-hidden">
        {/* Reuse the cinematic video as an atmospheric background for the CTA.
            Reduced-motion / mobile automatically falls back to the poster. */}
        {(HERO_VIDEO_WEBM_URL || HERO_VIDEO_MP4_URL || HERO_VIDEO_POSTER_URL) ? (
          <CinematicHeroVideo
            webmSrc={HERO_VIDEO_WEBM_URL}
            mp4Src={HERO_VIDEO_MP4_URL}
            posterSrc={HERO_VIDEO_POSTER_URL}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1C1A17] to-[#0A0908]" />
        )}
        <div className="absolute inset-0 bg-[#0A0908]/75" />
        <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-10 text-center">
          <p className="text-[10px] font-semibold tracking-[.2em] uppercase text-[#C9974A] mb-6">The bottom line</p>
          <h2 className="font-[var(--font-cormorant)] font-light text-[#FDFAF6] leading-[.95] mb-8" style={{ fontSize: "clamp(44px,8vw,100px)" }}>
            Three packages.
            <br /><em className="text-[#C9974A]">Every room.</em>
            <br />Always free.
          </h2>
          <p className="text-[#FDFAF6]/50 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Upload a photo. Set a budget. Walk through your redesigned home in 3D before spending a dollar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/design" className="btn-shimmer text-[#0A0908] px-12 py-5 rounded-2xl text-base font-semibold shadow-2xl shadow-[#C9974A]/30">
              Upload Your Room — it&apos;s free →
            </Link>
          </div>
          <p className="text-[#FDFAF6]/20 text-xs mt-6 tracking-wider">No account required · No credit card · Free for homeowners</p>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-[#1C1A17] border-t border-white/5 px-5 sm:px-10 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <p className="font-[var(--font-cormorant)] text-2xl font-light text-[#FDFAF6] mb-3">dwelliq</p>
              <p className="text-xs text-[#FDFAF6]/30 leading-relaxed max-w-xs mb-5">AI interior design + cross-room budget optimization. Affiliate-first. Free for homeowners. Patent-pending technology.</p>
              <div className="flex gap-3">
                {["IG","TT","LI","X"].map(s => (
                  <div key={s} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[10px] text-[#FDFAF6]/30 hover:border-[#C9974A] hover:text-[#C9974A] transition-colors cursor-pointer">{s}</div>
                ))}
              </div>
            </div>
            {([
              { heading: "Design", links: [
                { label: "How it works", href: "/#how-it-works" },
                { label: "3D Studio", href: "/studio" },
                { label: "AI Assistant", href: "/studio" },
                { label: "Room Explorer", href: "/#rooms" },
                { label: "Style Explorer", href: "/#rooms" },
                { label: "Start Designing", href: "/design" },
              ]},
              { heading: "Marketplace", links: [
                { label: "Browse catalog", href: "/marketplace" },
                { label: "Local vendors", href: "/marketplace#local" },
                { label: "Showrooms near me", href: "/marketplace#local" },
                { label: "Delivery tracker", href: "/marketplace" },
                { label: "Affiliate partners", href: "/resources" },
              ]},
              { heading: "Resources", links: [
                { label: "Interior design blog", href: "/resources" },
                { label: "Budget calculator", href: "/#calculator" },
                { label: "Style quiz", href: "/design" },
                { label: "Case studies", href: "/resources" },
                { label: "Press kit", href: "/resources" },
                { label: "Privacy policy", href: "/resources" },
              ]},
            ] as { heading: string; links: { label: string; href: string }[] }[]).map(col => (
              <div key={col.heading}>
                <p className="text-[10px] tracking-[.2em] uppercase text-[#FDFAF6]/30 mb-4">{col.heading}</p>
                <div className="space-y-2.5">
                  {col.links.map(l => (
                    <Link key={l.label} href={l.href} className="block text-sm text-[#FDFAF6]/40 hover:text-[#FDFAF6]/80 transition-colors ul-link">{l.label}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between gap-3">
            <p className="text-xs text-[#FDFAF6]/20">© 2026 DwellIQ · Affiliate commissions fund this product · Patent pending</p>
            <p className="text-xs text-[#FDFAF6]/20">Free for homeowners · Forever</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Shared section header ────────────────────────────────────────────────────
function SectionHeader({ label, title, subtitle }: { label: string; title: string; subtitle: string }) {
  const { ref, v } = useIO(0.1);
  return (
    <div ref={ref} className="max-w-2xl">
      <p
        className="text-[10px] font-semibold tracking-[.2em] uppercase text-[#C9974A] mb-3"
        style={{ opacity: v ? 1 : 0, transition: "opacity .5s" }}
      >{label}</p>
      <div className="overflow-hidden mb-4">
        <h2
          className="font-[var(--font-cormorant)] font-light text-[#0A0908] leading-tight"
          style={{ fontSize: "clamp(36px,5vw,64px)", animation: v ? "clipUp .95s .08s cubic-bezier(.77,0,.175,1) both" : "none", opacity: v ? 1 : 0 }}
        >{title}</h2>
      </div>
      <p
        className="text-[#5C5550] text-base leading-relaxed"
        style={{ opacity: v ? 1 : 0, transition: "opacity .7s .35s" }}
      >{subtitle}</p>
    </div>
  );
}

// ─── Style card ───────────────────────────────────────────────────────────────
function StyleCard({ style }: { style: typeof STYLES[0] }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      className="rounded-2xl overflow-hidden cursor-pointer border border-[#D4CFC8]"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ boxShadow: hov ? `0 20px 48px ${style.palette[0]}30` : "none", transform: hov ? "translateY(-4px) scale(1.01)" : "none", transition: "transform .35s cubic-bezier(.34,1.56,.64,1), box-shadow .35s ease" }}
    >
      <div className="relative" style={{ aspectRatio: "3/4" }}>
        <Image src={style.img} alt={style.name} fill className="object-cover" unoptimized style={{ transform: hov ? "scale(1.06)" : "scale(1)", transition: "transform .5s ease" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908]/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="font-[var(--font-cormorant)] text-base text-[#FDFAF6] leading-tight">{style.name}</p>
          {hov && (
            <div className="mt-2" style={{ animation: "fadeIn .2s both" }}>
              <div className="flex gap-1 mb-1.5">
                {style.palette.map(c => <div key={c} className="w-4 h-4 rounded-full border border-white/20" style={{ background: c }} />)}
              </div>
              <div className="flex flex-wrap gap-1">
                {style.keywords.map(k => <span key={k} className="text-[9px] bg-white/15 text-white px-1.5 py-0.5 rounded">{k}</span>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
