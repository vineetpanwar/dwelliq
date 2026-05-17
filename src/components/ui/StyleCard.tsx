"use client";

import { useState } from "react";
import Image from "next/image";

interface Style {
  name: string;
  keywords: string[];
  palette: string[];
  img: string;
}

export default function StyleCard({ style }: { style: Style }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      className="rounded-2xl overflow-hidden cursor-pointer border border-[#D4CFC8]"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        boxShadow: hov ? `0 20px 48px ${style.palette[0]}30` : "none",
        transform: hov ? "translateY(-4px) scale(1.01)" : "none",
        transition: "transform .35s cubic-bezier(.34,1.56,.64,1), box-shadow .35s ease",
      }}
    >
      <div className="relative" style={{ aspectRatio: "3/4" }}>
        <Image
          src={style.img}
          alt={style.name}
          fill
          className="object-cover"
          unoptimized
          style={{ transform: hov ? "scale(1.06)" : "scale(1)", transition: "transform .5s ease" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908]/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="font-[var(--font-cormorant)] text-base text-[#FDFAF6] leading-tight">{style.name}</p>
          {hov && (
            <div className="mt-2" style={{ animation: "fadeIn .2s both" }}>
              <div className="flex gap-1 mb-1.5">
                {style.palette.map(c => (
                  <div key={c} className="w-4 h-4 rounded-full border border-white/20" style={{ background: c }} />
                ))}
              </div>
              <div className="flex flex-wrap gap-1">
                {style.keywords.map(k => (
                  <span key={k} className="text-[9px] bg-white/15 text-white px-1.5 py-0.5 rounded">{k}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
