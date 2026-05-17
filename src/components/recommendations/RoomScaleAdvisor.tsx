"use client";

import { OnboardingData } from "@/lib/types";
import { getRoomScaleAdvice } from "@/lib/design-profiles";

export default function RoomScaleAdvisor({ data }: { data: OnboardingData }) {
  const advice = getRoomScaleAdvice(data.dimensions.length, data.dimensions.width, data.style);
  const sqft = data.dimensions.length * data.dimensions.width;
  const sizeLabel = sqft < 150 ? "Cosy" : sqft < 250 ? "Comfortable" : "Spacious";

  return (
    <div className="mb-10 rounded-2xl border border-[#CCC8C0] overflow-hidden">
      {/* Header */}
      <div className="px-5 sm:px-6 py-4 bg-[#F5F2EE] border-b border-[#CCC8C0] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FDFAF6] border border-[#CCC8C0] flex items-center justify-center text-base flex-shrink-0">
            📐
          </div>
          <div>
            <p className="text-xs font-semibold text-[#0A0908]">Room Scale Advisor</p>
            <p className="text-[10px] text-[#5C5550]">{data.dimensions.length} × {data.dimensions.width} ft · {sqft} sq ft · {sizeLabel}</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          {/* Mini room sketch */}
          <div className="relative border border-[#C9974A]/40 bg-[#C9974A]/5 rounded flex items-center justify-center"
            style={{
              width: Math.round(Math.max(48, Math.min(90, data.dimensions.width * 4))),
              height: Math.round(Math.max(36, Math.min(70, data.dimensions.length * 3.5))),
            }}>
            <span className="text-[8px] text-[#C9974A]" style={{ fontFamily: "var(--font-dm-mono), monospace" }}>
              {data.dimensions.length}×{data.dimensions.width}
            </span>
          </div>
          <span className="text-[9px] text-[#5C5550]">to scale</span>
        </div>
      </div>

      {/* Advice grid */}
      <div className="p-5 sm:p-6 bg-[#FDFAF6]">
        <div className="grid sm:grid-cols-2 gap-3">
          {advice.map((a) => (
            <div key={a.label} className="flex gap-3 p-3.5 rounded-xl border border-[#E8E4DE] bg-[#F5F2EE]">
              <span className="text-lg flex-shrink-0">{a.icon}</span>
              <div>
                <p className="text-xs font-semibold text-[#0A0908] mb-0.5">{a.label}</p>
                <p className="text-xs text-[#5C5550] leading-relaxed">{a.tip}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
