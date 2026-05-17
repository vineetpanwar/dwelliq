"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { OnboardingData, StylePreference, HouseholdType } from "@/lib/types";
import { STYLE_LABELS, STYLE_DESCRIPTIONS, STYLE_IMAGES } from "@/lib/catalog";

const INITIAL: OnboardingData = {
  room: "living-room",
  dimensions: { length: 14, width: 12 },
  budget: 3500,
  style: "warm-mid-century",
  household: "couple",
  primaryUse: "relaxing",
  existingPieces: "",
  postcode: "",
};

const STYLES: { value: StylePreference; label: string; desc: string; img: string }[] = [
  { value: "warm-mid-century",    label: "Warm Mid-Century",       desc: "Walnut tones, tapered legs, warm textures",     img: STYLE_IMAGES["warm-mid-century"]    },
  { value: "scandinavian-minimal",label: "Scandinavian Minimal",   desc: "Clean lines, light woods, quiet colors",       img: STYLE_IMAGES["scandinavian-minimal"] },
  { value: "modern-glam",         label: "Modern Glam",            desc: "Jewel tones, metallics, bold shapes",           img: STYLE_IMAGES["modern-glam"]         },
  { value: "earthy-organic",      label: "Earthy Organic",         desc: "Natural materials, earth tones, texture",      img: STYLE_IMAGES["earthy-organic"]      },
  { value: "eclectic-maximalist", label: "Eclectic Maximalist",    desc: "Pattern mixing, bold color, curated layers",   img: STYLE_IMAGES["eclectic-maximalist"] },
];

const HOUSEHOLDS: { value: HouseholdType; label: string; sub: string }[] = [
  { value: "solo",        label: "Just me",              sub: "One person, one perspective" },
  { value: "couple",      label: "Couple",               sub: "Two people, shared spaces" },
  { value: "family-kids", label: "Family with kids",     sub: "Durability matters here" },
  { value: "family-pets", label: "Family with pets",     sub: "Performance fabrics win" },
  { value: "roommates",   label: "Roommates",            sub: "Flexible and functional" },
];

const USES = [
  { value: "relaxing", label: "Relaxing & unwinding",   icon: "◎" },
  { value: "working",  label: "Working from home",       icon: "◗" },
  { value: "hosting",  label: "Hosting & entertaining",  icon: "◑" },
  { value: "all",      label: "All of the above",        icon: "◕" },
];

const BUDGET_ALLOC = [
  { label: "Sofa", pct: 35 }, { label: "Area rug", pct: 15 },
  { label: "Accent chair", pct: 12 }, { label: "Coffee table", pct: 12 },
  { label: "Floor lamp", pct: 8 }, { label: "Art + decor", pct: 18 },
];

const TOTAL_STEPS = 6;

export default function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(INITIAL);
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  function go(delta: number) {
    setVisible(false);
    setTimeout(() => {
      setStep((s) => s + delta);
      setVisible(true);
    }, 220);
  }

  async function finish() {
    sessionStorage.setItem("dwelliq_data", JSON.stringify(data));

    // Persist to server — best-effort, don't block navigation
    try {
      const existingToken = sessionStorage.getItem("dwelliq_session_token") ?? undefined;
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_token: existingToken, onboarding_data: data }),
      });
      if (res.ok) {
        const json = await res.json();
        sessionStorage.setItem("dwelliq_session_token", json.session_token);
      }
    } catch {
      // silently continue — sessionStorage fallback still works
    }

    router.push("/recommendations");
  }

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen bg-[#FDFAF6] flex flex-col" style={{ fontFamily: "var(--font-dm-sans), system-ui, sans-serif" }}>
      <style>{`
        @keyframes rise { from{opacity:0;transform:translateY(22px);} to{opacity:1;transform:translateY(0);} }
        @keyframes barGrow { from{width:0} to{width:100%} }
        .step-in { animation: rise 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        input[type=range] { -webkit-appearance:none; appearance:none; height:3px; border-radius:99px; outline:none; cursor:pointer; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:20px; height:20px; border-radius:50%; background:#C9974A; box-shadow:0 2px 8px rgba(201,151,74,0.4); cursor:pointer; }
      `}</style>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-12 h-16 bg-[#FDFAF6]/92 backdrop-blur-md border-b border-[#CCC8C0]/50">
        <Link href="/" className="text-[#0A0908] hover:text-[#C9974A] transition-colors" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: 22, fontWeight: 300, letterSpacing: "0.08em" }}>
          dwelliq
        </Link>
        <div className="flex items-center gap-5">
          <span className="text-xs text-[#5C5550]">{step + 1} of {TOTAL_STEPS}</span>
          {step > 0 && (
            <button onClick={() => go(-1)} className="text-xs text-[#5C5550] hover:text-[#0A0908] transition-colors">
              ← Back
            </button>
          )}
        </div>
      </nav>

      {/* Progress bar */}
      <div className="fixed top-16 left-0 right-0 z-40 h-[2px] bg-[#E8E4DE]">
        <div className="h-full bg-[#C9974A] transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 pt-28"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(12px)", transition: "opacity 0.22s ease, transform 0.22s ease" }}
      >
        <div className="w-full max-w-2xl">
          {step === 0 && <StepBudget data={data} onChange={(v) => setData((d) => ({ ...d, ...v }))} onNext={() => go(1)} mounted={mounted} />}
          {step === 1 && <StepDimensions data={data} onChange={(v) => setData((d) => ({ ...d, ...v }))} onNext={() => go(1)} />}
          {step === 2 && <StepStyle data={data} onChange={(v) => setData((d) => ({ ...d, ...v }))} onNext={() => go(1)} />}
          {step === 3 && <StepHousehold data={data} onChange={(v) => setData((d) => ({ ...d, ...v }))} onNext={() => go(1)} />}
          {step === 4 && <StepUse data={data} onChange={(v) => setData((d) => ({ ...d, ...v }))} onNext={() => go(1)} />}
          {step === 5 && <StepFinish data={data} onChange={(v) => setData((d) => ({ ...d, ...v }))} onNext={finish} />}
        </div>
      </div>
    </div>
  );
}

// ── Shared pieces ────────────────────────────────────────────────────────────

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-semibold text-[#C9974A] tracking-[0.2em] uppercase mb-3">{children}</p>;
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[#0A0908] leading-tight mb-2"
      style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 300 }}>
      {children}
    </h2>
  );
}

function Sub({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-[#5C5550] mb-8 leading-relaxed">{children}</p>;
}

function NextBtn({ onClick, label = "Continue →" }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden mt-10 inline-flex items-center gap-3 bg-[#0A0908] text-[#FDFAF6] px-8 py-3.5 rounded-2xl text-sm font-medium shadow-lg hover:shadow-xl transition-shadow"
    >
      <span className="relative z-10">{label}</span>
      <div className="absolute inset-0 bg-[#C9974A] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-400 rounded-2xl" />
    </button>
  );
}

// ── Step 0: Budget ───────────────────────────────────────────────────────────

function StepBudget({ data, onChange, onNext, mounted }: {
  data: OnboardingData; onChange: (v: Partial<OnboardingData>) => void;
  onNext: () => void; mounted: boolean;
}) {
  const pct = ((data.budget - 500) / 9500) * 100;

  return (
    <div className="step-in">
      <Eyebrow>Your budget</Eyebrow>
      <Heading>What&rsquo;s your total budget for this room?</Heading>
      <Sub>Include everything — furniture, lighting, rugs, art. We&rsquo;ll allocate intelligently across every piece.</Sub>

      {/* Amount display */}
      <div className="mb-6 flex items-baseline gap-3">
        <span style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: 72, fontWeight: 300, color: "#0A0908", lineHeight: 1 }}>
          ${data.budget.toLocaleString()}
        </span>
        <span className="text-sm text-[#5C5550]">total</span>
      </div>

      {/* Slider */}
      <div className="mb-6">
        <input
          type="range" min={500} max={10000} step={100} value={data.budget}
          onChange={(e) => onChange({ budget: Number(e.target.value) })}
          className="w-full"
          style={{ background: `linear-gradient(to right, #C9974A ${pct}%, #CCC8C0 ${pct}%)` }}
        />
        <div className="flex justify-between text-xs text-[#5C5550] mt-2"><span>$500</span><span>$10,000+</span></div>
      </div>

      {/* Quick presets */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[1000,2000,3500,5000,7500,10000].map((p) => (
          <button key={p} onClick={() => onChange({ budget: p })}
            className="px-4 py-2 rounded-full text-xs border transition-all duration-200"
            style={{ borderColor: data.budget === p ? "#C9974A" : "#CCC8C0", background: data.budget === p ? "#C9974A" : "transparent", color: data.budget === p ? "#FDFAF6" : "#5C5550" }}>
            ${p.toLocaleString()}
          </button>
        ))}
      </div>

      {/* Allocation preview */}
      <div className="rounded-2xl border border-[#E8E4DE] bg-[#F5F2EE] p-5">
        <p className="text-[10px] font-semibold text-[#5C5550] tracking-[0.15em] uppercase mb-4">How we allocate this</p>
        <div className="space-y-2.5">
          {BUDGET_ALLOC.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-xs text-[#5C5550] w-28">{item.label}</span>
              <div className="flex-1 h-1.5 bg-[#CCC8C0]/40 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${item.pct}%`, background: "#C9974A", opacity: 0.7, transition: "width 0.3s ease" }} />
              </div>
              <span className="text-xs text-[#C9974A] w-14 text-right" style={{ fontFamily: "var(--font-dm-mono), monospace" }}>
                ${Math.round(data.budget * item.pct / 100).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <NextBtn onClick={onNext} />
    </div>
  );
}

// ── Step 1: Dimensions ───────────────────────────────────────────────────────

function StepDimensions({ data, onChange, onNext }: {
  data: OnboardingData; onChange: (v: Partial<OnboardingData>) => void; onNext: () => void;
}) {
  return (
    <div className="step-in">
      <Eyebrow>Your space</Eyebrow>
      <Heading>How big is your living room?</Heading>
      <Sub>Typical living rooms are between 10&times;12 and 20&times;24 feet. This helps us scale recommendations correctly.</Sub>

      <div className="flex flex-wrap items-end gap-3 sm:gap-5 mb-10">
        <DimBox label="Length" value={data.dimensions.length} onChange={(v) => onChange({ dimensions: { ...data.dimensions, length: v } })} />
        <span className="text-2xl text-[#CCC8C0] font-light pb-1">×</span>
        <DimBox label="Width" value={data.dimensions.width} onChange={(v) => onChange({ dimensions: { ...data.dimensions, width: v } })} />
        <span className="text-sm text-[#5C5550] pb-1">ft</span>
      </div>

      {/* Visual hint */}
      <div className="mb-4 p-4 rounded-xl border border-[#E8E4DE] bg-[#F5F2EE] flex items-center gap-4">
        <div className="bg-[#C9974A]/10 border border-[#C9974A]/30 rounded flex items-end justify-end"
          style={{ width: Math.max(40, Math.min(140, data.dimensions.width * 5)), height: Math.max(30, Math.min(100, data.dimensions.length * 4)), transition: "all 0.3s ease" }}>
          <span className="text-[8px] text-[#C9974A] p-1">{data.dimensions.length}&times;{data.dimensions.width}</span>
        </div>
        <div className="text-xs text-[#5C5550] leading-relaxed">
          <p className="font-medium text-[#0A0908]">{data.dimensions.length}&thinsp;×&thinsp;{data.dimensions.width} ft</p>
          <p>{(data.dimensions.length * data.dimensions.width).toLocaleString()} sq ft — {data.dimensions.length * data.dimensions.width < 150 ? "cozy" : data.dimensions.length * data.dimensions.width < 250 ? "comfortable" : "spacious"}</p>
        </div>
      </div>

      <NextBtn onClick={onNext} />
    </div>
  );
}

function DimBox({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-[#5C5550]">{label}</label>
      <div className="flex items-center gap-1">
        <button onClick={() => onChange(Math.max(8, value - 1))}
          className="w-8 h-10 rounded-l-xl border border-[#CCC8C0] bg-[#F5F2EE] text-[#5C5550] hover:bg-[#E8E4DE] transition-colors text-lg font-light">−</button>
        <input type="number" min={8} max={40} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-16 h-10 border-t border-b border-[#CCC8C0] text-center text-sm font-medium text-[#0A0908] bg-[#FDFAF6] outline-none focus:border-[#C9974A]" />
        <button onClick={() => onChange(Math.min(40, value + 1))}
          className="w-8 h-10 rounded-r-xl border border-[#CCC8C0] bg-[#F5F2EE] text-[#5C5550] hover:bg-[#E8E4DE] transition-colors text-lg font-light">+</button>
      </div>
    </div>
  );
}

// ── Step 2: Style ────────────────────────────────────────────────────────────

function StepStyle({ data, onChange, onNext }: {
  data: OnboardingData; onChange: (v: Partial<OnboardingData>) => void; onNext: () => void;
}) {
  return (
    <div className="step-in">
      <Eyebrow>Your style</Eyebrow>
      <Heading>Which direction feels most like you?</Heading>
      <Sub>Pick the one that makes you feel most at home — you can always refine later.</Sub>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-2">
        {STYLES.map((s) => {
          const sel = data.style === s.value;
          return (
            <button key={s.value} onClick={() => { onChange({ style: s.value }); }}
              className="relative rounded-2xl overflow-hidden text-left border-2 transition-all duration-200"
              style={{ borderColor: sel ? "#C9974A" : "transparent", boxShadow: sel ? "0 0 0 2px #C9974A" : "0 2px 12px rgba(10,9,8,0.06)" }}>
              <div className="relative h-32 overflow-hidden">
                <Image src={s.img} alt={s.label} fill className="object-cover" unoptimized
                  style={{ transform: sel ? "scale(1.06)" : "scale(1)", transition: "transform 0.4s ease" }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908]/70 via-[#0A0908]/10 to-transparent" />
                {sel && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#C9974A] flex items-center justify-center">
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#FDFAF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                )}
              </div>
              <div className="p-3 bg-[#FDFAF6]">
                <p className="text-xs font-semibold text-[#0A0908]">{s.label}</p>
                <p className="text-[10px] text-[#5C5550] mt-0.5 leading-relaxed">{s.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      <NextBtn onClick={onNext} />
    </div>
  );
}

// ── Step 3: Household ────────────────────────────────────────────────────────

function StepHousehold({ data, onChange, onNext }: {
  data: OnboardingData; onChange: (v: Partial<OnboardingData>) => void; onNext: () => void;
}) {
  return (
    <div className="step-in">
      <Eyebrow>Your household</Eyebrow>
      <Heading>Who lives in this space?</Heading>
      <Sub>This shapes durability, material, and practicality recommendations.</Sub>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {HOUSEHOLDS.map((h) => {
          const sel = data.household === h.value;
          return (
            <button key={h.value} onClick={() => onChange({ household: h.value })}
              className="flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-200"
              style={{
                borderColor: sel ? "#C9974A" : "#E8E4DE",
                background: sel ? "#FDF5E8" : "#FDFAF6",
                boxShadow: sel ? "0 0 0 1px #C9974A" : "none",
              }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: sel ? "#C9974A" : "#F5F2EE" }}>
                <span className="text-lg" style={{ color: sel ? "#FDFAF6" : "#5C5550" }}>
                  {h.value === "solo" ? "◎" : h.value === "couple" ? "◑" : h.value === "family-kids" ? "◕" : h.value === "family-pets" ? "◖" : "◗"}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0A0908]">{h.label}</p>
                <p className="text-xs text-[#5C5550]">{h.sub}</p>
              </div>
              {sel && (
                <div className="ml-auto w-5 h-5 rounded-full bg-[#C9974A] flex items-center justify-center flex-shrink-0">
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#FDFAF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <NextBtn onClick={onNext} />
    </div>
  );
}

// ── Step 4: Primary use ──────────────────────────────────────────────────────

function StepUse({ data, onChange, onNext }: {
  data: OnboardingData; onChange: (v: Partial<OnboardingData>) => void; onNext: () => void;
}) {
  return (
    <div className="step-in">
      <Eyebrow>How you use it</Eyebrow>
      <Heading>How do you primarily use this room?</Heading>
      <Sub>This shapes layout priorities and which furniture pieces matter most.</Sub>

      <div className="grid grid-cols-2 gap-3">
        {USES.map((u) => {
          const sel = data.primaryUse === u.value;
          return (
            <button key={u.value} onClick={() => onChange({ primaryUse: u.value })}
              className="p-5 rounded-2xl border text-left transition-all duration-200"
              style={{
                borderColor: sel ? "#C9974A" : "#E8E4DE",
                background: sel ? "#FDF5E8" : "#FDFAF6",
                boxShadow: sel ? "0 0 0 1px #C9974A" : "none",
              }}>
              <span className="text-2xl block mb-3" style={{ color: sel ? "#C9974A" : "#CCC8C0" }}>{u.icon}</span>
              <span className="text-sm font-medium text-[#0A0908]">{u.label}</span>
            </button>
          );
        })}
      </div>

      <NextBtn onClick={onNext} />
    </div>
  );
}

// ── Step 5: Finish ───────────────────────────────────────────────────────────

function StepFinish({ data, onChange, onNext }: {
  data: OnboardingData; onChange: (v: Partial<OnboardingData>) => void; onNext: () => void;
}) {
  return (
    <div className="step-in">
      <Eyebrow>Almost there</Eyebrow>
      <Heading>One last thing.</Heading>
      <p className="text-sm text-[#5C5550] mb-8 leading-relaxed">
        Your postcode powers <strong className="text-[#0A0908] font-medium">Option C</strong> — the local boutique recommendation within 25 miles of you.
      </p>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#0A0908] mb-1.5">
            Your postcode <span className="text-[#5C5550] font-normal">(optional — for local shop recommendations)</span>
          </label>
          <input type="text" value={data.postcode} onChange={(e) => onChange({ postcode: e.target.value })}
            placeholder="e.g. 10001"
            className="w-full sm:w-56 px-4 py-3 border border-[#CCC8C0] rounded-xl bg-[#F5F2EE] text-[#0A0908] placeholder:text-[#CCC8C0] focus:outline-none focus:border-[#C9974A] transition-colors text-sm"
            style={{ fontFamily: "var(--font-dm-mono), monospace" }} />
          <p className="text-xs text-[#5C5550] mt-1.5">Leave blank — we&rsquo;ll show the nearest accessible option.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0A0908] mb-1.5">
            Any existing pieces to keep? <span className="text-[#5C5550] font-normal">(optional)</span>
          </label>
          <textarea value={data.existingPieces} onChange={(e) => onChange({ existingPieces: e.target.value })}
            placeholder="e.g. I have a dark walnut dining table I love, and a cream boucle armchair."
            rows={3}
            className="w-full px-4 py-3 border border-[#CCC8C0] rounded-xl bg-[#F5F2EE] text-[#0A0908] placeholder:text-[#CCC8C0] focus:outline-none focus:border-[#C9974A] transition-colors resize-none text-sm" />
        </div>
      </div>

      {/* Summary pill */}
      <div className="mt-8 mb-2 p-4 rounded-2xl border border-[#E8E4DE] bg-[#F5F2EE] flex flex-wrap gap-3">
        {[
          { label: "Budget", val: `$${data.budget.toLocaleString()}` },
          { label: "Size", val: `${data.dimensions.length}×${data.dimensions.width} ft` },
          { label: "Style", val: STYLE_LABELS[data.style] },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="text-[10px] text-[#5C5550] uppercase tracking-wider">{item.label}</span>
            <span className="text-xs font-medium text-[#0A0908] bg-[#FDFAF6] border border-[#CCC8C0] px-2.5 py-0.5 rounded-full">{item.val}</span>
          </div>
        ))}
      </div>

      <NextBtn onClick={onNext} label="Show my recommendations →" />
    </div>
  );
}
