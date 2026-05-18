"use client";

import Link from "next/link";
import Image from "next/image";
import { C } from "@/lib/tokens";
import SectionHeader from "@/components/ui/SectionHeader";
import { ENGINE_OUTPUTS } from "@/lib/data";

const SAMPLE_ITEMS = [
  { cat: "Sofa",     name: "Rivet Revolve", price: "$799", retailer: "Amazon", alloc: "35%", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80" },
  { cat: "Rug",      name: "Jaipur Braid",  price: "$449", retailer: "Wayfair", alloc: "15%", img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&q=80" },
  { cat: "Lighting", name: "Arco Lamp",     price: "$380", retailer: "Lumens",  alloc: "12%", img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&q=80" },
];

export default function RecommendationsPreview() {
  return (
    <section className="py-24 sm:py-36 px-5 sm:px-8 lg:px-10 bg-[#F5F2EE]">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          label="Your project"
          title="Three packages. Every piece."
          subtitle="Budget-Friendly, Balanced, and Premium — each with a 2D plan, 3D walkthrough, and per-item shopping list."
        />

        <div className="mt-12 rounded-3xl border border-[#D4CFC8] overflow-hidden shadow-xl bg-[#FDFAF6]">
          {/* Project header */}
          <div className="px-6 py-4 border-b border-[#EAE6DF] flex flex-wrap items-center gap-4">
            <p className="font-[var(--font-cormorant)] text-xl font-light">Rivera Apartment — 3 rooms</p>
            <span className="text-[10px] font-semibold bg-[#C9974A]/15 text-[#C9974A] px-3 py-1 rounded-full">Balanced · $4,200</span>
            <div className="ml-auto flex-1 max-w-[200px]">
              <div className="flex justify-between text-[10px] mb-1" style={{ color: C.light }}><span>Budget used</span><span>72%</span></div>
              <div className="h-1.5 bg-[#EAE6DF] rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-[#C9974A]" style={{ width: "72%" }} />
              </div>
            </div>
            <Link href="/studio" className="flex-shrink-0 text-[11px] bg-[#0A0908] text-[#FDFAF6] px-4 py-2 rounded-xl hover:bg-[#C9974A] hover:text-[#0A0908] transition-colors">Open in 3D →</Link>
          </div>

          {/* Package toggle */}
          <div className="grid sm:grid-cols-3 gap-4 p-6">
            {ENGINE_OUTPUTS.map(pkg => (
              <div key={pkg.label} className={`p-5 rounded-2xl border transition-all cursor-pointer ${pkg.label === "Balanced" ? "border-[#C9974A] bg-[#C9974A]/5" : "border-[#EAE6DF] hover:border-[#D4CFC8]"}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-[#0A0908]">{pkg.label}</span>
                  {pkg.label === "Balanced" && <span className="text-[9px] font-semibold bg-[#C9974A] text-[#0A0908] px-2 py-0.5 rounded-full">Recommended</span>}
                </div>
                <p className="font-[var(--font-cormorant)] text-2xl text-[#0A0908] mb-1">{pkg.desc.split(" ")[0]}</p>
                <p className="text-[11px]" style={{ color: C.light }}>{pkg.desc.split("—")[1]?.trim()}</p>
                <div className="mt-3 h-1 bg-[#EAE6DF] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pkg.pct}%`, background: pkg.color }} />
                </div>
              </div>
            ))}
          </div>

          {/* Sample product cards */}
          <div className="grid sm:grid-cols-3 gap-4 px-6 pb-6">
            {SAMPLE_ITEMS.map(item => (
              <div key={item.cat} className="relative bg-[#F5F2EE] rounded-2xl overflow-hidden border border-[#EAE6DF]">
                <div className="relative h-32">
                  <Image src={item.img} alt={item.name} fill className="object-cover" unoptimized />
                  <span className="absolute top-2 left-2 text-[9px] font-semibold bg-[#FDFAF6]/90 text-[#0A0908] px-2 py-0.5 rounded-full">{item.cat} · {item.alloc}</span>
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-[#0A0908]">{item.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-[var(--font-cormorant)] text-lg text-[#C9974A]">{item.price}</span>
                    <span className="text-[10px]" style={{ color: C.light }}>{item.retailer}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
