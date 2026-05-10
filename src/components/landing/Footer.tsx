import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink text-cream/60 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-serif text-2xl font-light text-cream mb-1">dwelliq</p>
            <p className="text-xs text-cream/40 max-w-xs leading-relaxed">
              AI Home Styling Advisor. Free for homeowners. Affiliate-first. Built in NYC & Jersey City.
            </p>
          </div>
          <div className="flex flex-col sm:items-end gap-2">
            <div className="flex gap-6 text-sm">
              <Link href="/design" className="hover:text-cream transition-colors">
                Start free
              </Link>
              <Link href="/#how-it-works" className="hover:text-cream transition-colors">
                How it works
              </Link>
              <Link href="/#why" className="hover:text-cream transition-colors">
                Why Dwelliq
              </Link>
            </div>
            <p className="text-xs text-cream/30">
              © 2026 Dwelliq · Affiliate commissions fund this product
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
