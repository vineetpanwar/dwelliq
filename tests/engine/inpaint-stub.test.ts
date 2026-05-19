import { describe, it, expect } from "vitest";
import { runInpaintStubs } from "@/lib/engine/inpaint-stub";

describe("runInpaintStubs", () => {
  it("returns 3 URLs matching the input photo URL", async () => {
    const results = await runInpaintStubs("https://example.com/photo.jpg", ["a", "b", "c"]);
    expect(results).toEqual({
      a: "https://example.com/photo.jpg",
      b: "https://example.com/photo.jpg",
      c: "https://example.com/photo.jpg",
    });
  });

  it("works with fewer than 3 skus", async () => {
    const results = await runInpaintStubs("https://example.com/photo.jpg", ["only"]);
    expect(Object.keys(results)).toEqual(["only"]);
  });
});
