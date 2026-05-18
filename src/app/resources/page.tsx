import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resources — DwellIQ",
  description: "Interior design guides, budget calculators, style quizzes, and case studies.",
};

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-[#FDFAF6]">
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 sm:px-10 h-16 bg-[#FDFAF6]/92 backdrop-blur-xl border-b border-[#D9CEBC]/60">
        <Link href="/" className="font-[var(--font-cormorant)] text-2xl font-light tracking-[.1em] hover:text-[#C9974A] transition-colors text-[#1C1C1C]">dwelliq</Link>
        <Link href="/design" className="bg-[#F0F0F0] text-[#FDFAF6] text-[11px] font-semibold px-5 py-2.5 rounded-full hover:bg-[#C9974A] hover:text-[#1C1C1C] transition-colors">Start Designing →</Link>
      </nav>

      <div className="max-w-5xl mx-auto px-5 sm:px-10 py-16">
        <p className="text-[10px] font-semibold tracking-[.2em] uppercase text-[#8C6820] mb-3">Resources</p>
        <h1 className="font-[var(--font-cormorant)] text-5xl font-light text-[#1C1C1C] mb-6">Design guides & tools.</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {[
            { title: "Interior design blog", desc: "Style guides, trends, and expert tips from our design team.", link: "#", tag: "Blog" },
            { title: "Budget calculator", desc: "See exactly how $500–$10,000 allocates across furniture, lighting, and décor.", link: "/design", tag: "Tool" },
            { title: "Style quiz", desc: "Discover your design style in 2 minutes — Japandi, Biophilic, Glam, and more.", link: "/design", tag: "Quiz" },
            { title: "Case studies", desc: "Before/after room transformations with budgets, timelines, and product lists.", link: "#", tag: "Case study" },
            { title: "Press kit", desc: "Logos, screenshots, and founder bios for media enquiries.", link: "#", tag: "Press" },
            { title: "Privacy policy", desc: "How we collect, store, and use your data.", link: "#", tag: "Legal" },
          ].map(r => (
            <Link key={r.title} href={r.link} className="block p-6 bg-[#F2EBE2] rounded-2xl border border-[#E8DFCF] hover:border-[#C9974A] hover:shadow-lg transition-all group">
              <span className="text-[10px] font-semibold text-[#8C6820] tracking-wider uppercase">{r.tag}</span>
              <h2 className="font-[var(--font-cormorant)] text-2xl font-light text-[#1C1C1C] my-2 group-hover:text-[#C9974A] transition-colors">{r.title}</h2>
              <p className="text-sm text-[#5A5A5A] leading-relaxed">{r.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
