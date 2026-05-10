"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

// ── Lazy Aurora canvas ─────────────────────────────────────────────────────────
function AuroraBg({ dark = false }: { dark?: boolean }) {
  const [Comp, setComp] = useState<React.ComponentType<{ dark?: boolean }> | null>(null);
  useEffect(() => {
    import("@/components/v5/AuroraCanvas").then((m) => setComp(() => m.default));
  }, []);
  return Comp ? <Comp dark={dark} /> : null;
}

// ── Lenis smooth scroll init ───────────────────────────────────────────────────
function useSmoothScroll() {
  useEffect(() => {
    let lenis: { raf: (time: number) => void; destroy: () => void } | null = null;
    let rafId = 0;
    import("lenis").then(({ default: Lenis }) => {
      lenis = new Lenis({ duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      function raf(time: number) { lenis!.raf(time); rafId = requestAnimationFrame(raf); }
      rafId = requestAnimationFrame(raf);
    });
    return () => { lenis?.destroy(); cancelAnimationFrame(rafId); };
  }, []);
}

// ── GSAP-style text scramble ───────────────────────────────────────────────────
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function useScramble(text: string, trigger: boolean) {
  const [display, setDisplay] = useState(text);
  const frameRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (!trigger) return;
    let iteration = 0;
    clearInterval(frameRef.current ?? undefined);
    frameRef.current = setInterval(() => {
      setDisplay(
        text.split("").map((ch, i) => {
          if (i < iteration) return ch;
          if (ch === " ") return " ";
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join("")
      );
      iteration += 0.6;
      if (iteration >= text.length) clearInterval(frameRef.current ?? undefined);
    }, 30);
    return () => clearInterval(frameRef.current ?? undefined);
  }, [text, trigger]);
  return display;
}

// ── Horizontal scroll section ─────────────────────────────────────────────────
const ROOM_STYLES = [
  { name: "Warm Mid-Century", tag: "Most popular", color: "#C9974A", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&q=80", items: ["Walnut sofa", "Tapered lamp", "Jute rug"] },
  { name: "Scandinavian Minimal", tag: "Clean + airy", color: "#8B9EA8", img: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=700&q=80", items: ["Light oak table", "Linen curtains", "Stone accessories"] },
  { name: "Earthy Organic", tag: "Grounded + warm", color: "#8B7355", img: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=700&q=80", items: ["Rattan chair", "Terracotta pots", "Woven rug"] },
  { name: "Modern Glam", tag: "Bold + confident", color: "#7B68C8", img: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=700&q=80", items: ["Velvet sofa", "Gold accents", "Statement lamp"] },
  { name: "Eclectic Maximalist", tag: "Curated chaos", color: "#B85C38", img: "https://images.unsplash.com/photo-1551298370-9d3d53740c72?w=700&q=80", items: ["Pattern mix", "Gallery wall", "Bold textiles"] },
];

function HorizontalStyleScroll() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onDown = (e: React.MouseEvent) => {
    setDragging(true);
    startX.current = e.pageX - (trackRef.current?.offsetLeft ?? 0);
    scrollLeft.current = trackRef.current?.scrollLeft ?? 0;
  };
  const onUp = () => setDragging(false);
  const onMove = (e: React.MouseEvent) => {
    if (!dragging || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    trackRef.current.scrollLeft = scrollLeft.current - (x - startX.current);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#F5F2EE] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#F5F2EE] to-transparent z-10 pointer-events-none" />

      <div
        ref={trackRef}
        className={`flex gap-4 overflow-x-auto pb-4 px-16 select-none cursor-grab ${dragging ? "cursor-grabbing" : ""}`}
        style={{ scrollbarWidth: "none" }}
        onMouseDown={onDown}
        onMouseUp={onUp}
        onMouseMove={onMove}
        onMouseLeave={onUp}
      >
        {ROOM_STYLES.map((style) => (
          <StyleCard key={style.name} style={style} />
        ))}
      </div>
      <p className="text-center text-xs text-[#5C5550] mt-2">← drag to explore →</p>
    </div>
  );
}

function StyleCard({ style }: { style: typeof ROOM_STYLES[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="flex-shrink-0 w-64 sm:w-72 rounded-2xl overflow-hidden cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: hovered ? "translateY(-8px) scale(1.01)" : "translateY(0) scale(1)",
        transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        boxShadow: hovered ? `0 24px 60px ${style.color}22` : "0 4px 16px rgba(10,9,8,0.06)",
      }}
    >
      <div className="relative h-52 overflow-hidden">
        <Image
          src={style.img}
          alt={style.name}
          fill
          className="object-cover"
          style={{ transform: hovered ? "scale(1.08)" : "scale(1)", transition: "transform 0.6s ease" }}
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908]/60 to-transparent" />
        <span
          className="absolute top-3 right-3 text-[10px] font-medium px-2.5 py-1 rounded-full text-white"
          style={{ background: style.color }}
        >
          {style.tag}
        </span>
        <p className="absolute bottom-3 left-3 font-[var(--font-cormorant)] text-xl text-[#FDFAF6]">{style.name}</p>
      </div>
      <div className="bg-[#FDFAF6] p-4">
        <div className="flex flex-wrap gap-1.5">
          {style.items.map((item) => (
            <span key={item} className="text-[10px] text-[#5C5550] bg-[#F5F2EE] border border-[#CCC8C0] px-2 py-0.5 rounded-full">
              {item}
            </span>
          ))}
        </div>
        <Link href="/design" className="mt-3 text-xs flex items-center gap-1 hover:gap-2 transition-all duration-200" style={{ color: style.color }}>
          Get recommendations for this style →
        </Link>
      </div>
    </div>
  );
}

// ── Interactive budget calculator ─────────────────────────────────────────────
const ALLOC = [
  { label: "Sofa", pct: 35, icon: "🛋" },
  { label: "Area rug", pct: 15, icon: "⬛" },
  { label: "Accent chair", pct: 12, icon: "🪑" },
  { label: "Coffee table", pct: 12, icon: "▭" },
  { label: "Floor lamp", pct: 8, icon: "💡" },
  { label: "Art + decor", pct: 18, icon: "🖼" },
];

function BudgetCalculator() {
  const [budget, setBudget] = useState(3500);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="bg-[#FDFAF6] rounded-2xl border border-[#CCC8C0] overflow-hidden shadow-lg">
      {/* Slider header */}
      <div className="p-6 border-b border-[#CCC8C0]">
        <p className="text-xs text-[#5C5550] uppercase tracking-wider mb-3">Your room budget</p>
        <div className="flex items-baseline gap-3 mb-4">
          <span className="font-[var(--font-cormorant)] text-5xl font-light text-[#0A0908]">
            ${budget.toLocaleString()}
          </span>
          <span className="text-[#5C5550] text-sm">total</span>
        </div>
        <input
          type="range" min={500} max={10000} step={100} value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="w-full"
          style={{ background: `linear-gradient(to right, #C9974A ${((budget-500)/9500)*100}%, #CCC8C0 ${((budget-500)/9500)*100}%)` }}
        />
        <div className="flex justify-between text-xs text-[#5C5550] mt-1">
          <span>$500</span><span>$10,000+</span>
        </div>
      </div>

      {/* Allocation breakdown */}
      <div className="p-4">
        <p className="text-xs text-[#5C5550] uppercase tracking-wider mb-3">How we allocate it</p>
        <div className="space-y-2">
          {ALLOC.map((item) => {
            const amount = Math.round(budget * item.pct / 100);
            const isSelected = selected === item.label;
            return (
              <button
                key={item.label}
                onClick={() => setSelected(isSelected ? null : item.label)}
                className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 text-left ${
                  isSelected ? "bg-[#C9974A]/10 border border-[#C9974A]/30" : "hover:bg-[#F5F2EE]"
                }`}
              >
                <span className="text-base w-6 text-center">{item.icon}</span>
                <span className="text-sm text-[#0A0908] flex-1">{item.label}</span>
                <div className="flex-1 max-w-[80px] h-1.5 bg-[#CCC8C0] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.pct}%`, background: isSelected ? "#C9974A" : "#8B9EA8" }}
                  />
                </div>
                <span className="font-[var(--font-dm-mono)] text-xs text-[#C9974A] w-16 text-right">
                  ${amount.toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
        <Link href="/design" className="mt-5 block text-center bg-[#C9974A] text-[#FDFAF6] py-3 rounded-xl text-sm font-medium hover:bg-[#B8863B] transition-colors">
          Get my recommendations →
        </Link>
      </div>
    </div>
  );
}

// ── Intersection observer ─────────────────────────────────────────────────────
function useIO(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, v };
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function V5Landing() {
  useSmoothScroll();
  const [mounted, setMounted] = useState(false);
  const heroText = "Your room.\nIntentionally designed.";
  const scrambled = useScramble("DWELLIQ", mounted);
  const { ref: calcRef, v: calcV } = useIO(0.1);

  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  return (
    <div className="bg-[#FDFAF6] text-[#0A0908] overflow-x-hidden font-[var(--font-dm-sans)]">
      <style>{`
        @keyframes v5Rise {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .v5-rise { animation: v5Rise 1s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes v5Clip {
          from { clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0% 100%); }
          to   { clip-path: polygon(0 0%, 100% 0%, 100% 100%, 0% 100%); }
        }
        .v5-clip { animation: v5Clip 1s cubic-bezier(0.77,0,0.175,1) both; }
        @keyframes v5ScaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
        .v5-scale { animation: v5ScaleIn 0.8s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes v5Float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        .v5-float { animation: v5Float 5s ease-in-out infinite; }
        @keyframes v5Spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .v5-spin { animation: v5Spin 20s linear infinite; }
        .v5-link::after {
          content: '';
          display: block;
          height: 1px;
          background: #C9974A;
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .v5-link:hover::after { transform: scaleX(1); transform-origin: left; }
        @keyframes v5Marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .v5-marquee { animation: v5Marquee 30s linear infinite; }
        .v5-card {
          transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1);
        }
        .v5-card:hover {
          transform: translateY(-8px) rotate(-0.3deg);
          box-shadow: 0 32px 80px rgba(10,9,8,0.12);
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-12 h-16 bg-[#FDFAF6]/90 backdrop-blur-sm border-b border-[#CCC8C0]/50">
        <div className="font-[var(--font-cormorant)] text-2xl font-light tracking-[0.1em] text-[#0A0908]">
          {scrambled.toLowerCase()}
        </div>
        <div className="hidden sm:flex items-center gap-8">
          {["How it works", "Styles", "Calculator"].map((l) => (
            <Link key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} className="text-xs text-[#5C5550] v5-link hover:text-[#0A0908] transition-colors">
              {l}
            </Link>
          ))}
        </div>
        <Link href="/design" className="group relative overflow-hidden border border-[#0A0908] text-[#0A0908] text-xs px-5 py-2.5 rounded-full">
          <span className="relative z-10 group-hover:text-[#FDFAF6] transition-colors duration-300">Start free →</span>
          <div className="absolute inset-0 bg-[#0A0908] translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
        </Link>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16">
        {/* Aurora background */}
        <div className="absolute inset-0">
          <AuroraBg dark={false} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-20">
          {/* Pre-headline tag */}
          <div
            className="mb-8"
            style={{ animation: mounted ? "v5Rise 0.7s 0.1s cubic-bezier(0.22,1,0.36,1) both" : "none", opacity: 0 }}
          >
            <span className="inline-flex items-center gap-3 border border-[#CCC8C0] bg-[#FDFAF6]/60 backdrop-blur-sm rounded-full px-5 py-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9974A] animate-pulse" />
              <span className="text-xs text-[#5C5550] font-medium tracking-wide">
                The AI home styling advisor — free for homeowners
              </span>
            </span>
          </div>

          {/* Giant headline */}
          <div className="mb-8 overflow-hidden">
            <h1
              className="font-[var(--font-cormorant)] text-[clamp(54px,8vw,120px)] font-light leading-[0.95] text-[#0A0908]"
              style={{ animation: mounted ? "v5Clip 1.1s 0.2s cubic-bezier(0.77,0,0.175,1) both" : "none", opacity: mounted ? 1 : 0 }}
            >
              Stop guessing.
              <br />
              <em className="text-[#C9974A]">Start buying</em>
              <br />
              with confidence.
            </h1>
          </div>

          <div className="grid lg:grid-cols-[1fr_420px] gap-16 items-start">
            <div>
              <p
                className="text-[#5C5550] text-xl leading-relaxed mb-10 max-w-2xl"
                style={{ animation: mounted ? "v5Rise 0.8s 0.6s cubic-bezier(0.22,1,0.36,1) both" : "none", opacity: 0 }}
              >
                Tell us your style, budget, and room. Get{" "}
                <strong className="text-[#0A0908] font-medium">three specific, purchasable options</strong>{" "}
                for every furniture piece — best within your budget, best if you can stretch, best from a local boutique near you.
              </p>

              <div
                className="flex flex-wrap gap-4 mb-12"
                style={{ animation: mounted ? "v5Rise 0.8s 0.75s cubic-bezier(0.22,1,0.36,1) both" : "none", opacity: 0 }}
              >
                <Link href="/design" className="group relative overflow-hidden inline-flex items-center gap-3 bg-[#0A0908] text-[#FDFAF6] px-8 py-4 rounded-2xl text-base font-medium shadow-xl shadow-[#0A0908]/20">
                  <span className="relative z-10">Design my room</span>
                  <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">→</span>
                  <div className="absolute inset-0 bg-[#C9974A] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                </Link>
                <span className="flex items-center gap-2 text-sm text-[#5C5550]">
                  <span className="text-[#4A6A58]">✓</span> Free · No account · Takes 2 minutes
                </span>
              </div>

              {/* Three-option preview pills */}
              <div
                className="flex flex-wrap gap-3"
                style={{ animation: mounted ? "v5Rise 0.8s 0.9s cubic-bezier(0.22,1,0.36,1) both" : "none", opacity: 0 }}
              >
                {[
                  { opt: "A", label: "Best within budget", bg: "#DCFCE7", text: "#166534" },
                  { opt: "B", label: "Best if flexible", bg: "#DBEAFE", text: "#1D4ED8" },
                  { opt: "C", label: "Best local option", bg: "#FEF3C7", text: "#92400E" },
                ].map((o) => (
                  <div key={o.opt} className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium" style={{ background: o.bg, color: o.text }}>
                    <span>Option {o.opt}</span>
                    <span className="opacity-60">·</span>
                    <span>{o.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: spinning ring + room mockup */}
            <div
              className="relative hidden lg:block"
              style={{ animation: mounted ? "v5Scale 1s 0.5s cubic-bezier(0.22,1,0.36,1) both" : "none", opacity: 0 }}
            >
              {/* Spinning decorator ring */}
              <div className="absolute -inset-8 v5-spin opacity-20 pointer-events-none">
                <svg viewBox="0 0 400 400" className="w-full h-full">
                  <circle cx="200" cy="200" r="190" fill="none" stroke="#C9974A" strokeWidth="1" strokeDasharray="8 12" />
                </svg>
              </div>

              {/* Floating card stack */}
              <div className="relative">
                <div className="v5-float">
                  <OptionPreviewCard
                    opt="A" label="Best within budget" tagBg="#DCFCE7" tagText="#166534"
                    name="Rivet Revolve Modern Sofa" retailer="Amazon" price="$799"
                    img="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"
                    style={{ transform: "rotate(-2deg)", zIndex: 1 }}
                  />
                </div>
                <div className="mt-[-120px] ml-8" style={{ animation: "v5Float 5s 0.8s ease-in-out infinite" }}>
                  <OptionPreviewCard
                    opt="B" label="Best if flexible" tagBg="#DBEAFE" tagText="#1D4ED8"
                    name="West Elm Haven — Natural Linen" retailer="West Elm" price="$1,299"
                    img="https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=400&q=80"
                    style={{ transform: "rotate(1.5deg)", zIndex: 2 }}
                  />
                </div>
                <div className="mt-[-100px] ml-16" style={{ animation: "v5Float 5s 1.6s ease-in-out infinite" }}>
                  <OptionPreviewCard
                    opt="C" label="Best local · 1.8 mi" tagBg="#FEF3C7" tagText="#92400E"
                    name="Haven Home Boutique Linen" retailer="Local boutique" price="$920"
                    img="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80"
                    style={{ transform: "rotate(-0.5deg)", zIndex: 3 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-5 h-8 rounded-full border border-[#5C5550] flex justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-[#C9974A]" style={{ animation: "v5Float 1.5s ease-in-out infinite" }} />
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="border-y border-[#CCC8C0] py-4 overflow-hidden bg-[#F5F2EE]">
        <div className="flex v5-marquee whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex flex-shrink-0">
              {[
                "Option A · Within budget",
                "Option B · Best if flexible",
                "Option C · Local boutique",
                "Sofa · Rug · Lamp · Chair · Table",
                "Free for homeowners",
                "No subscription ever",
                "Affiliate-first model",
              ].map((item, j) => (
                <span key={j} className="inline-flex items-center gap-4 text-xs tracking-widest uppercase text-[#5C5550] px-8">
                  {item}
                  <span className="text-[#C9974A] text-base">·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── PROBLEM / SOLUTION ── */}
      <section id="how-it-works" className="py-28 sm:py-40 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto">
          <ProblemSolution />
        </div>
      </section>

      {/* ── STYLE SCROLL ── */}
      <section id="styles" className="py-20 bg-[#F5F2EE]">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 mb-10">
          <p className="text-xs font-medium text-[#C9974A] tracking-widest uppercase mb-4">Five style directions</p>
          <div className="flex items-end justify-between">
            <h2 className="font-[var(--font-cormorant)] text-4xl sm:text-5xl font-light text-[#0A0908]">
              Find your aesthetic.
            </h2>
            <Link href="/design" className="hidden sm:block text-sm text-[#5C5550] v5-link hover:text-[#0A0908] transition-colors">
              Start designing →
            </Link>
          </div>
        </div>
        <HorizontalStyleScroll />
      </section>

      {/* ── BUDGET CALCULATOR ── */}
      <section id="calculator" className="py-28 sm:py-36 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-medium text-[#C9974A] tracking-widest uppercase mb-4">Budget tool</p>
            <h2 className="font-[var(--font-cormorant)] text-4xl sm:text-5xl font-light text-[#0A0908] leading-tight mb-6">
              See exactly where
              <br />
              your money goes.
            </h2>
            <p className="text-[#5C5550] leading-relaxed mb-6 text-sm">
              Set your total room budget. We'll show you exactly how much we allocate to each piece — based on real spending patterns from thousands of room makeovers. Click any category to explore.
            </p>
            <div className="space-y-3 text-sm text-[#5C5550]">
              {["Sofa gets 35% — it's the anchor piece everything else relates to.", "We never push you over budget. Option A always stays inside your allocation.", "Option C (local boutique) is often the same price as Option A — just from a shop you can walk into."].map((t) => (
                <p key={t} className="flex gap-2">
                  <span className="text-[#C9974A] mt-0.5">·</span>
                  {t}
                </p>
              ))}
            </div>
          </div>
          <div ref={calcRef as React.RefObject<HTMLDivElement>} style={{ opacity: calcV ? 1 : 0, transform: calcV ? "none" : "translateY(32px)", transition: "all 0.8s cubic-bezier(0.22,1,0.36,1)" }}>
            <BudgetCalculator />
          </div>
        </div>
      </section>

      {/* ── DARK AURORA CTA ── */}
      <section className="relative py-40 overflow-hidden">
        <div className="absolute inset-0">
          <AuroraBg dark={true} />
        </div>
        <div className="absolute inset-0 bg-[#0A0908]/70" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-12 text-center">
          <p className="text-xs font-medium text-[#C9974A] tracking-widest uppercase mb-6">The bottom line</p>
          <h2 className="font-[var(--font-cormorant)] text-5xl sm:text-6xl lg:text-7xl font-light text-[#FDFAF6] leading-[1.05] mb-8">
            Three options.
            <br />
            <em className="text-[#C9974A]">Every piece.</em>
            <br />
            Always free.
          </h2>
          <p className="text-[#FDFAF6]/50 text-lg mb-10 max-w-xl mx-auto">
            No overwhelm. No paralysis. Just three specific, purchasable recommendations — with the exact reason why each one is right for your room.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/design" className="inline-flex items-center justify-center gap-2 bg-[#C9974A] text-[#0A0908] px-10 py-4 rounded-2xl text-base font-medium hover:bg-[#D4A96A] transition-colors shadow-2xl shadow-[#C9974A]/30">
              Design my room — it's free →
            </Link>
            <Link href="/v4" className="inline-flex items-center justify-center gap-2 border border-[#FDFAF6]/20 text-[#FDFAF6]/60 px-8 py-4 rounded-2xl text-sm hover:border-[#FDFAF6]/40 hover:text-[#FDFAF6]/80 transition-colors">
              View other designs
            </Link>
          </div>
          <p className="text-[#FDFAF6]/20 text-xs mt-6 tracking-wider">No account · No credit card · Free for homeowners</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#080706] border-t border-white/5 px-6 sm:px-12 py-14">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-10 mb-10">
            <div>
              <p className="font-[var(--font-cormorant)] text-2xl font-light text-[#FDFAF6] mb-2">dwelliq</p>
              <p className="text-xs text-[#FDFAF6]/30 leading-relaxed max-w-xs">AI Home Styling Advisor. Affiliate-first revenue model. Free for homeowners. Built in NYC & Jersey City.</p>
            </div>
            <div>
              <p className="text-xs text-[#FDFAF6]/40 uppercase tracking-wider mb-4">Product</p>
              <div className="space-y-2">
                {["Start designing", "How it works", "Style quiz", "Budget calculator"].map((l) => (
                  <Link key={l} href="/design" className="block text-sm text-[#FDFAF6]/30 hover:text-[#FDFAF6]/60 transition-colors v5-link">{l}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-[#FDFAF6]/40 uppercase tracking-wider mb-4">Versions</p>
              <div className="space-y-2">
                {[["Classic", "/"], ["Noir Editorial", "/v2"], ["Warm Organic", "/v3"], ["Spotlight", "/v4"]].map(([l, h]) => (
                  <Link key={l} href={h} className="block text-sm text-[#FDFAF6]/30 hover:text-[#FDFAF6]/60 transition-colors v5-link">{l}</Link>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-xs text-[#FDFAF6]/20">© 2026 Dwelliq · Affiliate commissions fund this product</p>
            <p className="text-xs text-[#FDFAF6]/20">Free for homeowners · Forever</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function OptionPreviewCard({ opt, label, tagBg, tagText, name, retailer, price, img, style }: {
  opt: string; label: string; tagBg: string; tagText: string;
  name: string; retailer: string; price: string; img: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className="v5-card bg-[#FDFAF6] rounded-2xl border border-[#CCC8C0] overflow-hidden w-56 shadow-lg" style={style}>
      <div className="relative h-36 overflow-hidden">
        <Image src={img} alt={name} fill className="object-cover" unoptimized />
        <span className="absolute top-2 left-2 text-[9px] font-medium px-2 py-0.5 rounded-full" style={{ background: tagBg, color: tagText }}>
          {opt} · {label}
        </span>
      </div>
      <div className="p-3">
        <p className="text-xs font-medium text-[#0A0908] leading-snug line-clamp-2 mb-0.5">{name}</p>
        <p className="text-[10px] text-[#5C5550]">{retailer}</p>
        <p className="font-[var(--font-cormorant)] text-lg text-[#C9974A] mt-1">{price}</p>
      </div>
    </div>
  );
}

function ProblemSolution() {
  const { ref, v } = useIO(0.1);
  return (
    <div ref={ref} className="grid md:grid-cols-2 gap-20">
      <div>
        <p className="text-xs font-medium text-[#C9974A] tracking-widest uppercase mb-6">The problem</p>
        <h2 className="font-[var(--font-cormorant)] text-4xl sm:text-5xl font-light text-[#0A0908] leading-tight mb-8">
          95% of homeowners
          <br />
          can't afford a designer.
        </h2>
        <div className="space-y-6">
          {[
            ["Pinterest", "Beautiful. No specific products. No prices. No purchase path."],
            ["Wayfair / Amazon", "50,000 options with zero design context. Decision paralysis."],
            ["IKEA Room Planner", "One brand. No style guidance. No neutral advice."],
            ["Houzz / Havenly", "Human designers cost $2,000–$15,000 per project."],
          ].map(([tool, issue], i) => (
            <div
              key={tool}
              className="flex gap-4 border-b border-[#CCC8C0] pb-5"
              style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateX(-16px)", transition: `all 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 0.1}s` }}
            >
              <div className="w-5 h-5 rounded-full border border-[#8B3A2A]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 1L7 7M7 1L1 7" stroke="#8B3A2A" strokeWidth="1.2" strokeLinecap="round" /></svg>
              </div>
              <div>
                <p className="text-sm font-medium text-[#0A0908]">{tool}</p>
                <p className="text-xs text-[#5C5550] mt-0.5">{issue}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-[#4A6A58] tracking-widest uppercase mb-6">The Dwelliq answer</p>
        <h2 className="font-[var(--font-cormorant)] text-4xl sm:text-5xl font-light text-[#0A0908] leading-tight mb-8">
          Three options.
          <br />
          <em className="text-[#C9974A]">Every piece. Always.</em>
        </h2>
        <div className="space-y-5">
          {[
            { opt: "Option A", sub: "Best within budget", desc: "The confident default. Stays inside your allocation. Solid rating. Ships fast. Most people who buy this love it.", bg: "#DCFCE7", text: "#166534" },
            { opt: "Option B", sub: "Best if flexible", desc: "Usually 20–35% over target — but meaningful quality difference. The version you'll still love in ten years.", bg: "#DBEAFE", text: "#1D4ED8" },
            { opt: "Option C", sub: "Best local boutique", desc: "Within 25 miles of your postcode. You can see it in person. 5-star local ratings. Your money stays in the neighborhood.", bg: "#FEF3C7", text: "#92400E" },
          ].map((o, i) => (
            <div
              key={o.opt}
              className="p-4 rounded-xl border border-[#CCC8C0]"
              style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateX(16px)", transition: `all 0.5s cubic-bezier(0.22,1,0.36,1) ${0.2 + i * 0.1}s` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full" style={{ background: o.bg, color: o.text }}>{o.opt} · {o.sub}</span>
              </div>
              <p className="text-sm text-[#5C5550] leading-relaxed">{o.desc}</p>
            </div>
          ))}
        </div>
        <div
          className="mt-6"
          style={{ opacity: v ? 1 : 0, transition: "all 0.5s 0.55s cubic-bezier(0.22,1,0.36,1)" }}
        >
          <Link href="/design" className="inline-flex items-center gap-2 bg-[#C9974A] text-[#FDFAF6] px-7 py-3.5 rounded-xl text-sm font-medium hover:bg-[#B8863B] transition-colors">
            Get my recommendations →
          </Link>
        </div>
      </div>
    </div>
  );
}
