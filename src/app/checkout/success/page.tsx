import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Welcome to Pro — Dwelliq",
  robots: { index: false },
};

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-[#FDFAF6] flex flex-col items-center justify-center px-5">
      <Link
        href="/"
        className="font-[var(--font-cormorant)] text-2xl font-light tracking-[.1em] text-[#1C1C1C] hover:text-[#C9974A] transition-colors mb-16"
      >
        dwelliq
      </Link>

      <div className="w-full max-w-sm text-center">
        <div className="w-12 h-12 rounded-full mx-auto mb-6 flex items-center justify-center text-xl bg-[#5C7A5018] text-[#5C7A50]">
          ✓
        </div>

        <h1 className="font-[var(--font-cormorant)] text-3xl font-light mb-3 text-[#1C1C1C]">
          You&apos;re all set.
        </h1>
        <p className="text-sm text-[#5A5A5A] leading-relaxed mb-8">
          Your subscription is active. Start designing your space — all Pro features are unlocked.
        </p>

        <Link
          href="/design"
          className="inline-block bg-[#C9974A] text-[#1C1C1C] px-8 py-4 rounded-2xl text-sm font-semibold hover:bg-[#D4A96A] transition-colors"
        >
          Start designing →
        </Link>
      </div>
    </div>
  );
}
