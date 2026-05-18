"use client";

import Link from "next/link";

const SOCIAL = [
  { label: "Instagram", href: "https://instagram.com", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
  { label: "TikTok", href: "https://tiktok.com", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.83a8.18 8.18 0 004.78 1.52V6.89a4.85 4.85 0 01-1.01-.2z"/></svg> },
  { label: "LinkedIn", href: "https://linkedin.com", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  { label: "X / Twitter", href: "https://x.com", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
];

const COLUMNS = [
  { heading: "Design", links: [
    { label: "How it works",   href: "/#how-it-works" },
    { label: "3D Studio",      href: "/studio" },
    { label: "AI Assistant",   href: "/studio" },
    { label: "Room Explorer",  href: "/#rooms" },
    { label: "Style Explorer", href: "/#rooms" },
    { label: "Start Designing",href: "/design" },
  ]},
  { heading: "Marketplace", links: [
    { label: "Browse catalog",     href: "/marketplace" },
    { label: "Local vendors",      href: "/marketplace#local" },
    { label: "Showrooms near me",  href: "/marketplace#local" },
    { label: "Delivery tracker",   href: "/marketplace" },
    { label: "Affiliate partners", href: "/resources" },
  ]},
  { heading: "Resources", links: [
    { label: "Interior design blog", href: "/resources" },
    { label: "Budget calculator",    href: "/#calculator" },
    { label: "Style quiz",           href: "/design" },
    { label: "Case studies",         href: "/resources" },
    { label: "Press kit",            href: "/resources" },
    { label: "Privacy policy",       href: "/resources" },
  ]},
];

export default function Footer() {
  return (
    <footer className="bg-[#F0F0F0] border-t border-[#D9CEBC] px-5 sm:px-8 lg:px-10 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <p className="font-[var(--font-cormorant)] text-2xl font-light text-[#1C1C1C] mb-3">dwelliq</p>
            <p className="text-xs text-[#5A5A5A] leading-relaxed max-w-xs mb-5">
              AI interior design + cross-room budget optimization. Affiliate-first. Free for homeowners. Patent-pending technology.
            </p>
            <div className="flex gap-2">
              {SOCIAL.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg border border-[#D9CEBC] flex items-center justify-center text-[#707070] hover:border-[#C9974A]/50 hover:text-[#C9974A] hover:bg-[#C9974A]/8 transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map(col => (
            <div key={col.heading}>
              <p className="text-[10px] tracking-[.2em] uppercase text-[#707070] mb-4">{col.heading}</p>
              <div className="space-y-2.5">
                {col.links.map(l => (
                  <Link key={l.label} href={l.href} className="block text-sm text-[#5A5A5A] hover:text-[#1C1C1C] transition-colors ul-link">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-[#D9CEBC] pt-6 flex flex-col sm:flex-row justify-between gap-3">
          <p className="text-xs text-[#707070]">© 2026 DwellIQ · Affiliate commissions fund this product · Patent pending</p>
          <p className="text-xs text-[#707070]">Free for homeowners · Forever</p>
        </div>
      </div>
    </footer>
  );
}
