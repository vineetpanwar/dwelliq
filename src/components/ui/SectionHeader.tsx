"use client";

import { useIO } from "@/hooks/useIO";

interface Props {
  label: string;
  title: string;
  subtitle: string;
  onDark?: boolean;
}

export default function SectionHeader({ label, title, subtitle, onDark = false }: Props) {
  const { ref, v } = useIO(0.1);
  return (
    <div ref={ref} className="max-w-3xl">
      <div
        className="inline-flex items-center gap-2.5 mb-5"
        style={{ opacity: v ? 1 : 0, transition: "opacity .5s" }}
      >
        <span className="w-4 h-px bg-[#C9974A]" />
        <p className="text-[10px] font-semibold tracking-[.22em] uppercase text-[#C9974A]">{label}</p>
      </div>
      <div className="overflow-hidden mb-5">
        <h2
          className="font-[var(--font-cormorant)] leading-[1.05]"
          style={{
            fontSize: "clamp(36px,4.8vw,62px)",
            fontWeight: onDark ? 400 : 300,
            color: onDark ? "#FDFAF6" : "#0A0908",
            animation: v ? "clipUp .95s .08s cubic-bezier(.77,0,.175,1) both" : "none",
            opacity: v ? 1 : 0,
          }}
        >
          {title}
        </h2>
      </div>
      <p
        className="text-base leading-relaxed max-w-2xl"
        style={{
          color: onDark ? "rgba(253,250,246,0.58)" : "#5C5550",
          opacity: v ? 1 : 0,
          transition: "opacity .7s .35s",
        }}
      >
        {subtitle}
      </p>
    </div>
  );
}
