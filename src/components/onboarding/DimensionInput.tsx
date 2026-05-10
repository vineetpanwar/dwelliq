"use client";

import { useState } from "react";

const ROOM_PRESETS = [
  { label: "Small (10×12)", length: 10, width: 12 },
  { label: "Medium (14×16)", length: 14, width: 16 },
  { label: "Large (18×20)", length: 18, width: 20 },
  { label: "Open plan (20×24)", length: 20, width: 24 },
];

function clampDim(v: number) {
  return Math.max(8, Math.min(40, v));
}

export default function DimensionInput({
  dimensions,
  onChange,
}: {
  dimensions: { length: number; width: number };
  onChange: (v: { length: number; width: number }) => void;
}) {
  const [error, setError] = useState("");

  function validate(l: number, w: number) {
    if (l < 8 || w < 8) {
      setError("Rooms smaller than 8 ft per side are uncommon. Double-check your measurements?");
    } else if (l > 35 || w > 35) {
      setError("That's a very large space — are you sure? Typical living rooms are under 25 ft.");
    } else {
      setError("");
    }
  }

  function updateLength(v: number) {
    const clamped = clampDim(v);
    validate(clamped, dimensions.width);
    onChange({ ...dimensions, length: clamped });
  }

  function updateWidth(v: number) {
    const clamped = clampDim(v);
    validate(dimensions.length, clamped);
    onChange({ ...dimensions, width: clamped });
  }

  const sqft = dimensions.length * dimensions.width;

  return (
    <div>
      {/* Input row */}
      <div className="flex items-center gap-4 mb-4">
        <div>
          <label className="block text-xs text-warm-grey mb-1.5">Length (ft)</label>
          <input
            type="number"
            value={dimensions.length}
            min={6}
            max={40}
            onChange={(e) => updateLength(Number(e.target.value))}
            className="font-mono w-24 px-3 py-2.5 border border-border rounded bg-stone text-ink text-lg focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        <span className="text-warm-grey text-2xl mt-4">×</span>
        <div>
          <label className="block text-xs text-warm-grey mb-1.5">Width (ft)</label>
          <input
            type="number"
            value={dimensions.width}
            min={6}
            max={40}
            onChange={(e) => updateWidth(Number(e.target.value))}
            className="font-mono w-24 px-3 py-2.5 border border-border rounded bg-stone text-ink text-lg focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        <div className="mt-4 text-warm-grey">
          <p className="text-xs text-warm-grey">Total</p>
          <p className="font-mono text-lg text-ink">{sqft} ft²</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-rust mb-4 bg-rust/5 px-3 py-2 rounded border border-rust/20">
          {error}
        </p>
      )}

      {/* Presets */}
      <div>
        <p className="text-xs text-warm-grey mb-2">Common sizes</p>
        <div className="flex flex-wrap gap-2">
          {ROOM_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                onChange({ length: preset.length, width: preset.width });
                setError("");
              }}
              className={`px-3 py-1.5 rounded text-xs border transition-all duration-200 ${
                dimensions.length === preset.length && dimensions.width === preset.width
                  ? "border-gold bg-gold/5 text-ink"
                  : "border-border text-warm-grey hover:border-gold/40"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visual room preview */}
      <div className="mt-6">
        <p className="text-xs text-warm-grey mb-3">Your room, to scale</p>
        <div className="relative bg-stone border border-border rounded-lg overflow-hidden h-32 flex items-center justify-center">
          <div
            className="border-2 border-gold/60 bg-gold/5 relative flex items-center justify-center"
            style={{
              width: `${Math.min(90, (dimensions.width / 30) * 90)}%`,
              height: `${Math.min(85, (dimensions.length / 30) * 85)}%`,
            }}
          >
            <span className="text-xs text-gold/70 font-mono">
              {dimensions.length}×{dimensions.width}
            </span>
            {/* North indicator */}
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs text-warm-grey">
              ↑ entrance
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
