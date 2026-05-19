import { describe, it, expect } from "vitest";
import { stubEmbedFromText, stubEmbedFromImageUrl } from "@/lib/engine/embedding-stub";

describe("embedding-stub", () => {
  it("returns a 768-dim vector", () => {
    const v = stubEmbedFromText("hello");
    expect(v).toHaveLength(768);
  });

  it("is deterministic", () => {
    const a = stubEmbedFromText("warm mid-century sofa");
    const b = stubEmbedFromText("warm mid-century sofa");
    expect(a).toEqual(b);
  });

  it("different inputs produce different outputs", () => {
    const a = stubEmbedFromText("sofa");
    const b = stubEmbedFromText("rug");
    expect(a).not.toEqual(b);
  });

  it("vectors are L2-normalised", () => {
    const v = stubEmbedFromText("anything");
    const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
    expect(norm).toBeCloseTo(1, 5);
  });

  it("image URL stub is deterministic", async () => {
    const a = await stubEmbedFromImageUrl("https://example.com/x.jpg");
    const b = await stubEmbedFromImageUrl("https://example.com/x.jpg");
    expect(a).toEqual(b);
  });
});
