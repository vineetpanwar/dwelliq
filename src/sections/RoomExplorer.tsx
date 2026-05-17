"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { C } from "@/lib/tokens";
import { useIO } from "@/hooks/useIO";
import SectionHeader from "@/components/ui/SectionHeader";
import StyleCard from "@/components/ui/StyleCard";

const ROOM_TABS = [
  { id: "living",  label: "Living Room",  img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80",   principles: ["Anchor with a statement sofa", "Layer textiles for warmth", "Curate a gallery wall", "Balance scale and proportion"] },
  { id: "bedroom", label: "Bedroom",      img: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=900&q=80",  principles: ["Start with the bed as the focal point", "Use linen for a calm palette", "Add a reading nook", "Blackout with style"] },
  { id: "kitchen", label: "Kitchen",      img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80",   principles: ["Open shelving creates depth", "Contrast countertops with cabinetry", "Hardware finishes tie the room", "Task + ambient lighting layers"] },
  { id: "balcony", label: "Balcony",      img: "https://images.unsplash.com/photo-1591825729269-caeb344f6df2?w=900&q=80", principles: ["Weather-resistant materials only", "Vertical gardens save space", "Define zones even in small areas", "String lights set the mood"] },
  { id: "office",  label: "Home Office",  img: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=900&q=80", principles: ["Ergonomics before aesthetics", "Natural light left or right of screen", "Cable management is design", "One statement piece energises"] },
];

const STYLES = [
  { name: "Warm Mid-Century", keywords: ["Walnut", "Tapered legs", "Organic curves", "Ochre"],   palette: ["#C9974A", "#8B6914", "#4A3728", "#F5EDD4", "#2C5F4A"], img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80" },
  { name: "Scandinavian",     keywords: ["White oak", "Linen", "Negative space", "Hygge"],       palette: ["#E8E4DF", "#BFBAB4", "#4A4540", "#FFFFFF", "#7A9E8A"], img: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80" },
  { name: "Japandi",          keywords: ["Wabi-sabi", "Natural fibre", "Muted earth", "Shoji"],  palette: ["#D4C9B8", "#8B7355", "#3D3530", "#F0EBE3", "#7A8C82"], img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80" },
  { name: "Modern Luxury",    keywords: ["Marble", "Velvet", "Brass", "Dramatic"],               palette: ["#1C1A17", "#C9974A", "#8B7D6B", "#FDFAF6", "#7B68C8"], img: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&q=80" },
  { name: "Biophilic",        keywords: ["Living walls", "Natural light", "Stone", "Clay"],      palette: ["#7A9E8A", "#4A6A58", "#8B7355", "#EAE6DF", "#C4735A"], img: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80" },
  { name: "Industrial",       keywords: ["Exposed brick", "Raw steel", "Edison bulb", "Reclaimed"], palette: ["#3D3530", "#6B5B4E", "#9C8C7C", "#EAE6DF", "#C4735A"], img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80" },
];

export default function RoomExplorer() {
  const [activeRoom, setActiveRoom] = useState(0);
  const { ref, v } = useIO(0.05);

  return (
    <section id="rooms" className="py-24 sm:py-36 px-5 sm:px-8 lg:px-10 bg-[#F5F2EE]">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          label="Room & style explorer"
          title="Find your space."
          subtitle="Browse by room type and design style. Every combination generates a unique set of constraints and recommendations."
        />

        {/* Room tabs */}
        <div ref={ref} className="mt-12" style={{ opacity: v ? 1 : 0, transition: "opacity .5s" }}>
          <div className="flex gap-2 overflow-x-auto pb-3 mb-6" style={{ scrollbarWidth: "none" }}>
            {ROOM_TABS.map((r, i) => (
              <button
                key={r.id}
                onClick={() => setActiveRoom(i)}
                className="flex-shrink-0 text-[11px] font-medium px-5 py-2.5 rounded-full transition-all duration-200"
                style={activeRoom === i ? { background: C.ink, color: "#FDFAF6" } : { background: "#FDFAF6", color: C.mid, border: `1px solid ${C.border}` }}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-6 rounded-3xl overflow-hidden border border-[#D4CFC8]">
            <div className="relative" style={{ minHeight: 380 }}>
              <Image key={activeRoom} src={ROOM_TABS[activeRoom].img} alt={ROOM_TABS[activeRoom].label} fill className="object-cover" unoptimized style={{ animation: "kenBurns 10s ease-out forwards" }} />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0908]/30 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <h3 className="font-[var(--font-cormorant)] text-3xl font-light text-[#FDFAF6] mb-2">{ROOM_TABS[activeRoom].label}</h3>
                <Link href="/studio" className="inline-flex items-center gap-2 bg-[#FDFAF6]/90 text-[#0A0908] text-[11px] font-semibold px-4 py-2 rounded-full hover:bg-[#C9974A] hover:text-[#FDFAF6] transition-colors">
                  See this in 3D Studio →
                </Link>
              </div>
            </div>
            <div className="bg-[#FDFAF6] p-7">
              <p className="text-[10px] font-semibold tracking-[.18em] uppercase text-[#9C948C] mb-4">Design principles</p>
              <ul className="space-y-3">
                {ROOM_TABS[activeRoom].principles.map(p => (
                  <li key={p} className="flex gap-3 text-sm text-[#5C5550]">
                    <span className="text-[#C9974A] flex-shrink-0 mt-0.5">·</span>{p}
                  </li>
                ))}
              </ul>
              <Link href="/design" className="mt-7 block text-center bg-[#0A0908] text-[#FDFAF6] py-3.5 rounded-xl text-sm font-medium hover:bg-[#C9974A] hover:text-[#0A0908] transition-colors">
                Design this room →
              </Link>
            </div>
          </div>
        </div>

        {/* Style cards */}
        <div className="mt-14">
          <p className="text-[10px] font-semibold tracking-[.18em] uppercase text-[#9C948C] mb-6">Seven style families</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {STYLES.map(s => <StyleCard key={s.name} style={s} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
