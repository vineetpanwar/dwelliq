"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/lib/types";
import { PRODUCT_IMAGES } from "@/lib/assets";

const OPT = {
  A: { label: "Best within budget", bg: "#DCFCE7", text: "#166534", border: "#BBF7D0", btnBg: "#166534" },
  B: { label: "Best if flexible",   bg: "#DBEAFE", text: "#1D4ED8", border: "#BFDBFE", btnBg: "#1D4ED8" },
  C: { label: "Best local boutique",bg: "#FEF3C7", text: "#92400E", border: "#FDE68A", btnBg: "#92400E" },
};

export default function RecommendationCard({
  option,
  product,
  saved,
  onSave,
}: {
  option: "A" | "B" | "C";
  product: Product & { explanation: string };
  saved: boolean;
  onSave: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const cfg = OPT[option];
  const imageSrc = PRODUCT_IMAGES[product.id] || product.image;

  return (
    <div
      className="flex flex-col rounded-2xl border border-[#CCC8C0] overflow-hidden bg-[#FDFAF6]"
      style={{ transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-5px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 50px rgba(10,9,8,0.10)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "none";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      {/* Image */}
      <div className="relative h-44 sm:h-52 overflow-hidden bg-[#F5F2EE]">
        {!imgError ? (
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover"
            unoptimized
            onError={() => setImgError(true)}
            style={{ transition: "transform 0.5s ease" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl opacity-10">🛋</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908]/50 via-transparent to-transparent" />

        {/* Option badge */}
        <span
          className="absolute top-3 left-3 text-[10px] font-semibold px-3 py-1 rounded-full"
          style={{ background: cfg.bg, color: cfg.text }}
        >
          {option} · {cfg.label}
        </span>

        {/* Save heart */}
        <button
          onClick={onSave}
          aria-label={saved ? "Unsave" : "Save"}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#FDFAF6]/90 backdrop-blur-sm flex items-center justify-center shadow-md"
          style={{ transition: "transform 0.2s ease" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.12)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill={saved ? "#C9974A" : "none"} stroke="#C9974A" strokeWidth="1.5">
            <path d="M6.5 11.5L1.5 6.5C0.67 5.67 0.67 4.33 1.5 3.5C2.33 2.67 3.67 2.67 4.5 3.5L6.5 5.5L8.5 3.5C9.33 2.67 10.67 2.67 11.5 3.5C12.33 4.33 12.33 5.67 11.5 6.5L6.5 11.5Z" />
          </svg>
        </button>

        {/* Local distance badge */}
        {product.isLocal && (
          <span className="absolute bottom-3 left-3 text-[10px] font-medium px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#92400E]">
            📍 {product.localDistance} mi away
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <p className="text-sm font-semibold text-[#0A0908] leading-snug mb-0.5">{product.name}</p>
        <p className="text-xs text-[#5C5550] mb-3">{product.retailer}</p>

        {/* Stars */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map((s) => (
              <svg key={s} width="10" height="10" viewBox="0 0 10 10" fill={s <= Math.round(product.rating) ? "#C9974A" : "#CCC8C0"}>
                <path d="M5 1L6.18 3.82L9.27 4.09L7 6.12L7.64 9.09L5 7.5L2.36 9.09L3 6.12L0.73 4.09L3.82 3.82L5 1Z" />
              </svg>
            ))}
          </div>
          <span className="text-[10px] text-[#5C5550]">{product.rating}/5</span>
        </div>

        {/* Explanation */}
        <p className="text-xs text-[#5C5550] leading-relaxed flex-1 mb-4">{product.explanation}</p>

        {/* Price + CTA */}
        <div className="border-t border-[#E8E4DE] pt-4 flex items-center justify-between gap-3">
          <span
            className="text-2xl font-light text-[#C9974A]"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            ${product.price.toLocaleString()}
          </span>
          <button
            onClick={() => {
            const sid = sessionStorage.getItem("dwelliq_session_token") ?? "";
            const url = `/api/click?sku=${product.id}&option=${option}${sid ? `&sid=${encodeURIComponent(sid)}` : ""}`;
            window.open(url, "_blank");
          }}
            className="text-[10px] font-semibold px-3 py-2 rounded-lg text-[#FDFAF6] transition-opacity hover:opacity-80 whitespace-nowrap"
            style={{ background: cfg.btnBg }}
          >
            Shop at {product.retailer.split(" ")[0]} →
          </button>
        </div>
      </div>
    </div>
  );
}
