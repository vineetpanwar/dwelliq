"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const PREVIEW_ITEMS = [
  {
    category: "Sofa",
    options: [
      {
        label: "A",
        labelColor: "bg-green-100 text-green-800",
        name: "Rivet Revolve Modern Sofa",
        retailer: "Amazon",
        price: "$799",
        note: "Best within budget",
      },
      {
        label: "B",
        labelColor: "bg-blue-100 text-blue-800",
        name: "West Elm Haven Sofa — Linen",
        retailer: "West Elm",
        price: "$1,299",
        note: "Best if flexible",
      },
      {
        label: "C",
        labelColor: "bg-amber-100 text-amber-800",
        name: "Haven Home Boutique — Linen",
        retailer: "Local · 1.8 mi",
        price: "$920",
        note: "Best local option",
      },
    ],
  },
];

export default function PreviewSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 bg-stone">
      <div className="max-w-6xl mx-auto px-6">
        <div
          ref={ref}
          className={`text-center mb-14 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-xs font-medium text-gold tracking-widest uppercase mb-4">
            See it in action
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-ink">
            Three options. Every time. No exceptions.
          </h2>
        </div>

        {/* Recommendation card preview */}
        <div
          className={`transition-all duration-700 delay-200 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {PREVIEW_ITEMS.map((item) => (
            <div key={item.category} className="mb-8">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif text-2xl font-light text-ink">{item.category}</h3>
                <span className="text-xs text-warm-grey">Budget: $1,225</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {item.options.map((opt, i) => (
                  <div
                    key={opt.label}
                    className={`recommendation-card bg-cream rounded-lg border border-border overflow-hidden transition-all duration-500 ${
                      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                    style={{ transitionDelay: `${300 + i * 120}ms` }}
                  >
                    {/* Image placeholder */}
                    <div className="h-44 bg-gradient-to-br from-stone to-border/50 relative flex items-center justify-center">
                      <span className="text-4xl opacity-20">🛋</span>
                      <span
                        className={`absolute top-3 left-3 text-xs font-medium px-2 py-0.5 rounded-full ${opt.labelColor}`}
                      >
                        Option {opt.label} · {opt.note}
                      </span>
                    </div>
                    {/* Content */}
                    <div className="p-4">
                      <p className="text-sm font-medium text-ink leading-snug mb-1">
                        {opt.name}
                      </p>
                      <p className="text-xs text-warm-grey mb-3">{opt.retailer}</p>
                      <div className="flex items-center justify-between">
                        <p className="font-serif text-xl text-gold">{opt.price}</p>
                        <button className="btn-gold px-3 py-1.5 rounded text-xs font-medium">
                          View →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          className={`text-center mt-12 transition-all duration-700 delay-500 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Link
            href="/design"
            className="btn-gold px-10 py-3.5 rounded text-sm font-medium inline-block"
          >
            Get my room recommendations
          </Link>
          <p className="text-xs text-warm-grey mt-3">Free · No account required</p>
        </div>
      </div>
    </section>
  );
}
