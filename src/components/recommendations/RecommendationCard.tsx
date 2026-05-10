"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/lib/types";

const OPTION_CONFIG = {
  A: {
    label: "Option A",
    sublabel: "Best within budget",
    badgeBg: "bg-green-50",
    badgeText: "text-green-800",
    badgeBorder: "border-green-200",
    dot: "bg-green-600",
  },
  B: {
    label: "Option B",
    sublabel: "Best if flexible",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-800",
    badgeBorder: "border-blue-200",
    dot: "bg-blue-600",
  },
  C: {
    label: "Option C",
    sublabel: "Best local option",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-800",
    badgeBorder: "border-amber-200",
    dot: "bg-amber-600",
  },
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
  const config = OPTION_CONFIG[option];

  function handleClick() {
    // Track click (in production this would fire analytics)
    window.open(product.affiliateUrl === "#affiliate-" + product.id ? "#" : product.affiliateUrl, "_blank");
  }

  return (
    <div className="recommendation-card bg-cream rounded-xl border border-border overflow-hidden flex flex-col animate-fade-in-up">
      {/* Badge */}
      <div
        className={`flex items-center justify-between px-4 pt-3 pb-2 border-b ${config.badgeBorder} ${config.badgeBg}`}
      >
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${config.dot}`} />
          <span className={`text-xs font-medium ${config.badgeText}`}>
            {config.label}
          </span>
        </div>
        <span className={`text-xs ${config.badgeText} opacity-70`}>
          {config.sublabel}
        </span>
      </div>

      {/* Image */}
      <div className="relative h-48 bg-stone overflow-hidden group">
        {!imgError ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl opacity-20">🛋</span>
          </div>
        )}
        {/* Save button */}
        <button
          onClick={onSave}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-cream/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-transform hover:scale-110"
          aria-label={saved ? "Unsave" : "Save"}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill={saved ? "#C9974A" : "none"}
            stroke="#C9974A"
            strokeWidth="1.5"
          >
            <path d="M7 12.5L1.5 7C0.5 6 0.5 4.5 1.5 3.5C2.5 2.5 4 2.5 5 3.5L7 5.5L9 3.5C10 2.5 11.5 2.5 12.5 3.5C13.5 4.5 13.5 6 12.5 7L7 12.5Z" />
          </svg>
        </button>
        {/* Local badge */}
        {product.isLocal && (
          <div className="absolute bottom-3 left-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs px-2 py-0.5 rounded-full">
            📍 {product.localDistance} mi away
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-sm font-medium text-ink leading-snug mb-1">
          {product.name}
        </p>
        <p className="text-xs text-warm-grey mb-3">{product.retailer}</p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} width="10" height="10" viewBox="0 0 10 10" fill={star <= Math.round(product.rating) ? "#C9974A" : "#CCC8C0"}>
                <path d="M5 1L6.18 3.82L9.27 4.09L7 6.12L7.64 9.09L5 7.5L2.36 9.09L3 6.12L0.73 4.09L3.82 3.82L5 1Z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-warm-grey">{product.rating}/5</span>
        </div>

        {/* Explanation */}
        <p className="text-xs text-warm-grey leading-relaxed mb-4 flex-1">
          {product.explanation}
        </p>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
          <span className="font-serif text-2xl text-gold">
            ${product.price.toLocaleString()}
          </span>
          <button
            onClick={handleClick}
            className="btn-gold px-4 py-2 rounded text-xs font-medium"
          >
            View at {product.retailer.split(" ")[0]} →
          </button>
        </div>
      </div>
    </div>
  );
}
