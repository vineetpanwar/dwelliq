import V4Landing from "@/components/v4/V4Landing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dwelliq — Spotlight",
  description: "Three furniture options for every piece. Best within budget, best if flexible, best local.",
};

export default function V4Page() {
  return <V4Landing />;
}
