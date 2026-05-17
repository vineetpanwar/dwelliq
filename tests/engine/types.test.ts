import { describe, it, expectTypeOf } from "vitest";
import type {
  VisionFeatures, Candidate, Pick, PickSet, Brief, Reranker
} from "@/lib/engine/types";

describe("engine types", () => {
  it("VisionFeatures shape", () => {
    expectTypeOf<VisionFeatures>().toMatchTypeOf<{
      photo_id: string;
      bbox: [number, number, number, number];
      palette: string[];
      light_temp: "warm" | "neutral" | "cool";
      clip_embedding: number[];
    }>();
  });

  it("Pick role is A|B|C", () => {
    expectTypeOf<Pick["role"]>().toMatchTypeOf<"A" | "B" | "C">();
  });

  it("PickSet has exactly 3 picks", () => {
    expectTypeOf<PickSet["picks"]>().toMatchTypeOf<[Pick, Pick, Pick]>();
  });
});
