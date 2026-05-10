"use client";

const PRESETS = [1000, 2000, 3500, 5000, 7500, 10000];

export default function BudgetSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      {/* Current value display */}
      <div className="mb-6">
        <span className="font-serif text-6xl font-light text-ink">
          ${value.toLocaleString()}
        </span>
        <span className="text-warm-grey text-sm ml-2">total room budget</span>
      </div>

      {/* Range slider */}
      <div className="relative mb-8">
        <input
          type="range"
          min={500}
          max={10000}
          step={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1 appearance-none cursor-pointer rounded-full outline-none"
          style={{
            background: `linear-gradient(to right, #C9974A ${((value - 500) / 9500) * 100}%, #CCC8C0 ${((value - 500) / 9500) * 100}%)`,
          }}
        />
        <div className="flex justify-between text-xs text-warm-grey mt-2">
          <span>$500</span>
          <span>$10,000+</span>
        </div>
      </div>

      {/* Quick presets */}
      <div>
        <p className="text-xs text-warm-grey mb-3">Quick select</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => onChange(preset)}
              className={`px-4 py-2 rounded-full text-sm border transition-all duration-200 ${
                value === preset
                  ? "border-gold bg-gold text-cream"
                  : "border-border text-warm-grey hover:border-gold/50 hover:text-ink"
              }`}
            >
              ${preset.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      {/* Budget breakdown hint */}
      <div className="mt-8 p-4 bg-stone rounded-lg border border-border">
        <p className="text-xs text-warm-grey mb-2 font-medium uppercase tracking-wider">
          How we'll allocate this
        </p>
        <div className="space-y-1.5">
          {[
            { label: "Sofa", pct: 35 },
            { label: "Area rug", pct: 15 },
            { label: "Accent chair", pct: 12 },
            { label: "Coffee table", pct: 12 },
            { label: "Floor lamp", pct: 8 },
            { label: "Art + accessories", pct: 18 },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-xs text-warm-grey w-28">{item.label}</span>
              <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold/60 rounded-full"
                  style={{ width: `${item.pct}%` }}
                />
              </div>
              <span className="text-xs font-mono text-warm-grey w-12 text-right">
                ${Math.round((value * item.pct) / 100).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
