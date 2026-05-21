"use client";
import { useState } from "react";
import type { Plan } from "@/lib/stripe";

interface Props {
  plan: Plan;
  label: string;
  primary?: boolean;
}

export default function CheckoutButton({ plan, label, primary }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Could not start checkout. Please try again.");
        setLoading(false);
      }
    } catch {
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`block w-full text-center py-4 rounded-2xl text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
        primary
          ? "bg-[#C9974A] text-[#0A0908] hover:bg-[#D4A96A]"
          : "border border-[#D4CFC8] text-[#5C5550] hover:border-[#C9974A] hover:text-[#C9974A]"
      }`}
    >
      {loading ? "Redirecting…" : `${label} →`}
    </button>
  );
}
