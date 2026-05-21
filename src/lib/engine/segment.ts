const SAM_VERSION = "fe97b453a6455861e3bac769b441ca1f1086110da7466dbb65cf1eecfd60dc83";
const SAM_TIMEOUT_MS = 30_000;

/**
 * Segment the spot the user tapped in a room photo. Returns a mask URL (PNG)
 * or null if Replicate is unconfigured or errors out. Best-effort.
 *
 * Plan 3 phase 3d.
 */
export async function segmentSpot(
  imageUrl: string,
  tap: { x: number; y: number },
): Promise<string | null> {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) return null;

  try {
    const res = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      signal: AbortSignal.timeout(SAM_TIMEOUT_MS),
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
        Prefer: "wait",
      },
      body: JSON.stringify({
        version: SAM_VERSION,
        input: {
          image: imageUrl,
          point_coords: [[tap.x, tap.y]],
          point_labels: [1],
        },
      }),
    });
    if (!res.ok) throw new Error(`SAM ${res.status}`);
    const body = (await res.json()) as { output?: { combined_mask?: string } | string[] };
    const out = body.output;
    if (!out) return null;
    if (typeof out === "object" && !Array.isArray(out) && "combined_mask" in out) {
      return out.combined_mask ?? null;
    }
    if (Array.isArray(out)) return out[0] ?? null;
    return null;
  } catch (err) {
    console.warn("[segment] SAM failed:", (err as Error).message);
    return null;
  }
}
