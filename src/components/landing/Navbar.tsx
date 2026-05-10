"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-cream/95 backdrop-blur-sm border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl font-light tracking-wide text-ink">
          dwelliq
        </Link>
        <div className="flex items-center gap-8">
          <Link
            href="/#how-it-works"
            className="text-sm text-warm-grey hover:text-ink transition-colors hidden sm:block"
          >
            How it works
          </Link>
          <Link
            href="/#why"
            className="text-sm text-warm-grey hover:text-ink transition-colors hidden sm:block"
          >
            Why Dwelliq
          </Link>
          <Link
            href="/design"
            className="btn-gold px-5 py-2 rounded text-sm font-medium"
          >
            Start free
          </Link>
        </div>
      </div>
    </nav>
  );
}
