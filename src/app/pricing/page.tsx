import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing — DwellIQ",
  description: "Free for homeowners. Always. Our affiliate model means we earn when you purchase.",
};

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    color: "#5C5550",
    accent: "#7A9E8A",
    features: [
      "1 room per project",
      "1 design package (Balanced)",
      "Basic 3D view",
      "Marketplace access",
      "Local vendor discovery",
    ],
    cta: "Start for free",
    href: "/design",
    primary: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    color: "#C9974A",
    accent: "#C9974A",
    features: [
      "Unlimited rooms & projects",
      "All 3 design packages",
      "Full 3D Studio + VR mode",
      "In-room AI assistant",
      "Cross-room budget optimization",
      "PDF export + shopping list",
      "Priority support",
    ],
    cta: "Try Pro free for 14 days",
    href: "/signup",
    primary: true,
    badge: "Most popular",
  },
  {
    name: "Studio",
    price: "$49",
    period: "per month",
    color: "#C4735A",
    accent: "#C4735A",
    features: [
      "Everything in Pro",
      "Team seats (up to 5)",
      "Client project management",
      "White-label exports",
      "API access",
      "Dedicated account manager",
      "Custom integrations",
    ],
    cta: "Contact sales",
    href: "mailto:hello@dwelliq.com",
    primary: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#FDFAF6]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 sm:px-10 h-16 bg-[#FDFAF6]/92 backdrop-blur-xl border-b border-[#D4CFC8]/60">
        <Link href="/" className="font-[var(--font-cormorant)] text-2xl font-light tracking-[.1em] hover:text-[#C9974A] transition-colors">
          dwelliq
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-[11px] text-[#5C5550] hover:text-[#0A0908] transition-colors">Log in</Link>
          <Link href="/signup" className="bg-[#0A0908] text-[#FDFAF6] text-[11px] font-semibold px-5 py-2.5 rounded-full hover:bg-[#C9974A] hover:text-[#0A0908] transition-colors">
            Sign up free →
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-5 sm:px-10 py-16 sm:py-24">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[10px] font-semibold tracking-[.2em] uppercase text-[#C9974A] mb-4">Pricing</p>
          <h1 className="font-[var(--font-cormorant)] text-5xl sm:text-7xl font-light text-[#0A0908] mb-5">Start free. Always.</h1>
          <p className="text-[#5C5550] text-lg max-w-lg mx-auto">DwellIQ is free for homeowners. Our affiliate model means we earn when you purchase — no subscription required.</p>
        </div>

        {/* Plans */}
        <div className="grid sm:grid-cols-3 gap-5 mb-16">
          {PLANS.map(plan => (
            <div key={plan.name} className={`rounded-3xl border p-8 flex flex-col ${plan.primary ? "bg-[#0A0908] border-[#0A0908] shadow-2xl shadow-[#0A0908]/20 scale-[1.02]" : "bg-[#FDFAF6] border-[#D4CFC8]"}`}>
              {plan.badge && (
                <span className="inline-block text-[10px] font-semibold bg-[#C9974A] text-[#0A0908] px-3 py-1 rounded-full mb-4 self-start">{plan.badge}</span>
              )}
              <p className={`text-[11px] font-semibold tracking-[.18em] uppercase mb-2 ${plan.primary ? "text-[#C9974A]" : "text-[#9C948C]"}`}>{plan.name}</p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className={`font-[var(--font-cormorant)] text-5xl font-light ${plan.primary ? "text-[#FDFAF6]" : "text-[#0A0908]"}`}>{plan.price}</span>
                <span className={`text-sm ${plan.primary ? "text-[#FDFAF6]/40" : "text-[#9C948C]"}`}>{plan.period}</span>
              </div>
              <div className={`h-px my-6 ${plan.primary ? "bg-white/10" : "bg-[#EAE6DF]"}`} />
              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map(f => (
                  <li key={f} className={`flex items-start gap-3 text-sm ${plan.primary ? "text-[#FDFAF6]/70" : "text-[#5C5550]"}`}>
                    <span style={{ color: plan.accent }} className="flex-shrink-0 mt-0.5">✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link href={plan.href} className={`block text-center py-4 rounded-2xl text-sm font-semibold transition-colors ${plan.primary ? "bg-[#C9974A] text-[#0A0908] hover:bg-[#D4A96A]" : "border border-[#D4CFC8] text-[#5C5550] hover:border-[#C9974A] hover:text-[#C9974A]"}`}>
                {plan.cta} →
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ strip */}
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {[
            { q: "Is it really free?", a: "Yes. We earn affiliate commissions when you buy products — so the service is always free for homeowners." },
            { q: "Can I cancel Pro anytime?", a: "Yes. No contracts, no lock-in. Cancel from your account settings at any time." },
            { q: "What's the AI assistant?", a: "A natural-language chat panel inside the 3D Studio that re-optimises your design in real time based on your commands." },
            { q: "Do you support businesses?", a: "Yes — the Studio plan includes client project management and white-label exports for design professionals." },
          ].map(({ q, a }) => (
            <div key={q} className="p-5 bg-[#F5F2EE] rounded-2xl border border-[#EAE6DF]">
              <p className="text-sm font-semibold text-[#0A0908] mb-2">{q}</p>
              <p className="text-sm text-[#5C5550] leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
