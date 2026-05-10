"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// ── Lazy Three.js canvas loader ──────────────────────────────────────────────
function FurnitureCanvasLazy() {
  const [Comp, setComp] = useState<React.ComponentType | null>(null);
  useEffect(() => {
    import("@/components/v2/FurnitureCanvas").then((m) => setComp(() => m.default));
  }, []);
  return Comp ? <Comp /> : null;
}

// ── Magnetic button hook ─────────────────────────────────────────────────────
function useMagnetic(strength = 0.3) {
  const ref = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    function onMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      el!.style.transform = `translate(${dx}px, ${dy}px)`;
    }
    function onLeave() {
      el!.style.transform = "";
      el!.style.transition = "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)";
    }
    function onEnter() {
      el!.style.transition = "transform 0.1s linear";
    }
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("mouseenter", onEnter);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("mouseenter", onEnter);
    };
  }, [strength]);
  return ref;
}

// ── Word-by-word reveal ──────────────────────────────────────────────────────
function RevealText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <span
            className="inline-block animate-v2-reveal"
            style={{ animationDelay: `${delay + i * 0.07}s` }}
          >
            {word}&nbsp;
          </span>
        </span>
      ))}
    </span>
  );
}

// ── Intersection reveal hook ─────────────────────────────────────────────────
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ── Animated counter ─────────────────────────────────────────────────────────
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const { ref, visible } = useReveal(0.5);
  useEffect(() => {
    if (!visible) return;
    const duration = 1200;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible, target]);
  return (
    <span ref={ref} className="font-serif text-5xl sm:text-6xl font-light text-gold tabular-nums">
      {val.toLocaleString()}{suffix}
    </span>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function V2Landing() {
  const magneticRef = useMagnetic(0.25);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  return (
    <div className="bg-[#0A0908] text-[#FDFAF6] overflow-x-hidden font-[var(--font-dm-sans)]">
      {/* ── CSS for this version ── */}
      <style>{`
        @keyframes v2Reveal {
          from { transform: translateY(110%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .animate-v2-reveal {
          animation: v2Reveal 0.75s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes v2FadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .v2-fade { opacity: 0; }
        .v2-fade.visible {
          animation: v2FadeIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes v2LineIn {
          from { width: 0; }
          to   { width: 100%; }
        }
        .v2-line-in { width: 0; animation: v2LineIn 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both; }
        @keyframes v2Ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .v2-ticker { animation: v2Ticker 22s linear infinite; }
        @keyframes v2CardHover {
          from { transform: translateY(0) rotate(0deg); }
          to   { transform: translateY(-8px) rotate(-0.5deg); }
        }
        .v2-card:hover { animation: v2CardHover 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .v2-nav-link::after {
          content: '';
          display: block;
          height: 1px;
          background: #C9974A;
          width: 0;
          transition: width 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .v2-nav-link:hover::after { width: 100%; }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10 h-16 border-b border-white/5 backdrop-blur-md">
        <Link href="/" className="font-[var(--font-cormorant)] text-2xl font-light tracking-widest text-[#FDFAF6]">
          dwelliq
        </Link>
        <div className="flex items-center gap-8">
          <Link href="/v2#how" className="text-xs tracking-widest uppercase text-white/50 v2-nav-link hover:text-white/80 transition-colors hidden sm:block">Process</Link>
          <Link href="/v2#options" className="text-xs tracking-widest uppercase text-white/50 v2-nav-link hover:text-white/80 transition-colors hidden sm:block">Options</Link>
          <Link href="/design" className="text-xs tracking-widest uppercase border border-[#C9974A] text-[#C9974A] px-5 py-2 hover:bg-[#C9974A] hover:text-[#0A0908] transition-all duration-300">
            Start free →
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col justify-end overflow-hidden pb-20 sm:pb-28">
        <FurnitureCanvasLazy />

        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-[#0A0908]/60 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0908]/80 via-transparent to-[#0A0908]/40 pointer-events-none" />

        {/* Floating tag top-left */}
        <div className={`absolute top-24 left-6 sm:left-10 flex items-center gap-3 transition-all duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}>
          <div className="w-2 h-2 rounded-full bg-[#C9974A] animate-pulse" />
          <span className="text-xs tracking-[0.25em] uppercase text-white/40">AI Home Styling Advisor</span>
        </div>

        {/* Main headline */}
        <div className="relative z-10 px-6 sm:px-10 max-w-7xl">
          <div className="overflow-hidden mb-2">
            <span
              className="block font-[var(--font-cormorant)] text-[clamp(52px,9vw,130px)] font-light leading-[0.92] text-[#FDFAF6]"
              style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.1s" }}
            >
              <RevealText text="Every piece." delay={0.1} />
            </span>
          </div>
          <div className="overflow-hidden mb-6">
            <span
              className="block font-[var(--font-cormorant)] text-[clamp(52px,9vw,130px)] font-light leading-[0.92] italic text-[#C9974A]"
              style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.1s" }}
            >
              <RevealText text="Three options." delay={0.25} />
            </span>
          </div>

          <div className="h-px bg-[#C9974A]/30 mb-6 v2-line-in" />

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
            <p
              className="text-[#FDFAF6]/50 text-lg sm:text-xl max-w-md leading-relaxed"
              style={{
                opacity: mounted ? 1 : 0,
                animation: mounted ? "v2FadeIn 0.8s 0.8s cubic-bezier(0.22,1,0.36,1) both" : "none",
              }}
            >
              Best within your budget. Best if you can stretch. Best from a local shop near you.
              <br />
              <em className="text-[#FDFAF6]/30 not-italic text-sm">Always. For every single furniture piece.</em>
            </p>

            <div className="flex items-center gap-6">
              <Link
                href="/design"
                ref={magneticRef}
                className="group relative inline-flex items-center gap-3 bg-[#C9974A] text-[#0A0908] px-8 py-4 text-sm font-medium tracking-widest uppercase overflow-hidden"
                style={{ transition: "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}
              >
                <span className="relative z-10">Design my room</span>
                <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">→</span>
                <div className="absolute inset-0 bg-[#B8863B] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>
              <span className="text-xs text-white/30 tracking-wider">Free · No login</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-8 flex flex-col items-center gap-2 opacity-30">
          <div className="w-px h-16 bg-gradient-to-b from-transparent to-[#C9974A]" />
          <span className="text-xs tracking-widest uppercase rotate-90 origin-center" style={{ writingMode: "vertical-rl" }}>
            scroll
          </span>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="border-y border-white/5 py-4 overflow-hidden bg-[#0A0908]">
        <div className="flex v2-ticker whitespace-nowrap">
          {[...Array(2)].map((_, outer) => (
            <div key={outer} className="flex flex-shrink-0">
              {[
                "Option A — Best within budget",
                "Option B — Best if flexible",
                "Option C — Best local boutique",
                "Sofa · Rug · Lamp · Chair · Table",
                "Free for homeowners",
                "Affiliate-first · No subscription",
              ].map((item, i) => (
                <span key={i} className="inline-flex items-center gap-4 text-xs tracking-[0.2em] uppercase text-white/25 px-8">
                  {item}
                  <span className="text-[#C9974A]">·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── THE PROBLEM ── */}
      <section className="py-28 sm:py-40 px-6 sm:px-10 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-20 items-start">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-[#C9974A] mb-8">The problem</p>
            <h2 className="font-[var(--font-cormorant)] text-4xl sm:text-5xl lg:text-6xl font-light leading-tight text-[#FDFAF6]">
              95% of homeowners can't afford a designer.
              <br />
              <span className="text-white/30">So they waste weekends.</span>
            </h2>
          </div>
          <div className="space-y-8 pt-4 sm:pt-14">
            {[
              { n: "01", text: "They spend hours on Pinterest with no idea what specific products are in the images." },
              { n: "02", text: "They visit 3–5 furniture stores and leave empty-handed because nothing matches their vision and budget simultaneously." },
              { n: "03", text: "They scroll through 50,000 sofas on Wayfair, paralysed by options with no design framework." },
              { n: "04", text: "They buy pieces that don't work together — and end up with a room that feels assembled, not designed." },
            ].map((item) => (
              <V2ProblemRow key={item.n} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* ── THREE OPTIONS DEMO ── */}
      <section id="options" className="py-28 bg-[#111010]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="mb-16">
            <p className="text-xs tracking-[0.25em] uppercase text-[#C9974A] mb-4">How Dwelliq works</p>
            <h2 className="font-[var(--font-cormorant)] text-4xl sm:text-5xl lg:text-6xl font-light text-[#FDFAF6]">
              Three options. Every time.
              <br />
              <em className="text-white/30">No exceptions.</em>
            </h2>
          </div>

          {/* Option cards — the core product */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/5 rounded-lg overflow-hidden">
            <V2OptionCard
              letter="A"
              label="Best within budget"
              accent="#4A6A58"
              accentBg="rgba(74,106,88,0.1)"
              tagColor="#DCFCE7"
              tagText="#166534"
              example={{ name: "Rivet Revolve Modern Sofa", retailer: "Amazon", price: "$799" }}
              description="The confident, no-regrets choice. Solid rating. Stays within your sofa budget. Ships fast. Most people who buy this love it."
              image="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"
              index={0}
            />
            <V2OptionCard
              letter="B"
              label="Best if flexible"
              accent="#1D4ED8"
              accentBg="rgba(29,78,216,0.1)"
              tagColor="#DBEAFE"
              tagText="#1D4ED8"
              example={{ name: "West Elm Haven Sofa", retailer: "West Elm", price: "$1,299" }}
              description="Worth the stretch. Premium linen, 10-year warranty, genuine quality you'll notice in five years. $300 more but earns every dollar."
              image="https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=400&q=80"
              index={1}
            />
            <V2OptionCard
              letter="C"
              label="Best local option"
              accent="#92400E"
              accentBg="rgba(146,64,14,0.1)"
              tagColor="#FEF3C7"
              tagText="#92400E"
              example={{ name: "Haven Home Boutique", retailer: "Local · 1.8 mi", price: "$920" }}
              description="From a boutique 1.8 miles away. You can see it in person before buying. 5/5 stars. Your money stays in the neighborhood."
              image="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80"
              index={2}
            />
          </div>

          {/* Categories row */}
          <div className="flex flex-wrap gap-3 mt-8">
            {["Sofa", "Coffee Table", "Area Rug", "Floor Lamp", "Accent Chair", "Wall Art", "Plants", "Curtains"].map((cat, i) => (
              <span
                key={cat}
                className="text-xs tracking-widest uppercase border border-white/10 text-white/30 px-4 py-2 hover:border-[#C9974A]/40 hover:text-white/60 transition-colors cursor-default"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section id="how" className="py-28 sm:py-40 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-6 text-center">
          {[
            { target: 200, suffix: "+", label: "Curated SKUs" },
            { target: 10, suffix: "", label: "Furniture categories" },
            { target: 3, suffix: "", label: "Options per piece, always" },
            { target: 0, suffix: "$", label: "Cost for homeowners" },
          ].map((s) => (
            <div key={s.label}>
              <Counter target={s.target} suffix={s.suffix === "$" ? "" : s.suffix} />
              {s.suffix === "$" && <span className="font-serif text-5xl sm:text-6xl font-light text-gold">$0</span>}
              <p className="text-xs tracking-[0.15em] uppercase text-white/30 mt-3">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT'S DIFFERENT ── */}
      <section className="py-28 bg-[#111010] px-6 sm:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-[0.25em] uppercase text-[#C9974A] mb-10">Why everything else fails</p>
          <div className="space-y-px">
            {[
              { tool: "Pinterest / Instagram", issue: "No specific products. No prices. No purchase path.", score: 15 },
              { tool: "Amazon / Wayfair", issue: "50,000 options with zero design context. Paralysis.", score: 22 },
              { tool: "IKEA Room Planner", issue: "Single brand. No style guidance. No neutral advice.", score: 28 },
              { tool: "Houzz / Havenly", issue: "Human designers cost $2,000–$15,000. Unaffordable.", score: 18 },
              { tool: "RoomGPT", issue: "Beautiful AI images. Zero purchasable inventory.", score: 35 },
            ].map((row, i) => (
              <V2CompetitorRow key={row.tool} {...row} index={i} />
            ))}
          </div>

          {/* Dwelliq answer */}
          <div className="mt-8 p-6 border border-[#C9974A]/30 bg-[#C9974A]/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#C9974A]" />
                <p className="font-medium text-[#FDFAF6] tracking-wide">Dwelliq</p>
              </div>
              <p className="text-white/50 text-sm">
                Free AI advisor. Three purchasable options per item. Budget-aware. Local store always included.
              </p>
            </div>
            <Link href="/design" className="flex-shrink-0 border border-[#C9974A] text-[#C9974A] px-6 py-3 text-sm tracking-wider hover:bg-[#C9974A] hover:text-[#0A0908] transition-all duration-300">
              Try it free →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-36 sm:py-48 px-6 sm:px-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-[#C9974A]/5 to-transparent pointer-events-none" />
        <p className="text-xs tracking-[0.25em] uppercase text-[#C9974A] mb-6">Stop wasting weekends</p>
        <h2 className="font-[var(--font-cormorant)] text-5xl sm:text-6xl lg:text-7xl font-light text-[#FDFAF6] leading-tight mb-10">
          Know exactly what to buy.
          <br />
          <em className="text-white/25">Before you leave the house.</em>
        </h2>
        <Link
          href="/design"
          className="inline-flex items-center gap-3 bg-[#C9974A] text-[#0A0908] px-12 py-4 text-sm font-medium tracking-widest uppercase hover:bg-[#B8863B] transition-colors duration-300"
        >
          Design my room — it's free
          <span>→</span>
        </Link>
        <p className="text-white/20 text-xs tracking-widest mt-6">Takes 2 minutes · No account required</p>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 px-6 sm:px-10 py-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link href="/" className="font-[var(--font-cormorant)] text-xl font-light text-[#FDFAF6]">dwelliq</Link>
          <p className="text-xs text-white/20 tracking-wider">© 2026 Dwelliq · Affiliate-first · Free for homeowners</p>
          <div className="flex gap-6 text-xs text-white/30">
            <Link href="/design" className="hover:text-white/60 transition-colors">Start free</Link>
            <Link href="/" className="hover:text-white/60 transition-colors">Classic</Link>
            <Link href="/v3" className="hover:text-white/60 transition-colors">Version 3</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function V2ProblemRow({ n, text }: { n: string; text: string }) {
  const { ref, visible } = useReveal(0.2);
  return (
    <div
      ref={ref}
      className={`flex gap-5 border-b border-white/5 pb-8 transition-all duration-600 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
    >
      <span className="font-[var(--font-dm-mono)] text-xs text-[#C9974A] pt-1 flex-shrink-0">{n}</span>
      <p className="text-white/50 text-sm leading-relaxed">{text}</p>
    </div>
  );
}

function V2OptionCard({
  letter, label, accent, accentBg, tagColor, tagText, example, description, image, index,
}: {
  letter: string; label: string; accent: string; accentBg: string;
  tagColor: string; tagText: string;
  example: { name: string; retailer: string; price: string };
  description: string; image: string; index: number;
}) {
  const { ref, visible } = useReveal(0.1);
  const [imgErr, setImgErr] = useState(false);

  return (
    <div
      ref={ref}
      className={`v2-card bg-[#0A0908] flex flex-col transition-all duration-700 cursor-default ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${index * 0.15}s` }}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden" style={{ background: accentBg }}>
        {!imgErr ? (
          <Image
            src={image}
            alt={example.name}
            fill
            className="object-cover opacity-60 hover:opacity-80 transition-opacity duration-500"
            unoptimized
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl opacity-10">🛋</span>
          </div>
        )}
        {/* Option badge */}
        <div className="absolute top-4 left-4">
          <span
            className="text-xs font-medium px-3 py-1 rounded-full"
            style={{ background: tagColor, color: tagText }}
          >
            Option {letter} · {label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 border-t border-white/5">
        <p className="text-sm font-medium text-[#FDFAF6] mb-1 leading-snug">{example.name}</p>
        <p className="text-xs text-white/30 mb-4">{example.retailer}</p>
        <p className="text-xs text-white/40 leading-relaxed mb-6 flex-1">{description}</p>
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <span className="font-[var(--font-cormorant)] text-2xl" style={{ color: accent === "#4A6A58" ? "#C9974A" : "#C9974A" }}>
            {example.price}
          </span>
          <Link
            href="/design"
            className="text-xs border px-4 py-2 transition-all duration-300 hover:text-[#0A0908] hover:bg-current"
            style={{ borderColor: `${accent}40`, color: accent === "#4A6A58" ? "#C9974A" : accent === "#1D4ED8" ? "#93C5FD" : "#FCD34D" }}
          >
            View →
          </Link>
        </div>
      </div>
    </div>
  );
}

function V2CompetitorRow({ tool, issue, score, index }: { tool: string; issue: string; score: number; index: number }) {
  const { ref, visible } = useReveal(0.1);
  return (
    <div
      ref={ref}
      className={`flex items-center justify-between gap-4 py-5 border-t border-white/5 group transition-all duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
      style={{ transitionDelay: `${index * 0.08}s` }}
    >
      <div className="flex items-center gap-6 min-w-0">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0 opacity-30 group-hover:opacity-60 transition-opacity">
          <path d="M2 2L12 12M12 2L2 12" stroke="#8B3A2A" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <div>
          <p className="text-sm font-medium text-[#FDFAF6]/70 group-hover:text-[#FDFAF6] transition-colors">{tool}</p>
          <p className="text-xs text-white/30">{issue}</p>
        </div>
      </div>
      <div className="flex-shrink-0 w-24 h-px bg-white/5 relative overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-[#8B3A2A]/40"
          style={{ width: visible ? `${score}%` : "0%", transition: "width 1s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </div>
    </div>
  );
}
