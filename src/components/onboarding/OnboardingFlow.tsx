"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingData, StylePreference, HouseholdType } from "@/lib/types";
import { STYLE_LABELS, STYLE_DESCRIPTIONS, STYLE_IMAGES } from "@/lib/catalog";
import StyleCard from "./StyleCard";
import BudgetSlider from "./BudgetSlider";
import DimensionInput from "./DimensionInput";

const HOUSEHOLD_OPTIONS: { value: HouseholdType; label: string; icon: string }[] = [
  { value: "solo", label: "Just me", icon: "◎" },
  { value: "couple", label: "Couple", icon: "◑" },
  { value: "family-kids", label: "Family with kids", icon: "◕" },
  { value: "family-pets", label: "Family with pets", icon: "◖" },
  { value: "roommates", label: "Roommates", icon: "◗" },
];

const STYLE_OPTIONS = Object.entries(STYLE_LABELS).map(([value, label]) => ({
  value: value as StylePreference,
  label,
  description: STYLE_DESCRIPTIONS[value],
  image: STYLE_IMAGES[value],
}));

const INITIAL_DATA: OnboardingData = {
  room: "living-room",
  dimensions: { length: 14, width: 12 },
  budget: 3500,
  style: "warm-mid-century",
  household: "couple",
  primaryUse: "relaxing",
  existingPieces: "",
  postcode: "",
};

const TOTAL_STEPS = 6;

export default function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(INITIAL_DATA);
  const [transitioning, setTransitioning] = useState(false);
  const router = useRouter();

  function nextStep() {
    if (step >= TOTAL_STEPS - 1) {
      // Save to sessionStorage and navigate to results
      sessionStorage.setItem("dwelliq_data", JSON.stringify(data));
      router.push("/recommendations");
      return;
    }
    setTransitioning(true);
    setTimeout(() => {
      setStep((s) => s + 1);
      setTransitioning(false);
    }, 200);
  }

  function prevStep() {
    if (step === 0) return;
    setTransitioning(true);
    setTimeout(() => {
      setStep((s) => s - 1);
      setTransitioning(false);
    }, 200);
  }

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <span className="font-serif text-xl font-light text-ink">dwelliq</span>
        <div className="flex items-center gap-4">
          <span className="text-xs text-warm-grey">
            {step + 1} of {TOTAL_STEPS}
          </span>
          {step > 0 && (
            <button
              onClick={prevStep}
              className="text-xs text-warm-grey hover:text-ink transition-colors"
            >
              ← Back
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar mx-6 mt-0">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Step content */}
      <div
        className={`flex-1 flex flex-col items-center justify-center px-6 py-12 transition-all duration-200 ${
          transitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
        }`}
      >
        <div className="w-full max-w-2xl">
          {step === 0 && (
            <Step0
              data={data}
              onChange={(v) => setData((d) => ({ ...d, ...v }))}
              onNext={nextStep}
            />
          )}
          {step === 1 && (
            <Step1
              data={data}
              onChange={(v) => setData((d) => ({ ...d, ...v }))}
              onNext={nextStep}
            />
          )}
          {step === 2 && (
            <Step2
              data={data}
              onChange={(v) => setData((d) => ({ ...d, ...v }))}
              onNext={nextStep}
            />
          )}
          {step === 3 && (
            <Step3
              data={data}
              onChange={(v) => setData((d) => ({ ...d, ...v }))}
              onNext={nextStep}
            />
          )}
          {step === 4 && (
            <Step4
              data={data}
              onChange={(v) => setData((d) => ({ ...d, ...v }))}
              onNext={nextStep}
            />
          )}
          {step === 5 && (
            <Step5
              data={data}
              onChange={(v) => setData((d) => ({ ...d, ...v }))}
              onNext={nextStep}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Step 0: Budget
// ─────────────────────────────────────────────────────────
function Step0({
  data,
  onChange,
  onNext,
}: {
  data: OnboardingData;
  onChange: (v: Partial<OnboardingData>) => void;
  onNext: () => void;
}) {
  return (
    <div className="animate-fade-in-up">
      <p className="text-xs font-medium text-gold tracking-widest uppercase mb-3">
        Your budget
      </p>
      <h2 className="font-serif text-4xl font-light text-ink mb-2 leading-tight">
        What's your total budget for this room?
      </h2>
      <p className="text-sm text-warm-grey mb-10">
        Include everything — furniture, lighting, rugs, art. We'll allocate intelligently across categories.
      </p>
      <BudgetSlider
        value={data.budget}
        onChange={(v) => onChange({ budget: v })}
      />
      <button
        onClick={onNext}
        className="btn-gold mt-10 px-8 py-3 rounded font-medium w-full sm:w-auto"
      >
        Next →
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Step 1: Room dimensions
// ─────────────────────────────────────────────────────────
function Step1({
  data,
  onChange,
  onNext,
}: {
  data: OnboardingData;
  onChange: (v: Partial<OnboardingData>) => void;
  onNext: () => void;
}) {
  return (
    <div className="animate-fade-in-up">
      <p className="text-xs font-medium text-gold tracking-widest uppercase mb-3">
        Your space
      </p>
      <h2 className="font-serif text-4xl font-light text-ink mb-2 leading-tight">
        How big is your living room?
      </h2>
      <p className="text-sm text-warm-grey mb-8">
        Typical living rooms are between 10×12 and 20×24 feet.
      </p>
      <DimensionInput
        dimensions={data.dimensions}
        onChange={(v) => onChange({ dimensions: v })}
      />
      <button
        onClick={onNext}
        className="btn-gold mt-10 px-8 py-3 rounded font-medium w-full sm:w-auto"
      >
        Next →
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Step 2: Style
// ─────────────────────────────────────────────────────────
function Step2({
  data,
  onChange,
  onNext,
}: {
  data: OnboardingData;
  onChange: (v: Partial<OnboardingData>) => void;
  onNext: () => void;
}) {
  return (
    <div className="animate-fade-in-up">
      <p className="text-xs font-medium text-gold tracking-widest uppercase mb-3">
        Your style
      </p>
      <h2 className="font-serif text-4xl font-light text-ink mb-2 leading-tight">
        Which direction feels most like you?
      </h2>
      <p className="text-sm text-warm-grey mb-8">
        Pick the one that makes you feel most at home — you can always refine later.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {STYLE_OPTIONS.map((opt) => (
          <StyleCard
            key={opt.value}
            style={opt}
            selected={data.style === opt.value}
            onSelect={() => onChange({ style: opt.value })}
          />
        ))}
      </div>
      <button
        onClick={onNext}
        className="btn-gold mt-8 px-8 py-3 rounded font-medium w-full sm:w-auto"
      >
        Next →
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Step 3: Household
// ─────────────────────────────────────────────────────────
function Step3({
  data,
  onChange,
  onNext,
}: {
  data: OnboardingData;
  onChange: (v: Partial<OnboardingData>) => void;
  onNext: () => void;
}) {
  return (
    <div className="animate-fade-in-up">
      <p className="text-xs font-medium text-gold tracking-widest uppercase mb-3">
        Your household
      </p>
      <h2 className="font-serif text-4xl font-light text-ink mb-2 leading-tight">
        Who lives in this space?
      </h2>
      <p className="text-sm text-warm-grey mb-8">
        This shapes durability and practicality recommendations.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {HOUSEHOLD_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange({ household: opt.value })}
            className={`flex items-center gap-4 p-4 rounded-lg border text-left transition-all duration-200 ${
              data.household === opt.value
                ? "border-gold bg-gold/5 shadow-sm"
                : "border-border bg-cream hover:border-warm-grey/40"
            }`}
          >
            <span className="text-2xl text-gold">{opt.icon}</span>
            <span className="font-medium text-ink">{opt.label}</span>
          </button>
        ))}
      </div>
      <button
        onClick={onNext}
        className="btn-gold mt-8 px-8 py-3 rounded font-medium w-full sm:w-auto"
      >
        Next →
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Step 4: Primary use
// ─────────────────────────────────────────────────────────
const USE_OPTIONS = [
  { value: "relaxing", label: "Relaxing & unwinding" },
  { value: "working", label: "Working from home" },
  { value: "hosting", label: "Hosting & entertaining" },
  { value: "all", label: "All of the above" },
];

function Step4({
  data,
  onChange,
  onNext,
}: {
  data: OnboardingData;
  onChange: (v: Partial<OnboardingData>) => void;
  onNext: () => void;
}) {
  return (
    <div className="animate-fade-in-up">
      <p className="text-xs font-medium text-gold tracking-widest uppercase mb-3">
        How you use it
      </p>
      <h2 className="font-serif text-4xl font-light text-ink mb-2 leading-tight">
        How do you primarily use this room?
      </h2>
      <p className="text-sm text-warm-grey mb-8">
        This shapes layout and furniture priorities.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {USE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange({ primaryUse: opt.value })}
            className={`p-4 rounded-lg border text-left transition-all duration-200 ${
              data.primaryUse === opt.value
                ? "border-gold bg-gold/5 shadow-sm"
                : "border-border bg-cream hover:border-warm-grey/40"
            }`}
          >
            <span className="font-medium text-ink">{opt.label}</span>
          </button>
        ))}
      </div>
      <button
        onClick={onNext}
        className="btn-gold mt-8 px-8 py-3 rounded font-medium w-full sm:w-auto"
      >
        Next →
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Step 5: Postcode + existing pieces
// ─────────────────────────────────────────────────────────
function Step5({
  data,
  onChange,
  onNext,
}: {
  data: OnboardingData;
  onChange: (v: Partial<OnboardingData>) => void;
  onNext: () => void;
}) {
  return (
    <div className="animate-fade-in-up">
      <p className="text-xs font-medium text-gold tracking-widest uppercase mb-3">
        Almost there
      </p>
      <h2 className="font-serif text-4xl font-light text-ink mb-2 leading-tight">
        Last two questions.
      </h2>
      <p className="text-sm text-warm-grey mb-10">
        Your location powers Option C — the local boutique recommendation.
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            Your postcode{" "}
            <span className="text-warm-grey font-normal">(for local shop recommendations)</span>
          </label>
          <input
            type="text"
            value={data.postcode}
            onChange={(e) => onChange({ postcode: e.target.value })}
            placeholder="e.g. 10001"
            className="w-full sm:w-64 font-mono px-4 py-3 border border-border rounded bg-stone text-ink placeholder:text-warm-grey/50 focus:outline-none focus:border-gold transition-colors"
          />
          <p className="text-xs text-warm-grey mt-2">
            Skip this — we'll show the nearest accessible option instead.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            Any existing pieces you want to keep?{" "}
            <span className="text-warm-grey font-normal">(optional)</span>
          </label>
          <textarea
            value={data.existingPieces}
            onChange={(e) => onChange({ existingPieces: e.target.value })}
            placeholder="e.g. I have a dark walnut dining table I love, and a cream boucle armchair."
            rows={3}
            className="w-full px-4 py-3 border border-border rounded bg-stone text-ink placeholder:text-warm-grey/50 focus:outline-none focus:border-gold transition-colors resize-none text-sm"
          />
        </div>
      </div>

      <button
        onClick={onNext}
        className="btn-gold mt-10 px-8 py-3 rounded font-medium w-full sm:w-auto"
      >
        Show my recommendations →
      </button>
    </div>
  );
}
