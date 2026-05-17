"use client";

import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";

const PLANS = [
  {
    plan: "Free", price: "$0", period: "", primary: false, cta: "Start designing →", href: "/design",
    features: ["1 room", "1 design package", "Basic 3D preview", "Shopping list"],
  },
  {
    plan: "Pro", price: "$19", period: "/mo", primary: true, cta: "Try Pro free →", href: "/design",
    features: ["Unlimited rooms", "All 3 packages", "Full 3D Studio + VR", "AI assistant", "Priority support"],
  },
  {
    plan: "Studio", price: "$49", period: "/mo", primary: false, cta: "Contact sales →", href: "mailto:hello@dwelliq.com",
    features: ["Team workspaces", "Client projects", "White-label exports", "Dedicated onboarding"],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 sm:py-36 px-5 sm:px-8 lg:px-10 bg-[#F5F2EE]">
      <div className="max-w-4xl mx-auto text-center">
        <SectionHeader
          label="Pricing"
          title="Start free. Always."
          subtitle="Free for every homeowner. We earn a small commission when you purchase through our links — never a fee from you, never a paywall."
        />
        <div className="grid sm:grid-cols-3 gap-4 mt-14 max-w-3xl mx-auto">
          {PLANS.map(p => (
            <div
              key={p.plan}
              className={`rounded-3xl border p-7 text-left flex flex-col ${p.primary ? "bg-[#0A0908] border-transparent shadow-2xl shadow-[#0A0908]/20" : "bg-[#FDFAF6] border-[#D4CFC8]"}`}
            >
              <div className="mb-6">
                <p className={`text-[10px] font-semibold tracking-[.2em] uppercase mb-4 ${p.primary ? "text-[#C9974A]" : "text-[#9C948C]"}`}>{p.plan}</p>
                <div className="flex items-baseline gap-1">
                  <span className={`font-[var(--font-cormorant)] text-5xl font-light leading-none ${p.primary ? "text-[#FDFAF6]" : "text-[#0A0908]"}`}>{p.price}</span>
                  {p.period && <span className={`text-sm ${p.primary ? "text-[#FDFAF6]/40" : "text-[#9C948C]"}`}>{p.period}</span>}
                </div>
              </div>
              <ul className="space-y-2.5 mb-8 flex-1">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <span className={`text-[10px] ${p.primary ? "text-[#C9974A]" : "text-[#9C948C]"}`}>✓</span>
                    <span className={p.primary ? "text-[#FDFAF6]/70" : "text-[#5C5550]"}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={p.href}
                className={`block text-center py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${p.primary ? "bg-[#C9974A] text-[#0A0908] hover:bg-[#D4A96A]" : "border border-[#D4CFC8] text-[#5C5550] hover:border-[#C9974A] hover:text-[#C9974A]"}`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
