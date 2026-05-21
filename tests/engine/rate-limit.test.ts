import { describe, it, expect, beforeEach } from "vitest";
import { checkRate, _reset } from "@/lib/engine/rate-limit";

describe("checkRate", () => {
  beforeEach(() => _reset());

  it("allows up to perSec requests in the same second", async () => {
    expect((await checkRate("k", 2)).allowed).toBe(true);
    expect((await checkRate("k", 2)).allowed).toBe(true);
    expect((await checkRate("k", 2)).allowed).toBe(false);
  });

  it("tracks keys independently", async () => {
    expect((await checkRate("k1", 1)).allowed).toBe(true);
    expect((await checkRate("k2", 1)).allowed).toBe(true);
    expect((await checkRate("k1", 1)).allowed).toBe(false);
  });

  it("returns retryAfter (seconds) when rate-limited", async () => {
    await checkRate("k", 1);
    const r = await checkRate("k", 1);
    expect(r.allowed).toBe(false);
    expect(r.retryAfter).toBeGreaterThanOrEqual(1);
    expect(r.retryAfter).toBeLessThanOrEqual(2);
  });
});
