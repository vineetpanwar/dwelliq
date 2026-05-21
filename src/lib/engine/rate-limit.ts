const windows = new Map<string, number[]>();

export interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number;
}

/**
 * Simple in-memory sliding-window rate limiter. Counts requests in the last 1s
 * for a given key; rejects if >= perSec already counted.
 *
 * For production, swap to Vercel KV (kv.zadd + zrange by score). The function
 * signature stays the same.
 */
export async function checkRate(key: string, perSec: number): Promise<RateLimitResult> {
  const now = Date.now();
  const windowMs = 1_000;
  const arr = (windows.get(key) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= perSec) {
    return { allowed: false, retryAfter: Math.ceil((windowMs - (now - arr[0])) / 1000) };
  }
  arr.push(now);
  windows.set(key, arr);
  return { allowed: true };
}

/** For tests — clears all windows. */
export function _reset(): void {
  windows.clear();
}
