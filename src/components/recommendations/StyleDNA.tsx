"use client";

import { OnboardingData } from "@/lib/types";
import { DESIGN_PROFILES, HOUSEHOLD_MATERIAL_GUIDE } from "@/lib/design-profiles";
import { STYLE_LABELS } from "@/lib/catalog";

export default function StyleDNA({ data }: { data: OnboardingData }) {
  const profile = DESIGN_PROFILES[data.style];
  const household = HOUSEHOLD_MATERIAL_GUIDE[data.household];
  if (!profile) return null;

  return (
    <div className="mb-10 rounded-2xl overflow-hidden border border-[#CCC8C0]" style={{ fontFamily: "var(--font-dm-sans), system-ui, sans-serif" }}>

      {/* Header band */}
      <div className="px-6 sm:px-8 py-6 bg-[#0A0908] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #C9974A 0%, transparent 60%), radial-gradient(circle at 80% 20%, #4A6A58 0%, transparent 50%)" }} />
        <div className="relative z-10">
          <p className="text-[10px] font-semibold text-[#C9974A] tracking-[0.2em] uppercase mb-2">Your design identity</p>
          <h2 className="text-[#FDFAF6] mb-1" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 300 }}>
            {profile.headline}
          </h2>
          <p className="text-[#FDFAF6]/50 text-sm leading-relaxed max-w-xl">{profile.tagline}</p>

          {/* Personality tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {profile.personality.map((p) => (
              <span key={p} className="text-[10px] tracking-widest uppercase px-3 py-1 rounded-full border border-[#FDFAF6]/15 text-[#FDFAF6]/50">{p}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#FDFAF6] p-6 sm:p-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

          {/* Color Story */}
          <div className="lg:col-span-1">
            <p className="text-[10px] font-semibold text-[#5C5550] tracking-[0.18em] uppercase mb-4">Your colour story</p>
            <div className="space-y-2.5">
              {profile.colors.map((c) => (
                <div key={c.name} className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-lg flex-shrink-0 border border-black/8 mt-0.5 shadow-sm"
                    style={{ background: c.hex }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-medium text-[#0A0908]">{c.name}</span>
                      <span className="text-[9px] text-[#CCC8C0] uppercase tracking-wider">{c.role}</span>
                    </div>
                    <p className="text-[10px] text-[#5C5550] leading-relaxed hidden group-hover:block transition-all">{c.tip}</p>
                    <p className="text-[10px] text-[#5C5550] leading-relaxed group-hover:hidden" style={{ fontFamily: "var(--font-dm-mono), monospace" }}>{c.hex}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Materials + Avoid */}
          <div>
            <p className="text-[10px] font-semibold text-[#5C5550] tracking-[0.18em] uppercase mb-4">Materials that work</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {profile.materials.map((m) => (
                <span key={m.label} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-[#CCC8C0] bg-[#F5F2EE] text-[#0A0908]">
                  <span>{m.icon}</span>{m.label}
                </span>
              ))}
            </div>

            <p className="text-[10px] font-semibold text-[#8B3A2A] tracking-[0.18em] uppercase mb-3">Avoid</p>
            <div className="space-y-1.5">
              {profile.avoid.map((a) => (
                <div key={a} className="flex items-start gap-2">
                  <span className="text-[#8B3A2A] mt-0.5 flex-shrink-0 text-xs">✕</span>
                  <span className="text-xs text-[#5C5550]">{a}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Household guide + Room tips */}
          <div>
            <p className="text-[10px] font-semibold text-[#5C5550] tracking-[0.18em] uppercase mb-3">
              {STYLE_LABELS[data.style]} for {data.household.replace(/-/g, " ")}
            </p>
            <div className="mb-5 p-3 rounded-xl bg-[#F5F2EE] border border-[#E8E4DE]">
              <p className="text-xs font-medium text-[#0A0908] mb-2">{household.headline}</p>
              {household.tips.map((t) => (
                <p key={t} className="text-xs text-[#5C5550] flex gap-1.5 mb-1.5 leading-relaxed">
                  <span className="text-[#4A6A58] flex-shrink-0">·</span>{t}
                </p>
              ))}
            </div>

            <p className="text-[10px] font-semibold text-[#5C5550] tracking-[0.18em] uppercase mb-3">Designer notes</p>
            <div className="space-y-2">
              {profile.roomTips.slice(0, 3).map((t) => (
                <p key={t} className="text-xs text-[#5C5550] flex gap-1.5 leading-relaxed">
                  <span className="text-[#C9974A] flex-shrink-0 mt-0.5">·</span>{t}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
