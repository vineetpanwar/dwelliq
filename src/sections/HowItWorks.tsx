"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { C } from "@/lib/tokens";
import { useIO } from "@/hooks/useIO";
import SectionHeader from "@/components/ui/SectionHeader";

// ── Step card visuals ────────────────────────────────────────────────────────

function StepVisualUpload({ color }: { color: string }) {
  return (
    <div className="space-y-3">
      <div className="rounded-xl p-5 text-center" style={{ border: "1px dashed rgba(255,255,255,0.1)" }}>
        <div className="text-3xl mb-2" style={{ opacity: 0.55 }}>↑</div>
        <p className="text-[11px]" style={{ color: "rgba(253,250,246,0.3)" }}>Drop room photos here</p>
        <div className="flex flex-wrap gap-1.5 justify-center mt-3">
          {["Living Room", "Bedroom", "Kitchen"].map(r => (
            <span key={r} className="text-[9px] px-2.5 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(253,250,246,0.35)", border: "1px solid rgba(255,255,255,0.07)" }}>{r}</span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {["Length: 14 ft", "Width: 12 ft"].map(d => (
          <div key={d} className="px-4 py-3 rounded-xl text-[12px]" style={{ background: "rgba(255,255,255,0.04)", color: "rgba(253,250,246,0.45)", border: "1px solid rgba(255,255,255,0.06)" }}>{d}</div>
        ))}
      </div>
      <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: `${color}12`, border: `1px solid ${color}22` }}>
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color, animation: "pulse 1.5s ease-in-out infinite" }} />
        <span className="text-[11px]" style={{ color }}>Vision model analysing space…</span>
      </div>
    </div>
  );
}

function StepVisualBudget({ color }: { color: string }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {["Fixed", "Flexible", "Time"].map((m, i) => (
          <div key={m} className="p-3 rounded-xl text-center text-[11px]"
            style={{ background: i === 0 ? `${color}15` : "rgba(255,255,255,0.04)", border: `1px solid ${i === 0 ? color + "30" : "rgba(255,255,255,0.06)"}`, color: i === 0 ? color : "rgba(253,250,246,0.28)" }}>
            {m}
          </div>
        ))}
      </div>
      <div>
        <div className="flex justify-between text-[10px] mb-2">
          <span style={{ color: "rgba(253,250,246,0.35)" }}>Budget</span>
          <span style={{ color }}>$4,200</span>
        </div>
        <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
          <div className="h-full rounded-full" style={{ width: "65%", background: color }} />
        </div>
        <div className="flex justify-between text-[9px] mt-1.5" style={{ color: "rgba(253,250,246,0.2)" }}>
          <span>$1,000</span><span>$10,000</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {["Japandi", "Mid-Century", "Biophilic"].map((st, i) => (
          <span key={st} className="text-[10px] px-3 py-1.5 rounded-full"
            style={{ background: i === 0 ? `${color}15` : "rgba(255,255,255,0.04)", border: `1px solid ${i === 0 ? color + "30" : "rgba(255,255,255,0.06)"}`, color: i === 0 ? color : "rgba(253,250,246,0.32)" }}>
            {st}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
        <span className="text-[10px]" style={{ color: "rgba(253,250,246,0.22)" }}>📍</span>
        <span className="text-[10px] font-[var(--font-dm-mono)]" style={{ color: "rgba(253,250,246,0.45)" }}>07302 · Jersey City, NJ</span>
      </div>
    </div>
  );
}

function StepVisualEngine({ color }: { color: string }) {
  return (
    <div className="space-y-3">
      <p className="text-[9px] tracking-[.22em] uppercase mb-4" style={{ color: "rgba(253,250,246,0.22)" }}>Allocating across rooms</p>
      {[
        { room: "Living Room", pct: 45, col: C.brass, amount: "$1,890" },
        { room: "Bedroom",     pct: 30, col: C.sage,  amount: "$1,260" },
        { room: "Kitchen",     pct: 25, col: C.terra, amount: "$1,050" },
      ].map(r => (
        <div key={r.room}>
          <div className="flex justify-between text-[11px] mb-1.5">
            <span style={{ color: "rgba(253,250,246,0.5)" }}>{r.room}</span>
            <span style={{ color: r.col }}>{r.amount}</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: r.col }} />
          </div>
        </div>
      ))}
      <div className="mt-4 p-3 rounded-xl" style={{ background: `${color}10`, border: `1px solid ${color}18` }}>
        <p className="text-[9px]" style={{ color: "rgba(253,250,246,0.32)" }}>
          AI rebalancing · furniture 38% · lighting 18% · décor 24% · storage 20%
        </p>
      </div>
    </div>
  );
}

function StepVisualPackages() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {[
        { plan: "Budget",   price: "$2,800", color: C.sage,  icon: "◎" },
        { plan: "Balanced", price: "$4,200", color: C.brass, icon: "◈", featured: true },
        { plan: "Premium",  price: "$6,500", color: C.terra, icon: "✦" },
      ].map(p => (
        <div key={p.plan} className="rounded-2xl p-4"
          style={{ background: p.featured ? `${p.color}12` : "rgba(255,255,255,0.03)", border: `1px solid ${p.featured ? p.color + "30" : "rgba(255,255,255,0.07)"}` }}>
          <div className="text-lg mb-2" style={{ color: p.color }}>{p.icon}</div>
          <p className="text-[9px] tracking-[.18em] uppercase mb-2" style={{ color: p.color }}>{p.plan}</p>
          <p className="font-[var(--font-cormorant)] text-xl text-[#FDFAF6] mb-3">{p.price}</p>
          <div className="space-y-1.5">
            {["2D plan", "3D walkthrough", "Shopping list"].map(f => (
              <div key={f} className="flex items-center gap-1.5">
                <span className="text-[8px]" style={{ color: p.color }}>✓</span>
                <p className="text-[9px]" style={{ color: "rgba(253,250,246,0.35)" }}>{f}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Steps data ───────────────────────────────────────────────────────────────

const HIW_STEPS = [
  { num: "01", icon: "↑", color: C.sage,  title: "Upload your room",  desc: "Share photos and tell us your property type, rooms, and basic dimensions. Our vision model reads the space in seconds." },
  { num: "02", icon: "◈", color: C.brass, title: "Set budget mode",    desc: "Choose Fixed, Flexible, or Time-Constrained. Add style preferences, hard constraints, and your postcode for local enrichment." },
  { num: "03", icon: "⊙", color: C.terra, title: "Engine optimises",   desc: "The cross-room allocation engine balances furniture, lighting, decor, and storage across your entire property simultaneously." },
  { num: "04", icon: "⬡", color: C.blue,  title: "Get 3 packages",    desc: "Budget-Friendly, Balanced, and Premium. Each includes a 2D plan, 3D walkthrough, and direct shopping links." },
] as const;

const HIW_DURATION = 4800;

// ── Main export ──────────────────────────────────────────────────────────────

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const { ref, v } = useIO(0.06);
  const N = HIW_STEPS.length;

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActive(c => (c + 1) % N), HIW_DURATION);
    return () => clearInterval(id);
  }, [paused, N]);

  const go = (i: number) => { setActive(i); setPaused(true); };

  return (
    <section id="how-it-works" className="py-24 sm:py-36 px-5 sm:px-8 lg:px-10 bg-[#F5F2EE]">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          label="How it works"
          title="From photo to furnished."
          subtitle="Four steps from a raw photo to a fully specified, budget-optimised design with 3D preview and shopping list."
        />

        <div ref={ref} className="mt-14 grid lg:grid-cols-[1fr_1fr] gap-8 lg:gap-14 items-start">
          {/* Left: step navigator */}
          <div className="space-y-1" style={{ opacity: v ? 1 : 0, transition: "opacity .5s" }}>
            {HIW_STEPS.map((s, i) => (
              <button
                key={s.num}
                onClick={() => go(i)}
                className="w-full text-left flex gap-4 items-start p-5 rounded-2xl"
                style={{
                  background: active === i ? "#FDFAF6" : "transparent",
                  boxShadow: active === i ? "0 4px 24px rgba(10,9,8,0.07)" : "none",
                  transition: "background .3s ease, box-shadow .3s ease",
                }}
              >
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-base mt-0.5"
                  style={{
                    background: active === i ? `${s.color}15` : "transparent",
                    color: active === i ? s.color : C.light,
                    border: `1px solid ${active === i ? s.color + "30" : C.border}`,
                    transition: "all .3s ease",
                  }}
                >
                  {s.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-semibold tracking-[.22em] uppercase block mb-1" style={{ color: active === i ? s.color : C.light, transition: "color .3s" }}>
                    {s.num}
                  </span>
                  <h3 className="font-[var(--font-cormorant)] text-[1.3rem] font-light leading-tight" style={{ color: active === i ? C.ink : C.mid, transition: "color .3s" }}>
                    {s.title}
                  </h3>
                  <div style={{ maxHeight: active === i ? 96 : 0, opacity: active === i ? 1 : 0, overflow: "hidden", transition: "max-height .4s cubic-bezier(.22,1,.36,1), opacity .3s ease" }}>
                    <p className="text-sm leading-relaxed mt-2" style={{ color: C.mid }}>{s.desc}</p>
                  </div>
                  {active === i && (
                    <div className="mt-3 h-[2px] rounded-full overflow-hidden" style={{ background: C.borderLight }}>
                      <div key={`pb-${i}`} className="h-full rounded-full" style={{ background: s.color, animation: `progressAdvance ${HIW_DURATION}ms linear forwards` }} />
                    </div>
                  )}
                </div>
              </button>
            ))}
            <div className="px-5 pt-4">
              <Link href="/design" className="inline-flex items-center gap-2 bg-[#0A0908] text-[#FDFAF6] px-8 py-4 rounded-2xl text-sm font-medium hover:bg-[#C9974A] hover:text-[#0A0908] transition-colors">
                Start Designing — It&apos;s Free →
              </Link>
            </div>
          </div>

          {/* Right: animated dark card */}
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{
              minHeight: 480,
              background: "#0A0908",
              opacity: v ? 1 : 0,
              transition: "opacity .5s .18s",
              boxShadow: "0 28px 80px rgba(10,9,8,0.13), 0 4px 20px rgba(10,9,8,0.07)",
            }}
          >
            {HIW_STEPS.map((s, i) => (
              <div
                key={i}
                className="absolute inset-0 p-7 sm:p-8"
                style={{
                  opacity: i === active ? 1 : 0,
                  transform: i === active ? "translateX(0) scale(1)" : i < active ? "translateX(-24px) scale(0.985)" : "translateX(24px) scale(0.985)",
                  transition: "opacity .5s cubic-bezier(.22,1,.36,1), transform .5s cubic-bezier(.22,1,.36,1)",
                  pointerEvents: i === active ? "auto" : "none",
                }}
              >
                <div className="absolute top-2 right-4 font-[var(--font-cormorant)] font-light select-none leading-none pointer-events-none" style={{ fontSize: 110, color: `${s.color}10` }}>
                  {s.num}
                </div>
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl mb-5" style={{ background: `${s.color}16`, color: s.color, border: `1px solid ${s.color}28` }}>
                  {s.icon}
                </div>
                <h3 className="font-[var(--font-cormorant)] text-[1.9rem] font-light text-[#FDFAF6] mb-5 leading-tight">{s.title}</h3>
                {i === 0 && <StepVisualUpload color={s.color} />}
                {i === 1 && <StepVisualBudget color={s.color} />}
                {i === 2 && <StepVisualEngine color={s.color} />}
                {i === 3 && <StepVisualPackages />}
              </div>
            ))}

            {/* Dot navigation */}
            <div className="absolute bottom-5 right-6 flex items-center gap-1.5">
              {HIW_STEPS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  style={{
                    width: i === active ? 22 : 6, height: 6, borderRadius: 3,
                    background: i === active ? HIW_STEPS[active].color : "rgba(255,255,255,0.18)",
                    border: "none", padding: 0, cursor: "pointer",
                    transition: "all .35s cubic-bezier(.34,1.56,.64,1)", flexShrink: 0,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
