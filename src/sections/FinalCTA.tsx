"use client";

import Link from "next/link";
import CinematicHeroVideo from "@/components/ui/CinematicHeroVideo";
import {
  HERO_VIDEO_WEBM_URL,
  HERO_VIDEO_MP4_URL,
  HERO_VIDEO_POSTER_URL,
} from "@/lib/assets";

export default function FinalCTA() {
  return (
    <section className="relative py-40 overflow-hidden">
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

      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 lg:px-10 text-center">
        <p className="text-[10px] font-semibold tracking-[.2em] uppercase text-[#C9974A] mb-6">The bottom line</p>
        <h2 className="font-[var(--font-cormorant)] font-light text-[#FDFAF6] leading-[.95] mb-8" style={{ fontSize: "clamp(44px,8vw,100px)" }}>
          Three packages.<br /><em className="text-[#C9974A]">Every room.</em><br />Always free.
        </h2>
        <p className="text-[#FDFAF6]/50 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
          Upload a photo. Set a budget. Walk through your redesigned home in 3D before spending a dollar.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/design" className="btn-shimmer text-[#0A0908] px-12 py-5 rounded-2xl text-base font-semibold tracking-[.01em] shadow-2xl shadow-[#C9974A]/30">
            Upload Your Room — it&apos;s free →
          </Link>
        </div>
        <p className="text-[#FDFAF6]/20 text-xs mt-6 tracking-wider">No account required · No credit card · Free for homeowners</p>
      </div>
    </section>
  );
}
