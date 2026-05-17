import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "3D Studio — DwellIQ",
  description: "Walk through your room design in real-time 3D before buying anything.",
};

export default function StudioPage() {
  return (
    <div className="min-h-screen bg-[#1C1A17] text-[#FDFAF6] flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 sm:px-10 h-16 border-b border-white/10">
        <Link href="/" className="font-[var(--font-cormorant)] text-2xl font-light tracking-[.1em] hover:text-[#C9974A] transition-colors">
          dwelliq
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/marketplace" className="text-[11px] text-white/50 hover:text-white transition-colors">Marketplace</Link>
          <Link href="/design" className="bg-[#C9974A] text-[#0A0908] text-[11px] font-semibold px-5 py-2.5 rounded-full hover:bg-[#D4A96A] transition-colors">
            Start Designing →
          </Link>
        </div>
      </nav>

      {/* Studio chrome mockup */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-[#0A0908]">
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-white/40">Living Room — Balanced Package · $4,200</span>
          </div>
          <div className="flex gap-2">
            {["2D", "3D", "VR"].map(v => (
              <button key={v} className={`text-[11px] px-3 py-1.5 rounded ${v === "3D" ? "bg-[#C9974A] text-[#0A0908] font-semibold" : "text-white/40 hover:text-white"}`}>{v}</button>
            ))}
          </div>
          <div className="flex gap-2">
            {["Orbit", "Pan", "Measure"].map(t => (
              <span key={t} className="text-[10px] bg-white/10 text-white/60 px-3 py-1.5 rounded-full">{t}</span>
            ))}
          </div>
        </div>

        {/* Canvas placeholder */}
        <div className="flex-1 flex items-center justify-center relative" style={{ minHeight: 400, background: "radial-gradient(ellipse at 50% 40%, #2C2820 0%, #1C1A17 70%)" }}>
          <div className="text-center px-6">
            <div className="w-20 h-20 rounded-3xl bg-[#C9974A]/15 border border-[#C9974A]/30 flex items-center justify-center text-3xl mx-auto mb-6">⬡</div>
            <h1 className="font-[var(--font-cormorant)] text-4xl sm:text-5xl font-light mb-4">
              3D Room Studio
            </h1>
            <p className="text-white/50 max-w-md mx-auto mb-8 leading-relaxed">
              WebGL-powered real-time 3D viewer with orbit camera, drag-and-drop furniture placement, and one-click style switching. Complete a design quiz to load your room.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/design" className="bg-[#C9974A] text-[#0A0908] px-8 py-4 rounded-2xl text-sm font-semibold hover:bg-[#D4A96A] transition-colors">
                Start a design to open Studio →
              </Link>
              <Link href="/marketplace" className="border border-white/20 text-white/60 px-7 py-4 rounded-2xl text-sm hover:border-white/40 hover:text-white transition-colors">
                Browse marketplace first
              </Link>
            </div>
          </div>
        </div>

        {/* Product tray */}
        <div className="border-t border-white/10 px-6 py-4 bg-[#0A0908] overflow-x-auto">
          <div className="flex gap-3 items-center">
            <span className="text-[10px] text-white/30 uppercase tracking-wider flex-shrink-0">Add to room</span>
            {["Sofa", "Rug", "Lamp", "Chair", "Table", "Shelving", "Art", "Plants"].map(item => (
              <Link key={item} href="/marketplace" className="flex-shrink-0 text-[11px] bg-white/8 text-white/60 px-4 py-2 rounded-full hover:bg-[#C9974A]/20 hover:text-[#C9974A] transition-colors border border-white/10">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
