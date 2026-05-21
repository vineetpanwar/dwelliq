import Anthropic from "@anthropic-ai/sdk";
import { randomUUID } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { RuleBasedReranker } from "./reranker";
import type { Reranker, RerankerInput, PickSet, Pick } from "./types";

const MODEL = "claude-sonnet-4-6";
const SYSTEM = `You are an interior designer. The user has photographed a spot in their room and you must choose 3 products from the candidate list.

Return JSON only, matching:
{
  "picks": [
    { "role": "A" | "B" | "C", "sku": "<from candidates>", "match": 0-100, "rationale": "<1-2 sentences referencing something concrete in the photo>" }
  ]
}

Rules:
- A = best in-budget pick (price <= brief.budget)
- B = stretch pick (price <= 1.5 x brief.budget)
- C = local pick (prefer isLocal=true; if none exists, the candidate that brings the most "different perspective" from A)
- Rationale MUST reference something visible in the photo
- Each role's product MUST come from candidates, by sku
- Output JSON only — no prose around it`;

export class ClaudeSonnetReranker implements Reranker {
  readonly providerName = "claude-sonnet";
  private readonly client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  async rerank(input: RerankerInput): Promise<PickSet> {
    const photoUrl = await this.resolvePhotoUrl(input.photo_id);
    const candidateSummary = input.candidates.slice(0, 30).map((c) => ({
      sku: c.sku, name: c.product.name, retailer: c.product.retailer,
      price: c.product.price, image: c.product.image, isLocal: c.product.isLocal ?? false,
      similarity: c.similarity,
    }));

    const resp = await this.client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: SYSTEM,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "url", url: photoUrl } },
          { type: "text", text: JSON.stringify({ brief: input.brief, candidates: candidateSummary }) },
        ],
      }],
    });

    const textBlock = resp.content.find((c) => c.type === "text") as { type: "text"; text: string } | undefined;
    const text = textBlock?.text ?? "";

    let parsed: { picks: { role: "A"|"B"|"C"; sku: string; match: number; rationale: string }[] };
    try {
      const cleaned = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      parsed = JSON.parse(cleaned);
    } catch (err) {
      throw new Error(`Claude rerank parse failed: ${(err as Error).message}`);
    }

    const candidateBySku = new Map(input.candidates.map((c) => [c.sku, c]));
    const picks: Pick[] = parsed.picks.slice(0, 3).map((p) => {
      const cand = candidateBySku.get(p.sku);
      if (!cand) throw new Error(`Claude returned unknown sku: ${p.sku}`);
      return {
        role: p.role,
        sku: p.sku,
        product: cand.product,
        rationale: p.rationale,
        match: Math.round(p.match),
        ar_available: !!cand.product.gltf_url || !!cand.product.usdz_url,
        gltf_url: cand.product.gltf_url ?? null,
        usdz_url: cand.product.usdz_url ?? null,
        mood_url: null,
      };
    });

    while (picks.length < 3) {
      const fallback = input.candidates.find((c) => !picks.find((p) => p.sku === c.sku));
      if (!fallback) break;
      const role = (["A","B","C"] as const)[picks.length];
      picks.push({
        role, sku: fallback.sku, product: fallback.product,
        rationale: "Style match", match: Math.round(fallback.similarity * 100),
        ar_available: !!fallback.product.gltf_url || !!fallback.product.usdz_url,
        gltf_url: fallback.product.gltf_url ?? null,
        usdz_url: fallback.product.usdz_url ?? null,
        mood_url: null,
      });
    }

    return {
      pick_set_id: randomUUID(),
      brief: input.brief,
      inferred: { style: "warm-mid-century", palette: input.features.palette, light_temp: input.features.light_temp },
      picks: picks as [Pick, Pick, Pick],
    };
  }

  private async resolvePhotoUrl(photoId: string): Promise<string> {
    const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? "room-photos";
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUrl(`uploads/${photoId}.jpg`, 60 * 10);
    if (error || !data) throw new Error(`Couldn't sign photo URL: ${error?.message}`);
    return data.signedUrl;
  }
}

let cached: Reranker | null = null;

export function getReranker(): Reranker {
  if (cached) return cached;
  const key = process.env.ANTHROPIC_API_KEY;
  cached = key ? new ClaudeSonnetReranker(key) : new RuleBasedReranker();
  return cached;
}

export function _resetRerankerCache(): void {
  cached = null;
}
