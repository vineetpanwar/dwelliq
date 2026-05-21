import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Unsubscribe — Dwelliq",
  robots: { index: false },
};

const STATES = {
  success: {
    heading: "You've been unsubscribed.",
    body: "You won't receive any more emails from Dwelliq. Changed your mind? You can re-subscribe any time from the homepage.",
    color: "#5C7A50",
  },
  invalid: {
    heading: "That link isn't valid.",
    body: "The unsubscribe link may have expired or been modified. If you'd like to unsubscribe, contact us directly.",
    color: "#C9974A",
  },
  error: {
    heading: "Something went wrong.",
    body: "We couldn't process your request right now. Please try again or contact us.",
    color: "#8A4A30",
  },
} as const;

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const state = STATES[(status as keyof typeof STATES) ?? ""] ?? STATES.success;

  return (
    <div className="min-h-screen bg-[#FDFAF6] flex flex-col items-center justify-center px-5">
      <Link
        href="/"
        className="font-[var(--font-cormorant)] text-2xl font-light tracking-[.1em] text-[#1C1C1C] hover:text-[#C9974A] transition-colors mb-16"
      >
        dwelliq
      </Link>

      <div className="w-full max-w-sm text-center">
        <div
          className="w-12 h-12 rounded-full mx-auto mb-6 flex items-center justify-center text-xl"
          style={{ background: `${state.color}18`, color: state.color }}
        >
          {status === "success" ? "✓" : status === "invalid" ? "!" : "×"}
        </div>

        <h1
          className="font-[var(--font-cormorant)] text-3xl font-light mb-3"
          style={{ color: "#1C1C1C" }}
        >
          {state.heading}
        </h1>

        <p className="text-sm text-[#5A5A5A] leading-relaxed mb-8">{state.body}</p>

        <Link
          href="/"
          className="inline-block text-sm text-[#C9974A] hover:underline"
        >
          ← Back to Dwelliq
        </Link>
      </div>
    </div>
  );
}
