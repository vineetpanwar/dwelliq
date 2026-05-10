"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

function HeroCanvasLazy() {
  const [mounted, setMounted] = useState(false);
  const [HeroCanvas, setHeroCanvas] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    setMounted(true);
    import("@/components/three/HeroCanvas").then((m) => {
      setHeroCanvas(() => m.default);
    });
  }, []);

  if (!mounted || !HeroCanvas) return null;
  return <HeroCanvas />;
}

const STATS = [
  { value: "$185B", label: "US home decor market" },
  { value: "60%", label: "of millennials renovating in 2025" },
  { value: "Free", label: "always free for homeowners" },
];

export default function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-cream">
      {/* Three.js canvas */}
      <HeroCanvasLazy />

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream/20 via-transparent to-cream/60 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 mb-8 transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-xs font-medium text-warm-grey tracking-widest uppercase">
              AI Home Styling · Free for Homeowners
            </span>
          </div>

          {/* Headline */}
          <h1
            className={`font-serif text-5xl sm:text-6xl md:text-7xl font-light leading-[1.1] text-ink mb-6 transition-all duration-700 delay-100 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Your room,{" "}
            <em className="text-gold not-italic">intentionally</em>{" "}
            designed.
          </h1>

          {/* Subhead */}
          <p
            className={`text-lg sm:text-xl text-warm-grey leading-relaxed mb-10 max-w-xl transition-all duration-700 delay-200 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Tell us your style, budget, and room — get three specific, purchasable
            furniture options for every piece. Best within budget. Best if you can
            stretch. Best from a local shop near you.
          </p>

          {/* CTAs */}
          <div
            className={`flex flex-wrap items-center gap-4 mb-16 transition-all duration-700 delay-300 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <Link
              href="/design"
              className="btn-gold px-8 py-3.5 rounded text-base font-medium inline-block"
            >
              Design my room — it's free
            </Link>
            <a
              href="#how-it-works"
              className="text-sm text-warm-grey underline underline-offset-4 hover:text-ink transition-colors"
            >
              See how it works
            </a>
          </div>

          {/* Stats */}
          <div
            className={`flex flex-wrap gap-8 transition-all duration-700 delay-400 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-serif text-3xl font-light text-ink">{s.value}</p>
                <p className="text-xs text-warm-grey mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-border" />
        <span className="text-xs text-warm-grey tracking-wider">scroll</span>
      </div>
    </section>
  );
}
