"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HERO_VIDEO_URL, ILLUSTRATIONS, PRESS } from "@/lib/assets";

// ── Lazy Aurora canvas ────────────────────────────────────────────────────────
function AuroraBg({ dark = false }: { dark?: boolean }) {
  const [Comp, setComp] = useState<React.ComponentType<{ dark?: boolean }> | null>(null);
  useEffect(() => {
    import("@/components/v5/AuroraCanvas").then((m) => setComp(() => m.default));
  }, []);
  return Comp ? <Comp dark={dark} /> : null;
}

// ── Hero background — Runway ML video or aurora fallback ──────────────────────
function HeroBg({ dark = false }: { dark?: boolean }) {
  if (HERO_VIDEO_URL) {
    return (
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={HERO_VIDEO_URL}
        autoPlay muted loop playsInline
      />
    );
  }
  return <AuroraBg dark={dark} />;
}

// ── Lovart illustration slot ──────────────────────────────────────────────────
function Illustration({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  if (src) return <Image src={src} alt={alt} fill className={`object-contain ${className}`} unoptimized />;
  // Placeholder until Lovart asset is ready
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-[#CCC8C0] flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#CCC8C0" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
          <path d="M21 15l-5-5L5 21"/>
        </svg>
      </div>
    </div>
  );
}

// ── Lenis smooth scroll ───────────────────────────────────────────────────────
function useSmoothScroll() {
  useEffect(() => {
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let rafId = 0;
    import("lenis").then(({ default: Lenis }) => {
      lenis = new Lenis({ duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      function raf(t: number) { lenis!.raf(t); rafId = requestAnimationFrame(raf); }
      rafId = requestAnimationFrame(raf);
    });
    return () => { lenis?.destroy(); cancelAnimationFrame(rafId); };
  }, []);
}

// ── Scramble animation (logo) ─────────────────────────────────────────────────
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function useScramble(text: string, trigger: boolean) {
  const [display, setDisplay] = useState(text);
  const frame = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (!trigger) return;
    let i = 0;
    clearInterval(frame.current ?? undefined);
    frame.current = setInterval(() => {
      setDisplay(text.split("").map((ch, j) => {
        if (j < i) return ch;
        if (ch === " ") return " ";
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join(""));
      i += 0.6;
      if (i >= text.length) clearInterval(frame.current ?? undefined);
    }, 30);
    return () => clearInterval(frame.current ?? undefined);
  }, [text, trigger]);
  return display;
}

// ── Count-up numbers ──────────────────────────────────────────────────────────
function CountUp({ end, trigger, className = "" }: { end: number; trigger: boolean; className?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!trigger) { setN(0); return; }
    let cur = 0;
    const tick = () => {
      cur += Math.max(1, Math.ceil((end - cur) / 10));
      if (cur >= end) { setN(end); return; }
      setN(cur);
      setTimeout(tick, 28);
    };
    setTimeout(tick, 200);
  }, [trigger, end]);
  return <span className={className}>{n}</span>;
}

// ── CSS 3D tilt card ──────────────────────────────────────────────────────────
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 18;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -12;
    ref.current.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg) scale(1.02)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)";
  };
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ transition: "transform 0.18s ease", transformStyle: "preserve-3d", willChange: "transform" }}
    >
      {children}
    </div>
  );
}

// ── Intersection observer ─────────────────────────────────────────────────────
function useIO(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, v };
}

// ── Data ──────────────────────────────────────────────────────────────────────
const ROOM_STYLES = [
  { name: "Warm Mid-Century", tag: "Most popular", color: "#C9974A", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&q=80", items: ["Walnut sofa", "Tapered lamp", "Jute rug"] },
  { name: "Scandinavian Minimal", tag: "Clean + airy", color: "#8B9EA8", img: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=700&q=80", items: ["Light oak table", "Linen curtains", "Stone accessories"] },
  { name: "Earthy Organic", tag: "Grounded + warm", color: "#8B7355", img: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=700&q=80", items: ["Rattan chair", "Terracotta pots", "Woven rug"] },
  { name: "Modern Glam", tag: "Bold + confident", color: "#7B68C8", img: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=700&q=80", items: ["Velvet sofa", "Gold accents", "Statement lamp"] },
  { name: "Eclectic Maximalist", tag: "Curated chaos", color: "#B85C38", img: "https://images.unsplash.com/photo-1551298370-9d3d53740c72?w=700&q=80", items: ["Pattern mix", "Gallery wall", "Bold textiles"] },
];

const DEMO_RESULT = {
  room: "Living Room", budget: "$3,500", style: "Warm Mid-Century", piece: "Sofa",
  options: [
    {
      opt: "A", label: "Best within budget", bg: "#DCFCE7", text: "#166534",
      name: "Rivet Revolve Modern Sofa",
      retailer: "Amazon", price: "$799",
      saving: "$701 under your sofa allocation",
      why: "4.4★ · 2,300+ reviews · Ships free in 3 days · Solid walnut legs, performance fabric.",
      img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80",
    },
    {
      opt: "B", label: "Best if flexible", bg: "#DBEAFE", text: "#1D4ED8",
      name: "West Elm Haven — Natural Linen",
      retailer: "West Elm", price: "$1,299",
      saving: "$25 over allocation — worth the stretch",
      why: "Heirloom quality. Kiln-dried hardwood frame. You'll still love this in 15 years.",
      img: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=500&q=80",
    },
    {
      opt: "C", label: "Best local boutique", bg: "#FEF3C7", text: "#92400E",
      name: "Linen Shelter Sofa",
      retailer: "Haven Home · 1.8 mi", price: "$920",
      saving: "$580 under allocation · see it today",
      why: "5★ local boutique. See it in person before buying. Same-day pickup available.",
      img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=80",
    },
  ],
};

const BUDGET_ALLOC = [
  { label: "Sofa", pct: 35, icon: "🛋" },
  { label: "Area rug", pct: 15, icon: "⬛" },
  { label: "Accent chair", pct: 12, icon: "🪑" },
  { label: "Coffee table", pct: 12, icon: "▭" },
  { label: "Floor lamp", pct: 8, icon: "💡" },
  { label: "Art + decor", pct: 18, icon: "🖼" },
];

const TESTIMONIALS = [
  {
    quote: "I had $4,000 and no idea where to start. Dwelliq gave me a sofa I never would have found on my own — $200 under budget and perfect for my space.",
    name: "Maya R.", role: "Homeowner · Jersey City NJ", initials: "MR", color: "#C9974A",
  },
  {
    quote: "The local boutique option blew me away. A shop 2 miles from me had exactly what I wanted at the same price as Amazon. I went in and bought it that afternoon.",
    name: "Tom & Sarah L.", role: "First home · Austin TX", initials: "TL", color: "#4A6A58",
  },
  {
    quote: "Three options, all perfect, each with a reason why. That's what I'd pay an interior designer thousands for. Dwelliq gave it to me free in 2 minutes.",
    name: "Priya M.", role: "Apartment refresh · Brooklyn NY", initials: "PM", color: "#8B7355",
  },
];

// ── Main component ────────────────────────────────────────────────────────────
export default function V5Landing() {
  useSmoothScroll();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [budget, setBudget] = useState(3500);
  const [selectedAlloc, setSelectedAlloc] = useState<string | null>(null);
  const [demoVisible, setDemoVisible] = useState(false);

  const scrambled = useScramble("DWELLIQ", mounted);
  const { ref: statsRef, v: statsV } = useIO(0.2);
  const { ref: stepsRef, v: stepsV } = useIO(0.1);
  const { ref: demoRef, v: demoV } = useIO(0.08);
  const { ref: stylesRef, v: stylesV } = useIO(0.05);
  const { ref: calcRef, v: calcV } = useIO(0.1);
  const { ref: allocRef, v: allocV } = useIO(0.1);

  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);
  useEffect(() => { if (demoV) setTimeout(() => setDemoVisible(true), 400); }, [demoV]);
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener("scroll", close, { passive: true });
    return () => window.removeEventListener("scroll", close);
  }, [menuOpen]);

  return (
    <div className="bg-[#FDFAF6] text-[#0A0908] overflow-x-hidden font-[var(--font-dm-sans)]">
      <style>{`
        @keyframes rise { from{opacity:0;transform:translateY(36px);} to{opacity:1;transform:translateY(0);} }
        @keyframes clip { from{clip-path:polygon(0 100%,100% 100%,100% 100%,0 100%);} to{clip-path:polygon(0 0,100% 0,100% 100%,0 100%);} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.93);} to{opacity:1;transform:scale(1);} }
        @keyframes float { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-10px);} }
        @keyframes spin { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
        @keyframes marquee { from{transform:translateX(0);} to{transform:translateX(-50%);} }
        @keyframes menuSlide { from{opacity:0;transform:translateY(-8px);} to{opacity:1;transform:translateY(0);} }
        @keyframes barGrow { from{width:0%;} to{width:var(--w);} }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
        .do-float { animation:float 5s ease-in-out infinite; }
        .do-spin { animation:spin 22s linear infinite; }
        .do-marquee { animation:marquee 32s linear infinite; }
        .do-menu { animation:menuSlide 0.2s cubic-bezier(0.22,1,0.36,1) both; }
        .ul-link::after { content:''; display:block; height:1px; background:#C9974A; transform:scaleX(0); transform-origin:right; transition:transform 0.3s cubic-bezier(0.22,1,0.36,1); }
        .ul-link:hover::after { transform:scaleX(1); transform-origin:left; }
        .rec-card { transition:all 0.35s cubic-bezier(0.34,1.56,0.64,1); }
        .rec-card:hover { transform:translateY(-6px); box-shadow:0 20px 60px rgba(10,9,8,0.1); }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-12 h-16 bg-[#FDFAF6]/92 backdrop-blur-md border-b border-[#CCC8C0]/50">
        <Link href="/v5" className="font-[var(--font-cormorant)] text-2xl font-light tracking-[0.1em] hover:text-[#C9974A] transition-colors">
          {scrambled.toLowerCase()}
        </Link>
        <div className="hidden sm:flex items-center gap-8">
          {[{ label: "How it works", href: "#how-it-works" }, { label: "Styles", href: "#styles" }, { label: "Calculator", href: "#calculator" }].map(({ label, href }) => (
            <a key={label} href={href} className="text-xs text-[#5C5550] ul-link hover:text-[#0A0908] transition-colors">{label}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/design" className="hidden sm:inline-flex group relative overflow-hidden border border-[#0A0908] text-[#0A0908] text-xs px-5 py-2.5 rounded-full">
            <span className="relative z-10 group-hover:text-[#FDFAF6] transition-colors duration-300">Start free →</span>
            <div className="absolute inset-0 bg-[#0A0908] translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
          </Link>
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden p-2 -mr-1 text-[#0A0908] hover:text-[#C9974A] transition-colors"
          >
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M5 5L17 17M17 5L5 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 7h16M3 11h16M3 15h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            )}
          </button>
        </div>
      </nav>

      {/* ── MOBILE MENU ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 sm:hidden" onClick={() => setMenuOpen(false)}>
          <div className="do-menu absolute top-16 left-0 right-0 bg-[#FDFAF6] border-b border-[#CCC8C0] shadow-2xl px-6 py-5" onClick={(e) => e.stopPropagation()}>
            {[{ label: "How it works", href: "#how-it-works" }, { label: "Styles", href: "#styles" }, { label: "Calculator", href: "#calculator" }].map(({ label, href }) => (
              <a key={label} href={href} onClick={() => setMenuOpen(false)} className="flex items-center justify-between px-1 py-4 text-base text-[#5C5550] hover:text-[#0A0908] border-b border-[#CCC8C0]/40 last:border-0 transition-colors">
                <span>{label}</span><span className="text-[#C9974A]">→</span>
              </a>
            ))}
            <Link href="/design" onClick={() => setMenuOpen(false)} className="block text-center mt-4 bg-[#0A0908] text-[#FDFAF6] py-3.5 rounded-xl text-sm font-medium hover:bg-[#C9974A] transition-colors">
              Start free — design my room →
            </Link>
          </div>
        </div>
      )}

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16">
        <div className="absolute inset-0"><HeroBg dark={false} /></div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-12 py-12 sm:py-20 grid lg:grid-cols-[1fr_380px] gap-10 lg:gap-20 items-center">

          {/* Left */}
          <div>
            <div style={{ animation: mounted ? "rise 0.6s 0.05s both" : "none", opacity: 0 }} className="mb-8">
              <span className="inline-flex items-center gap-3 border border-[#CCC8C0] bg-[#FDFAF6]/70 backdrop-blur-sm rounded-full px-5 py-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9974A]" style={{ animation: "pulse 2s ease-in-out infinite" }} />
                <span className="text-xs text-[#5C5550] font-medium tracking-wide">
                  AI home styling advisor — free for homeowners
                </span>
              </span>
            </div>

            <div className="overflow-hidden mb-5 sm:mb-6">
              <h1
                className="font-[var(--font-cormorant)] font-light leading-[0.92] text-[#0A0908]"
                style={{
                  fontSize: "clamp(44px, 9vw, 128px)",
                  animation: mounted ? "clip 1.1s 0.15s cubic-bezier(0.77,0,0.175,1) both" : "none",
                  opacity: mounted ? 1 : 0
                }}
              >
                Stop guessing.
                <br />
                <em className="text-[#C9974A]">Start buying</em>
                <br />
                with confidence.
              </h1>
            </div>

            <p style={{ animation: mounted ? "rise 0.7s 0.55s both" : "none", opacity: 0 }} className="text-[#5C5550] text-base sm:text-xl leading-relaxed mb-8 sm:mb-10 max-w-xl">
              Tell us your style, budget, and room. Get{" "}
              <strong className="text-[#0A0908] font-medium">three specific, purchasable options</strong>{" "}
              for every furniture piece — best within budget, best if you can stretch, best from a local boutique near you.
            </p>

            <div style={{ animation: mounted ? "rise 0.7s 0.7s both" : "none", opacity: 0 }} className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8 sm:mb-10">
              <Link href="/design" className="group relative overflow-hidden inline-flex items-center gap-3 bg-[#0A0908] text-[#FDFAF6] px-9 py-4 rounded-2xl text-base font-medium shadow-xl shadow-[#0A0908]/20">
                <span className="relative z-10">Design my room</span>
                <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">→</span>
                <div className="absolute inset-0 bg-[#C9974A] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
              </Link>
              <span className="flex items-center gap-2 text-sm text-[#5C5550]">
                <span className="text-[#4A6A58]">✓</span> Free · No account · 2 minutes
              </span>
            </div>

            <div style={{ animation: mounted ? "rise 0.7s 0.85s both" : "none", opacity: 0 }} className="flex flex-wrap gap-2 sm:gap-3">
              {[
                { opt: "A", label: "Best within budget", bg: "#DCFCE7", text: "#166534" },
                { opt: "B", label: "Best if flexible", bg: "#DBEAFE", text: "#1D4ED8" },
                { opt: "C", label: "Best local boutique", bg: "#FEF3C7", text: "#92400E" },
              ].map((o) => (
                <div key={o.opt} className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium" style={{ background: o.bg, color: o.text }}>
                  <span>Option {o.opt}</span><span className="opacity-50">·</span><span>{o.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: CSS 3D tilt preview */}
          <div
            className="hidden md:block"
            style={{ animation: mounted ? "scaleIn 1s 0.5s both" : "none", opacity: 0 }}
          >
            <TiltCard>
              <HeroPreviewCard />
            </TiltCard>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div className="w-5 h-8 rounded-full border border-[#5C5550] flex justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-[#C9974A]" style={{ animation: "float 1.6s ease-in-out infinite" }} />
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="border-y border-[#CCC8C0] py-4 overflow-hidden bg-[#F5F2EE]">
        <div className="flex do-marquee whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex flex-shrink-0">
              {["Option A · Within budget", "Option B · Best if flexible", "Option C · Local boutique", "Sofa · Rug · Lamp · Chair · Table", "Free for homeowners", "No subscription ever", "Affiliate-first model", "Takes 2 minutes"].map((t, j) => (
                <span key={j} className="inline-flex items-center gap-4 text-[10px] tracking-widest uppercase text-[#5C5550] px-8">
                  {t}<span className="text-[#C9974A] text-sm">·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <div ref={statsRef} className="max-w-7xl mx-auto px-6 sm:px-12 py-16 sm:py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 mb-16 sm:mb-20">
          {[
            { end: 12000, suffix: "+", label: "Rooms designed" },
            { end: 840, prefix: "$", suffix: "", label: "Avg saved vs. MSRP" },
            { end: 200, suffix: "+", label: "Curated products" },
            { end: 2, suffix: " min", label: "To your recommendations" },
          ].map((s, i) => (
            <div key={s.label} className="text-center" style={{ opacity: statsV ? 1 : 0, transform: statsV ? "none" : "translateY(20px)", transition: `all 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 0.1}s` }}>
              <div className="font-[var(--font-cormorant)] text-5xl sm:text-7xl font-light text-[#0A0908] mb-2 leading-none">
                {s.prefix && <span className="text-[#C9974A]">{s.prefix}</span>}
                <CountUp end={s.end} trigger={statsV} />
                <span className="text-[#C9974A]">{s.suffix}</span>
              </div>
              <p className="text-xs text-[#5C5550] tracking-wider uppercase">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Press bar — swap PRESS[].url with Kittl logo PNGs when ready */}
        <div className="border-t border-b border-[#CCC8C0]/60 py-6 sm:py-8" style={{ opacity: statsV ? 1 : 0, transition: "all 0.8s 0.4s cubic-bezier(0.22,1,0.36,1)" }}>
          <p className="text-center text-[10px] tracking-[0.2em] uppercase text-[#CCC8C0] mb-5 sm:mb-6">As seen in</p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12">
            {PRESS.map((p) => (
              <div key={p.name} className="flex items-center">
                {p.url ? (
                  <Image src={p.url} alt={p.name} width={100} height={28} className="opacity-30 hover:opacity-60 transition-opacity grayscale" unoptimized />
                ) : (
                  <span className="text-sm sm:text-base font-[var(--font-cormorant)] font-light tracking-wider text-[#CCC8C0] hover:text-[#5C5550] transition-colors cursor-default select-none">
                    {p.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── THREE STEPS ── */}
      <section id="how-it-works" className="py-24 sm:py-36 px-6 sm:px-12 bg-[#F5F2EE]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <p className="text-[10px] font-semibold text-[#C9974A] tracking-[0.2em] uppercase mb-3">How it works</p>
            <h2 className="font-[var(--font-cormorant)] text-5xl sm:text-6xl font-light text-[#0A0908] mb-4">Three steps to clarity.</h2>
            <p className="text-sm text-[#5C5550] max-w-md mx-auto">No overwhelm. No endless scrolling. Just your room, your budget, three perfect options — for every piece.</p>
          </div>

          <div ref={stepsRef} className="grid md:grid-cols-3 gap-5 lg:gap-8">
            {[
              {
                num: "01", color: "#C9974A",
                illustration: ILLUSTRATIONS.step1,
                illustrationAlt: "Person answering a home quiz",
                title: "Tell us about your room",
                desc: "Six questions. Two minutes. Style preference, budget, room size, household, how you use the space, and your postcode for local options.",
                tag: "Takes 2 minutes",
                link: "/design", linkLabel: "Start the quiz →",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#C9974A" strokeWidth="1.4" strokeLinecap="round">
                    <rect x="3" y="5" width="22" height="18" rx="2"/>
                    <path d="M8 10h12M8 14h8M8 18h5"/>
                    <circle cx="22" cy="6" r="3" fill="#C9974A" stroke="none"/>
                  </svg>
                ),
              },
              {
                num: "02", color: "#4A6A58",
                illustration: ILLUSTRATIONS.step2,
                illustrationAlt: "AI matching products",
                title: "AI matches 200+ products",
                desc: "We search Amazon, West Elm, Wayfair, local boutiques near you — filtering by your exact style, budget allocation, and availability.",
                tag: "200+ products searched",
                link: null, linkLabel: null,
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#4A6A58" strokeWidth="1.4" strokeLinecap="round">
                    <circle cx="14" cy="14" r="4"/>
                    <circle cx="5" cy="8" r="2.5"/><circle cx="23" cy="8" r="2.5"/>
                    <circle cx="5" cy="20" r="2.5"/><circle cx="23" cy="20" r="2.5"/>
                    <path d="M7 9.5L11 12M17 12L21 9.5M7 18.5L11 16M17 16L21 18.5"/>
                  </svg>
                ),
              },
              {
                num: "03", color: "#7B68C8",
                illustration: ILLUSTRATIONS.step3,
                illustrationAlt: "Choosing between three furniture options",
                title: "Get 3 options. Buy immediately.",
                desc: "Option A: Best within your allocation. Option B: Worth the stretch. Option C: A local boutique within 25 miles — see it in person.",
                tag: "3 options · Every piece",
                link: "/recommendations", linkLabel: "See example results →",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#7B68C8" strokeWidth="1.4" strokeLinecap="round">
                    <rect x="2" y="8" width="7" height="14" rx="1.5"/>
                    <rect x="10.5" y="4" width="7" height="18" rx="1.5"/>
                    <rect x="19" y="10" width="7" height="12" rx="1.5"/>
                    <path d="M5.5 22v2M14 22v2M22.5 22v2"/>
                  </svg>
                ),
              },
            ].map((s, i) => (
              <div
                key={s.num}
                className="relative bg-[#FDFAF6] border border-[#CCC8C0] rounded-2xl overflow-hidden group hover:shadow-xl transition-shadow duration-500"
                style={{ opacity: stepsV ? 1 : 0, transform: stepsV ? "none" : "translateY(28px)", transition: `all 0.65s cubic-bezier(0.22,1,0.36,1) ${i * 0.14}s` }}
              >
                {/* Illustration area — swaps Lovart image in when src is set */}
                <div className="relative h-40 sm:h-48 bg-gradient-to-br overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${s.color}08 0%, ${s.color}18 100%)` }}>
                  {s.illustration ? (
                    <div className="relative w-full h-full">
                      <Illustration src={s.illustration} alt={s.illustrationAlt} />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: `${s.color}14` }}>
                        {s.icon}
                      </div>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 font-[var(--font-cormorant)] text-5xl font-light select-none" style={{ color: `${s.color}20` }}>{s.num}</div>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="w-2 h-2 rounded-full mb-4" style={{ background: s.color }} />
                  <h3 className="font-[var(--font-cormorant)] text-2xl sm:text-3xl font-light text-[#0A0908] mb-3 leading-tight">{s.title}</h3>
                  <p className="text-sm text-[#5C5550] leading-relaxed mb-6">{s.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full" style={{ background: `${s.color}14`, color: s.color }}>{s.tag}</span>
                    {s.link && <Link href={s.link} className="text-xs text-[#5C5550] ul-link hover:text-[#0A0908] transition-colors">{s.linkLabel}</Link>}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${s.color}60, transparent)` }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE RECOMMENDATION PREVIEW ── */}
      <section id="demo" className="py-24 sm:py-36 px-6 sm:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[10px] font-semibold text-[#C9974A] tracking-[0.2em] uppercase mb-3">See it in action</p>
            <h2 className="font-[var(--font-cormorant)] text-5xl sm:text-6xl font-light text-[#0A0908] mb-4">
              This is what you get.
            </h2>
            <p className="text-[#5C5550] max-w-lg mx-auto">
              Real recommendations for a real room. Three options for a sofa — best within budget, best if flexible, best local.
            </p>
          </div>

          {/* Demo card */}
          <div ref={demoRef} className="rounded-2xl border border-[#CCC8C0] overflow-hidden shadow-xl" style={{ opacity: demoV ? 1 : 0, transform: demoV ? "none" : "translateY(24px)", transition: "all 0.8s cubic-bezier(0.22,1,0.36,1)" }}>
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-5 py-3.5 bg-[#F5F2EE] border-b border-[#CCC8C0]">
              {["#EF4444", "#F59E0B", "#10B981"].map((c) => <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />)}
              <span className="ml-2 text-[10px] text-[#5C5550] font-mono">dwelliq.com/recommendations</span>
            </div>

            {/* Context bar */}
            <div className="px-6 py-4 bg-[#FDFAF6] border-b border-[#CCC8C0] flex flex-wrap items-center gap-3">
              <span className="text-xs text-[#5C5550]">Room:</span>
              <span className="text-xs font-medium text-[#0A0908] bg-[#F5F2EE] px-3 py-1 rounded-full">{DEMO_RESULT.room}</span>
              <span className="text-xs text-[#5C5550]">Budget:</span>
              <span className="text-xs font-medium text-[#0A0908] bg-[#F5F2EE] px-3 py-1 rounded-full">{DEMO_RESULT.budget}</span>
              <span className="text-xs text-[#5C5550]">Style:</span>
              <span className="text-xs font-medium text-[#0A0908] bg-[#F5F2EE] px-3 py-1 rounded-full">{DEMO_RESULT.style}</span>
              <span className="ml-auto text-xs text-[#4A6A58] font-medium">Showing: {DEMO_RESULT.piece}</span>
            </div>

            {/* Three option cards */}
            <div className="p-5 sm:p-7 grid sm:grid-cols-3 gap-4">
              {DEMO_RESULT.options.map((opt, i) => (
                <div
                  key={opt.opt}
                  className="rec-card rounded-2xl border border-[#CCC8C0] overflow-hidden bg-[#FDFAF6]"
                  style={{ opacity: demoVisible ? 1 : 0, transform: demoVisible ? "none" : "translateY(20px)", transition: `all 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 0.15}s` }}
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    <Image src={opt.img} alt={opt.name} fill className="object-cover" unoptimized />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908]/40 to-transparent" />
                    <span className="absolute top-2.5 left-2.5 text-[9px] font-semibold px-2.5 py-1 rounded-full" style={{ background: opt.bg, color: opt.text }}>
                      Option {opt.opt} · {opt.label}
                    </span>
                  </div>
                  {/* Content */}
                  <div className="p-4">
                    <p className="text-xs font-semibold text-[#0A0908] leading-snug mb-0.5">{opt.name}</p>
                    <p className="text-[10px] text-[#5C5550] mb-3">{opt.retailer}</p>
                    <p className="font-[var(--font-cormorant)] text-2xl text-[#0A0908] mb-1">{opt.price}</p>
                    <p className="text-[10px] font-medium mb-3" style={{ color: opt.text }}>{opt.saving}</p>
                    <p className="text-[10px] text-[#5C5550] leading-relaxed mb-4 border-t border-[#CCC8C0] pt-3">{opt.why}</p>
                    <Link
                      href="/design"
                      className="block text-center text-[10px] font-semibold py-2.5 rounded-lg transition-colors"
                      style={{ background: opt.bg, color: opt.text }}
                    >
                      Get this for my room →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-7 py-4 bg-[#F5F2EE] border-t border-[#CCC8C0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-xs text-[#5C5550]">This is a sample. Your actual recommendations are matched to your exact style, budget, and location.</p>
              <Link href="/design" className="flex-shrink-0 inline-flex items-center gap-2 bg-[#C9974A] text-[#FDFAF6] text-xs font-medium px-5 py-2.5 rounded-lg hover:bg-[#B8863B] transition-colors">
                Get mine free →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STYLE CAROUSEL ── */}
      <section id="styles" className="py-20 bg-[#F5F2EE]">
        <div ref={stylesRef} className="max-w-7xl mx-auto px-6 sm:px-12 mb-10" style={{ opacity: stylesV ? 1 : 0, transform: stylesV ? "none" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.22,1,0.36,1)" }}>
          <p className="text-[10px] font-semibold text-[#C9974A] tracking-[0.2em] uppercase mb-4">Five style directions</p>
          <div className="flex items-end justify-between">
            <h2 className="font-[var(--font-cormorant)] text-5xl sm:text-6xl font-light text-[#0A0908]">Find your aesthetic.</h2>
            <Link href="/design" className="hidden sm:block text-sm text-[#5C5550] ul-link hover:text-[#0A0908] transition-colors">Start designing →</Link>
          </div>
        </div>
        <StyleCarousel />
      </section>

      {/* ── BUDGET CALCULATOR ── */}
      <section id="calculator" className="py-24 sm:py-36 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div ref={calcRef}>
            <p className="text-[10px] font-semibold text-[#C9974A] tracking-[0.2em] uppercase mb-4">Budget tool</p>
            <h2 className="font-[var(--font-cormorant)] text-5xl sm:text-6xl font-light text-[#0A0908] leading-tight mb-6">
              See exactly where
              <br />your money goes.
            </h2>
            <p className="text-[#5C5550] leading-relaxed mb-6 text-sm max-w-md">
              Set your total room budget. We allocate intelligently across every piece — based on real spending patterns from thousands of room makeovers. Click any item to explore.
            </p>
            <div className="space-y-3 text-sm text-[#5C5550]" style={{ opacity: calcV ? 1 : 0, transform: calcV ? "none" : "translateX(-16px)", transition: "all 0.7s 0.3s cubic-bezier(0.22,1,0.36,1)" }}>
              {["Sofa gets 35% — it's the anchor piece everything else relates to.", "Option A always stays inside your allocation — we never push you over budget.", "Option C (local boutique) is often the same price as Option A, from a shop you can walk into."].map((t) => (
                <p key={t} className="flex gap-2"><span className="text-[#C9974A] flex-shrink-0 mt-0.5">·</span>{t}</p>
              ))}
            </div>
          </div>
          <div ref={allocRef} style={{ opacity: calcV ? 1 : 0, transform: calcV ? "none" : "translateY(32px)", transition: "all 0.8s cubic-bezier(0.22,1,0.36,1)" }}>
            <BudgetCalculatorWidget budget={budget} setBudget={setBudget} selected={selectedAlloc} setSelected={setSelectedAlloc} animated={allocV} />
          </div>
        </div>
      </section>

      {/* ── PROBLEM / SOLUTION ── */}
      <section className="py-24 sm:py-36 px-6 sm:px-12 bg-[#F5F2EE]">
        <div className="max-w-7xl mx-auto">
          <ProblemSolution />
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 sm:py-32 px-6 sm:px-12 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <div>
              <p className="text-[10px] font-semibold text-[#C9974A] tracking-[0.2em] uppercase mb-3">Real homeowners</p>
              <h2 className="font-[var(--font-cormorant)] text-5xl sm:text-6xl font-light text-[#0A0908]">What they say.</h2>
            </div>
            <Link href="/design" className="hidden sm:inline-flex items-center gap-2 text-sm text-[#5C5550] ul-link hover:text-[#0A0908] transition-colors flex-shrink-0">
              Join them — it's free →
            </Link>
          </div>

          {/* Featured testimonial */}
          <div className="mb-5 bg-[#0A0908] rounded-2xl p-8 sm:p-12 relative overflow-hidden"
            style={{ animation: "rise 0.6s 0.1s both" }}>
            <div className="absolute top-6 left-8 font-[var(--font-cormorant)] text-[120px] leading-none text-[#FDFAF6]/04 select-none font-light">"</div>
            <div className="relative z-10 flex flex-col sm:flex-row gap-8 items-start">
              <div className="flex-1">
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} width="14" height="14" viewBox="0 0 14 14" fill="#C9974A">
                      <path d="M7 1.5l1.5 3 3.3.5-2.4 2.3.6 3.3L7 9l-3 1.6.6-3.3L2.2 5l3.3-.5L7 1.5z"/>
                    </svg>
                  ))}
                </div>
                <p className="font-[var(--font-cormorant)] text-2xl sm:text-3xl font-light text-[#FDFAF6] leading-relaxed mb-6 italic">
                  "{TESTIMONIALS[0].quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-[#FDFAF6] flex-shrink-0" style={{ background: TESTIMONIALS[0].color }}>
                    {TESTIMONIALS[0].initials}
                  </div>
                  <div>
                    <p className="text-[#FDFAF6] text-sm font-medium">{TESTIMONIALS[0].name}</p>
                    <p className="text-[#FDFAF6]/40 text-xs">{TESTIMONIALS[0].role}</p>
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex flex-col gap-3 flex-shrink-0 w-48">
                <div className="text-center p-4 rounded-xl border border-[#FDFAF6]/10">
                  <p className="font-[var(--font-cormorant)] text-3xl text-[#C9974A]">$200</p>
                  <p className="text-[10px] text-[#FDFAF6]/40 uppercase tracking-wider mt-1">under budget</p>
                </div>
                <div className="text-center p-4 rounded-xl border border-[#FDFAF6]/10">
                  <p className="font-[var(--font-cormorant)] text-3xl text-[#FDFAF6]">2 min</p>
                  <p className="text-[10px] text-[#FDFAF6]/40 uppercase tracking-wider mt-1">to results</p>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary testimonials */}
          <div className="grid sm:grid-cols-2 gap-5">
            {TESTIMONIALS.slice(1).map((t, i) => (
              <div
                key={t.name}
                className="bg-[#F5F2EE] border border-[#CCC8C0] rounded-2xl p-7 hover:shadow-lg hover:border-[#C9974A]/30 transition-all duration-300"
                style={{ animation: `rise 0.6s ${0.2 + i * 0.12}s both` }}
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} width="12" height="12" viewBox="0 0 12 12" fill="#C9974A">
                      <path d="M6 1l1.3 2.7 3 .4-2.2 2 .5 3L6 7.7 3.4 9.1l.5-3L1.7 4.1l3-.4L6 1z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-[#5C5550] text-sm leading-relaxed mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-[#FDFAF6] flex-shrink-0" style={{ background: t.color }}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-[#0A0908] text-sm font-medium">{t.name}</p>
                    <p className="text-[#5C5550] text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DARK AURORA CTA ── */}
      <section className="relative py-40 overflow-hidden">
        <div className="absolute inset-0"><HeroBg dark={true} /></div>
        <div className="absolute inset-0 bg-[#0A0908]/72" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-12 text-center">
          <p className="text-[10px] font-semibold text-[#C9974A] tracking-[0.2em] uppercase mb-6">The bottom line</p>
          <h2 className="font-[var(--font-cormorant)] text-6xl sm:text-7xl lg:text-8xl font-light text-[#FDFAF6] leading-[1.0] mb-8">
            Three options.
            <br />
            <em className="text-[#C9974A]">Every piece.</em>
            <br />
            Always free.
          </h2>
          <p className="text-[#FDFAF6]/50 text-lg mb-10 max-w-xl mx-auto">
            No overwhelm. No paralysis. Three specific, purchasable recommendations — with the exact reason why each one is right for your room.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/design" className="inline-flex items-center justify-center gap-2 bg-[#C9974A] text-[#0A0908] px-10 py-4 rounded-2xl text-base font-medium hover:bg-[#D4A96A] transition-colors shadow-2xl shadow-[#C9974A]/30">
              Design my room — it's free →
            </Link>
            <Link href="/v3" className="inline-flex items-center justify-center gap-2 border border-[#FDFAF6]/20 text-[#FDFAF6]/60 px-8 py-4 rounded-2xl text-sm hover:border-[#FDFAF6]/40 hover:text-[#FDFAF6]/80 transition-colors">
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
                {[{ label: "Start designing", href: "/design" }, { label: "How it works", href: "#how-it-works" }, { label: "Style quiz", href: "/design" }, { label: "Budget calculator", href: "#calculator" }].map(({ label, href }) => (
                  <a key={label} href={href} className="block text-sm text-[#FDFAF6]/30 hover:text-[#FDFAF6]/60 transition-colors ul-link">{label}</a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-[#FDFAF6]/40 uppercase tracking-wider mb-4">Versions</p>
              <div className="space-y-2">
                {[["Classic", "/"], ["Noir Editorial", "/v2"], ["Warm Organic", "/v3"], ["Spotlight", "/v4"], ["Luxury Magazine", "/v5"]].map(([l, h]) => (
                  <Link key={l} href={h} className="block text-sm text-[#FDFAF6]/30 hover:text-[#FDFAF6]/60 transition-colors ul-link">
                    {l}{h === "/v5" && <span className="ml-1.5 text-[10px] text-[#C9974A]">← here</span>}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between gap-3">
            <p className="text-xs text-[#FDFAF6]/20">© 2026 Dwelliq · Affiliate commissions fund this product</p>
            <p className="text-xs text-[#FDFAF6]/20">Free for homeowners · Forever</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── Hero preview card (CSS 3D tilt target) ────────────────────────────────────
function HeroPreviewCard() {
  const [tick, setTick] = useState(false);
  useEffect(() => { setTimeout(() => setTick(true), 900); }, []);

  return (
    <div className="do-float bg-[#FDFAF6] rounded-2xl border border-[#CCC8C0] overflow-hidden shadow-2xl shadow-[#0A0908]/12">
      <div className="px-5 py-4 border-b border-[#CCC8C0]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#4A6A58]" style={{ animation: "pulse 2s ease-in-out infinite" }} />
            <span className="text-[10px] text-[#5C5550]">Recommendations ready</span>
          </div>
          <span className="text-[9px] font-semibold bg-[#DCFCE7] text-[#166534] px-2.5 py-1 rounded-full">Living Room · $3,500</span>
        </div>
        <p className="text-[#0A0908] text-sm font-semibold">Warm Mid-Century · Sofa</p>
        <p className="text-[#5C5550] text-xs mt-0.5">Your sofa allocation: $1,225</p>
      </div>

      {[
        { opt: "A", label: "Within budget", bg: "#DCFCE7", text: "#166534", name: "Rivet Revolve Sofa", retailer: "Amazon", price: "$799" },
        { opt: "B", label: "Best if flexible", bg: "#DBEAFE", text: "#1D4ED8", name: "West Elm Haven — Linen", retailer: "West Elm", price: "$1,299" },
        { opt: "C", label: "Local · 1.8 mi", bg: "#FEF3C7", text: "#92400E", name: "Haven Home Boutique", retailer: "Local shop", price: "$920" },
      ].map((o, i) => (
        <div
          key={o.opt}
          className="px-4 py-3.5 border-b border-[#CCC8C0] last:border-0 flex items-center gap-3"
          style={{ opacity: tick ? 1 : 0, transform: tick ? "none" : "translateX(8px)", transition: `all 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 0.12}s` }}
        >
          <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: o.bg, color: o.text }}>{o.opt}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[#0A0908] truncate">{o.name}</p>
            <p className="text-[10px] text-[#5C5550]">{o.retailer}</p>
          </div>
          <span className="font-[var(--font-cormorant)] text-lg text-[#C9974A]">{o.price}</span>
        </div>
      ))}

      <div className="px-5 py-4">
        <div className="bg-[#C9974A] text-[#FDFAF6] text-xs font-medium text-center py-2.5 rounded-lg">
          Get my recommendations →
        </div>
      </div>
    </div>
  );
}

// ── Style carousel ────────────────────────────────────────────────────────────
function StyleCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0); const scrollL = useRef(0);
  const touchX = useRef(0); const touchSL = useRef(0);

  const onDown = (e: React.MouseEvent) => { setDragging(true); startX.current = e.pageX - (trackRef.current?.offsetLeft ?? 0); scrollL.current = trackRef.current?.scrollLeft ?? 0; };
  const onUp = () => setDragging(false);
  const onMove = (e: React.MouseEvent) => { if (!dragging || !trackRef.current) return; e.preventDefault(); trackRef.current.scrollLeft = scrollL.current - (e.pageX - trackRef.current.offsetLeft - startX.current); };
  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].pageX; touchSL.current = trackRef.current?.scrollLeft ?? 0; };
  const onTouchMove = (e: React.TouchEvent) => { if (!trackRef.current) return; trackRef.current.scrollLeft = touchSL.current - (e.touches[0].pageX - touchX.current); };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#F5F2EE] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#F5F2EE] to-transparent z-10 pointer-events-none" />
      <div
        ref={trackRef}
        className={`flex gap-4 overflow-x-auto pb-4 px-16 select-none cursor-grab ${dragging ? "cursor-grabbing" : ""}`}
        style={{ scrollbarWidth: "none" }}
        onMouseDown={onDown} onMouseUp={onUp} onMouseMove={onMove} onMouseLeave={onUp}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove}
      >
        {ROOM_STYLES.map((s) => <StyleCarouselCard key={s.name} style={s} />)}
      </div>
      <p className="text-center text-xs text-[#5C5550] mt-2">← swipe or drag to explore →</p>
    </div>
  );
}

function StyleCarouselCard({ style }: { style: typeof ROOM_STYLES[0] }) {
  const [h, setH] = useState(false);
  return (
    <div
      className="flex-shrink-0 w-64 sm:w-72 rounded-2xl overflow-hidden cursor-pointer"
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ transform: h ? "translateY(-8px) scale(1.01)" : "none", transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)", boxShadow: h ? `0 24px 60px ${style.color}22` : "0 4px 16px rgba(10,9,8,0.06)" }}
    >
      <div className="relative h-52 overflow-hidden">
        <Image src={style.img} alt={style.name} fill className="object-cover" unoptimized style={{ transform: h ? "scale(1.08)" : "scale(1)", transition: "transform 0.6s ease" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908]/60 to-transparent" />
        <span className="absolute top-3 right-3 text-[10px] font-medium px-2.5 py-1 rounded-full text-white" style={{ background: style.color }}>{style.tag}</span>
        <p className="absolute bottom-3 left-3 font-[var(--font-cormorant)] text-xl text-[#FDFAF6]">{style.name}</p>
      </div>
      <div className="bg-[#FDFAF6] p-4">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {style.items.map((item) => (
            <span key={item} className="text-[10px] text-[#5C5550] bg-[#F5F2EE] border border-[#CCC8C0] px-2 py-0.5 rounded-full">{item}</span>
          ))}
        </div>
        <Link href="/design" className="text-xs flex items-center gap-1 hover:gap-2 transition-all duration-200" style={{ color: style.color }}>
          Get recommendations for this style →
        </Link>
      </div>
    </div>
  );
}

// ── Budget calculator widget ──────────────────────────────────────────────────
function BudgetCalculatorWidget({ budget, setBudget, selected, setSelected, animated }: {
  budget: number; setBudget: (v: number) => void;
  selected: string | null; setSelected: (v: string | null) => void;
  animated: boolean;
}) {
  return (
    <div className="bg-[#FDFAF6] rounded-2xl border border-[#CCC8C0] overflow-hidden shadow-lg">
      <div className="p-6 border-b border-[#CCC8C0]">
        <p className="text-xs text-[#5C5550] uppercase tracking-wider mb-3">Your room budget</p>
        <div className="flex items-baseline gap-3 mb-4">
          <span className="font-[var(--font-cormorant)] text-5xl font-light text-[#0A0908]">${budget.toLocaleString()}</span>
          <span className="text-[#5C5550] text-sm">total</span>
        </div>
        <input
          type="range" min={500} max={10000} step={100} value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="w-full"
          style={{ background: `linear-gradient(to right, #C9974A ${((budget - 500) / 9500) * 100}%, #CCC8C0 ${((budget - 500) / 9500) * 100}%)` }}
        />
        <div className="flex justify-between text-xs text-[#5C5550] mt-1"><span>$500</span><span>$10,000+</span></div>
      </div>
      <div className="p-4">
        <p className="text-xs text-[#5C5550] uppercase tracking-wider mb-3">How we allocate it</p>
        <div className="space-y-1.5">
          {BUDGET_ALLOC.map((item, i) => {
            const amount = Math.round(budget * item.pct / 100);
            const isSel = selected === item.label;
            return (
              <button
                key={item.label}
                onClick={() => setSelected(isSel ? null : item.label)}
                className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 text-left ${isSel ? "bg-[#C9974A]/10 border border-[#C9974A]/30" : "hover:bg-[#F5F2EE]"}`}
                style={{ opacity: animated ? 1 : 0, transform: animated ? "none" : "translateX(12px)", transition: `all 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 0.07}s` }}
              >
                <span className="text-sm w-6 text-center">{item.icon}</span>
                <span className="text-sm text-[#0A0908] flex-1">{item.label}</span>
                <div className="flex-1 max-w-[80px] h-1.5 bg-[#CCC8C0] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${item.pct}%`, background: isSel ? "#C9974A" : "#8B9EA8" }} />
                </div>
                <span className="font-[var(--font-dm-mono)] text-xs text-[#C9974A] w-16 text-right">${amount.toLocaleString()}</span>
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

// ── Problem / Solution ────────────────────────────────────────────────────────
function ProblemSolution() {
  const { ref, v } = useIO(0.1);
  return (
    <div ref={ref} className="grid md:grid-cols-2 gap-16 lg:gap-24">
      <div>
        <p className="text-[10px] font-semibold text-[#C9974A] tracking-[0.2em] uppercase mb-6">The problem</p>
        <h2 className="font-[var(--font-cormorant)] text-5xl font-light text-[#0A0908] leading-tight mb-8">
          95% of homeowners<br />can't afford a designer.
        </h2>
        <div className="space-y-5">
          {[
            ["Pinterest", "Beautiful. No specific products. No prices. No purchase path."],
            ["Wayfair / Amazon", "50,000 options with zero design context. Decision paralysis."],
            ["IKEA Room Planner", "One brand. No style guidance. No neutral advice."],
            ["Houzz / Havenly", "Human designers cost $2,000–$15,000 per project."],
          ].map(([tool, issue], i) => (
            <div key={tool} className="flex gap-4 border-b border-[#CCC8C0] pb-5" style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateX(-16px)", transition: `all 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 0.1}s` }}>
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
        <p className="text-[10px] font-semibold text-[#4A6A58] tracking-[0.2em] uppercase mb-6">The Dwelliq answer</p>
        <h2 className="font-[var(--font-cormorant)] text-5xl font-light text-[#0A0908] leading-tight mb-8">
          Three options.<br /><em className="text-[#C9974A]">Every piece. Always.</em>
        </h2>
        <div className="space-y-4">
          {[
            { opt: "Option A", sub: "Best within budget", desc: "The confident default. Stays inside your allocation. Ships fast. Most people who buy this love it.", bg: "#DCFCE7", text: "#166534" },
            { opt: "Option B", sub: "Best if flexible", desc: "Usually 20–35% over target — but meaningful quality difference. The version you'll still love in ten years.", bg: "#DBEAFE", text: "#1D4ED8" },
            { opt: "Option C", sub: "Best local boutique", desc: "Within 25 miles of your postcode. You can see it in person. 5-star local ratings. Supports local businesses.", bg: "#FEF3C7", text: "#92400E" },
          ].map((o, i) => (
            <div key={o.opt} className="p-4 rounded-xl border border-[#CCC8C0] bg-[#FDFAF6]" style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateX(16px)", transition: `all 0.5s cubic-bezier(0.22,1,0.36,1) ${0.2 + i * 0.1}s` }}>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full" style={{ background: o.bg, color: o.text }}>{o.opt} · {o.sub}</span>
              <p className="text-sm text-[#5C5550] leading-relaxed mt-2">{o.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-6" style={{ opacity: v ? 1 : 0, transition: "all 0.5s 0.6s cubic-bezier(0.22,1,0.36,1)" }}>
          <Link href="/design" className="inline-flex items-center gap-2 bg-[#C9974A] text-[#FDFAF6] px-7 py-3.5 rounded-xl text-sm font-medium hover:bg-[#B8863B] transition-colors">
            Get my recommendations →
          </Link>
        </div>
      </div>
    </div>
  );
}
