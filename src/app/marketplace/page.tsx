import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Marketplace — DwellIQ",
  description: "200+ curated products matched to your style, budget, and location.",
};

const PRODUCTS = [
  { name: "Rivet Revolve Modern Sofa", retailer: "Amazon", price: 799, match: 98, style: "Mid-Century", delivery: "3 days", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80", tags: ["In stock", "Free delivery"] },
  { name: "West Elm Haven — Natural Linen", retailer: "West Elm", price: 1299, match: 94, style: "Scandinavian", delivery: "2 weeks", img: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=400&q=80", tags: ["Premium", "Local pickup"] },
  { name: "Jaipur Braid Rug 8×10", retailer: "Wayfair", price: 449, match: 96, style: "Japandi", delivery: "5 days", img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80", tags: ["In stock"] },
  { name: "Arco Floor Lamp", retailer: "Lumens", price: 380, match: 91, style: "Modern", delivery: "1 week", img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80", tags: ["Local showroom"] },
  { name: "IKEA KIVIK 3-Seat Sofa", retailer: "IKEA", price: 649, match: 87, style: "Scandinavian", delivery: "3 days", img: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400&q=80", tags: ["In stock", "Pickup available"] },
  { name: "Wayfair Briarwood Sectional", retailer: "Wayfair", price: 1089, match: 84, style: "Modern Glam", delivery: "10 days", img: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&q=80", tags: ["Free delivery"] },
  { name: "Rattan Accent Chair", retailer: "World Market", price: 299, match: 92, style: "Biophilic", delivery: "5 days", img: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&q=80", tags: ["In stock"] },
  { name: "Industrial Shelving Unit", retailer: "CB2", price: 549, match: 89, style: "Industrial", delivery: "2 weeks", img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=80", tags: ["Local showroom"] },
];

const FILTERS = ["All", "Sofas", "Rugs", "Lighting", "Tables", "Storage", "Chairs", "Near me", "Under $500", "Under $1,000", "Premium"];

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-[#FDFAF6]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 sm:px-10 h-16 bg-[#FDFAF6]/92 backdrop-blur-xl border-b border-[#D9CEBC]/60">
        <Link href="/" className="font-[var(--font-cormorant)] text-2xl font-light tracking-[.1em] hover:text-[#C9974A] transition-colors text-[#1C1C1C]">
          dwelliq
        </Link>
        <div className="hidden sm:flex items-center gap-6">
          <Link href="/studio" className="text-[11px] text-[#5A5A5A] hover:text-[#1C1C1C] transition-colors">3D Studio</Link>
          <Link href="/pricing" className="text-[11px] text-[#5A5A5A] hover:text-[#1C1C1C] transition-colors">Pricing</Link>
        </div>
        <Link href="/design" className="bg-[#F0F0F0] text-[#FDFAF6] text-[11px] font-semibold px-5 py-2.5 rounded-full hover:bg-[#C9974A] hover:text-[#1C1C1C] transition-colors">
          Start Designing →
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto px-5 sm:px-10 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[10px] font-semibold tracking-[.2em] uppercase text-[#8C6820] mb-3">Marketplace</p>
          <h1 className="font-[var(--font-cormorant)] text-5xl sm:text-6xl font-light text-[#1C1C1C] mb-4">Every product, scored for your room.</h1>
          <p className="text-[#5A5A5A] max-w-2xl">200+ curated products across all categories. Match scores, delivery estimates, and local showroom availability — all in one place.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {FILTERS.map((f, i) => (
            <button key={f} className="text-[11px] px-4 py-2 rounded-full border transition-all" style={{ borderColor: i === 0 ? "#1C1C1C" : "#D9CEBC", background: i === 0 ? "#1C1C1C" : "transparent", color: i === 0 ? "#FDFAF6" : "#5A5A5A" }}>
              {f}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <input className="border border-[#D9CEBC] rounded-xl px-4 py-2 text-sm outline-none focus:border-[#C9974A] w-48 placeholder:text-[#8A8A8A]" placeholder="Search products…" />
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {PRODUCTS.map(p => (
            <div key={p.name} className="bg-[#FDFAF6] border border-[#D9CEBC] rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="relative" style={{ aspectRatio: "4/3" }}>
                <Image src={p.img} alt={p.name} fill className="object-cover" unoptimized />
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                  {p.tags.map(t => <span key={t} className="text-[9px] font-semibold bg-[#FDFAF6]/90 text-[#1C1C1C] px-2 py-0.5 rounded-full">{t}</span>)}
                </div>
                <div className="absolute top-2.5 right-2.5 bg-[#C9974A] text-[#1C1C1C] text-[10px] font-bold px-2 py-0.5 rounded-full">{p.match}%</div>
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold text-[#1C1C1C] leading-snug mb-0.5">{p.name}</p>
                <p className="text-[10px] mb-2" style={{ color: "#707070" }}>{p.retailer} · {p.style}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-[var(--font-cormorant)] text-xl text-[#1C1C1C]">${p.price.toLocaleString()}</span>
                  <span className="text-[10px]" style={{ color: "#5C7A50" }}>🚚 {p.delivery}</span>
                </div>
                <Link href="/studio" className="block text-center text-[10px] font-semibold py-2 rounded-lg bg-[#F2EBE2] hover:bg-[#C9974A] hover:text-[#1C1C1C] transition-colors text-[#5A5A5A]">
                  See in my room →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Location / local section */}
        <div id="local" className="mt-16 p-8 bg-[#F2EBE2] rounded-3xl border border-[#D9CEBC]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[10px] font-semibold tracking-[.2em] uppercase text-[#4A6A8A] mb-2">Local vendors</p>
              <h2 className="font-[var(--font-cormorant)] text-3xl font-light text-[#1C1C1C]">Showrooms near you</h2>
            </div>
            <Link href="/design" className="hidden sm:block border border-[#D9CEBC] text-[#5A5A5A] px-5 py-2.5 rounded-xl text-sm hover:border-[#C9974A] hover:text-[#C9974A] transition-all">
              Set my location →
            </Link>
          </div>
          <p className="text-[#5A5A5A] text-sm">Enter your ZIP code in the design quiz to see local boutiques, showrooms, and same-day pickup options matched to your design.</p>
        </div>
      </div>
    </div>
  );
}
