"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function CtaSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 bg-ink relative overflow-hidden">
      {/* Background texture lines */}
      <div className="absolute inset-0 opacity-5">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute border-t border-cream"
            style={{ top: `${(i + 1) * 12.5}%`, left: 0, right: 0 }}
          />
        ))}
      </div>

      <div className="relative max-w-6xl mx-auto px-6 text-center" ref={ref}>
        <div
          className={`transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-xs font-medium text-gold tracking-widest uppercase mb-6">
            Ready to furnish your home?
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-cream leading-tight mb-6">
            Stop visiting stores on weekends.
            <br />
            <em className="text-gold">Start knowing exactly what to buy.</em>
          </h2>
          <p className="text-cream/50 text-lg mb-10 max-w-lg mx-auto">
            Free for homeowners. Three options for every piece. Local boutiques included.
            No account required.
          </p>
          <Link
            href="/design"
            className="btn-gold px-12 py-4 rounded text-base font-medium inline-block"
          >
            Design my room — it's free
          </Link>
          <p className="text-cream/30 text-xs mt-4">
            Takes 2 minutes · No email required to see results
          </p>
        </div>

        {/* Social proof line */}
        <div
          className={`mt-16 flex flex-wrap items-center justify-center gap-8 transition-all duration-700 delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {[
            { stat: "200+", label: "curated products" },
            { stat: "10", label: "furniture categories" },
            { stat: "3", label: "options per piece, always" },
            { stat: "$0", label: "for homeowners, forever" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-serif text-2xl text-cream font-light">{s.stat}</p>
              <p className="text-xs text-cream/40 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
