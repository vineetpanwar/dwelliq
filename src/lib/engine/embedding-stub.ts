import { createHash } from "node:crypto";

const DIM = 768;

/**
 * Plan-1 stub: deterministic 768-d L2-normalised vector from a text seed.
 *
 * Replaced in Plan 3 by real CLIP via Replicate. Call sites (retrieval,
 * /api/vision, /api/picks) treat the result as opaque, so the swap is a
 * one-file change.
 */
export function stubEmbedFromText(seed: string): number[] {
  const out = new Float32Array(DIM);
  // Hash the seed; expand by repeated hashing.
  let h = createHash("sha256").update(seed).digest();
  let off = 0;
  while (off < DIM * 4) {
    if (off + h.length > DIM * 4) break;
    for (let i = 0; i < h.length && off + i < DIM * 4; i++) {
      out[(off + i) >> 2] = ((h[i] / 255) - 0.5) * 2;
    }
    off += h.length;
    h = createHash("sha256").update(h).digest();
  }
  // L2-normalise.
  let norm = 0;
  for (let i = 0; i < DIM; i++) norm += out[i] * out[i];
  norm = Math.sqrt(norm) || 1;
  return Array.from(out, (x) => x / norm);
}

/**
 * Plan-1 stub for image URLs. Plan 3 fetches the image and runs CLIP.
 * We just hash the URL for now — sufficient for deterministic retrieval tests.
 */
export async function stubEmbedFromImageUrl(url: string): Promise<number[]> {
  return stubEmbedFromText(`image::${url}`);
}
