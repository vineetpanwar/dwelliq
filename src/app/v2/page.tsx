import V2Landing from "@/components/v2/V2Landing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dwelliq — Noir Editorial",
  description: "Three options for every furniture piece. Best within budget, best if flexible, best local.",
};

export default function V2Page() {
  return <V2Landing />;
}
