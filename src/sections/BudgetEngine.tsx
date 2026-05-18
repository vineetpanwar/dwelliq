"use client";

import { C } from "@/lib/tokens";
import { useIO } from "@/hooks/useIO";
import SectionHeader from "@/components/ui/SectionHeader";
import { ENGINE_INPUTS, ENGINE_OUTPUTS } from "@/lib/data";

export default function BudgetEngine() {
  const { ref, v } = useIO(0.08);

  return (
    <section className="py-24 sm:py-36 px-5 sm:px-8 lg:px-10 bg-[#FAF6EF]">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          label="The engine"
          title="Dynamic Cross-Room Optimization."
          subtitle="A patent-grade allocation engine that balances your entire home's budget across rooms, categories, and constraints simultaneously."
        />

        <div ref={ref} className="mt-14 grid lg:grid-cols-[1fr_auto_1fr] gap-5 lg:gap-8 items-stretch">
          {/* Inputs */}
          <div className="bg-[#F5F2EE] border border-[#D4CFC8] rounded-2xl p-6 sm:p-8" style={{ opacity: v ? 1 : 0, transition: "opacity .5s" }}>
            <p className="text-[10px] font-semibold tracking-[.18em] uppercase mb-5" style={{ color: C.light }}>Inputs</p>
            <div className="space-y-4">
              {ENGINE_INPUTS.map((inp, i) => (
                <div key={inp.label} className="flex items-start gap-4 p-4 bg-[#FDFAF6] rounded-xl border border-[#EAE6DF]" style={{ opacity: v ? 1 : 0, transition: `opacity .4s ${i * .08}s` }}>
                  <span className="text-xl flex-shrink-0">{inp.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-[#0A0908]">{inp.label}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: C.light }}>{inp.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Engine box */}
          <div className="flex flex-col items-center justify-center gap-4 py-6" style={{ opacity: v ? 1 : 0, transition: "opacity .5s .15s" }}>
            <div className="hidden lg:block w-px h-16 bg-[#D9CEBC]" />
            <div className="bg-[#1C1C1C] text-[#FDFAF6] rounded-2xl p-6 text-center min-w-[160px]">
              <div className="text-2xl mb-2">◈</div>
              <p className="font-[var(--font-cormorant)] text-xl font-light">Optimization<br />Engine</p>
              <p className="text-[10px] text-[#FDFAF6]/50 mt-2 tracking-wider uppercase">AI · Budget allocation<br />Location enrichment</p>
            </div>
            <div className="hidden lg:block w-px h-16 bg-[#D9CEBC]" />
          </div>

          {/* Outputs */}
          <div className="bg-[#F5F2EE] border border-[#D4CFC8] rounded-2xl p-6 sm:p-8" style={{ opacity: v ? 1 : 0, transition: "opacity .5s .25s" }}>
            <p className="text-[10px] font-semibold tracking-[.18em] uppercase mb-5" style={{ color: C.light }}>Design packages</p>
            <div className="space-y-4">
              {ENGINE_OUTPUTS.map((out, i) => (
                <div key={out.label} className="p-4 bg-[#FDFAF6] rounded-xl border border-[#EAE6DF]" style={{ opacity: v ? 1 : 0, transition: `opacity .4s ${.3 + i * .1}s` }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-[#0A0908]">{out.label}</span>
                    <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full" style={{ background: `${out.color}18`, color: out.color }}>{out.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-[#EAE6DF] rounded-full overflow-hidden mb-2">
                    <div className="h-full rounded-full" style={{ width: v ? `${out.pct}%` : "0%", background: out.color, transition: `width .8s cubic-bezier(.22,1,.36,1) ${.4 + i * .12}s` }} />
                  </div>
                  <p className="text-[11px]" style={{ color: C.light }}>{out.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 p-4 bg-[#C9974A]/10 rounded-xl border border-[#C9974A]/30">
              <p className="text-[11px] text-[#C9974A] font-medium">Each package includes per-room allocations across furniture, lighting, textiles, storage, and décor — with live recalculation as you change any constraint.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
