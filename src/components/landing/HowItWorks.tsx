"use client";

import { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    number: "01",
    title: "Tell us about your room",
    description:
      "Answer 6 quick questions — room dimensions, budget, style direction, and who lives there. Less than 2 minutes.",
    icon: "◎",
  },
  {
    number: "02",
    title: "Get three options, not fifty",
    description:
      "For every furniture piece you need, we surface exactly three recommendations. No scrolling through 50,000 sofas.",
    icon: "⊞",
  },
  {
    number: "03",
    title: "Option A, B, and C — always",
    description:
      "Best within your budget. Best if you can stretch a little. Best from a local boutique near you. Every single time.",
    icon: "◈",
  },
  {
    number: "04",
    title: "Buy with confidence",
    description:
      "Each pick comes with a plain-English explanation. Click through to buy directly. No login required.",
    icon: "◻",
  },
];

function Step({
  step,
  index,
}: {
  step: (typeof STEPS)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`flex gap-6 transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div className="flex-shrink-0 flex flex-col items-center">
        <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center">
          <span className="font-serif text-xl text-gold">{step.icon}</span>
        </div>
        {index < STEPS.length - 1 && (
          <div className="w-px flex-1 mt-4 bg-border min-h-[40px]" />
        )}
      </div>
      <div className="pb-10">
        <p className="text-xs font-mono text-gold mb-1">{step.number}</p>
        <h3 className="font-serif text-2xl font-light text-ink mb-2">
          {step.title}
        </h3>
        <p className="text-warm-grey leading-relaxed text-sm max-w-sm">
          {step.description}
        </p>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-stone">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-xs font-medium text-gold tracking-widest uppercase mb-4">
              How it works
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl font-light text-ink leading-tight mb-6">
              From empty room to furnished home — in minutes.
            </h2>
            <p className="text-warm-grey leading-relaxed">
              We designed Dwelliq for the first homeowner who has a clear feeling
              for what they want, but no idea how to translate that into specific
              pieces that work together and stay on budget.
            </p>
          </div>
          <div className="pt-2">
            {STEPS.map((step, i) => (
              <Step key={step.number} step={step} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
