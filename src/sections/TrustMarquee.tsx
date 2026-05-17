"use client";

import { C } from "@/lib/tokens";

const ITEMS = [
  "Upload a photo · get a plan",
  "3D walkthrough before you buy",
  "Cross-room budget optimization",
  "Local vendors · fast delivery",
  "7 design styles · 200+ products",
  "AI-powered · always free to start",
  "Used by designers & homeowners",
];

export default function TrustMarquee() {
  return (
    <div
      className="overflow-hidden"
      style={{ background: C.stone, borderTop: `1px solid ${C.borderLight}`, borderBottom: `1px solid ${C.borderLight}`, padding: "14px 0" }}
    >
      <div className="flex do-marquee whitespace-nowrap">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex flex-shrink-0">
            {ITEMS.map((t, j) => (
              <span key={j} className="inline-flex items-center gap-4 px-8" style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: C.light }}>
                {t}<span style={{ color: C.brass, fontSize: 8 }}>✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
