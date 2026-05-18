"use client";

import Image from "next/image";
import { C } from "@/lib/tokens";
import { useIO } from "@/hooks/useIO";

const IMAGES = [
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

export default function FilmStrip() {
  const { ref, v } = useIO(0.05);
  const row2 = [...IMAGES.slice(5), ...IMAGES.slice(0, 5)];

  return (
    <div
      ref={ref}
      className="relative overflow-hidden bg-[#F0F0F0] py-12"
      style={{ opacity: v ? 1 : 0, transition: "opacity 1.4s ease" }}
    >
      <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-[#F0F0F0] to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-[#F0F0F0] to-transparent z-10 pointer-events-none" />

      {/* Row 1 — scroll left */}
      <div className="flex gap-3 mb-3" style={{ animation: "filmScroll 55s linear infinite", willChange: "transform" }}>
        {[...IMAGES, ...IMAGES].map((img, i) => (
          <div key={i} className="relative flex-shrink-0 rounded-xl overflow-hidden" style={{ width: 340, height: 220, borderColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderStyle: "solid" }}>
            <Image src={img.src} alt={img.label} fill className="object-cover" style={{ opacity: 0.75 }} unoptimized />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/60 to-transparent" />
            <span className="absolute bottom-3 left-3 text-[9px] tracking-[.2em] uppercase text-white/40 font-medium">{img.label}</span>
          </div>
        ))}
      </div>

      {/* Row 2 — scroll right */}
      <div className="flex gap-3" style={{ animation: "filmScrollReverse 65s linear infinite", willChange: "transform" }}>
        {[...row2, ...row2].map((img, i) => (
          <div key={i} className="relative flex-shrink-0 rounded-xl overflow-hidden" style={{ width: 290, height: 186, borderColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderStyle: "solid" }}>
            <Image src={img.src} alt={img.label} fill className="object-cover" style={{ opacity: 0.55 }} unoptimized />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/50 to-transparent" />
          </div>
        ))}
      </div>

      {/* Centre text overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, #111111 0%, rgba(17,17,17,0.15) 40%, rgba(17,17,17,0.15) 60%, #111111 100%)" }} />
        <div className="relative text-center px-8">
          <p className="text-[9px] font-semibold tracking-[.3em] uppercase text-[#C9974A] mb-3">24,000+ rooms designed</p>
          <h3
            className="font-[var(--font-cormorant)] font-light text-[#FDFAF6] leading-[.95]"
            style={{ fontSize: "clamp(34px,5vw,62px)", textShadow: "0 2px 40px rgba(17,17,17,0.9)" }}
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
