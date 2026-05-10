"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

// ── Lazy canvas ────────────────────────────────────────────────────────────────
function ShaderBg() {
  const [Comp, setComp] = useState<React.ComponentType | null>(null);
  useEffect(() => {
    import("@/components/v4/NoiseShaderCanvas").then((m) => setComp(() => m.default));
  }, []);
  return Comp ? <Comp /> : null;
}

// ── Spotlight cursor ───────────────────────────────────────────────────────────
function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!ref.current) return;
      ref.current.style.left = `${e.clientX}px`;
      ref.current.style.top  = `${e.clientY}px`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <div
      ref={ref}
      className="pointer-events-none fixed z-0 -translate-x-1/2 -translate-y-1/2 transition-[left,top] duration-[80ms] ease-out"
      style={{
        width: 600,
        height: 600,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(201,151,74,0.08) 0%, transparent 70%)",
      }}
    />
  );
}

// ── Animated gradient border card ──────────────────────────────────────────────
function GlowCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative rounded-2xl transition-all duration-700 ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transitionDelay: `${delay}s`,
      }}
    >
      {/* Animated gradient border */}
      <div
        className="absolute -inset-[1px] rounded-2xl transition-opacity duration-500"
        style={{
          background: hovered
            ? "linear-gradient(135deg, #C9974A 0%, #E8C88A 40%, #C9974A 80%)"
            : "linear-gradient(135deg, rgba(201,151,74,0.3) 0%, rgba(201,151,74,0.1) 100%)",
          opacity: 1,
        }}
      />
      <div className="relative rounded-2xl bg-[#FDFAF6] overflow-hidden">{children}</div>
    </div>
  );
}

// ── Framer-like number tick ─────────────────────────────────────────────────────
function Tick({ to, duration = 1400, suffix = "" }: { to: number; duration?: number; suffix?: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        setN(Math.round(eased * to));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

// ── Mini interactive recommendation preview ─────────────────────────────────────
const CATEGORIES = ["Sofa", "Coffee Table", "Area Rug", "Floor Lamp", "Accent Chair"];
const PREVIEW_DATA: Record<string, { A: { name: string; price: number; retailer: string; img: string }; B: { name: string; price: number; retailer: string; img: string }; C: { name: string; price: number; retailer: string; img: string } }> = {
  Sofa: {
    A: { name: "Rivet Revolve Modern Sofa", price: 799, retailer: "Amazon", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80" },
    B: { name: "West Elm Haven — Natural Linen", price: 1299, retailer: "West Elm", img: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=400&q=80" },
    C: { name: "Haven Home Boutique Linen", price: 920, retailer: "Local · 1.8 mi", img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80" },
  },
  "Coffee Table": {
    A: { name: "Amazon Basics Walnut Round", price: 189, retailer: "Amazon", img: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=400&q=80" },
    B: { name: "West Elm Marble-Top", price: 449, retailer: "West Elm", img: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400&q=80" },
    C: { name: "Artisan Craft — Live Edge Oak", price: 380, retailer: "Local · 2.3 mi", img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=80" },
  },
  "Area Rug": {
    A: { name: "IKEA STOENSE Low Pile", price: 129, retailer: "IKEA", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80" },
    B: { name: "Loloi Amber Lewis Homage", price: 498, retailer: "Loloi", img: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&q=80" },
    C: { name: "Thread & Weave Hand-Knotted", price: 399, retailer: "Local · 3.1 mi", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80" },
  },
  "Floor Lamp": {
    A: { name: "IKEA RANARP Off-White", price: 49, retailer: "IKEA", img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80" },
    B: { name: "West Elm Sculptural Arc", price: 299, retailer: "West Elm", img: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&q=80" },
    C: { name: "Glow Studio — Rattan Arc", price: 145, retailer: "Local · 0.9 mi", img: "https://images.unsplash.com/photo-1530603907829-659dc8b5f5de?w=400&q=80" },
  },
  "Accent Chair": {
    A: { name: "IKEA POÄNG — Birch Beige", price: 139, retailer: "IKEA", img: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=80" },
    B: { name: "West Elm Roar+Rabbit Swivel", price: 499, retailer: "West Elm", img: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&q=80" },
    C: { name: "Seat & Co. Velvet Terracotta", price: 329, retailer: "Local · 1.4 mi", img: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=400&q=80" },
  },
};

function LivePreview() {
  const [cat, setCat] = useState("Sofa");
  const [activeOpt, setActiveOpt] = useState<"A" | "B" | "C">("A");
  const [budget] = useState(3500);
  const data = PREVIEW_DATA[cat];
  const item = data[activeOpt];

  const OPTION_STYLE = {
    A: { badge: "bg-[#DCFCE7] text-[#166534]", label: "Best within budget", ring: "ring-[#166534]/20" },
    B: { badge: "bg-[#DBEAFE] text-[#1D4ED8]", label: "Best if flexible", ring: "ring-[#1D4ED8]/20" },
    C: { badge: "bg-[#FEF3C7] text-[#92400E]", label: "Best local option", ring: "ring-[#92400E]/20" },
  };

  return (
    <div className="rounded-2xl border border-[#CCC8C0] bg-[#FDFAF6] overflow-hidden shadow-xl shadow-[#0A0908]/6">
      {/* Header bar */}
      <div className="px-5 py-3 border-b border-[#CCC8C0] flex items-center justify-between bg-[#F5F2EE]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <span className="text-xs text-[#5C5550] font-mono">dwelliq.app/recommendations</span>
        <div className="w-16" />
      </div>

      {/* Category tabs */}
      <div className="flex gap-0 border-b border-[#CCC8C0] overflow-x-auto">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => { setCat(c); setActiveOpt("A"); }}
            className={`flex-shrink-0 px-4 py-2.5 text-xs font-medium border-b-2 transition-all duration-200 ${
              cat === c
                ? "border-[#C9974A] text-[#C9974A] bg-[#FDFAF6]"
                : "border-transparent text-[#5C5550] hover:text-[#0A0908]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Budget bar */}
      <div className="px-5 py-2.5 flex items-center gap-3 border-b border-[#CCC8C0]/50">
        <span className="text-xs text-[#5C5550]">Room budget:</span>
        <div className="flex-1 h-1.5 bg-[#CCC8C0] rounded-full overflow-hidden">
          <div className="h-full bg-[#4A6A58] rounded-full" style={{ width: "52%" }} />
        </div>
        <span className="text-xs font-mono text-[#4A6A58]">${budget.toLocaleString()} · $1,680 remaining</span>
      </div>

      {/* Option selector + preview */}
      <div className="p-5 grid grid-cols-3 gap-3">
        {(["A", "B", "C"] as const).map((opt) => {
          const s = OPTION_STYLE[opt];
          const d = data[opt];
          const isActive = activeOpt === opt;
          return (
            <button
              key={opt}
              onClick={() => setActiveOpt(opt)}
              className={`text-left rounded-xl border-2 overflow-hidden transition-all duration-300 ${
                isActive ? `border-[#C9974A] ring-2 ${s.ring} shadow-md` : "border-[#CCC8C0] hover:border-[#C9974A]/40"
              }`}
            >
              {/* Mini image */}
              <div className="relative h-24 bg-[#F5F2EE] overflow-hidden">
                <Image src={d.img} alt={d.name} fill className="object-cover opacity-80" unoptimized />
                <span className={`absolute top-2 left-2 text-[9px] font-medium px-1.5 py-0.5 rounded-full ${s.badge}`}>
                  {opt}
                </span>
              </div>
              <div className="p-2.5">
                <p className="text-[10px] text-[#5C5550] mb-0.5">{s.label}</p>
                <p className="text-xs font-medium text-[#0A0908] leading-tight line-clamp-2">{d.name}</p>
                <p className="font-[var(--font-cormorant)] text-base text-[#C9974A] mt-1">${d.price}</p>
                <p className="text-[9px] text-[#5C5550]">{d.retailer}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected item detail */}
      <div className="mx-5 mb-5 p-4 bg-[#F5F2EE] rounded-xl border border-[#CCC8C0]">
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
            <Image src={item.img} alt={item.name} fill className="object-cover" unoptimized />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[#0A0908] truncate">{item.name}</p>
            <p className="text-[10px] text-[#5C5550]">{item.retailer}</p>
            <p className="font-[var(--font-cormorant)] text-lg text-[#C9974A]">${item.price.toLocaleString()}</p>
          </div>
          <button className="flex-shrink-0 bg-[#C9974A] text-[#FDFAF6] text-xs px-3 py-1.5 rounded-lg">
            View →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Testimonial carousel ────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: "Maya R.", role: "First homeowner, Austin TX", quote: "I spent three weekends visiting furniture stores and left empty-handed every time. Dwelliq took 8 minutes and I bought my sofa the same day.", rating: 5 },
  { name: "James T.", role: "Real estate agent, NYC", quote: "I send every client the Dwelliq link right after closing. It's the single best thing I can do for them at that moment.", rating: 5 },
  { name: "Priya K.", role: "Interior designer, Jersey City", quote: "The local option card is my favorite. It surfaces boutiques I didn't even know existed in my neighborhood.", rating: 5 },
  { name: "David L.", role: "New homeowner, Brooklyn", quote: "Finally a tool that doesn't overwhelm you with 10,000 choices. Three options, clear reasons, done.", rating: 5 },
];

function TestimonialCarousel() {
  const [idx, setIdx] = useState(0);
  const [prev, setPrev] = useState(-1);
  const [dir, setDir] = useState<1 | -1>(1);

  const go = useCallback((to: number, d: 1 | -1) => {
    setPrev(idx);
    setDir(d);
    setIdx(to);
  }, [idx]);

  useEffect(() => {
    const t = setInterval(() => go((idx + 1) % TESTIMONIALS.length, 1), 5000);
    return () => clearInterval(t);
  }, [idx, go]);

  return (
    <div className="relative overflow-hidden">
      <div className="relative min-h-[160px]">
        {TESTIMONIALS.map((t, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-all duration-500"
            style={{
              opacity: i === idx ? 1 : 0,
              transform: i === idx ? "translateX(0)" : `translateX(${i === prev ? `-${dir * 100}%` : `${dir * 80}px`})`,
              pointerEvents: i === idx ? "auto" : "none",
            }}
          >
            <div className="flex gap-1 mb-3">
              {Array.from({ length: t.rating }, (_, j) => (
                <svg key={j} width="14" height="14" viewBox="0 0 14 14" fill="#C9974A">
                  <path d="M7 1.5L8.6 5.4L12.5 5.7L9.7 8.2L10.6 12L7 9.9L3.4 12L4.3 8.2L1.5 5.7L5.4 5.4L7 1.5Z" />
                </svg>
              ))}
            </div>
            <blockquote className="text-[#0A0908] text-sm leading-relaxed mb-3">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <div>
              <p className="text-sm font-medium text-[#0A0908]">{t.name}</p>
              <p className="text-xs text-[#5C5550]">{t.role}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-4">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i, i > idx ? 1 : -1)}
            className={`rounded-full transition-all duration-300 ${i === idx ? "w-6 h-1.5 bg-[#C9974A]" : "w-1.5 h-1.5 bg-[#CCC8C0]"}`}
          />
        ))}
      </div>
    </div>
  );
}

// ── Scroll progress bar ─────────────────────────────────────────────────────────
function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const update = () => {
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setPct(max > 0 ? (scrolled / max) * 100 : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-0.5 bg-transparent">
      <div className="h-full bg-[#C9974A] transition-[width] duration-100" style={{ width: `${pct}%` }} />
    </div>
  );
}

// ── Intersection helper ────────────────────────────────────────────────────────
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
export default function V4Landing() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);
  const { ref: statsRef, v: statsV } = useIO(0.2);
  const { ref: trustRef, v: trustV } = useIO(0.1);

  return (
    <div className="bg-[#FDFAF6] text-[#0A0908] overflow-x-hidden font-[var(--font-dm-sans)]">
      <ScrollProgress />
      <Spotlight />

      <style>{`
        @keyframes v4Rise {
          from { opacity:0; transform: translateY(32px); }
          to   { opacity:1; transform: translateY(0); }
        }
        .v4-rise { animation: v4Rise 0.9s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes v4FadeIn {
          from { opacity:0; }
          to   { opacity:1; }
        }
        @keyframes v4Border {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        .animated-border-btn {
          background: linear-gradient(135deg, #C9974A, #E8C88A, #A67C3B, #C9974A);
          background-size: 300% 300%;
          animation: v4Border 4s ease infinite;
        }
        @keyframes v4Pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(201,151,74,0.4); }
          50%       { box-shadow: 0 0 0 12px rgba(201,151,74,0); }
        }
        .pulse-ring { animation: v4Pulse 2.5s ease-in-out infinite; }
        .feature-card { transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease; }
        .feature-card:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(10,9,8,0.1); }
        @keyframes v4Beam {
          from { transform: scaleX(0); transform-origin: left; }
          to   { transform: scaleX(1); transform-origin: left; }
        }
        .beam-in { animation: v4Beam 1.2s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      {/* ── NAVBAR ───────────────────────────────────────────────────────── */}
      <nav className="fixed top-0.5 left-0 right-0 z-50 px-4">
        <div className="max-w-6xl mx-auto mt-3 flex items-center justify-between px-6 py-3 rounded-2xl bg-[#FDFAF6]/80 backdrop-blur-xl border border-[#CCC8C0]/60 shadow-sm shadow-[#0A0908]/5">
          <Link href="/" className="font-[var(--font-cormorant)] text-xl font-light text-[#0A0908]">
            dwelliq
          </Link>
          <div className="hidden sm:flex items-center gap-1">
            {["How it works", "Why Dwelliq", "Styles"].map((label) => (
              <Link
                key={label}
                href={`#${label.toLowerCase().replace(/ /g, "-")}`}
                className="px-4 py-2 text-sm text-[#5C5550] hover:text-[#0A0908] hover:bg-[#F5F2EE] rounded-xl transition-all duration-200"
              >
                {label}
              </Link>
            ))}
          </div>
          <Link
            href="/design"
            className="animated-border-btn text-[#FDFAF6] text-sm font-medium px-5 py-2.5 rounded-xl"
          >
            Start free →
          </Link>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-24 overflow-hidden">
        {/* Noise shader background */}
        <div className="absolute inset-0">
          <ShaderBg />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#FDFAF6]/50 via-[#FDFAF6]/20 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 w-full py-20">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 items-center">
            {/* Left */}
            <div>
              {/* Trust pill */}
              <div
                className="inline-flex items-center gap-2.5 bg-[#FDFAF6]/80 backdrop-blur-sm border border-[#CCC8C0] rounded-full px-4 py-2 mb-8"
                style={{ animation: mounted ? "v4Rise 0.6s 0.1s cubic-bezier(0.22,1,0.36,1) both" : "none", opacity: 0 }}
              >
                <span className="pulse-ring w-2 h-2 rounded-full bg-[#C9974A]" />
                <span className="text-xs text-[#5C5550] font-medium">AI Home Styling · Free for homeowners</span>
              </div>

              <h1
                className="font-[var(--font-cormorant)] text-[clamp(46px,6.5vw,88px)] font-light leading-[1.05] text-[#0A0908] mb-6"
                style={{ animation: mounted ? "v4Rise 1s 0.2s cubic-bezier(0.22,1,0.36,1) both" : "none", opacity: 0 }}
              >
                Stop guessing.
                <br />
                <em className="text-[#C9974A]">Start knowing</em>
                <br />
                what to buy.
              </h1>

              <p
                className="text-[#5C5550] text-lg leading-relaxed mb-8 max-w-xl"
                style={{ animation: mounted ? "v4Rise 0.8s 0.4s cubic-bezier(0.22,1,0.36,1) both" : "none", opacity: 0 }}
              >
                Tell us your room dimensions, budget, and style. Get{" "}
                <strong className="text-[#0A0908] font-medium">three specific, purchasable furniture recommendations</strong>{" "}
                for every piece — best within budget, best if flexible, best from a local shop near you.
              </p>

              <div
                className="flex flex-wrap items-center gap-4 mb-12"
                style={{ animation: mounted ? "v4Rise 0.8s 0.55s cubic-bezier(0.22,1,0.36,1) both" : "none", opacity: 0 }}
              >
                <Link
                  href="/design"
                  className="group relative inline-flex items-center gap-2 bg-[#0A0908] text-[#FDFAF6] px-7 py-3.5 rounded-xl text-sm font-medium overflow-hidden"
                >
                  <span className="relative z-10">Design my room — it's free</span>
                  <span className="relative z-10 group-hover:translate-x-0.5 transition-transform">→</span>
                  <div className="absolute inset-0 bg-[#1A1918] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Link>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {["#C9974A", "#8B7355", "#4A6A58"].map((c, i) => (
                      <div key={i} className="w-7 h-7 rounded-full border-2 border-[#FDFAF6]" style={{ background: c }} />
                    ))}
                  </div>
                  <span className="text-xs text-[#5C5550]">Loved by first-time homeowners</span>
                </div>
              </div>

              {/* Stat pills */}
              <div
                className="flex flex-wrap gap-3"
                style={{ animation: mounted ? "v4Rise 0.8s 0.7s cubic-bezier(0.22,1,0.36,1) both" : "none", opacity: 0 }}
              >
                {[
                  { label: "Free for homeowners", icon: "◎" },
                  { label: "3 options per piece", icon: "⊞" },
                  { label: "Local boutiques included", icon: "📍" },
                  { label: "No account required", icon: "⊘" },
                ].map((pill) => (
                  <span key={pill.label} className="inline-flex items-center gap-1.5 bg-[#F5F2EE] text-[#5C5550] text-xs px-3.5 py-1.5 rounded-full border border-[#CCC8C0]">
                    <span className="text-[#C9974A]">{pill.icon}</span>
                    {pill.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — live interactive preview */}
            <div
              className="relative"
              style={{ animation: mounted ? "v4Rise 1s 0.45s cubic-bezier(0.22,1,0.36,1) both" : "none", opacity: 0 }}
            >
              <LivePreview />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────── */}
      <div ref={statsRef} className="border-y border-[#CCC8C0] bg-[#F5F2EE]">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-12 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {[
            { to: 185, suffix: "B", label: "US home decor market", prefix: "$" },
            { to: 200, suffix: "+", label: "Curated products", prefix: "" },
            { to: 3, suffix: "", label: "Options per piece, always", prefix: "" },
            { to: 0, suffix: "", label: "Cost for homeowners", prefix: "$" },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-[var(--font-cormorant)] text-4xl sm:text-5xl font-light text-[#0A0908]">
                {statsV ? <><span>{s.prefix}</span><Tick to={s.to} suffix={s.suffix} /></> : <span className="opacity-0">0</span>}
              </p>
              <p className="text-xs text-[#5C5550] mt-2 tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURE GRID ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 sm:py-32 px-6 sm:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-medium text-[#C9974A] tracking-widest uppercase mb-4">Why Dwelliq works</p>
            <h2 className="font-[var(--font-cormorant)] text-4xl sm:text-5xl font-light text-[#0A0908]">
              Built around one insight:
              <br />
              <em className="text-[#C9974A]">three options eliminate paralysis.</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: "◎", title: "Option A — Within budget", desc: "The confident default. Curated to fit your category allocation and style. Solid ratings, fast shipping.", color: "#DCFCE7", textColor: "#166534", delay: 0 },
              { icon: "⊞", title: "Option B — Best if flexible", desc: "Worth the stretch. Usually 20–35% more. The version you'll still love in ten years with meaningful quality difference.", color: "#DBEAFE", textColor: "#1D4ED8", delay: 0.1 },
              { icon: "📍", title: "Option C — Best local", desc: "A boutique near you. You can see it in person before buying. Your money stays in the neighborhood.", color: "#FEF3C7", textColor: "#92400E", delay: 0.2 },
              { icon: "◈", title: "Budget tracker", desc: "See remaining budget update in real time as you browse. Color-coded: sage → amber → rust.", color: "#F5F2EE", textColor: "#0A0908", delay: 0.3 },
              { icon: "◻", title: "Plain-English reasons", desc: "Every recommendation comes with a 2-sentence explanation of why it's right for your specific room.", color: "#F5F2EE", textColor: "#0A0908", delay: 0.4 },
              { icon: "◑", title: "Free, always", desc: "Dwelliq earns a standard affiliate commission when you buy. Your interests and ours are perfectly aligned.", color: "#F5F2EE", textColor: "#0A0908", delay: 0.5 },
            ].map((f) => (
              <GlowCard key={f.title} delay={f.delay} className="feature-card">
                <div className="p-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-lg" style={{ background: f.color, color: f.textColor }}>
                    {f.icon}
                  </div>
                  <h3 className="font-medium text-[#0A0908] mb-2">{f.title}</h3>
                  <p className="text-sm text-[#5C5550] leading-relaxed">{f.desc}</p>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS STEPS ────────────────────────────────────────────────── */}
      <section id="why-dwelliq" className="py-24 bg-[#0A0908] px-6 sm:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-medium text-[#C9974A] tracking-widest uppercase mb-4">The process</p>
              <h2 className="font-[var(--font-cormorant)] text-4xl sm:text-5xl font-light text-[#FDFAF6] leading-tight mb-6">
                From empty room
                <br />
                to furnished home.
                <br />
                <em className="text-[#C9974A]">In under 3 minutes.</em>
              </h2>
              <p className="text-[#FDFAF6]/50 text-sm leading-relaxed mb-8">
                No account. No credit card. Just answers. We designed the flow to feel like a conversation with a designer friend, not a form.
              </p>
              <Link href="/design" className="inline-flex items-center gap-2 border border-[#C9974A] text-[#C9974A] px-6 py-3 rounded-xl text-sm hover:bg-[#C9974A] hover:text-[#0A0908] transition-all duration-300">
                Start now — it's free
              </Link>
            </div>

            <div className="space-y-0">
              {[
                { n: "01", title: "Set your budget", sub: "Slider from $500 to $10,000+. We allocate across categories intelligently." },
                { n: "02", title: "Pick your style direction", sub: "5 visual options with real room photography. Takes 5 seconds." },
                { n: "03", title: "Tell us your room", sub: "Dimensions, household type, how you use the space. 4 quick questions." },
                { n: "04", title: "Get your recommendations", sub: "Instant. Three options for every piece. Buy with one click." },
              ].map((step, i) => (
                <ProcessStep key={step.n} {...step} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST / TESTIMONIALS ─────────────────────────────────────────── */}
      <section id="styles" className="py-24 sm:py-32 px-6 sm:px-10">
        <div ref={trustRef} className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-xs font-medium text-[#C9974A] tracking-widest uppercase mb-4">What people say</p>
            <h2 className="font-[var(--font-cormorant)] text-4xl sm:text-5xl font-light text-[#0A0908] leading-tight mb-8">
              Trusted by first-time
              <br />
              homeowners.
            </h2>
            <div
              className="transition-all duration-700"
              style={{ opacity: trustV ? 1 : 0, transform: trustV ? "none" : "translateY(20px)" }}
            >
              <TestimonialCarousel />
            </div>
          </div>

          {/* Why competitors fail */}
          <div>
            <p className="text-xs font-medium text-[#5C5550] tracking-widest uppercase mb-6">Why everything else fails</p>
            <div className="space-y-1">
              {[
                { name: "Pinterest", issue: "Inspiration. Zero product path." },
                { name: "Wayfair/Amazon", issue: "50,000 options. No design context." },
                { name: "IKEA Planner", issue: "One brand. No neutral advice." },
                { name: "Houzz/Havenly", issue: "$2,000–$15,000 per project." },
                { name: "RoomGPT", issue: "Pretty images. Nothing to buy." },
              ].map((c, i) => (
                <CompRow key={c.name} {...c}
                  style={{ opacity: trustV ? 1 : 0, transform: trustV ? "none" : "translateX(-16px)", transitionDelay: `${i * 0.08}s`, transition: "all 0.5s cubic-bezier(0.22,1,0.36,1)" }}
                />
              ))}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#C9974A]/8 border border-[#C9974A]/20 mt-4"
                style={{ opacity: trustV ? 1 : 0, transform: trustV ? "none" : "translateX(-16px)", transitionDelay: "0.45s", transition: "all 0.5s cubic-bezier(0.22,1,0.36,1)" }}>
                <div className="w-6 h-6 rounded-full bg-[#C9974A] flex items-center justify-center flex-shrink-0">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#FDFAF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#0A0908]">Dwelliq</p>
                  <p className="text-xs text-[#5C5550]">Free AI. Three options per piece. Local boutiques. Budget-aware.</p>
                </div>
                <Link href="/design" className="ml-auto text-xs text-[#C9974A] hover:underline whitespace-nowrap">Try free →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="py-32 bg-[#F5F2EE] px-6 sm:px-10 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-medium text-[#C9974A] tracking-widest uppercase mb-6">Ready to start?</p>
          <h2 className="font-[var(--font-cormorant)] text-5xl sm:text-6xl font-light text-[#0A0908] leading-tight mb-6">
            Design your room today.
            <br />
            <em className="text-[#C9974A]">It's completely free.</em>
          </h2>
          <p className="text-[#5C5550] text-lg mb-10">Takes 2 minutes. Three options for every piece. No account. No credit card.</p>
          <Link href="/design" className="animated-border-btn inline-flex items-center gap-3 text-[#FDFAF6] px-12 py-4 rounded-2xl text-base font-medium shadow-lg shadow-[#C9974A]/20">
            Design my room — it's free →
          </Link>
          <div className="flex flex-wrap justify-center gap-6 mt-12 text-xs text-[#5C5550]">
            {["No credit card", "No account required", "Free for homeowners", "Local boutiques included"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <span className="text-[#4A6A58]">✓</span> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="bg-[#0A0908] px-6 sm:px-10 py-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-[var(--font-cormorant)] text-2xl font-light text-[#FDFAF6] mb-1">dwelliq</p>
            <p className="text-xs text-[#FDFAF6]/30">AI Home Styling Advisor · Free for homeowners · Affiliate-first</p>
          </div>
          <div className="flex flex-col sm:items-end gap-3">
            <div className="flex gap-6 text-xs text-[#FDFAF6]/40">
              <Link href="/design" className="hover:text-[#FDFAF6]/70 transition-colors">Start free</Link>
              <Link href="/" className="hover:text-[#FDFAF6]/70 transition-colors">Version 1</Link>
              <Link href="/v2" className="hover:text-[#FDFAF6]/70 transition-colors">Version 2</Link>
              <Link href="/v3" className="hover:text-[#FDFAF6]/70 transition-colors">Version 3</Link>
              <Link href="/v5" className="hover:text-[#FDFAF6]/70 transition-colors">Version 5</Link>
            </div>
            <p className="text-xs text-[#FDFAF6]/20">© 2026 Dwelliq</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function ProcessStep({ n, title, sub, index }: { n: string; title: string; sub: string; index: number }) {
  const { ref, v } = useIO(0.15);
  return (
    <div
      ref={ref}
      className="flex gap-5 py-6 border-b border-[#FDFAF6]/8 last:border-0"
      style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateX(20px)", transition: `all 0.6s cubic-bezier(0.22,1,0.36,1) ${index * 0.12}s` }}
    >
      <div className="flex-shrink-0">
        <span className="font-[var(--font-dm-mono)] text-xs text-[#C9974A]">{n}</span>
      </div>
      <div>
        <div className="flex items-center gap-3 mb-1.5">
          <div className="beam-in h-px flex-1 bg-[#C9974A]/30" style={{ animationDelay: `${index * 0.15}s` }} />
        </div>
        <p className="font-medium text-[#FDFAF6] mb-1">{title}</p>
        <p className="text-sm text-[#FDFAF6]/40">{sub}</p>
      </div>
    </div>
  );
}

function CompRow({ name, issue, style }: { name: string; issue: string; style: React.CSSProperties }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl border border-[#CCC8C0]/50 hover:border-[#CCC8C0] transition-colors" style={style}>
      <div className="w-5 h-5 rounded-full border border-[#8B3A2A]/30 flex items-center justify-center flex-shrink-0">
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 1L7 7M7 1L1 7" stroke="#8B3A2A" strokeWidth="1.2" strokeLinecap="round" /></svg>
      </div>
      <p className="text-sm font-medium text-[#0A0908]">{name}</p>
      <p className="text-xs text-[#5C5550] ml-auto text-right max-w-[140px]">{issue}</p>
    </div>
  );
}
