import V6Landing from "@/components/v6/V6Landing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dwelliq — AI Interior Design for Homes & Apartments",
  description: "AI-powered interior design with 7 styles, curated colour palettes, material libraries, and budget-matched furniture recommendations. Free for homeowners.",
};

export default function HomePage() {
  return (
    <>
      <div style={{ display: "none" }}>
        Impact-Site-Verification: cadae08b-c619-49d0-ae4c-4c45a07a9f35
      </div>
      <V6Landing />
    </>
  );
}
