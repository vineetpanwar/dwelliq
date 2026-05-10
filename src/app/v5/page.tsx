import V5Landing from "@/components/v5/V5Landing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dwelliq — Luxury Magazine",
  description: "Three furniture options for every piece. Best within budget, best if flexible, best local.",
};

export default function V5Page() {
  return <V5Landing />;
}
