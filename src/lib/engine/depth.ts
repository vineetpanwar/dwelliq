// TODO: pin actual Depth Anything v2 version on Replicate when wiring real depth
const DEPTH_VERSION = "abcdef1234567890";
const DEPTH_TIMEOUT_MS = 30_000;

/**
 * Estimate the depth map for a room photo and return an approximate real-world
 * width (cm) of a bbox. Null when Replicate is unconfigured / errors.
 *
 * Uses a heuristic: 300cm baseline scaled by bbox width fraction (image assumed
 * 1000px logical width). Real implementation needs camera intrinsics. Plan 3 polish.
 */
export async function estimateBboxScaleCm(
  imageUrl: string,
  bbox: [number, number, number, number],
): Promise<number | null> {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) return null;

  try {
    const res = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      signal: AbortSignal.timeout(DEPTH_TIMEOUT_MS),
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
        Prefer: "wait",
      },
      body: JSON.stringify({
        version: DEPTH_VERSION,
        input: { image: imageUrl },
      }),
    });
    if (!res.ok) throw new Error(`Depth ${res.status}`);
    // We don't actually parse the depth map — we just confirm the call succeeded
    // and return a heuristic estimate based on bbox width.
    const [, , w] = bbox;
    return Math.round((w / 1000) * 300);
  } catch (err) {
    console.warn("[depth] failed:", (err as Error).message);
    return null;
  }
}
