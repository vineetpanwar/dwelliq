"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { C } from "@/lib/tokens";
import { useScrollY } from "@/hooks/useScrollY";
import { HeroPhoneMockup } from "@/components/v6/PhoneMockupShowcase";
import CinematicHeroVideo from "@/components/ui/CinematicHeroVideo";
import { HERO_VIDEO_WEBM_URL, HERO_VIDEO_MP4_URL, HERO_VIDEO_POSTER_URL } from "@/lib/assets";

const INK = "#1C1C1C";

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const scrollY = useScrollY();

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  return (
    <section className="relative min-h-[100svh] flex flex-col overflow-hidden" style={{ background: C.parchment }}>
      {/* Warm room video — softened by cream scrim */}
      <CinematicHeroVideo
        webmSrc={HERO_VIDEO_WEBM_URL}
        mp4Src={HERO_VIDEO_MP4_URL}
        posterSrc={HERO_VIDEO_POSTER_URL}
      />

      {/* Warm cream scrim — lets the room show through as warm editorial texture */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
        style={{ background: `linear-gradient(135deg, ${C.parchment}E8 0%, ${C.parchment}B0 55%, ${C.parchment}70 100%)` }}
      />

      {/* Brass radial bloom — top-right warmth */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{ top: "-8%", right: "-6%", width: 680, height: 680, borderRadius: "50%", background: "radial-gradient(ellipse at center, rgba(201,151,74,0.22) 0%, transparent 65%)" }}
      />

      <div className="h-16 flex-shrink-0" />

      <div className="relative z-10 flex-1 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 w-full grid lg:grid-cols-[1fr_460px] xl:grid-cols-[1fr_520px] gap-10 lg:gap-16 items-center py-10 sm:py-14">
        {/* Left: editorial typography */}
        <div>
          <div className="flex items-center gap-3 mb-8" style={{ opacity: mounted ? 1 : 0, transition: "opacity .6s .05s" }}>
            <span className="flex-shrink-0 w-6 h-px" style={{ background: C.brass, animation: mounted ? "heroLineIn .8s .1s ease both" : "none" }} />
            <span className="text-[10px] font-semibold tracking-[.28em] uppercase" style={{ color: C.brassText }}>AI Home Styling</span>
            <span className="w-px h-3.5 flex-shrink-0" style={{ background: `rgba(28,28,28,0.14)` }} />
            <span className="text-[10px] tracking-[.16em] uppercase" style={{ color: `rgba(28,28,28,0.45)` }}>Free for homeowners</span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(44px, 5.6vw, 84px)",
              fontWeight: 300,
              lineHeight: 1.08,
              color: INK,
              letterSpacing: "-0.02em",
              animation: mounted ? "riseIn 0.9s 0.12s cubic-bezier(.22,1,.36,1) both" : "none",
              opacity: mounted ? 1 : 0,
            }}
          >
            Design every <em style={{ color: C.brass, fontStyle: "italic" }}>room,</em>
            <br />
            optimise one <em style={{ color: C.brass, fontStyle: "italic" }}>budget.</em>
          </h1>

          <div className="flex items-center gap-4 mt-7 mb-6" style={{ opacity: mounted ? 1 : 0, transition: "opacity .5s .44s" }}>
            <div className="flex-shrink-0 w-10 h-px" style={{ background: `rgba(28,28,28,0.15)` }} />
            <span className="text-[10px] tracking-[.2em] uppercase" style={{ color: `rgba(28,28,28,0.48)` }}>
              Three packages · 3D preview · Instant shopping
            </span>
          </div>

          <p className="text-[15px] leading-[1.75] max-w-[420px] mb-8" style={{ color: `rgba(28,28,28,0.68)`, opacity: mounted ? 1 : 0, transition: "opacity .5s .54s" }}>
            Tell us your rooms, budget, and style. We return three complete design packages — each 3D-previewed and directly shoppable. Your postcode shapes every recommendation.
          </p>

          <div className="flex flex-wrap gap-3 mb-9" style={{ opacity: mounted ? 1 : 0, transition: "opacity .5s .66s" }}>
            <Link href="/design" className="btn-shimmer text-[#FDFAF6] font-semibold px-8 py-4 rounded-full text-sm" style={{ boxShadow: "0 6px 36px rgba(201,151,74,0.35)" }}>
              Upload Your Room →
            </Link>
            <a href="#how-it-works" className="hero-outline-btn text-sm px-7 py-4">See How It Works</a>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-4" style={{ opacity: mounted ? 1 : 0, transition: "opacity .5s .78s" }}>
            <div className="flex -space-x-2">
              {[C.brass, C.sage, C.terra, C.blue].map((col, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0"
                  style={{ background: col, borderColor: `rgba(28,28,28,0.14)`, zIndex: 4 - i }}
                >
                  {["M", "J", "P", "A"][i]}
                </div>
              ))}
            </div>
            <div>
              <div className="flex gap-0.5 mb-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="10" height="10" viewBox="0 0 13 13" fill={C.brass}><path d="M6.5 1l1.4 2.8 3.1.5-2.3 2.2.6 3.1L6.5 8.1 3.7 9.6l.6-3.1L2 3.3l3.1-.5L6.5 1z"/></svg>
                ))}
              </div>
              <p className="text-[11px]" style={{ color: `rgba(28,28,28,0.58)` }}>
                Trusted by <strong style={{ color: INK }}>24,000+</strong> homeowners
              </p>
            </div>
          </div>
        </div>

        {/* Right: iPhone mockup */}
        <div
          className="hidden md:flex justify-center lg:justify-end"
          style={{
            opacity: mounted ? 1 : 0,
            animation: mounted ? "scaleIn .95s .35s both" : "none",
            transform: `translateY(${scrollY * -0.05}px)`,
            willChange: "transform",
            filter: "drop-shadow(0 32px 64px rgba(201,151,74,0.22)) drop-shadow(0 8px 24px rgba(28,28,28,0.20))",
          }}
        >
          <HeroPhoneMockup />
        </div>
      </div>

      {/* Bottom editorial bar */}
      <div
        className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 w-full pb-7 flex items-center justify-between flex-wrap gap-4"
        style={{ borderTop: `1px solid rgba(28,28,28,0.10)`, paddingTop: 18 }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-5 h-8 rounded-full flex justify-center pt-2"
            style={{ border: `1px solid rgba(28,28,28,0.18)` }}
          >
            <div className="w-0.5 h-2 rounded-full" style={{ background: C.brass, animation: "float 1.5s ease-in-out infinite" }} />
          </div>
          <span className="text-[10px] tracking-[.22em] uppercase" style={{ color: `rgba(28,28,28,0.42)` }}>Scroll to explore</span>
        </div>
        <div className="hidden sm:flex items-center gap-5 text-[9px] tracking-wider" style={{ color: `rgba(28,28,28,0.35)` }}>
          <span>© 2026 DwellIQ</span>
          <span className="w-px h-3" style={{ background: `rgba(28,28,28,0.12)` }} />
          <span>Patent pending</span>
          <span className="w-px h-3" style={{ background: `rgba(28,28,28,0.12)` }} />
          <span>Free for homeowners</span>
        </div>
      </div>
    </section>
  );
}
