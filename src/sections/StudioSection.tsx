"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { C } from "@/lib/tokens";
import { useIO } from "@/hooks/useIO";

const FEATURES = [
  { icon: "⬡", title: "Orbit & walkthrough camera", desc: "Explore from any angle — top-down floorplan or first-person walk" },
  { icon: "⊞", title: "Drag-and-drop placement",    desc: "Products snap to scale with collision detection and fit hints" },
  { icon: "◈", title: "Live AI updates",             desc: "Tell the assistant to change style or budget — the 3D updates instantly" },
  { icon: "◎", title: "VR mode via WebXR",           desc: "Put on a headset and walk through your design before purchasing" },
];

const PROMPTS = [
  "Optimise for more storage",
  "Keep this sofa, change everything else",
  "Make it more Japandi but stay under $5,000",
  "Show me a premium upgrade for the bedroom only",
];

export default function StudioSection() {
  const { ref, v } = useIO(0.1);
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "I've analysed your living room. Budget mode: Balanced · $4,200. What would you like to change?" },
  ]);

  const sendAiMessage = () => {
    if (!aiInput.trim()) return;
    const msg = aiInput.trim();
    setAiMessages(prev => [...prev, { role: "user", text: msg }]);
    setAiInput("");
    setTimeout(() => {
      setAiMessages(prev => [...prev, { role: "ai", text: `Understood — optimising the design for "${msg}". Reallocating budget across rooms and updating the 3D view…` }]);
    }, 900);
  };

  return (
    <section id="studio" className="py-24 sm:py-36 px-5 sm:px-8 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div style={{ opacity: v ? 1 : 0, transition: "opacity .5s" }}>
            <span className="inline-block text-[10px] font-semibold tracking-[.18em] uppercase text-[#7A9E8A] mb-4">3D Room Studio</span>
            <h2 className="font-[var(--font-cormorant)] text-5xl sm:text-6xl font-light text-[#0A0908] leading-tight mb-6">
              Walk through your<br /><em style={{ color: C.brass }}>design</em> before<br />you buy anything.
            </h2>
            <p className="text-[#5C5550] leading-relaxed mb-8 max-w-md">
              Our WebGL-powered studio renders your room in real-time 3D. Drag and drop products from the marketplace, switch styles with one click, and preview in VR via WebXR on any headset.
            </p>
            <div className="space-y-4 mb-8">
              {FEATURES.map(f => (
                <div key={f.title} className="flex gap-4">
                  <span className="text-lg text-[#C9974A] flex-shrink-0 mt-0.5">{f.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-[#0A0908]">{f.title}</p>
                    <p className="text-[11px] text-[#9C948C] mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/studio" className="inline-flex items-center gap-2 bg-[#0A0908] text-[#FDFAF6] px-8 py-4 rounded-2xl text-sm font-medium hover:bg-[#C9974A] hover:text-[#0A0908] transition-colors">
              Open in 3D Studio →
            </Link>
          </div>

          {/* 3D Studio mockup */}
          <div style={{ opacity: v ? 1 : 0, transition: "opacity .6s .15s" }}>
            <div className="relative rounded-3xl overflow-hidden border border-[#D4CFC8] shadow-2xl shadow-[#0A0908]/10 bg-[#1C1A17]">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div className="flex gap-1.5">
                  {["#EF4444","#F59E0B","#10B981"].map(c => <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />)}
                </div>
                <span className="text-[10px] text-white/40 font-mono">DwellIQ 3D Studio — Living Room</span>
                <div className="flex gap-3">
                  {["2D","3D","VR"].map(view => (
                    <span key={view} className={`text-[10px] px-2 py-0.5 rounded ${view === "3D" ? "bg-[#C9974A] text-[#0A0908] font-semibold" : "text-white/40"}`}>{view}</span>
                  ))}
                </div>
              </div>
              <div className="relative" style={{ aspectRatio: "16/10" }}>
                <Image src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80" alt="3D room preview" fill className="object-cover opacity-80" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1C1A17]/60" />
                <div className="absolute top-12 right-4 bg-[#FDFAF6]/90 rounded-xl p-3 text-xs max-w-[140px]">
                  <p className="font-semibold text-[#0A0908]">Rivet Sofa</p>
                  <p className="text-[#5C5550]">$799 · Fits ✓</p>
                  <p className="text-[#7A9E8A] text-[10px]">3 days delivery</p>
                </div>
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {["Orbit","Pan","Zoom"].map(ctrl => (
                    <span key={ctrl} className="text-[10px] bg-[#0A0908]/60 text-white px-2.5 py-1 rounded-full">{ctrl}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 border-t border-white/10 overflow-x-auto">
                {["Sofa","Rug","Lamp","Chair","Table","Art"].map(item => (
                  <span key={item} className="flex-shrink-0 text-[10px] bg-white/10 text-white/70 px-3 py-1.5 rounded-full cursor-pointer hover:bg-[#C9974A]/30 hover:text-[#C9974A] transition-colors">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Assistant embed */}
        <div className="mt-16 grid lg:grid-cols-2 gap-12 items-center">
          <div style={{ opacity: v ? 1 : 0, transition: "opacity .5s .3s" }}>
            <div className="bg-[#F5F2EE] border border-[#D4CFC8] rounded-3xl overflow-hidden shadow-lg">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-[#EAE6DF] bg-[#FDFAF6]">
                <div className="w-8 h-8 rounded-full bg-[#C9974A] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">AI</div>
                <div>
                  <p className="text-sm font-semibold text-[#0A0908]">DwellIQ Design Assistant</p>
                  <p className="text-[10px] text-[#7A9E8A]">Understands your room · budget · style</p>
                </div>
              </div>
              <div className="p-5 space-y-3 min-h-[220px]">
                {aiMessages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-snug ${m.role === "user" ? "bg-[#0A0908] text-[#FDFAF6]" : "bg-[#FDFAF6] border border-[#EAE6DF] text-[#0A0908]"}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 px-4 pb-4">
                <input
                  value={aiInput}
                  onChange={e => setAiInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendAiMessage()}
                  placeholder="e.g. Stay under $5,000 · Go more Japandi · Add storage…"
                  className="flex-1 bg-[#FDFAF6] border border-[#D4CFC8] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C9974A] transition-colors placeholder:text-[#9C948C]"
                />
                <button onClick={sendAiMessage} className="bg-[#C9974A] text-[#0A0908] px-4 py-3 rounded-xl font-semibold text-sm hover:bg-[#D4A96A] transition-colors">→</button>
              </div>
              <div className="px-4 pb-4 flex flex-wrap gap-1.5">
                {["More Japandi", "Add storage", "Stay under $5k", "Change the sofa"].map(s => (
                  <button key={s} onClick={() => setAiInput(s)} className="text-[10px] px-3 py-1.5 bg-[#EAE6DF] rounded-full text-[#5C5550] hover:bg-[#C9974A]/15 hover:text-[#C9974A] transition-colors">{s}</button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ opacity: v ? 1 : 0, transition: "opacity .5s .4s" }}>
            <span className="inline-block text-[10px] font-semibold tracking-[.18em] uppercase text-[#C4735A] mb-4">In-room AI assistant</span>
            <h3 className="font-[var(--font-cormorant)] text-4xl sm:text-5xl font-light text-[#0A0908] leading-tight mb-4">
              Talk to your<br /><em style={{ color: C.terra }}>designer.</em>
            </h3>
            <p className="text-[#5C5550] leading-relaxed mb-6">The assistant lives inside the 3D Studio and understands your room, budget mode, and current selections. Natural language commands instantly re-optimise the engine and update the 3D view.</p>
            <div className="space-y-3">
              {PROMPTS.map(cmd => (
                <div key={cmd} className="flex items-center gap-3 text-sm text-[#5C5550]">
                  <span className="text-[#C4735A]">→</span><span>&ldquo;{cmd}&rdquo;</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
