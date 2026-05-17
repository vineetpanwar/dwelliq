"use client";

import { C } from "@/lib/tokens";
import { useIO } from "@/hooks/useIO";
import CountUp from "@/components/ui/CountUp";
import { PRESS } from "@/lib/assets";

const STATS = [
  { end: 24000, suffix: "+",    label: "Rooms designed",       color: C.brass },
  { end: 7,     suffix: "",     label: "Style families",        color: C.sage  },
  { end: 200,   suffix: "+",    label: "Products in catalog",   color: C.terra },
  { end: 2,     suffix: " min", label: "Avg. to first design",  color: C.blue  },
];

export default function PressStats() {
  const { ref, v } = useIO(0.2);

  return (
    <div ref={ref} className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16 sm:py-24">
      {/* Press logos */}
      <div className="mb-16 pb-14 border-b border-[#EAE6DF]">
        <p className="text-center text-[10px] tracking-[.22em] uppercase text-[#B8B2AB] mb-8">As seen in</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {PRESS.map(p => (
            <span
              key={p.name}
              className="font-[var(--font-cormorant)] text-xl font-light select-none cursor-default transition-all duration-200 hover:border-[#C9974A]/40 hover:text-[#9C948C]"
              style={{ color: "#B8B2AB", letterSpacing: "0.14em", border: "1px solid #EAE6DF", borderRadius: 999, padding: "6px 18px" }}
            >
              {p.name}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-[#EAE6DF]">
        {STATS.map((s, i) => (
          <div key={s.label} className="text-center md:px-10" style={{ opacity: v ? 1 : 0, transition: `opacity .5s ${i * .09}s` }}>
            <div className="flex justify-center mb-4">
              <div className="w-7 h-[2px] rounded-full" style={{ background: s.color }} />
            </div>
            <div className="font-[var(--font-cormorant)] font-light leading-none mb-3 whitespace-nowrap" style={{ fontSize: "clamp(42px,6vw,80px)", color: s.color }}>
              <CountUp end={s.end} trigger={v} suffix={s.suffix} />
            </div>
            <p className="text-[10px] tracking-[.18em] uppercase text-[#9C948C]">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
