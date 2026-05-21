import { randomUUID } from "node:crypto";
import type {
  Reranker, RerankerInput, PickSet, Pick, Candidate
} from "./types";
import type { Product, StylePreference } from "@/lib/types";

export class RuleBasedReranker implements Reranker {
  readonly providerName = "rule-based";

  async rerank(input: RerankerInput): Promise<PickSet> {
    const { candidates, brief, features } = input;
    const budget = brief.budget ?? medianPrice(candidates);
    const stretchCeiling = budget * 1.5;

    const sorted = [...candidates].sort((a, b) => score(b, brief) - score(a, brief));

    const inBudget = sorted.filter(c => c.product.price <= budget);
    const stretch  = sorted.filter(c => c.product.price > budget && c.product.price <= stretchCeiling);
    const local    = sorted.filter(c => c.product.isLocal);

    const a = inBudget[0] ?? sorted[0];
    const b = stretch[0]  ?? sorted.find(c => c.sku !== a?.sku) ?? a;
    const c = local[0]    ?? sorted.find(x => x.sku !== a?.sku && x.sku !== b?.sku) ?? a;

    const picks: [Pick, Pick, Pick] = [
      toPick("A", a, budget, "in-budget"),
      toPick("B", b, budget, "stretch"),
      toPick("C", c, budget, "local"),
    ];

    return {
      pick_set_id: randomUUID(),
      brief,
      inferred: {
        style: inferStyle(candidates),
        palette: features.palette,
        light_temp: features.light_temp,
      },
      picks,
    };
  }
}

function score(c: Candidate, brief: { budget?: number }): number {
  // Higher = better. Combines: catalog similarity, rating, budget fit.
  let s = c.similarity * 3 + c.product.rating;
  if (brief.budget) {
    const fit = 1 - Math.abs(c.product.price - brief.budget * 0.85) / brief.budget;
    s += fit * 2;
  }
  return s;
}

function medianPrice(cs: Candidate[]): number {
  if (cs.length === 0) return 0;
  const sorted = [...cs].map(c => c.product.price).sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function inferStyle(cs: Candidate[]): StylePreference {
  // Pick the most common style across candidates' styles[] arrays.
  const counts = new Map<string, number>();
  for (const c of cs) for (const s of c.product.styles) counts.set(s, (counts.get(s) ?? 0) + 1);
  let best: string = "warm-mid-century";
  let n = 0;
  for (const [s, k] of counts) if (k > n) { best = s; n = k; }
  return best as StylePreference;
}

function toPick(role: "A" | "B" | "C", c: Candidate, budget: number, kind: "in-budget" | "stretch" | "local"): Pick {
  return {
    role,
    sku: c.sku,
    product: c.product,
    rationale: rationale(c.product, budget, kind),
    match: Math.round(c.similarity * 100),
    ar_available: !!c.product.gltf_url || !!c.product.usdz_url,
    gltf_url: c.product.gltf_url ?? null,
    usdz_url: c.product.usdz_url ?? null,
    mood_url: null,                     // populated by /api/inpaint stub
  };
}

function rationale(p: Product, budget: number, kind: "in-budget" | "stretch" | "local"): string {
  if (kind === "in-budget") {
    if (p.price <= budget) {
      return `Comfortably within budget at $${p.price}. ${p.rating}/5 rated — a confident, no-regrets pick.`;
    }
    // Fallback case: A slot couldn't find an in-budget candidate, so it's showing the best match overall.
    return `Best style match we found at $${p.price} — slightly over your target, but most aligned with the room.`;
  }
  if (kind === "stretch") {
    const over = p.price - budget;
    return `$${over} over your target, but ${p.retailer} earns the premium — you'll notice the difference in five years.`;
  }
  return `From ${p.retailer}${p.localDistance ? `, ${p.localDistance} miles away` : " (local)"}. See it in person before buying.`;
}
