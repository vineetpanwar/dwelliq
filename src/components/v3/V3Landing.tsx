"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

// ── Lazy canvas ───────────────────────────────────────────────────────────────
function RoomCanvasLazy() {
  const [Comp, setComp] = useState<React.ComponentType | null>(null);
  useEffect(() => {
    import("@/components/v3/RoomCanvas").then((m) => setComp(() => m.default));
  }, []);
  return Comp ? <Comp /> : null;
}

// ── Clip reveal hook (text mask wipe) ────────────────────────────────────────
function useClipReveal(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setRevealed(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, revealed };
}

// ── Parallax hook ────────────────────────────────────────────────────────────
function useParallax(strength = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const onScroll = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const offset = (window.innerHeight / 2 - center) * strength;
    ref.current.style.transform = `translateY(${offset}px)`;
  }, [strength]);
  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);
  return ref;
}

// ── Stagger reveal list (fixed — no hooks in loop) ───────────────────────────
function useStagger(count: number) {
  const ref0 = useRef<HTMLDivElement>(null);
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const ref3 = useRef<HTMLDivElement>(null);
  const refs = [ref0, ref1, ref2, ref3].slice(0, count);
  const [visibles, setVisibles] = useState<boolean[]>(Array(count).fill(false));
  useEffect(() => {
    refs.forEach((ref, i) => {
      if (!ref.current) return;
      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) setVisibles((v) => { const n = [...v]; n[i] = true; return n; });
      }, { threshold: 0.15 });
      obs.observe(ref.current);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return { refs, visibles };
}

// ── Carousel for style options ────────────────────────────────────────────────
const STYLES = [
  { name: "Warm Mid-Century", desc: "Walnut tones, tapered legs, warm textures, natural light", color: "#C9974A", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80" },
  { name: "Scandinavian Minimal", desc: "Clean lines, light woods, quiet colors, lots of breathing room", color: "#8B9EA8", image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80" },
  { name: "Earthy Organic", desc: "Natural materials, earth tones, textures, warmth without fuss", color: "#8B7355", image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80" },
  { name: "Modern Glam", desc: "Jewel tones, metallics, bold shapes, confident energy", color: "#7B68C8", image: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&q=80" },
  { name: "Eclectic Maximalist", desc: "Pattern mixing, bold color, curated layers, intentional abundance", color: "#B85C38", image: "https://images.unsplash.com/photo-1551298370-9d3d53740c72?w=600&q=80" },
];

function StyleCarousel() {
  const [active, setActive] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  function go(to: number) {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setActive(to);
      setTransitioning(false);
    }, 300);
  }

  const style = STYLES[active];

  return (
    <div className="relative">
      {/* Main image */}
      <div
        className={`relative h-64 sm:h-80 rounded-xl overflow-hidden transition-all duration-300 ${transitioning ? "opacity-0 scale-[0.98]" : "opacity-100 scale-100"}`}
      >
        <Image
          src={style.image}
          alt={style.name}
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDFAF6]/80 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <p className="font-[var(--font-cormorant)] text-2xl font-light text-ink">{style.name}</p>
          <p className="text-xs text-warm-grey mt-1">{style.desc}</p>
        </div>
      </div>

      {/* Style picker dots */}
      <div className="flex gap-2 mt-4 items-center">
        {STYLES.map((s, i) => (
          <button
            key={s.name}
            onClick={() => go(i)}
            className={`rounded-full transition-all duration-300 ${i === active ? "w-8 h-2" : "w-2 h-2 hover:w-4"}`}
            style={{ background: i === active ? style.color : "#CCC8C0" }}
            title={s.name}
          />
        ))}
        <span className="ml-2 text-xs text-warm-grey">{style.name}</span>
      </div>

      {/* Arrow nav */}
      <div className="absolute top-1/2 -translate-y-1/2 -left-4">
        <button
          onClick={() => go((active - 1 + STYLES.length) % STYLES.length)}
          className="w-8 h-8 rounded-full bg-cream border border-border flex items-center justify-center hover:border-gold transition-colors shadow-sm"
        >
          ←
        </button>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 -right-4">
        <button
          onClick={() => go((active + 1) % STYLES.length)}
          className="w-8 h-8 rounded-full bg-cream border border-border flex items-center justify-center hover:border-gold transition-colors shadow-sm"
        >
          →
        </button>
      </div>
    </div>
  );
}

// ── Option card V3 ─────────────────────────────────────────────────────────────
function V3OptionCard({
  letter, label, tagBg, tagText, name, retailer, price, explanation, image, index,
}: {
  letter: string; label: string; tagBg: string; tagText: string;
  name: string; retailer: string; price: string; explanation: string;
  image: string; index: number;
}) {
  const { ref, revealed } = useClipReveal(0.1);
  const [imgErr, setImgErr] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative bg-cream rounded-2xl overflow-hidden border border-border cursor-default transition-all duration-500"
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(24px)",
        transitionDelay: `${index * 0.12}s`,
        boxShadow: hovered ? "0 24px 60px rgba(10,9,8,0.14)" : "0 2px 12px rgba(10,9,8,0.04)",
      }}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden"
        style={{ height: hovered ? "220px" : "180px", transition: "height 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}
      >
        {!imgErr ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-700"
            style={{ transform: hovered ? "scale(1.08)" : "scale(1)" }}
            unoptimized
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full bg-stone flex items-center justify-center">
            <span className="text-4xl opacity-20">🛋</span>
          </div>
        )}
        <span
          className="absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full"
          style={{ background: tagBg, color: tagText }}
        >
          {letter} · {label}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-sm font-medium text-ink mb-0.5 leading-snug">{name}</p>
        <p className="text-xs text-warm-grey mb-3">{retailer}</p>
        <p className="text-xs text-warm-grey leading-relaxed mb-4">{explanation}</p>
        <div className="flex items-center justify-between">
          <span className="font-[var(--font-cormorant)] text-2xl text-gold">{price}</span>
          <Link
            href="/design"
            className="text-xs border border-gold text-gold px-3 py-1.5 rounded hover:bg-gold hover:text-cream transition-all duration-200"
          >
            View →
          </Link>
        </div>
      </div>

      {/* Hover glow border */}
      <div
        className="absolute inset-0 rounded-2xl border-2 border-gold/20 pointer-events-none transition-opacity duration-300"
        style={{ opacity: hovered ? 1 : 0 }}
      />
    </div>
  );
}

// ── Journey step ──────────────────────────────────────────────────────────────
function JourneyStep({
  number, title, description, detail, revealed, delay,
}: {
  number: string; title: string; description: string; detail: string;
  revealed: boolean; delay: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="border-t border-border pt-6 pb-6 cursor-pointer group"
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(20px)",
        transition: `all 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
      }}
      onClick={() => setExpanded((e) => !e)}
    >
      <div className="flex items-start gap-5">
        <span className="font-[var(--font-dm-mono)] text-xs text-gold pt-1 w-5 flex-shrink-0">{number}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-[var(--font-cormorant)] text-2xl sm:text-3xl font-light text-ink group-hover:text-gold transition-colors duration-300">
              {title}
            </h3>
            <span
              className="text-warm-grey text-xl transition-transform duration-300 flex-shrink-0"
              style={{ transform: expanded ? "rotate(45deg)" : "rotate(0deg)" }}
            >
              +
            </span>
          </div>
          <p className="text-sm text-warm-grey mt-1">{description}</p>
          <div
            className="overflow-hidden transition-all duration-500"
            style={{ maxHeight: expanded ? "200px" : "0", opacity: expanded ? 1 : 0 }}
          >
            <p className="text-sm text-warm-grey/70 mt-3 leading-relaxed border-l-2 border-gold/30 pl-4">
              {detail}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function V3Landing() {
  const [mounted, setMounted] = useState(false);
  const parallaxRef = useParallax(0.08);
  const { ref: howRef, revealed: howRevealed } = useClipReveal(0.1);
  const { refs: journeyRefs, visibles: journeyVisibles } = useStagger(4);

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  return (
    <div className="bg-[#FDFAF6] text-[#0A0908] overflow-x-hidden">
      <style>{`
        @keyframes v3SlideIn {
          from { clip-path: inset(0 100% 0 0); }
          to   { clip-path: inset(0 0% 0 0); }
        }
        .v3-clip-in {
          clip-path: inset(0 100% 0 0);
          animation: v3SlideIn 1s cubic-bezier(0.77,0,0.175,1) forwards;
        }
        @keyframes v3Rise {
          from { transform: translateY(40px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        .v3-rise { animation: v3Rise 0.9s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes v3FlipIn {
          0%   { transform: rotateX(-30deg) translateY(16px); opacity: 0; }
          100% { transform: rotateX(0deg) translateY(0); opacity: 1; }
        }
        .v3-flip { animation: v3FlipIn 0.6s cubic-bezier(0.22,1,0.36,1) both; }
        .v3-hover-line {
          position: relative;
        }
        .v3-hover-line::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 1px;
          background: #C9974A;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.22,1,0.36,1);
        }
        .v3-hover-line:hover::after { transform: scaleX(1); }
        @keyframes v3Breathe {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.015); }
        }
        .v3-breathe { animation: v3Breathe 6s ease-in-out infinite; }
        @keyframes v3Progress {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FDFAF6]/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
          <Link href="/" className="font-[var(--font-cormorant)] text-2xl font-light tracking-wide text-ink">
            dwelliq
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/v3#how" className="text-xs text-warm-grey v3-hover-line hover:text-ink transition-colors hidden sm:block">How it works</Link>
            <Link href="/v3#styles" className="text-xs text-warm-grey v3-hover-line hover:text-ink transition-colors hidden sm:block">Styles</Link>
            <Link href="/design" className="bg-ink text-cream text-xs px-5 py-2.5 rounded hover:bg-ink/80 transition-colors">
              Start free →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Three.js floor plan canvas */}
        <div className="absolute inset-0">
          <RoomCanvasLazy />
        </div>

        {/* Warm gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FDFAF6]/95 via-[#FDFAF6]/75 to-[#FDFAF6]/50 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 w-full py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — headline */}
            <div>
              <div
                className="inline-flex items-center gap-2 border border-border rounded-full px-4 py-1.5 mb-10"
                style={{
                  opacity: mounted ? 1 : 0,
                  animation: mounted ? "v3Rise 0.6s 0.1s cubic-bezier(0.22,1,0.36,1) both" : "none",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                <span className="text-xs text-warm-grey tracking-wider">AI Home Styling · Free for homeowners</span>
              </div>

              <div className="overflow-hidden mb-3">
                <h1
                  className="font-[var(--font-cormorant)] text-[clamp(48px,7vw,90px)] font-light leading-[1.0] text-ink"
                  style={{ animation: mounted ? "v3Rise 1s 0.15s cubic-bezier(0.22,1,0.36,1) both" : "none", opacity: 0 }}
                >
                  Your room,
                </h1>
              </div>
              <div className="overflow-hidden mb-6">
                <h1
                  className="font-[var(--font-cormorant)] text-[clamp(48px,7vw,90px)] font-light leading-[1.0] italic text-gold"
                  style={{ animation: mounted ? "v3Rise 1s 0.3s cubic-bezier(0.22,1,0.36,1) both" : "none", opacity: 0 }}
                >
                  intentionally designed.
                </h1>
              </div>

              <p
                className="text-warm-grey text-lg leading-relaxed mb-8 max-w-lg"
                style={{ animation: mounted ? "v3Rise 0.8s 0.55s cubic-bezier(0.22,1,0.36,1) both" : "none", opacity: 0 }}
              >
                Tell us your style, budget, and room dimensions.
                Get three specific, purchasable furniture recommendations for every single piece —
                <strong className="text-ink font-normal"> best within budget, best if flexible, best from a local shop</strong>.
              </p>

              <div
                className="flex flex-wrap items-center gap-4"
                style={{ animation: mounted ? "v3Rise 0.8s 0.7s cubic-bezier(0.22,1,0.36,1) both" : "none", opacity: 0 }}
              >
                <Link
                  href="/design"
                  className="v3-breathe bg-gold text-cream px-8 py-3.5 rounded-lg font-medium text-sm hover:bg-[#B8863B] transition-colors duration-300 shadow-lg shadow-gold/20"
                >
                  Design my room — it's free
                </Link>
                <Link href="/v3#how" className="text-xs text-warm-grey underline underline-offset-4 hover:text-ink transition-colors">
                  See how it works
                </Link>
              </div>

              {/* Mini stats */}
              <div
                className="flex gap-8 mt-12 pt-8 border-t border-border"
                style={{ animation: mounted ? "v3Rise 0.8s 0.85s cubic-bezier(0.22,1,0.36,1) both" : "none", opacity: 0 }}
              >
                {[
                  { n: "200+", l: "Curated products" },
                  { n: "3", l: "Options per piece" },
                  { n: "$0", l: "For homeowners" },
                ].map((s) => (
                  <div key={s.l}>
                    <p className="font-[var(--font-cormorant)] text-3xl font-light text-ink">{s.n}</p>
                    <p className="text-xs text-warm-grey mt-0.5">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — live room blueprint label */}
            <div
              ref={parallaxRef}
              className="hidden lg:flex flex-col items-center justify-center gap-6"
            >
              <div className="relative">
                <div
                  className="w-80 h-56 rounded-xl border border-gold/20 bg-cream/50 backdrop-blur-sm flex items-center justify-center relative overflow-hidden"
                  style={{ animation: mounted ? "v3Rise 1s 0.5s cubic-bezier(0.22,1,0.36,1) both" : "none", opacity: 0 }}
                >
                  {/* Simulated floor plan legend */}
                  <div className="absolute inset-0 p-5 flex flex-col justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                      <span className="text-xs text-warm-grey font-[var(--font-dm-mono)]">Living room · 14×12 ft</span>
                    </div>
                    {[
                      { label: "Sofa", x: "8%", y: "30%", w: "45%", h: "22%", opacity: 0.5 },
                      { label: "Coffee table", x: "14%", y: "55%", w: "28%", h: "12%", opacity: 0.35 },
                      { label: "Accent chair", x: "60%", y: "30%", w: "28%", h: "24%", opacity: 0.4 },
                      { label: "Floor lamp", x: "73%", y: "60%", w: "8%", h: "14%", opacity: 0.3 },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="absolute border border-gold rounded-sm flex items-center justify-center"
                        style={{ left: item.x, top: item.y, width: item.w, height: item.h, background: `rgba(201,151,74,${item.opacity * 0.15})`, borderColor: `rgba(201,151,74,${item.opacity})` }}
                      >
                        <span className="text-[8px] text-gold/70 font-[var(--font-dm-mono)] hidden sm:block">{item.label}</span>
                      </div>
                    ))}
                    <div className="flex justify-end">
                      <span className="text-[9px] text-warm-grey/50 font-[var(--font-dm-mono)]">Dwelliq floor plan</span>
                    </div>
                  </div>
                </div>
                {/* Floating price callout */}
                <div
                  className="absolute -right-8 -bottom-6 bg-cream border border-border rounded-lg px-4 py-3 shadow-lg"
                  style={{ animation: mounted ? "v3Rise 0.8s 1s cubic-bezier(0.22,1,0.36,1) both" : "none", opacity: 0 }}
                >
                  <p className="text-xs text-warm-grey">Budget remaining</p>
                  <p className="font-[var(--font-cormorant)] text-2xl text-ink">$1,850</p>
                  <div className="h-1 bg-border rounded-full mt-2 w-32 overflow-hidden">
                    <div className="h-full bg-sage rounded-full" style={{ width: "53%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THREE OPTIONS ── */}
      <section className="py-24 sm:py-32 bg-stone">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="text-center mb-16" ref={howRef as React.RefObject<HTMLDivElement>}>
            <p className="text-xs font-medium text-gold tracking-widest uppercase mb-4">The Dwelliq difference</p>
            <h2
              className="font-[var(--font-cormorant)] text-4xl sm:text-5xl font-light text-ink leading-tight"
              style={{
                clipPath: howRevealed ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                transition: "clip-path 1s cubic-bezier(0.77,0,0.175,1)",
              }}
            >
              For every furniture piece,
              <br />
              <em className="text-gold">exactly three options.</em>
            </h2>
            <p className="text-warm-grey mt-4 max-w-lg mx-auto text-sm leading-relaxed">
              Not fifty. Not a single overwhelming catalog. Three specific picks, each with a plain-English reason why it's right for you.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <V3OptionCard
              letter="A"
              label="Best within budget"
              tagBg="#DCFCE7"
              tagText="#166534"
              name="Rivet Revolve Modern Sofa"
              retailer="Amazon · Ships in 3–5 days"
              price="$799"
              explanation="Comfortably within your sofa budget. Solid 4.4/5 rating across 2,300+ reviews. This is the confident, no-regrets choice."
              image="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80"
              index={0}
            />
            <V3OptionCard
              letter="B"
              label="Best if flexible"
              tagBg="#DBEAFE"
              tagText="#1D4ED8"
              name="West Elm Haven Sofa — Natural Linen"
              retailer="West Elm · 10-year warranty"
              price="$1,299"
              explanation="$500 over target but earns every dollar. Premium linen. 10-year warranty. The version you'll still love in ten years."
              image="https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=600&q=80"
              index={1}
            />
            <V3OptionCard
              letter="C"
              label="Best local option"
              tagBg="#FEF3C7"
              tagText="#92400E"
              name="Haven Home Boutique — Linen Loveseat"
              retailer="Local boutique · 1.8 miles away"
              price="$920"
              explanation="You can sit on it before you buy it. 5-star rated. Your money stays in the neighborhood — and they'll deliver next week."
              image="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80"
              index={2}
            />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS — expandable journey ── */}
      <section id="how" className="py-24 sm:py-32 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-start">
          <div className="sticky top-24">
            <p className="text-xs font-medium text-gold tracking-widest uppercase mb-4">Your journey</p>
            <h2 className="font-[var(--font-cormorant)] text-4xl sm:text-5xl font-light text-ink leading-tight mb-6">
              From empty room
              <br />
              to furnished home.
            </h2>
            <p className="text-warm-grey text-sm leading-relaxed mb-8">
              Click any step to learn more. The whole process takes under 3 minutes. No account. No email. Just answers.
            </p>
            <Link
              href="/design"
              className="inline-flex items-center gap-2 bg-gold text-cream px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#B8863B] transition-colors"
            >
              Start designing →
            </Link>
          </div>
          <div>
            {[
              {
                number: "01",
                title: "Tell us your budget",
                description: "Slide to your total room budget. We'll allocate across categories intelligently.",
                detail: "We allocate 35% to your sofa, 15% to the rug, 12% to the accent chair, and so on — based on real spending data from thousands of room makeovers. You can always adjust.",
              },
              {
                number: "02",
                title: "Pick your style",
                description: "Five visual directions, each with real room photography — not abstract descriptions.",
                detail: "Warm Mid-Century, Scandinavian Minimal, Earthy Organic, Modern Glam, Eclectic Maximalist. We match your style to catalog items and rank by how closely they fit your aesthetic.",
              },
              {
                number: "03",
                title: "Answer 4 more questions",
                description: "Room size, household type, how you use the space, your postcode for Option C.",
                detail: "We need your postcode only to surface local boutiques within 25 miles for Option C. We never store it, share it, or use it for anything else. You can skip it and we'll show the nearest accessible global brand instead.",
              },
              {
                number: "04",
                title: "Get your recommendations",
                description: "Three options for every piece. Click to buy. Track your budget in real time.",
                detail: "Option A stays under your allocated budget. Option B is the quality stretch (usually 20–35% more). Option C is always a local boutique with the shortest distance to you. All three equal weight — we never push you toward the expensive option.",
              },
            ].map((step, i) => (
              <div key={step.number} ref={journeyRefs[i] as React.RefObject<HTMLDivElement>}>
                <JourneyStep
                  {...step}
                  revealed={journeyVisibles[i]}
                  delay={i * 0.1}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STYLE SELECTOR ── */}
      <section id="styles" className="py-24 bg-stone px-6 sm:px-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-medium text-gold tracking-widest uppercase mb-4">Five style directions</p>
            <h2 className="font-[var(--font-cormorant)] text-4xl sm:text-5xl font-light text-ink leading-tight mb-6">
              From warm mid-century
              <br />
              to earthy maximalist.
            </h2>
            <p className="text-warm-grey text-sm leading-relaxed mb-8">
              Pick the one that makes your stomach drop in the best possible way. We'll match your catalog recommendations to that feeling — not just a tag.
            </p>
            <Link href="/design" className="inline-flex items-center gap-2 text-sm text-warm-grey underline underline-offset-4 hover:text-ink transition-colors">
              Find my style →
            </Link>
          </div>
          <div className="px-6">
            <StyleCarousel />
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-32 sm:py-40 bg-ink text-cream px-6 sm:px-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="v3-breathe w-full h-full" style={{ background: "radial-gradient(circle at 50% 50%, #C9974A, transparent 70%)" }} />
        </div>
        <div className="relative max-w-3xl mx-auto">
          <p className="text-xs font-medium tracking-widest uppercase mb-6" style={{ color: "#C9974A" }}>
            Ready to furnish your home?
          </p>
          <h2 className="font-[var(--font-cormorant)] text-5xl sm:text-6xl lg:text-7xl font-light leading-tight mb-8">
            Stop visiting stores
            <br />
            on weekends.
          </h2>
          <p className="text-cream/50 mb-10 text-lg leading-relaxed max-w-lg mx-auto">
            Get three perfect options for every furniture piece in your living room. Free. Takes 2 minutes.
          </p>
          <Link
            href="/design"
            className="inline-flex items-center gap-3 bg-gold text-ink px-12 py-4 rounded-xl text-sm font-medium hover:bg-[#D4A96A] transition-all duration-300 shadow-2xl shadow-gold/30 hover:shadow-gold/50 hover:-translate-y-0.5"
          >
            Design my room — it's free
            <span>→</span>
          </Link>
          <p className="text-cream/30 text-xs mt-4">No account · No credit card · Always free for homeowners</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#080706] border-t border-white/5 px-6 sm:px-10 py-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-[var(--font-cormorant)] text-2xl font-light text-cream mb-1">dwelliq</p>
            <p className="text-xs text-cream/30 max-w-xs">AI Home Styling Advisor. Affiliate-first. Free for homeowners. Built in NYC & Jersey City.</p>
          </div>
          <div className="flex flex-col sm:items-end gap-3">
            <div className="flex gap-6 text-xs text-cream/40">
              <Link href="/design" className="hover:text-cream/70 transition-colors">Start free</Link>
              <Link href="/" className="hover:text-cream/70 transition-colors">Version 1</Link>
              <Link href="/v2" className="hover:text-cream/70 transition-colors">Version 2</Link>
            </div>
            <p className="text-xs text-cream/20">© 2026 Dwelliq</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
