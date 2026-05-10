"use client";

import { useEffect, useRef, useState } from "react";

const COMPARISONS = [
  {
    tool: "Pinterest",
    issue: "No specific products. No prices. No purchase path.",
  },
  {
    tool: "Wayfair / Amazon",
    issue: "50,000 options. Zero design context. Paralysis.",
  },
  {
    tool: "IKEA Planner",
    issue: "Single brand only. No style guidance. No neutral advice.",
  },
  {
    tool: "Houzz / Havenly",
    issue: "Human designers cost $2,000–$15,000. Unaffordable.",
  },
  {
    tool: "RoomGPT",
    issue: "Beautiful images. Zero purchasable inventory.",
  },
];

const BENEFITS = [
  {
    title: "Three options, always",
    description:
      "One within budget. One if you can stretch. One local. Never more, never less. Decisiveness is the feature.",
  },
  {
    title: "Plain English explanations",
    description:
      "Every recommendation comes with a two-sentence reason. You understand why, not just what.",
  },
  {
    title: "Local shops included",
    description:
      "Option C is always a nearby boutique. See it in person. Support your neighborhood. We find the gems you'd never discover.",
  },
  {
    title: "Free. Always.",
    description:
      "We earn when you buy, through standard affiliate relationships with retailers. Your interests and ours are perfectly aligned.",
  },
];

function useVisible(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export default function WhyDwelliq() {
  const { ref: headRef, visible: headVisible } = useVisible();

  return (
    <section id="why" className="py-24 bg-cream">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div
          ref={headRef}
          className={`max-w-2xl mb-16 transition-all duration-700 ${
            headVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-xs font-medium text-gold tracking-widest uppercase mb-4">
            Why Dwelliq
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-ink leading-tight">
            Every existing tool fails the first homeowner.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Comparison table */}
          <div>
            <p className="text-xs text-warm-grey uppercase tracking-wider mb-5 font-medium">
              What's out there
            </p>
            <div className="space-y-0">
              {COMPARISONS.map((c, i) => (
                <ComparisonRow key={c.tool} comparison={c} index={i} />
              ))}
              <div className="flex gap-4 pt-6 border-t border-border">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center mt-0.5">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="#C9974A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">Dwelliq</p>
                  <p className="text-sm text-warm-grey mt-0.5">
                    Free AI advisor. Three purchasable options per item. Budget-aware. Local store always included.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div>
            <p className="text-xs text-warm-grey uppercase tracking-wider mb-5 font-medium">
              What makes us different
            </p>
            <div className="space-y-8">
              {BENEFITS.map((b, i) => (
                <BenefitCard key={b.title} benefit={b} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ComparisonRow({
  comparison,
  index,
}: {
  comparison: (typeof COMPARISONS)[0];
  index: number;
}) {
  const { ref, visible } = useVisible(0.1);

  return (
    <div
      ref={ref}
      className={`flex gap-4 py-4 border-b border-border transition-all duration-500 ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="flex-shrink-0 w-5 h-5 rounded-full border border-rust/30 flex items-center justify-center mt-0.5">
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path d="M1 1L7 7M7 1L1 7" stroke="#8B3A2A" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium text-ink">{comparison.tool}</p>
        <p className="text-sm text-warm-grey mt-0.5">{comparison.issue}</p>
      </div>
    </div>
  );
}

function BenefitCard({
  benefit,
  index,
}: {
  benefit: (typeof BENEFITS)[0];
  index: number;
}) {
  const { ref, visible } = useVisible(0.1);

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-1 h-1 rounded-full bg-gold mt-2.5" />
        <div>
          <p className="text-sm font-medium text-ink mb-1">{benefit.title}</p>
          <p className="text-sm text-warm-grey leading-relaxed">{benefit.description}</p>
        </div>
      </div>
    </div>
  );
}
