"use client";

import Link from "next/link";
import { C } from "@/lib/tokens";
import { useIO } from "@/hooks/useIO";

const TESTIMONIALS = [
  { quote: "DwellIQ rebuilt our entire apartment — living room, bedroom, dining — inside a single budget envelope. I never thought cross-room coordination was possible this affordably.", name: "Maya R.",  role: "Homeowner · Jersey City NJ",       initials: "MR", color: C.brass, saved: "$1,240" },
  { quote: "The 3D walkthrough sold my clients before a single piece was purchased. We closed a $28k project in one meeting.",                                                           name: "James T.", role: "Interior Designer · Austin TX",     initials: "JT", color: C.sage },
  { quote: "I told the AI 'keep the sofa, go more Japandi'. It rerouted the budget across three rooms and updated the 3D model in seconds.",                                             name: "Priya M.", role: "Apartment refresh · Brooklyn NY", initials: "PM", color: C.terra },
];

export default function Testimonials() {
  const { ref, v } = useIO(0.08);

  return (
    <section className="py-24 sm:py-32 px-5 sm:px-8 lg:px-10">
      <div ref={ref} className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div style={{ opacity: v ? 1 : 0, transition: "opacity .5s" }}>
            <p className="text-[10px] font-semibold tracking-[.18em] uppercase text-[#C9974A] mb-3">Real results</p>
            <h2 className="font-[var(--font-cormorant)] text-5xl sm:text-6xl font-light text-[#0A0908]">What they say.</h2>
          </div>
          <Link href="/design" className="hidden sm:flex items-center gap-2 text-sm text-[#5C5550] ul-link hover:text-[#0A0908] transition-colors" style={{ opacity: v ? 1 : 0, transition: "opacity .5s .1s" }}>
            Join 24,000+ homeowners — it&apos;s free →
          </Link>
        </div>

        {/* Featured quote */}
        <div className="bg-[#0A0908] rounded-3xl p-8 sm:p-12 lg:p-16 mb-5 relative overflow-hidden" style={{ opacity: v ? 1 : 0, transition: "opacity .5s .15s" }}>
          <div className="absolute top-0 left-10 font-[var(--font-cormorant)] select-none pointer-events-none" style={{ fontSize: 160, lineHeight: 1, color: "rgba(201,151,74,0.07)" }}>&ldquo;</div>
          <div className="relative z-10 flex flex-col sm:flex-row gap-10 lg:gap-16 items-start">
            <div className="flex-1">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} width="13" height="13" viewBox="0 0 13 13" fill="#C9974A"><path d="M6.5 1l1.4 2.8 3.1.5-2.3 2.2.6 3.1L6.5 8.1 3.7 9.6l.6-3.1L2 3.3l3.1-.5L6.5 1z"/></svg>
                ))}
              </div>
              <p className="font-[var(--font-cormorant)] text-2xl sm:text-[2rem] lg:text-[2.25rem] font-light text-[#FDFAF6] leading-[1.38] mb-8 italic">
                &ldquo;{TESTIMONIALS[0].quote}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-xs font-bold text-[#FDFAF6] flex-shrink-0 ring-2 ring-white/10" style={{ background: TESTIMONIALS[0].color }}>
                  {TESTIMONIALS[0].initials}
                </div>
                <div>
                  <p className="text-[#FDFAF6] text-sm font-semibold">{TESTIMONIALS[0].name}</p>
                  <p className="text-[#FDFAF6]/40 text-xs mt-0.5">{TESTIMONIALS[0].role}</p>
                </div>
              </div>
            </div>
            {TESTIMONIALS[0].saved && (
              <div className="hidden sm:flex flex-col gap-3 flex-shrink-0 min-w-[160px]">
                <div className="text-center px-6 py-5 rounded-2xl border border-white/8 bg-white/3">
                  <p className="font-[var(--font-cormorant)] text-4xl text-[#C9974A] leading-none mb-2">{TESTIMONIALS[0].saved}</p>
                  <p className="text-[9px] text-[#FDFAF6]/35 uppercase tracking-[.18em]">saved vs. designer</p>
                </div>
                <div className="text-center px-6 py-5 rounded-2xl border border-white/8 bg-white/3">
                  <p className="font-[var(--font-cormorant)] text-4xl text-[#FDFAF6] leading-none mb-2">3</p>
                  <p className="text-[9px] text-[#FDFAF6]/35 uppercase tracking-[.18em]">rooms, one budget</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Secondary quotes */}
        <div className="grid sm:grid-cols-2 gap-4">
          {TESTIMONIALS.slice(1).map((t, i) => (
            <div key={t.name} className="bg-[#F5F2EE] border border-[#D4CFC8] rounded-2xl p-7 card-lift" style={{ opacity: v ? 1 : 0, transition: `opacity .5s ${.25 + i * .1}s` }}>
              <div className="flex gap-0.5 mb-5">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} width="11" height="11" viewBox="0 0 11 11" fill="#C9974A"><path d="M5.5 1l1.2 2.4L9.5 4 7.5 6l.4 2.7L5.5 7.4 3.1 8.7l.4-2.7L1.5 4l2.8-.6L5.5 1z"/></svg>
                ))}
              </div>
              <p className="font-[var(--font-cormorant)] text-[1.15rem] font-light text-[#0A0908] leading-[1.55] mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#EAE6DF]">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-[#FDFAF6] flex-shrink-0" style={{ background: t.color }}>{t.initials}</div>
                <div>
                  <p className="text-[#0A0908] text-sm font-semibold leading-none">{t.name}</p>
                  <p className="text-[#9C948C] text-xs mt-1">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
