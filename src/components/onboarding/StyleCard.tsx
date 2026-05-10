"use client";

import Image from "next/image";
import { StylePreference } from "@/lib/types";

interface StyleOption {
  value: StylePreference;
  label: string;
  description: string;
  image: string;
}

export default function StyleCard({
  style,
  selected,
  onSelect,
}: {
  style: StyleOption;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`relative overflow-hidden rounded-lg border text-left transition-all duration-200 group ${
        selected
          ? "border-gold shadow-md ring-1 ring-gold/30"
          : "border-border hover:border-warm-grey/50"
      }`}
    >
      {/* Image */}
      <div className="relative h-32 bg-stone overflow-hidden">
        <Image
          src={style.image}
          alt={style.label}
          fill
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
            selected ? "scale-105" : ""
          }`}
          unoptimized
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-ink/30 transition-opacity duration-200 group-hover:opacity-20" />
        {selected && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-gold rounded-full flex items-center justify-center">
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path
                d="M1 4L3.5 6.5L9 1"
                stroke="#FDFAF6"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
      {/* Label */}
      <div className={`p-3 ${selected ? "bg-gold/5" : "bg-cream"}`}>
        <p className="text-sm font-medium text-ink">{style.label}</p>
        <p className="text-xs text-warm-grey mt-0.5">{style.description}</p>
      </div>
    </button>
  );
}
