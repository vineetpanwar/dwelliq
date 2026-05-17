"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { OnboardingData, RecommendationSet } from "@/lib/types";
import { generateRecommendations } from "@/lib/recommendations";
import { STYLE_LABELS } from "@/lib/catalog";
import RecommendationCard from "./RecommendationCard";
import EmailCapture from "./EmailCapture";
import StyleDNA from "./StyleDNA";
import MoodBoard from "./MoodBoard";
import RoomScaleAdvisor from "./RoomScaleAdvisor";
import CompleteTheLook from "./CompleteTheLook";

const DEMO: OnboardingData = {
  room: "living-room", dimensions: { length: 14, width: 12 },
  budget: 3500, style: "warm-mid-century", household: "couple",
  primaryUse: "relaxing", existingPieces: "", postcode: "10001",
};

export default function RecommendationPage() {
  const [data, setData] = useState<OnboardingData | null>(null);
  const [recs, setRecs] = useState<RecommendationSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [view, setView] = useState<"cards" | "moodboard">("cards");
  const [moodOption, setMoodOption] = useState<"A" | "B" | "C">("A");
  const [showDNA, setShowDNA] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("dwelliq_data");
    const parsed = stored ? (JSON.parse(stored) as OnboardingData) : DEMO;
    setData(parsed);
    setTimeout(() => { setRecs(generateRecommendations(parsed)); setLoading(false); }, 1400);
  }, []);

  function toggleSave(id: string) {
    setSaved((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  }

  const totalSpend = recs.reduce((s, r) => s + r.optionA.price, 0);
  const pct = data ? Math.round((totalSpend / data.budget) * 100) : 0;

  if (loading || !data) return <LoadingScreen />;
  if (recs.length === 0) return (
    <div className="min-h-screen bg-[#FDFAF6] flex items-center justify-center">
      <div className="text-center">
        <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: 28, fontWeight: 300 }} className="text-[#0A0908] mb-2">No recommendations found</p>
        <Link href="/design" className="text-sm text-[#C9974A] underline underline-offset-2">Start over</Link>
      </div>
    </div>
  );

  const rec = recs[active];

  return (
    <div className="min-h-screen bg-[#FDFAF6]" style={{ fontFamily: "var(--font-dm-sans), system-ui, sans-serif" }}>
      <style>{`
        @keyframes rise { from{opacity:0;transform:translateY(18px);} to{opacity:1;transform:translateY(0);} }
        .card-in { animation: rise 0.45s cubic-bezier(0.22,1,0.36,1) both; }
        .tab-scroll { scrollbar-width:none; }
        .tab-scroll::-webkit-scrollbar { display:none; }
      `}</style>

      {/* Sticky header */}
      <header className="sticky top-0 z-40 bg-[#FDFAF6]/95 backdrop-blur-md border-b border-[#CCC8C0]/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 flex items-center justify-between h-14 sm:h-16 gap-3">
          <Link href="/" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: 20, fontWeight: 300, letterSpacing: "0.08em" }} className="text-[#0A0908] hover:text-[#C9974A] transition-colors flex-shrink-0">
            dwelliq
          </Link>

          {/* Budget meter — hidden on very small screens */}
          <div className="hidden xs:flex items-center gap-2 sm:gap-3 flex-1 max-w-[180px] sm:max-w-xs">
            <div className="flex-1 h-1.5 bg-[#E8E4DE] rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, pct)}%`, background: pct > 100 ? "#8B3A2A" : "#C9974A" }} />
            </div>
            <span className="text-[10px] sm:text-xs text-[#5C5550] flex-shrink-0 whitespace-nowrap">
              <span style={{ fontFamily: "var(--font-dm-mono), monospace" }} className="text-[#0A0908] font-medium">${totalSpend.toLocaleString()}</span>
              <span className="hidden sm:inline">{" / $"}{data.budget.toLocaleString()}</span>
            </span>
          </div>

          <Link href="/design" className="text-xs text-[#5C5550] hover:text-[#0A0908] transition-colors flex-shrink-0">
            <span className="hidden sm:inline">Start over →</span>
            <span className="sm:hidden">↩</span>
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-10">

        {/* Hero title + view toggle */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10 card-in">
          <div>
            <p className="text-[10px] font-semibold text-[#C9974A] tracking-[0.2em] uppercase mb-2">Your personalized room</p>
            <h1 className="text-[#0A0908] leading-tight mb-1"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "clamp(22px,4vw,44px)", fontWeight: 300 }}>
              {STYLE_LABELS[data.style]}
              <span className="text-[#CCC8C0] mx-2 sm:mx-3">·</span>
              <span className="text-[#C9974A]">${data.budget.toLocaleString()}</span>
              <span className="hidden sm:inline">
                <span className="text-[#CCC8C0] mx-3">·</span>
                {data.dimensions.length}&thinsp;×&thinsp;{data.dimensions.width} ft
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-[#5C5550]">
              {recs.length} categories · A = within budget · C = local boutique
            </p>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex rounded-xl border border-[#CCC8C0] overflow-hidden">
              {(["cards", "moodboard"] as const).map((v) => (
                <button key={v} onClick={() => setView(v)}
                  className="px-3 py-2 text-xs font-medium transition-all duration-200 flex items-center gap-1.5"
                  style={{ background: view === v ? "#0A0908" : "#FDFAF6", color: view === v ? "#FDFAF6" : "#5C5550" }}>
                  {v === "cards" ? (
                    <><svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><rect x="0" y="0" width="5" height="5" rx="1"/><rect x="7" y="0" width="5" height="5" rx="1"/><rect x="0" y="7" width="5" height="5" rx="1"/><rect x="7" y="7" width="5" height="5" rx="1"/></svg>Cards</>
                  ) : (
                    <><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="0.75" y="0.75" width="4" height="6" rx="1"/><rect x="7.25" y="0.75" width="4" height="3.5" rx="1"/><rect x="7.25" y="7.25" width="4" height="4" rx="1"/><rect x="0.75" y="9" width="4" height="2.25" rx="1"/></svg>Mood board</>
                  )}
                </button>
              ))}
            </div>
            <button onClick={() => setShowDNA((s) => !s)}
              className="px-3 py-2 rounded-xl text-xs font-medium border border-[#CCC8C0] text-[#5C5550] hover:border-[#C9974A] hover:text-[#C9974A] transition-colors duration-200">
              {showDNA ? "Hide" : "Show"} DNA
            </button>
          </div>
        </div>

        {/* Style DNA card */}
        {showDNA && <StyleDNA data={data} />}

        {/* Room Scale Advisor */}
        <RoomScaleAdvisor data={data} />

        {/* Mood board view */}
        {view === "moodboard" && (
          <div className="mb-4">
            <div className="flex gap-2 mb-6">
              {(["A", "B", "C"] as const).map((opt) => (
                <button key={opt} onClick={() => setMoodOption(opt)}
                  className="px-4 py-2 rounded-full text-xs border transition-all duration-200"
                  style={{
                    background: moodOption === opt ? "#C9974A" : "transparent",
                    borderColor: moodOption === opt ? "#C9974A" : "#CCC8C0",
                    color: moodOption === opt ? "#FDFAF6" : "#5C5550",
                  }}>
                  Option {opt}
                </button>
              ))}
            </div>
            <MoodBoard recs={recs} selectedOption={moodOption} />
          </div>
        )}

        {/* Category tabs — only in cards view */}
        {view === "cards" && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 sm:mb-8 tab-scroll" style={{ WebkitOverflowScrolling: "touch" }}>
            {recs.map((r, i) => (
              <button key={r.category} onClick={() => setActive(i)}
                className="flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs border transition-all duration-200"
                style={{
                  borderColor: active === i ? "#C9974A" : "#CCC8C0",
                  background: active === i ? "#C9974A" : "transparent",
                  color: active === i ? "#FDFAF6" : "#5C5550",
                }}>
                {r.categoryLabel}
              </button>
            ))}
          </div>
        )}

        {/* Cards section — hidden in moodboard view */}
        {view === "cards" && <>

        {/* Category header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-[#0A0908]" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: 28, fontWeight: 300 }}>
              {rec.categoryLabel}
            </h2>
            <p className="text-xs text-[#5C5550] mt-0.5">
              Allocated budget: <span style={{ fontFamily: "var(--font-dm-mono), monospace" }} className="text-[#0A0908]">${rec.categoryBudget.toLocaleString()}</span>
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[10px] text-[#5C5550]">
            {[{c:"#DCFCE7",t:"#166534",l:"A · within budget"},{c:"#DBEAFE",t:"#1D4ED8",l:"B · if flexible"},{c:"#FEF3C7",t:"#92400E",l:"C · local"}].map((o)=>(
              <span key={o.l} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium" style={{ background: o.c, color: o.t }}>{o.l}</span>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div key={active} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 sm:mb-10">
          {([
            { opt: "A" as const, product: rec.optionA },
            { opt: "B" as const, product: rec.optionB },
            { opt: "C" as const, product: rec.optionC },
          ]).map(({ opt, product }, i) => (
            <div key={opt} className="card-in" style={{ animationDelay: `${i * 0.08}s` }}>
              <RecommendationCard
                option={opt}
                product={product}
                saved={saved.has(product.id)}
                onSave={() => toggleSave(product.id)}
              />
            </div>
          ))}
        </div>

        {/* Prev / Next + dots */}
        <div className="flex items-center justify-between mb-16">
          <button onClick={() => setActive((a) => Math.max(0, a - 1))} disabled={active === 0}
            className="flex items-center gap-2 text-sm text-[#5C5550] disabled:opacity-25 hover:text-[#0A0908] transition-colors">
            ← {active > 0 ? recs[active - 1].categoryLabel : ""}
          </button>
          <div className="flex gap-2">
            {recs.map((_, i) => (
              <button key={i} onClick={() => setActive(i)}
                className="rounded-full transition-all duration-200"
                style={{ width: i === active ? 20 : 8, height: 8, background: i === active ? "#C9974A" : "#CCC8C0" }} />
            ))}
          </div>
          <button onClick={() => setActive((a) => Math.min(recs.length - 1, a + 1))} disabled={active === recs.length - 1}
            className="flex items-center gap-2 text-sm text-[#5C5550] disabled:opacity-25 hover:text-[#0A0908] transition-colors">
            {active < recs.length - 1 ? recs[active + 1].categoryLabel : ""} →
          </button>
        </div>

        {/* All categories overview */}
        <div className="mb-16">
          <h2 className="text-[#0A0908] mb-5" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: 26, fontWeight: 300 }}>
            All recommendations
          </h2>
          <div className="space-y-2">
            {recs.map((r, i) => (
              <button key={r.category} onClick={() => setActive(i)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-200"
                style={{
                  borderColor: i === active ? "#C9974A" : "#E8E4DE",
                  background: i === active ? "#FDF5E8" : "#FDFAF6",
                }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: i === active ? "#C9974A" : "#CCC8C0" }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0A0908]">{r.categoryLabel}</p>
                  <p className="text-xs text-[#5C5550] truncate">
                    From ${Math.min(r.optionA.price, r.optionB.price, r.optionC.price).toLocaleString()} · {r.optionA.retailer}, {r.optionB.retailer}, {r.optionC.retailer}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#5C5550] flex-shrink-0">
                  <span style={{ fontFamily: "var(--font-dm-mono), monospace" }}>${r.categoryBudget.toLocaleString()}</span>
                  <span className="text-[#CCC8C0]">→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        </>}

        <CompleteTheLook style={data.style} />
      </div>

      <EmailCapture />
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#FDFAF6] flex flex-col items-center justify-center gap-6 px-6">
      <style>{`
        @keyframes shimmer { 0%{background-position:-1000px 0} 100%{background-position:1000px 0} }
        .shimmer { background:linear-gradient(90deg,#F5F2EE 25%,#EDE9E4 50%,#F5F2EE 75%); background-size:1000px 100%; animation:shimmer 1.5s infinite; }
        @keyframes bounce { 0%,100%{transform:translateY(0);opacity:1} 50%{transform:translateY(-8px);opacity:0.5} }
      `}</style>

      <div>
        <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: 32, fontWeight: 300 }} className="text-[#0A0908] text-center mb-2">
          Finding your perfect matches…
        </p>
        <p className="text-sm text-[#5C5550] text-center max-w-sm">
          Matching your style and budget across 200+ curated products from Amazon, West Elm, Wayfair, and local boutiques.
        </p>
      </div>

      <div className="flex gap-2">
        {[0,1,2].map((i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-[#C9974A]"
            style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
        {[0,1,2].map((i) => (
          <div key={i} className="rounded-2xl overflow-hidden border border-[#E8E4DE]" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="shimmer h-48" />
            <div className="p-4 space-y-2.5">
              <div className="shimmer h-3 rounded-lg w-3/4" />
              <div className="shimmer h-3 rounded-lg w-1/2" />
              <div className="shimmer h-5 rounded-lg w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
