import { describe, it, expectTypeOf } from "vitest";
import type { CatalogSource, FetchOptions, RemoteProduct } from "@/lib/engine/sources/catalog-source";

describe("CatalogSource types", () => {
  it("FetchOptions shape", () => {
    expectTypeOf<FetchOptions>().toMatchTypeOf<{ category: string; limit: number; zip?: string }>();
  });

  it("RemoteProduct has source field", () => {
    expectTypeOf<RemoteProduct["source"]>().toMatchTypeOf<"walmart" | "ebay">();
  });
});
