import { stubEmbedFromImageUrl } from "./embedding-stub";

const REPLICATE_CLIP_VERSION =
  "1c0371070cb827ec3c7f2f28adcdde54b50dcd239aa6faea0bc98b174ef03fb4";
const REPLICATE_TIMEOUT_MS = 30_000;

/**
 * Embed an image URL into a 768-d vector.
 *
 * If REPLICATE_API_TOKEN is set, runs real CLIP via Replicate (krthr/clip-embeddings,
 * ViT-L/14, 768-d). Otherwise falls back to the deterministic stub so unit tests
 * and key-less environments still work.
 */
export async function embedImageUrl(url: string): Promise<number[]> {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) return stubEmbedFromImageUrl(url);

  try {
    const vec = await runReplicateClip(url, token);
    if (vec.length !== 768) {
      console.warn(`[embedding] unexpected CLIP dim ${vec.length}, falling back to stub`);
      return stubEmbedFromImageUrl(url);
    }
    return l2Normalise(vec);
  } catch (err) {
    console.warn("[embedding] Replicate call failed, using stub:", (err as Error).message);
    return stubEmbedFromImageUrl(url);
  }
}

async function runReplicateClip(imageUrl: string, token: string): Promise<number[]> {
  const ctl = AbortSignal.timeout(REPLICATE_TIMEOUT_MS);

  // Use sync mode: Prefer: wait — Replicate returns the result inline within
  // ~60s rather than requiring a poll loop.
  const res = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    signal: ctl,
    headers: {
      "Authorization": `Token ${token}`,
      "Content-Type": "application/json",
      "Prefer": "wait",
    },
    body: JSON.stringify({
      version: REPLICATE_CLIP_VERSION,
      input: { image: imageUrl },
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Replicate ${res.status}: ${text.slice(0, 200)}`);
  }

  const json = (await res.json()) as { status: string; output?: { embedding?: number[] }; error?: string };
  if (json.status !== "succeeded" || !json.output?.embedding) {
    throw new Error(`Replicate status=${json.status} error=${json.error ?? "none"}`);
  }
  return json.output.embedding;
}

function l2Normalise(v: number[]): number[] {
  let norm = 0;
  for (const x of v) norm += x * x;
  norm = Math.sqrt(norm) || 1;
  return v.map((x) => x / norm);
}
