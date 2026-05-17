"use client";

import { StylePreference } from "@/lib/types";
import { DESIGN_PROFILES } from "@/lib/design-profiles";

export default function CompleteTheLook({ style }: { style: StylePreference }) {
  const profile = DESIGN_PROFILES[style];
  if (!profile) return null;

  return (
    <div className="mb-16">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-[10px] font-semibold text-[#C9974A] tracking-[0.2em] uppercase mb-1">Interior styling</p>
          <h2 className="text-[#0A0908]" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: 28, fontWeight: 300 }}>
            Complete the look
          </h2>
        </div>
        <p className="text-xs text-[#5C5550] hidden sm:block max-w-xs text-right">
          Accessories finish a room. These five additions make your {profile.headline.toLowerCase()} space feel fully designed.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {profile.accessories.map((acc, i) => (
          <a
            key={acc.name}
            href={`https://www.google.com/search?q=${encodeURIComponent(acc.searchQuery)}&tbm=shop`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex gap-4 p-4 rounded-2xl border border-[#E8E4DE] bg-[#FDFAF6] hover:border-[#C9974A]/40 hover:shadow-md transition-all duration-300"
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            {/* Number */}
            <div className="w-8 h-8 rounded-full bg-[#F5F2EE] border border-[#CCC8C0] flex items-center justify-center flex-shrink-0 group-hover:bg-[#C9974A] group-hover:border-[#C9974A] transition-colors duration-300">
              <span className="text-xs font-medium text-[#5C5550] group-hover:text-[#FDFAF6] transition-colors duration-300">
                {i + 1}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#0A0908] mb-0.5 group-hover:text-[#C9974A] transition-colors duration-200">{acc.name}</p>
              <p className="text-xs text-[#5C5550] leading-relaxed mb-2">{acc.why}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#C9974A]" style={{ fontFamily: "var(--font-dm-mono), monospace" }}>{acc.priceRange}</span>
                <span className="text-[10px] text-[#5C5550] group-hover:text-[#C9974A] transition-colors">Shop →</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Material reminder */}
      <div className="mt-4 p-4 rounded-xl border border-[#E8E4DE] bg-[#F5F2EE] flex flex-wrap items-center gap-3">
        <p className="text-xs font-medium text-[#0A0908] flex-shrink-0">Materials to stick with:</p>
        {profile.materials.map((m) => (
          <span key={m.label} className="text-xs px-2.5 py-1 rounded-full bg-[#FDFAF6] border border-[#CCC8C0] text-[#5C5550]">
            {m.icon} {m.label}
          </span>
        ))}
      </div>
    </div>
  );
}
