"use client";

import { useEffect, useState } from "react";
import { OnboardingData } from "@/lib/types";
import { RecommendationSet } from "@/lib/types";
import { generateRecommendations } from "@/lib/recommendations";
import { STYLE_LABELS } from "@/lib/catalog";
import RecommendationCard from "./RecommendationCard";
import EmailCapture from "./EmailCapture";
import BudgetTracker from "./BudgetTracker";

export default function RecommendationPage() {
  const [data, setData] = useState<OnboardingData | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(0);
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stored = sessionStorage.getItem("dwelliq_data");
    if (stored) {
      const parsed = JSON.parse(stored) as OnboardingData;
      setData(parsed);
      // Simulate brief loading (catalog lookup)
      setTimeout(() => {
        setRecommendations(generateRecommendations(parsed));
        setLoading(false);
      }, 1200);
    } else {
      // Demo mode with defaults
      const demo: OnboardingData = {
        room: "living-room",
        dimensions: { length: 14, width: 12 },
        budget: 3500,
        style: "warm-mid-century",
        household: "couple",
        primaryUse: "relaxing",
        existingPieces: "",
        postcode: "10001",
      };
      setData(demo);
      setTimeout(() => {
        setRecommendations(generateRecommendations(demo));
        setLoading(false);
      }, 1200);
    }
  }, []);

  const totalSpend = recommendations.reduce((sum, r) => {
    return sum + r.optionA.price;
  }, 0);

  if (loading) {
    return <LoadingState />;
  }

  if (!data || recommendations.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="font-serif text-2xl text-ink mb-2">No recommendations found</p>
          <a href="/design" className="text-gold underline text-sm">Start over</a>
        </div>
      </div>
    );
  }

  const active = recommendations[activeCategory];

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-cream/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <a href="/" className="font-serif text-xl font-light text-ink">dwelliq</a>
            <div className="flex items-center gap-4">
              <BudgetTracker
                totalBudget={data.budget}
                spent={totalSpend}
                compact
              />
              <a
                href="/design"
                className="text-xs text-warm-grey hover:text-ink transition-colors"
              >
                Start over
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Title */}
        <div className="mb-8">
          <p className="text-xs font-medium text-gold tracking-widest uppercase mb-2">
            Your personalized room
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-ink">
            {STYLE_LABELS[data.style]} · ${data.budget.toLocaleString()} budget ·{" "}
            {data.dimensions.length}×{data.dimensions.width} ft
          </h1>
        </div>

        {/* Budget tracker — full */}
        <div className="mb-8">
          <BudgetTracker totalBudget={data.budget} spent={totalSpend} />
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {recommendations.map((rec, i) => (
            <button
              key={rec.category}
              onClick={() => setActiveCategory(i)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm border transition-all duration-200 ${
                activeCategory === i
                  ? "border-gold bg-gold text-cream"
                  : "border-border text-warm-grey hover:border-gold/40 hover:text-ink"
              }`}
            >
              {rec.categoryLabel}
            </button>
          ))}
        </div>

        {/* Category header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl font-light text-ink">
              {active.categoryLabel}
            </h2>
            <p className="text-xs text-warm-grey mt-1">
              Allocated budget:{" "}
              <span className="font-mono">${active.categoryBudget.toLocaleString()}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-warm-grey">
            <span className="w-2 h-2 rounded-full bg-green-600 inline-block" />
            A · within budget
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block ml-2" />
            B · if flexible
            <span className="w-2 h-2 rounded-full bg-amber-600 inline-block ml-2" />
            C · local
          </div>
        </div>

        {/* Recommendation cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <RecommendationCard
            option="A"
            product={active.optionA}
            saved={savedItems.has(active.optionA.id)}
            onSave={() => {
              setSavedItems((prev) => {
                const next = new Set(prev);
                next.has(active.optionA.id) ? next.delete(active.optionA.id) : next.add(active.optionA.id);
                return next;
              });
            }}
          />
          <RecommendationCard
            option="B"
            product={active.optionB}
            saved={savedItems.has(active.optionB.id)}
            onSave={() => {
              setSavedItems((prev) => {
                const next = new Set(prev);
                next.has(active.optionB.id) ? next.delete(active.optionB.id) : next.add(active.optionB.id);
                return next;
              });
            }}
          />
          <RecommendationCard
            option="C"
            product={active.optionC}
            saved={savedItems.has(active.optionC.id)}
            onSave={() => {
              setSavedItems((prev) => {
                const next = new Set(prev);
                next.has(active.optionC.id) ? next.delete(active.optionC.id) : next.add(active.optionC.id);
                return next;
              });
            }}
          />
        </div>

        {/* Navigation between categories */}
        <div className="flex items-center justify-between mb-16">
          <button
            onClick={() => setActiveCategory((c) => Math.max(0, c - 1))}
            disabled={activeCategory === 0}
            className="flex items-center gap-2 text-sm text-warm-grey disabled:opacity-30 hover:text-ink transition-colors"
          >
            ← {activeCategory > 0 ? recommendations[activeCategory - 1].categoryLabel : ""}
          </button>
          <div className="flex gap-2">
            {recommendations.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveCategory(i)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  i === activeCategory ? "bg-gold w-5" : "bg-border"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => setActiveCategory((c) => Math.min(recommendations.length - 1, c + 1))}
            disabled={activeCategory === recommendations.length - 1}
            className="flex items-center gap-2 text-sm text-warm-grey disabled:opacity-30 hover:text-ink transition-colors"
          >
            {activeCategory < recommendations.length - 1 ? recommendations[activeCategory + 1].categoryLabel : ""} →
          </button>
        </div>

        {/* All categories overview */}
        <div className="mb-16">
          <h2 className="font-serif text-2xl font-light text-ink mb-6">All recommendations</h2>
          <div className="space-y-3">
            {recommendations.map((rec, i) => (
              <button
                key={rec.category}
                onClick={() => setActiveCategory(i)}
                className={`w-full flex items-center justify-between p-4 rounded-lg border text-left transition-all duration-200 ${
                  i === activeCategory
                    ? "border-gold bg-gold/5"
                    : "border-border bg-cream hover:border-warm-grey/40"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`w-2 h-2 rounded-full ${i === activeCategory ? "bg-gold" : "bg-border"}`} />
                  <div>
                    <p className="text-sm font-medium text-ink">{rec.categoryLabel}</p>
                    <p className="text-xs text-warm-grey">
                      From ${Math.min(rec.optionA.price, rec.optionB.price, rec.optionC.price)} · {rec.optionA.retailer}, {rec.optionB.retailer}, {rec.optionC.retailer}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-warm-grey">
                  <span className="font-mono">${rec.categoryBudget.toLocaleString()} budget</span>
                  <span>→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Email capture bar */}
      <EmailCapture />
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-6">
      <div className="font-serif text-2xl font-light text-ink">
        Finding your perfect matches...
      </div>
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-gold animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
      <p className="text-sm text-warm-grey max-w-xs text-center">
        Matching your style and budget across 200+ curated products from IKEA,
        West Elm, Wayfair, and local boutiques.
      </p>
      {/* Skeleton cards */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-2xl mt-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-lg overflow-hidden border border-border"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="skeleton h-40" />
            <div className="p-4 space-y-2">
              <div className="skeleton h-3 rounded w-3/4" />
              <div className="skeleton h-3 rounded w-1/2" />
              <div className="skeleton h-5 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
