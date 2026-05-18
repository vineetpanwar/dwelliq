"use client";

import { useEffect, useRef, useState } from "react";

// ── Design tokens ─────────────────────────────────────────────────────────────
const T = {
  cream: "#FDFAF6", stone: "#F2EBE2", greige: "#E8DFCF",
  ink: "#1C1C1C", charcoal: "#111111", mid: "#5A5A5A",
  border: "#D9CEBC",
  brass: "#C9974A", brassLight: "#D4A96A",
  sage: "#5C7A50",
  terra: "#8A4A30",
};

// ── Step metadata ─────────────────────────────────────────────────────────────
const STEPS = [
  { label: "Choose your style",   accent: T.brass, desc: "Select aesthetic directions — Japandi, Biophilic, Scandi. Every product recommendation is scored against your taste profile." },
  { label: "Set your budget",     accent: T.sage,  desc: "One number covers the whole room. The allocation engine splits it optimally across sofa, rug, lighting, and every other category." },
  { label: "Pick a room",         accent: T.terra, desc: "Room type, primary use, and household type all feed the scoring model — so a family living room gets durable picks first." },
  { label: "Review three options",accent: T.brass, desc: "Option A: best within budget · Option B: best if you can stretch · Option C: best from a local shop near you. For every item." },
  { label: "Shop in one tap",     accent: T.sage,  desc: "Tap any product to open the retailer page. Price-alert subscriptions fire when the cost drops below your target." },
] as const;

// ── Cursor sequences ──────────────────────────────────────────────────────────
// Each entry: (x%, y%) position inside phone screen + optional click flag + ms delay
type CursorPt = { x: number; y: number; click?: true; delay: number };
const SEQ: CursorPt[][] = [
  // Step 0 – Style
  [
    { x: 50, y: 15, delay: 300 },
    { x: 68, y: 57, delay: 900 },
    { x: 68, y: 57, click: true, delay: 1250 },
    { x: 35, y: 69, delay: 2000 },
    { x: 35, y: 69, click: true, delay: 2350 },
    { x: 50, y: 88, delay: 3300 },
    { x: 50, y: 88, click: true, delay: 3700 },
  ],
  // Step 1 – Budget
  [
    { x: 50, y: 32, delay: 400 },
    { x: 50, y: 52, delay: 1000 },
    { x: 50, y: 52, click: true, delay: 1400 },
    { x: 50, y: 88, delay: 3900 },
    { x: 50, y: 88, click: true, delay: 4300 },
  ],
  // Step 2 – Room
  [
    { x: 50, y: 27, delay: 300 },
    { x: 50, y: 44, delay: 950 },
    { x: 50, y: 44, click: true, delay: 1300 },
    { x: 50, y: 88, delay: 3400 },
    { x: 50, y: 88, click: true, delay: 3800 },
  ],
  // Step 3 – Results (toggle A→B→C)
  [
    { x: 50, y: 22, delay: 400 },
    { x: 27, y: 63, delay: 1100 },
    { x: 27, y: 63, click: true, delay: 1500 },
    { x: 50, y: 63, delay: 2350 },
    { x: 50, y: 63, click: true, delay: 2750 },
    { x: 73, y: 63, delay: 3600 },
    { x: 73, y: 63, click: true, delay: 4000 },
  ],
  // Step 4 – Shop
  [
    { x: 50, y: 38, delay: 500 },
    { x: 50, y: 73, delay: 1300 },
    { x: 50, y: 73, click: true, delay: 1900 },
    { x: 50, y: 73, delay: 2700 },
    { x: 50, y: 73, click: true, delay: 3200 },
  ],
];

// ── Phone frame ───────────────────────────────────────────────────────────────
function PhoneFrame({ children, glow = false }: { children: React.ReactNode; glow?: boolean }) {
  return (
    <div
      style={{
        position: "relative",
        width: 248,
        height: 516,
        borderRadius: 44,
        background: "linear-gradient(160deg, #3C3C3E 0%, #1C1C1E 60%, #2C2C2E 100%)",
        boxShadow: glow
          ? `0 0 0 1.5px rgba(255,255,255,0.14), 0 70px 120px rgba(0,0,0,0.65), 0 0 80px ${T.brass}22`
          : "0 0 0 1.5px rgba(255,255,255,0.10), 0 40px 80px rgba(0,0,0,0.5)",
        transition: "box-shadow 0.6s ease",
        flexShrink: 0,
      }}
    >
      {/* Side volume buttons */}
      {[86, 128, 168].map((top, i) => (
        <div key={i} style={{ position: "absolute", left: -3, top, width: 3, height: i === 0 ? 32 : 46, background: "linear-gradient(90deg, #2A2A2C, #3A3A3C)", borderRadius: "2px 0 0 2px" }} />
      ))}
      {/* Power button */}
      <div style={{ position: "absolute", right: -3, top: 140, width: 3, height: 64, background: "linear-gradient(90deg, #3A3A3C, #2A2A2C)", borderRadius: "0 2px 2px 0" }} />

      {/* Screen bezel */}
      <div
        style={{
          position: "absolute",
          inset: 10,
          borderRadius: 36,
          overflow: "hidden",
          background: T.cream,
        }}
      >
        {/* Dynamic Island */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            width: 88,
            height: 28,
            background: "#000",
            borderRadius: 14,
            zIndex: 20,
          }}
        />
        {children}
      </div>
    </div>
  );
}

// ── Cursor dot ────────────────────────────────────────────────────────────────
function CursorDot({ x, y, clicking }: { x: number; y: number; clicking: boolean }) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",
        zIndex: 50,
        pointerEvents: "none",
        transition: "left 0.55s cubic-bezier(0.4,0,0.2,1), top 0.55s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {/* Outer ring — pulses on click */}
      <div
        style={{
          position: "absolute",
          inset: -10,
          borderRadius: "50%",
          border: `1.5px solid ${T.brass}`,
          opacity: clicking ? 0.8 : 0,
          transform: clicking ? "scale(1)" : "scale(0.6)",
          transition: "opacity 0.25s, transform 0.25s",
        }}
      />
      {/* Core dot */}
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: T.brass,
          boxShadow: `0 0 12px ${T.brass}80`,
          transform: clicking ? "scale(0.75)" : "scale(1)",
          transition: "transform 0.15s",
        }}
      />
    </div>
  );
}

// ── Screen: Style ─────────────────────────────────────────────────────────────
const STYLE_CHIPS = ["Minimalist", "Scandi", "Japandi", "Industrial", "Biophilic", "Coastal", "Mid-Century", "Japandi"] as const;
const STYLE_DISPLAY = ["Minimalist", "Scandi", "Japandi", "Industrial", "Biophilic", "Coastal", "Mid-Century", "Maximalist"];

function StyleScreen({ step }: { step: number }) {
  const [selected, setSelected] = useState<Set<number>>(new Set());

  useEffect(() => {
    const t1 = setTimeout(() => setSelected(new Set([2])), 1300);  // Japandi
    const t2 = setTimeout(() => setSelected(new Set([2, 4])), 2400);  // + Biophilic
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={{ paddingTop: 52, height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Progress */}
      <ProgressDots total={5} current={0} />

      <div style={{ padding: "14px 16px 0", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: 22, fontWeight: 300, color: T.ink, lineHeight: 1.25, marginBottom: 3 }}>
          What&apos;s your <em style={{ color: T.brass }}>style?</em>
        </div>
        <div style={{ fontSize: 10, color: T.mid, marginBottom: 16 }}>Select all that resonate</div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, flex: 1 }}>
          {STYLE_DISPLAY.map((s, i) => (
            <div
              key={s}
              style={{
                fontSize: 11,
                padding: "6px 12px",
                borderRadius: 100,
                border: `1px solid ${selected.has(i) ? T.brass : T.border}`,
                background: selected.has(i) ? `${T.brass}18` : "#fff",
                color: selected.has(i) ? T.brass : T.mid,
                fontWeight: selected.has(i) ? 600 : 400,
                transition: "all 0.3s ease",
              }}
            >
              {s}
            </div>
          ))}
        </div>

        <ContinueBtn accent={T.brass} />
      </div>
    </div>
  );
}

// ── Screen: Budget ────────────────────────────────────────────────────────────
function BudgetScreen({ step }: { step: number }) {
  const [amount, setAmount] = useState(0);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const focusTimer = setTimeout(() => setFocused(true), 1400);
    const target = 2400;
    let start = 0;
    const duration = 2200;
    const startTime = Date.now() + 1600;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < 0) { requestAnimationFrame(tick); return; }
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAmount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => clearTimeout(focusTimer);
  }, []);

  return (
    <div style={{ paddingTop: 52, height: "100%", display: "flex", flexDirection: "column" }}>
      <ProgressDots total={5} current={1} />

      <div style={{ padding: "14px 16px 0", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: T.mid, marginBottom: 8 }}>Total room budget</div>

        {/* Budget input display */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 4,
            padding: "16px 18px",
            border: `1.5px solid ${focused ? T.brass : T.border}`,
            borderRadius: 16,
            background: focused ? `${T.brass}06` : "#fff",
            transition: "all 0.3s ease",
            marginBottom: 24,
          }}
        >
          <span style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: 28, color: T.mid, lineHeight: 1 }}>£</span>
          <span style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: 52, color: T.ink, lineHeight: 1, letterSpacing: -2 }}>
            {amount.toLocaleString()}
          </span>
          {focused && (
            <div style={{ width: 2, height: 40, background: T.brass, borderRadius: 1, animation: "blink 1s step-end infinite", marginLeft: 2, marginBottom: 4 }} />
          )}
        </div>

        {/* Suggested amounts */}
        <div style={{ display: "flex", gap: 7, marginBottom: 20 }}>
          {[1000, 2400, 5000].map(v => (
            <div
              key={v}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "8px 0",
                borderRadius: 12,
                fontSize: 12,
                border: `1px solid ${v === 2400 ? T.brass : T.border}`,
                background: v === 2400 ? `${T.brass}12` : "transparent",
                color: v === 2400 ? T.brass : T.mid,
                fontWeight: v === 2400 ? 600 : 400,
              }}
            >
              £{v.toLocaleString()}
            </div>
          ))}
        </div>

        <div style={{ marginTop: "auto" }}>
          <ContinueBtn accent={T.sage} />
        </div>
      </div>
    </div>
  );
}

// ── Screen: Room ──────────────────────────────────────────────────────────────
const ROOMS = [
  { label: "Living Room", emoji: "🛋️" },
  { label: "Bedroom", emoji: "🛏️" },
  { label: "Kitchen / Dining", emoji: "🍳" },
  { label: "Home Office", emoji: "💼" },
  { label: "Bathroom", emoji: "🛁" },
];

function RoomScreen({ step }: { step: number }) {
  const [selected, setSelected] = useState(-1);

  useEffect(() => {
    const t = setTimeout(() => setSelected(0), 1350);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ paddingTop: 52, height: "100%", display: "flex", flexDirection: "column" }}>
      <ProgressDots total={5} current={2} />

      <div style={{ padding: "14px 16px 0", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: 22, fontWeight: 300, color: T.ink, lineHeight: 1.25, marginBottom: 3 }}>
          Which <em style={{ color: T.terra }}>room?</em>
        </div>
        <div style={{ fontSize: 10, color: T.mid, marginBottom: 16 }}>Tailored for your space</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
          {ROOMS.map((r, i) => (
            <div
              key={r.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 14px",
                borderRadius: 14,
                border: `1px solid ${selected === i ? T.terra : T.border}`,
                background: selected === i ? `${T.terra}10` : "#fff",
                transition: "all 0.3s ease",
              }}
            >
              <span style={{ fontSize: 20 }}>{r.emoji}</span>
              <span style={{ fontSize: 13, color: selected === i ? T.terra : T.ink, fontWeight: selected === i ? 600 : 400 }}>{r.label}</span>
              {selected === i && (
                <div style={{ marginLeft: "auto", width: 18, height: 18, borderRadius: "50%", background: T.terra, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>✓</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <ContinueBtn accent={T.terra} />
      </div>
    </div>
  );
}

// ── Screen: Results ───────────────────────────────────────────────────────────
const RESULT_OPTIONS = [
  { opt: "A", name: "IKEA KIVIK Sofa", retailer: "IKEA", price: 549, tag: "Within budget" },
  { opt: "B", name: "Made.com Axel Sofa", retailer: "Made.com", price: 999, tag: "Best quality" },
  { opt: "C", name: "Local Boutique Sofa", retailer: "Camden Market", price: 750, tag: "Shop local" },
];

function ResultsScreen({ step }: { step: number }) {
  const [active, setActive] = useState<"A" | "B" | "C">("A");

  useEffect(() => {
    const t1 = setTimeout(() => setActive("A"), 1500);
    const t2 = setTimeout(() => setActive("B"), 2750);
    const t3 = setTimeout(() => setActive("C"), 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const product = RESULT_OPTIONS.find(o => o.opt === active)!;

  return (
    <div style={{ paddingTop: 52, height: "100%", display: "flex", flexDirection: "column" }}>
      <ProgressDots total={5} current={3} />

      <div style={{ padding: "14px 16px 0", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: 20, fontWeight: 300, color: T.ink, marginBottom: 12 }}>
          Your <em style={{ color: T.brass }}>room plan</em>
        </div>

        {/* Category label */}
        <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: T.mid, marginBottom: 6 }}>Sofa</div>

        {/* Option tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
          {(["A", "B", "C"] as const).map(o => (
            <div
              key={o}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "7px 0",
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 600,
                background: active === o ? T.ink : "transparent",
                color: active === o ? T.cream : T.mid,
                border: `1px solid ${active === o ? T.ink : T.border}`,
                transition: "all 0.25s ease",
              }}
            >
              {o}
            </div>
          ))}
        </div>

        {/* Product card */}
        <div
          key={active}
          style={{
            background: "#fff",
            border: `1px solid ${T.border}`,
            borderRadius: 16,
            padding: "14px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            animation: "fadeSlideIn 0.3s ease both",
          }}
        >
          {/* Image placeholder */}
          <div style={{ background: T.greige, borderRadius: 10, height: 90, marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 32 }}>🛋️</span>
          </div>

          <div style={{ fontSize: 9, color: T.mid, marginBottom: 2 }}>{product.retailer.toUpperCase()}</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, marginBottom: 4, lineHeight: 1.3 }}>{product.name}</div>
          <div style={{ fontSize: 9, padding: "2px 8px", borderRadius: 100, background: `${T.brass}15`, color: T.brass, alignSelf: "flex-start", marginBottom: "auto" }}>{product.tag}</div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.greige}` }}>
            <span style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: 22, color: T.ink }}>£{product.price.toLocaleString()}</span>
            <div style={{ background: T.brass, color: T.cream, padding: "6px 14px", borderRadius: 100, fontSize: 11, fontWeight: 600 }}>Shop →</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Screen: Shop ──────────────────────────────────────────────────────────────
function ShopScreen({ step }: { step: number }) {
  const [tapped, setTapped] = useState(false);
  const [ripple, setRipple] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setTapped(true);
      setRipple(true);
    }, 1900);
    const t2 = setTimeout(() => {
      setTapped(false);
      setRipple(false);
    }, 2300);
    const t3 = setTimeout(() => {
      setTapped(true);
      setRipple(true);
    }, 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div style={{ paddingTop: 52, height: "100%", display: "flex", flexDirection: "column" }}>
      <ProgressDots total={5} current={4} />

      <div style={{ padding: "14px 16px 0", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: 20, fontWeight: 300, color: T.ink, marginBottom: 14 }}>
          Ready to <em style={{ color: T.sage }}>shop.</em>
        </div>

        {/* Product hero */}
        <div style={{ background: T.greige, borderRadius: 16, height: 130, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 52 }}>🛋️</span>
        </div>

        <div style={{ fontSize: 10, color: T.mid, marginBottom: 2 }}>MADE.COM · BALANCED OPTION</div>
        <div style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: 20, color: T.ink, marginBottom: 6 }}>Axel 3-Seater Sofa</div>

        {/* Delivery info */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {["🚚 14 days", "⭐ 4.5/5", "Free returns"].map(tag => (
            <span key={tag} style={{ fontSize: 10, color: T.mid, background: T.stone, padding: "3px 8px", borderRadius: 100 }}>{tag}</span>
          ))}
        </div>

        {/* Price + shop button */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: 30, color: T.ink }}>£999</span>
          <div style={{ fontSize: 9, color: T.sage }}>✓ Within your sofa budget</div>
        </div>

        {/* Shop CTA with tap animation */}
        <div style={{ position: "relative" }}>
          {ripple && (
            <div
              style={{
                position: "absolute",
                inset: -8,
                borderRadius: 24,
                background: `${T.sage}20`,
                animation: "rippleOut 0.4s ease-out both",
              }}
            />
          )}
          <div
            style={{
              background: tapped ? T.sage : T.ink,
              color: T.cream,
              padding: "14px 0",
              borderRadius: 16,
              textAlign: "center",
              fontSize: 14,
              fontWeight: 600,
              transform: tapped ? "scale(0.97)" : "scale(1)",
              transition: "all 0.15s ease",
            }}
          >
            Shop at Made.com →
          </div>
        </div>

        <div style={{ textAlign: "center", fontSize: 10, color: T.mid, marginTop: 10 }}>
          Price alert: on · Saves to your board automatically
        </div>
      </div>
    </div>
  );
}

// ── Shared UI atoms ───────────────────────────────────────────────────────────
function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 16px", borderBottom: `1px solid ${T.greige}` }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 3,
            flex: i === current ? 2 : 1,
            borderRadius: 2,
            background: i === current ? T.brass : T.greige,
            transition: "flex 0.4s, background 0.4s",
          }}
        />
      ))}
      <span style={{ fontSize: 9, color: T.mid, marginLeft: 4 }}>{current + 1}/{total}</span>
    </div>
  );
}

function ContinueBtn({ accent }: { accent: string }) {
  return (
    <div
      style={{
        background: T.ink,
        color: T.cream,
        padding: "12px 0",
        borderRadius: 100,
        textAlign: "center",
        fontSize: 13,
        fontWeight: 600,
        margin: "14px 0",
        flexShrink: 0,
      }}
    >
      Continue →
    </div>
  );
}

// ── Screens registry ──────────────────────────────────────────────────────────
const SCREENS = [StyleScreen, BudgetScreen, RoomScreen, ResultsScreen, ShopScreen];

// ── Fan layout config ─────────────────────────────────────────────────────────
// For each phone at offset i from active: [scale, rotateY, translateX, opacity]
function fanStyle(offset: number): React.CSSProperties {
  const configs: Record<number, [number, number, number, number]> = {
    0:  [1.00,  0,    0,    1.00],
    1:  [0.76, -7,  260,   0.52],
    2:  [0.56, -13, 460,   0.26],
    [-1]: [0.76,  7, -260,  0.52],
    [-2]: [0.56,  13, -460, 0.26],
  };
  const cfg = configs[Math.max(-2, Math.min(2, offset))] ?? [0.45, offset > 0 ? -18 : 18, offset * 280, 0];
  const [scale, rotY, tx, opacity] = cfg;
  return {
    transform: `translateX(${tx}px) rotateY(${rotY}deg) scale(${scale})`,
    opacity,
    zIndex: 5 - Math.abs(offset),
    transition: "transform 0.65s cubic-bezier(0.4,0,0.2,1), opacity 0.65s ease",
    pointerEvents: offset === 0 ? "auto" : "none",
    position: "absolute",
    transformOrigin: "center center",
  };
}

// ── Hero phone mockup (named export — used in the landing hero section) ───────
export function HeroPhoneMockup() {
  const [active, setActive] = useState(0);
  const N = STEPS.length;
  const STEP_DURATION = 4500;

  useEffect(() => {
    const id = setInterval(() => setActive(c => (c + 1) % N), STEP_DURATION);
    return () => clearInterval(id);
  }, [N]);

  const Screen = SCREENS[active];
  const nextStep = (active + 1) % N;
  const step = STEPS[active];

  return (
    <>
      <style>{`
        @keyframes hero-phone-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes hero-step-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes hero-progress {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes rippleOut {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0; transform: scale(1.3); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      <div style={{ position: "relative" }}>
        {/* Ambient glow — tracks accent colour */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: `radial-gradient(ellipse at center, ${step.accent}18 0%, transparent 70%)`,
            pointerEvents: "none",
            transition: "background 0.7s ease",
          }}
        />

        {/* Phone stack */}
        <div style={{ position: "relative", height: 560, display: "flex", alignItems: "center", justifyContent: "center" }}>

          {/* Secondary phone — next step, peeking behind */}
          <div
            style={{
              position: "absolute",
              transform: "translateX(68px) translateY(-22px) rotate(6deg) scale(0.78)",
              opacity: 0.38,
              zIndex: 1,
              filter: "blur(0.8px)",
              pointerEvents: "none",
              transition: "opacity 0.5s ease",
            }}
          >
            <PhoneFrame>
              <GhostScreen step={nextStep} />
            </PhoneFrame>
          </div>

          {/* Primary phone */}
          <div style={{ position: "relative", zIndex: 2, animation: "hero-phone-float 4.2s ease-in-out infinite" }}>
            <PhoneFrame glow>
              <div key={active} style={{ position: "relative", width: "100%", height: "100%" }}>
                <Screen step={active} />
              </div>
            </PhoneFrame>
          </div>
        </div>

        {/* Step label */}
        <div
          key={`label-${active}`}
          style={{ textAlign: "center", marginTop: 20, animation: "hero-step-in 0.4s ease both" }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: step.accent, marginBottom: 5 }}>
            Step {active + 1} / {N} — {step.label}
          </div>
        </div>

        {/* Dot progress */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
          {STEPS.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: i === active ? 24 : 6,
                height: 6,
                borderRadius: 3,
                background: i === active ? step.accent : "#D4CFC8",
                border: "none",
                padding: 0,
                cursor: "pointer",
                transition: "all 0.35s cubic-bezier(.34,1.56,.64,1)",
              }}
            />
          ))}
        </div>

        {/* Thin progress bar */}
        <div style={{ width: 160, height: 2, background: "rgba(10,9,8,0.08)", borderRadius: 1, margin: "12px auto 0", overflow: "hidden" }}>
          <div
            key={`progress-${active}`}
            style={{
              height: "100%",
              background: step.accent,
              borderRadius: 1,
              animation: `hero-progress ${STEP_DURATION}ms linear both`,
              width: "100%",
              transformOrigin: "left",
            }}
          />
        </div>
      </div>
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function PhoneMockupShowcase() {
  const [active, setActive] = useState(0);
  const [cursor, setCursor] = useState({ x: 50, y: 50 });
  const [clicking, setClicking] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const N = STEPS.length;
  const STEP_DURATION = 5200;

  // Auto-advance
  useEffect(() => {
    intervalRef.current = setInterval(() => setActive(c => (c + 1) % N), STEP_DURATION);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [N]);

  // Cursor sequence for active step
  useEffect(() => {
    const seq = SEQ[active] ?? [];
    setCursor({ x: 50, y: 50 });
    setClicking(false);

    const timers = seq.map(pt => {
      const t = setTimeout(() => {
        setCursor({ x: pt.x, y: pt.y });
        if (pt.click) {
          setClicking(true);
          setTimeout(() => setClicking(false), 320);
        }
      }, pt.delay);
      return t;
    });

    return () => timers.forEach(clearTimeout);
  }, [active]);

  const goTo = (i: number) => {
    setActive(i);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => setActive(c => (c + 1) % N), STEP_DURATION);
  };

  const Screen = SCREENS[active];

  return (
    <>
      {/* Inject keyframes */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes rippleOut {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0; transform: scale(1.3); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes orb-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.08); }
          66% { transform: translate(-20px, 15px) scale(0.95); }
        }
        @keyframes phone-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>

      <section
        style={{
          background: T.charcoal,
          padding: "96px 20px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Background orbs */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(ellipse at center, ${T.brass}10 0%, transparent 70%)`, animation: "orb-float 12s ease-in-out infinite" }} />
          <div style={{ position: "absolute", bottom: "10%", left: "20%", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(ellipse at center, ${T.sage}08 0%, transparent 70%)`, animation: "orb-float 16s ease-in-out infinite reverse" }} />
        </div>

        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ display: "inline-block", fontSize: 10, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: T.brass, marginBottom: 16, padding: "4px 14px", border: `1px solid ${T.brass}40`, borderRadius: 100 }}>
              See it in action
            </div>
            <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "clamp(36px,5vw,64px)", fontWeight: 300, color: T.cream, lineHeight: 1.1, marginBottom: 14 }}>
              Five steps to a <em style={{ color: T.brass }}>perfect</em> room.
            </h2>
            <p style={{ fontSize: 15, color: `${T.cream}70`, maxWidth: 480, margin: "0 auto" }}>
              Watch how Dwelliq turns preferences and a budget into a fully specified design plan.
            </p>
          </div>

          {/* Phone fan */}
          <div
            style={{
              position: "relative",
              height: 560,
              perspective: 1200,
              perspectiveOrigin: "50% 50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {STEPS.map((step, i) => {
              const offset = i - active;
              // wrap offset for circular behaviour
              const wrappedOffset = ((offset + Math.floor(N / 2) + N) % N) - Math.floor(N / 2);

              return (
                <div
                  key={i}
                  style={{
                    ...fanStyle(wrappedOffset),
                    cursor: wrappedOffset !== 0 ? "pointer" : "default",
                  }}
                  onClick={() => wrappedOffset !== 0 && goTo(i)}
                >
                  <div style={{ animation: wrappedOffset === 0 ? "phone-float 4s ease-in-out infinite" : "none" }}>
                    <PhoneFrame glow={wrappedOffset === 0}>
                      {/* Only render full screen + cursor for active phone to save perf */}
                      {wrappedOffset === 0 ? (
                        <div key={active} style={{ position: "relative", width: "100%", height: "100%" }}>
                          <Screen step={active} />
                          <CursorDot x={cursor.x} y={cursor.y} clicking={clicking} />
                        </div>
                      ) : (
                        // Ghost screen for non-active phones
                        <GhostScreen step={i} />
                      )}
                    </PhoneFrame>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Step descriptor */}
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <div
              key={active}
              style={{ animation: "fadeSlideIn 0.4s ease both" }}
            >
              <div
                style={{
                  display: "inline-block",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: STEPS[active].accent,
                  marginBottom: 10,
                }}
              >
                Step {String(active + 1).padStart(2, "0")} of {N}
              </div>
              <div style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: 26, fontWeight: 300, color: T.cream, marginBottom: 10 }}>
                {STEPS[active].label}
              </div>
              <div style={{ fontSize: 14, color: `${T.cream}60`, maxWidth: 440, margin: "0 auto", lineHeight: 1.7 }}>
                {STEPS[active].desc}
              </div>
            </div>

            {/* Step pills */}
            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 28 }}>
              {STEPS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "6px 14px 6px 10px",
                    borderRadius: 100,
                    border: `1px solid ${i === active ? s.accent : "rgba(255,255,255,0.15)"}`,
                    background: i === active ? `${s.accent}18` : "transparent",
                    color: i === active ? s.accent : "rgba(255,255,255,0.4)",
                    fontSize: 11,
                    fontWeight: i === active ? 600 : 400,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: i === active ? s.accent : "rgba(255,255,255,0.1)",
                      color: i === active ? T.ink : "rgba(255,255,255,0.4)",
                      fontSize: 9,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
              ))}
            </div>

            {/* Progress track */}
            <div style={{ width: 240, height: 2, background: "rgba(255,255,255,0.1)", borderRadius: 1, margin: "20px auto 0", overflow: "hidden" }}>
              <div
                key={active}
                style={{
                  height: "100%",
                  background: STEPS[active].accent,
                  borderRadius: 1,
                  animation: `progressGrow ${STEP_DURATION}ms linear both`,
                  width: "100%",
                  transformOrigin: "left",
                }}
              />
            </div>
          </div>
        </div>
      </section>
      <style>{`
        @keyframes progressGrow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>
    </>
  );
}

// ── Ghost screen (non-active phones) ─────────────────────────────────────────
function GhostScreen({ step }: { step: number }) {
  const colors = [T.brass, T.sage, T.terra, T.brass, T.sage];
  const accent = colors[step] ?? T.brass;

  return (
    <div style={{ paddingTop: 52, padding: "52px 16px 20px", height: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Header ghost */}
      <div style={{ height: 8, borderRadius: 4, background: T.greige, width: "60%" }} />
      <div style={{ height: 6, borderRadius: 3, background: T.greige, width: "40%" }} />

      {/* Content ghosts */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: 24,
              borderRadius: 100,
              background: i === 2 ? `${accent}25` : T.greige,
              border: `1px solid ${i === 2 ? accent : T.border}`,
              flex: "0 0 auto",
              width: `${40 + (i % 3) * 15}%`,
            }}
          />
        ))}
      </div>

      {/* Center graphic */}
      <div style={{ flex: 1, background: `linear-gradient(135deg, ${T.greige}, ${T.stone})`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${accent}30`, border: `2px solid ${accent}50` }} />
      </div>

      {/* CTA ghost */}
      <div style={{ height: 36, borderRadius: 100, background: `${T.ink}`, opacity: 0.7 }} />
    </div>
  );
}
