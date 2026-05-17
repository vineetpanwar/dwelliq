"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { C } from "@/lib/tokens";

const NAV_LINKS = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Rooms",        href: "/#rooms" },
  { label: "3D Studio",   href: "/studio" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Pricing",     href: "/pricing" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const h = () => setMenuOpen(false);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, [menuOpen]);

  return (
    <>
      <nav
        className="fixed top-0 inset-x-0 z-50 h-16 flex items-center justify-between px-5 sm:px-8 lg:px-10 backdrop-blur-xl border-b"
        style={{ background: "rgba(253,250,246,0.94)", borderColor: "rgba(212,207,200,0.55)" }}
      >
        <Link
          href="/"
          className="font-[var(--font-cormorant)] text-[1.4rem] tracking-[.14em] select-none"
          style={{ color: C.ink, fontWeight: 400 }}
        >
          dwelliq
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href} className="text-[11px] ul-link tracking-[.04em]" style={{ color: C.mid }}>
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/login" className="hidden sm:block text-[11px] px-2 py-1" style={{ color: C.mid }}>
            Log in
          </Link>
          <Link href="/signup" className="hidden sm:block text-[11px] px-4 py-2 rounded-full" style={{ border: `1px solid ${C.border}`, color: C.mid }}>
            Sign up
          </Link>
          <Link
            href="/design"
            className="btn-shimmer text-[#0A0908] text-[11px] font-semibold px-5 py-2.5 rounded-full"
            style={{ boxShadow: "0 2px 16px rgba(201,151,74,0.22)" }}
          >
            Start Free →
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 ml-1"
            style={{ color: C.ink }}
            aria-label="Menu"
          >
            {menuOpen
              ? <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              : <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            }
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMenuOpen(false)}>
          <div
            className="absolute top-16 inset-x-0 bg-[#FDFAF6] border-b border-[#D4CFC8] shadow-2xl px-6 py-5"
            onClick={e => e.stopPropagation()}
            style={{ animation: "fadeIn .15s ease both" }}
          >
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="flex justify-between items-center py-4 text-[#5C5550] border-b border-[#EAE6DF] last:border-0"
              >
                <span className="text-base">{label}</span>
                <span className="text-[#C9974A]">→</span>
              </a>
            ))}
            <Link
              href="/design"
              onClick={() => setMenuOpen(false)}
              className="block text-center mt-5 bg-[#0A0908] text-[#FDFAF6] py-4 rounded-2xl text-sm font-medium"
            >
              Start Designing Free →
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
