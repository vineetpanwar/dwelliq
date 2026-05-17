"use client";

import Image from "next/image";
import { RecommendationSet } from "@/lib/types";
import { PRODUCT_IMAGES } from "@/lib/assets";

const OPT_COLORS = {
  A: { bg: "#DCFCE7", text: "#166534", label: "Within budget" },
  B: { bg: "#DBEAFE", text: "#1D4ED8", label: "If flexible" },
  C: { bg: "#FEF3C7", text: "#92400E", label: "Local boutique" },
};

// Masonry-style mood board of all Option A picks with accent splashes of B and C
export default function MoodBoard({
  recs,
  selectedOption,
}: {
  recs: RecommendationSet[];
  selectedOption: "A" | "B" | "C";
}) {
  const cfg = OPT_COLORS[selectedOption];
  const products = recs.map((r) => ({
    rec: r,
    product: selectedOption === "A" ? r.optionA : selectedOption === "B" ? r.optionB : r.optionC,
  }));

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <p className="text-xs text-[#5C5550]">Viewing</p>
        {(["A", "B", "C"] as const).map((opt) => {
          const c = OPT_COLORS[opt];
          const active = selectedOption === opt;
          return (
            <span
              key={opt}
              className="text-[10px] font-semibold px-3 py-1.5 rounded-full cursor-default"
              style={{ background: active ? c.bg : "#F5F2EE", color: active ? c.text : "#5C5550", border: `1px solid ${active ? c.text + "30" : "#CCC8C0"}` }}
            >
              Option {opt} · {c.label}
            </span>
          );
        })}
      </div>

      {/* Masonry grid — varies column spans for visual interest */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {products.map(({ rec, product }, i) => {
          // Vary card sizes for masonry feel
          const tall = i === 0 || i === 4;
          const wide = i === 2;
          const imageSrc = PRODUCT_IMAGES[product.id] || product.image;

          return (
            <div
              key={rec.category}
              className={`relative rounded-2xl overflow-hidden border border-[#CCC8C0] bg-[#F5F2EE] group cursor-pointer hover:shadow-xl transition-all duration-500
                ${wide ? "sm:col-span-2" : ""}
                ${tall ? "row-span-2" : ""}
              `}
              style={{ animationDelay: `${i * 0.06}s` }}
              onClick={() => window.open(`/api/click?sku=${product.id}&option=${selectedOption}`, "_blank")}
            >
              <div className={`relative overflow-hidden ${tall ? "h-72 sm:h-80" : "h-40 sm:h-48"}`}>
                <Image
                  src={imageSrc}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Category label */}
              <div className="absolute top-2.5 left-2.5">
                <span className="text-[9px] font-semibold px-2 py-1 rounded-full" style={{ background: cfg.bg, color: cfg.text }}>
                  {rec.categoryLabel}
                </span>
              </div>

              {/* Hover reveal */}
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-[#0A0908]/90">
                <p className="text-xs font-medium text-[#FDFAF6] truncate">{product.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[10px] text-[#FDFAF6]/60">{product.retailer}</p>
                  <p className="text-sm font-light text-[#C9974A]" style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>
                    ${product.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Total cost tile */}
        <div className="rounded-2xl border border-[#CCC8C0] bg-[#0A0908] p-5 flex flex-col justify-between">
          <p className="text-[10px] text-[#FDFAF6]/40 uppercase tracking-wider">Option {selectedOption} total</p>
          <div>
            <p className="font-light text-[#C9974A] mb-1" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: 36 }}>
              ${products.reduce((s, { product }) => s + product.price, 0).toLocaleString()}
            </p>
            <p className="text-[10px] text-[#FDFAF6]/30">{products.length} pieces selected</p>
          </div>
          <span className="text-[10px] font-semibold px-3 py-1.5 rounded-full self-start" style={{ background: cfg.bg, color: cfg.text }}>
            {cfg.label}
          </span>
        </div>
      </div>
    </div>
  );
}
