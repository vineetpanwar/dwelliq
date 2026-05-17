"use client";

import Image from "next/image";
import { C } from "@/lib/tokens";
import { useIO } from "@/hooks/useIO";

const FEATURES = [
  { label: "Local vendor discovery",  desc: "Showrooms and boutiques near your postcode surface in every design package" },
  { label: "Climate-aware materials", desc: "Humid climates get moisture-resistant recommendations; cold climates get insulating textiles" },
  { label: "Real delivery windows",   desc: "Google Maps distance matrix gives accurate lead times per product and retailer" },
  { label: "Service radius map",      desc: "A live map shows your property, available vendors, and delivery reach" },
];

const PINS = [
  { top: "30%", left: "30%", label: "Design Nest · 1.2 mi" },
  { top: "65%", left: "62%", label: "Haven Home · 2.4 mi" },
  { top: "40%", left: "68%", label: "West Elm · 3.1 mi" },
];

export default function LocationSection() {
  const { ref, v } = useIO(0.1);

  return (
    <section className="py-24 sm:py-36 px-5 sm:px-8 lg:px-10">
      <div ref={ref} className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div style={{ opacity: v ? 1 : 0, transition: "opacity .5s" }}>
          <span className="inline-block text-[10px] font-semibold tracking-[.18em] uppercase text-[#4A6A8A] mb-4">Location intelligence</span>
          <h2 className="font-[var(--font-cormorant)] text-5xl sm:text-6xl font-light text-[#0A0908] leading-tight mb-6">
            Your ZIP code<br /><em style={{ color: C.blue }}>shapes</em> your design.
          </h2>
          <p className="text-[#5C5550] leading-relaxed mb-7">
            We geocode your address to lat/long and enrich it with regional climate, local retail inventory, and logistics data. Style and material suggestions adapt to where you live. Delivery estimates are real.
          </p>
          <div className="space-y-4">
            {FEATURES.map(f => (
              <div key={f.label} className="flex gap-4 p-4 bg-[#F5F2EE] rounded-xl border border-[#EAE6DF]">
                <span className="text-[#4A6A8A] mt-0.5 flex-shrink-0">◎</span>
                <div>
                  <p className="text-sm font-semibold text-[#0A0908]">{f.label}</p>
                  <p className="text-[11px] text-[#9C948C] mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map mockup */}
        <div style={{ opacity: v ? 1 : 0, transition: "opacity .6s .15s" }}>
          <div className="relative rounded-3xl overflow-hidden border border-[#D4CFC8] shadow-xl" style={{ aspectRatio: "1" }}>
            <Image src="https://images.unsplash.com/photo-1569336415962-a4bd9f69c054?w=700&q=80" alt="Map" fill className="object-cover opacity-30" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-b from-[#EAE6DF] to-[#D4CFC8]" style={{ opacity: .7 }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="w-5 h-5 rounded-full bg-[#C9974A] border-2 border-[#FDFAF6] shadow-lg" style={{ animation: "pulse 2s ease-in-out infinite" }} />
                  <div className="mt-1 bg-[#FDFAF6] rounded-lg px-3 py-1.5 text-[10px] font-semibold text-[#0A0908] shadow whitespace-nowrap">Your property</div>
                </div>
                {PINS.map(pin => (
                  <div key={pin.label} className="absolute flex flex-col items-center" style={{ top: pin.top, left: pin.left }}>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#7A9E8A] border-2 border-[#FDFAF6] shadow" />
                    <div className="mt-1 bg-[#FDFAF6]/90 rounded-md px-2 py-1 text-[9px] text-[#0A0908] shadow whitespace-nowrap">{pin.label}</div>
                  </div>
                ))}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#C9974A]/40" style={{ width: 180, height: 180 }} />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-[#FDFAF6]/95 rounded-2xl p-4 border border-[#D4CFC8]">
              <p className="text-[10px] tracking-wider uppercase text-[#9C948C] mb-2">Jersey City, NJ 07302</p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div><p className="font-[var(--font-cormorant)] text-xl text-[#C9974A]">3</p><p className="text-[9px] text-[#9C948C]">local vendors</p></div>
                <div><p className="font-[var(--font-cormorant)] text-xl text-[#7A9E8A]">2 mi</p><p className="text-[9px] text-[#9C948C]">avg. showroom</p></div>
                <div><p className="font-[var(--font-cormorant)] text-xl text-[#0A0908]">3 days</p><p className="text-[9px] text-[#9C948C]">avg. delivery</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
