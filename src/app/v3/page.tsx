import V3Landing from "@/components/v3/V3Landing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dwelliq — Warm Organic",
  description: "Three options for every furniture piece. Best within budget, best if flexible, best local.",
};

export default function V3Page() {
  return <V3Landing />;
}
