"use client";

import Link from "next/link";
import Image from "next/image";
import { C } from "@/lib/tokens";
import { useIO } from "@/hooks/useIO";
import SectionHeader from "@/components/ui/SectionHeader";

const STYLE_COLORS: Record<string, string> = {
  "Mid-Century":  C.terra,
  "Scandinavian": C.sage,
  "Japandi":      C.brass,
  "Modern":       C.blue,
};

const PRODUCTS = [
  { name: "Rivet Revolve Sofa",       retailer: "Amazon",   price: 799,  match: 98, style: "Mid-Century",  delivery: "3 days",  img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",  tags: ["In stock", "Free delivery"] },
  { name: "West Elm Haven — Linen",   retailer: "West Elm", price: 1299, match: 94, style: "Scandinavian", delivery: "2 weeks", img: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=400&q=80", tags: ["Premium", "Local pickup"] },
  { name: "Jaipur Braid Rug 8×10",   retailer: "Wayfair",  price: 449,  match: 96, style: "Japandi",      delivery: "5 days",  img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80",  tags: ["In stock"] },
  { name: "Arco Floor Lamp",          retailer: "Lumens",   price: 380,  match: 91, style: "Modern",       delivery: "1 week",  img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80",  tags: ["Local showroom"] },
];

const FILTERS = ["All", "Sofas", "Rugs", "Lighting", "Tables", "Storage", "Near me", "Under $500", "Premium"];

export default function MarketplaceSection() {
  const { ref, v } = useIO(0.08);

  return (
    <section id="marketplace" className="py-24 sm:py-36 px-5 sm:px-8 lg:px-10 bg-[#F5F2EE]">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          label="Marketplace"
          title="Every product, scored for your room."
          subtitle='Filters by room type, style, price, delivery time, and "near me". Every card shows a match score, fit indicator, and delivery estimate.'
        />

        <div ref={ref} className="flex flex-wrap gap-2 mt-10 mb-8" style={{ opacity: v ? 1 : 0, transition: "opacity .4s" }}>
          {FILTERS.map((f, i) => (
            <button key={f} className="text-[11px] px-4 py-2 rounded-full border transition-all" style={{ borderColor: i === 0 ? C.ink : C.border, background: i === 0 ? C.ink : "transparent", color: i === 0 ? "#FDFAF6" : C.mid }}>
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{ opacity: v ? 1 : 0, transition: "opacity .5s .1s" }}>
          {PRODUCTS.map((p, i) => (
            <div key={p.name} className="bg-[#FDFAF6] border border-[#D4CFC8] rounded-2xl overflow-hidden card-lift" style={{ opacity: v ? 1 : 0, transition: `opacity .4s ${i * .07}s` }}>
              <div className="relative" style={{ aspectRatio: "4/3" }}>
                <Image src={p.img} alt={p.name} fill className="object-cover" unoptimized />
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                  {p.tags.map(t => <span key={t} className="text-[9px] font-semibold bg-[#FDFAF6]/90 text-[#0A0908] px-2 py-0.5 rounded-full">{t}</span>)}
                </div>
                <div className="absolute top-2.5 right-2.5 bg-[#C9974A] text-[#0A0908] text-[10px] font-bold px-2 py-0.5 rounded-full">{p.match}%</div>
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold text-[#0A0908] leading-snug mb-0.5">{p.name}</p>
                <p className="text-[10px] mb-2" style={{ color: C.light }}>
                  {p.retailer} · <span style={{ color: STYLE_COLORS[p.style] ?? C.mid }}>{p.style}</span>
                </p>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-[var(--font-cormorant)] text-xl text-[#0A0908]">${p.price.toLocaleString()}</span>
                  <span className="text-[10px]" style={{ color: C.sage }}>🚚 {p.delivery}</span>
                </div>
                <Link href="/studio" className="block text-center text-[10px] font-semibold py-2 rounded-xl bg-[#F5F2EE] hover:bg-[#C9974A] hover:text-[#0A0908] transition-colors text-[#5C5550]">
                  See in my room →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/marketplace" className="inline-flex items-center gap-2 border border-[#D4CFC8] text-[#5C5550] px-7 py-3.5 rounded-2xl text-sm hover:border-[#C9974A] hover:text-[#C9974A] transition-all">
            Browse full catalog — 200+ products →
          </Link>
        </div>
      </div>
    </section>
  );
}
