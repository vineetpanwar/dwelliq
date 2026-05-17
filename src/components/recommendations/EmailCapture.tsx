"use client";

import { useState, useEffect, useRef } from "react";
import { OnboardingData } from "@/lib/types";

type Status = "idle" | "loading" | "success" | "error";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Slide in after a short delay
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  async function submit() {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const storedData = sessionStorage.getItem("dwelliq_data");
      const room_data: OnboardingData | null = storedData ? JSON.parse(storedData) : null;

      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, room_data }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Could not subscribe. Try again.");
    }
  }

  if (dismissed) return null;

  return (
    <div
      className="sticky bottom-0 z-40 border-t border-[#CCC8C0] shadow-xl"
      style={{
        background: "#F5F2EE",
        transform: visible ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-4">
        {status === "success" ? (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[#4A6A58] flex items-center justify-center flex-shrink-0">
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="#FDFAF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-[#0A0908]">You're on the list.</p>
                <p className="text-xs text-[#5C5550]">We'll email you when any of your picks changes price.</p>
              </div>
            </div>
            <button onClick={() => setDismissed(true)} aria-label="Dismiss" className="text-[#5C5550] hover:text-[#0A0908] transition-colors text-lg leading-none flex-shrink-0">✕</button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Copy */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#0A0908]">Price drop alerts — free</p>
              <p className="text-xs text-[#5C5550]">Get notified when any recommendation changes price or goes out of stock.</p>
            </div>

            {/* Input + CTA */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrorMsg(""); }}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  placeholder="your@email.com"
                  disabled={status === "loading"}
                  className="flex-1 sm:w-52 px-3 py-2.5 rounded-xl border text-sm text-[#0A0908] placeholder:text-[#CCC8C0] focus:outline-none transition-colors bg-[#FDFAF6] disabled:opacity-50"
                  style={{ borderColor: errorMsg ? "#8B3A2A" : email ? "#C9974A" : "#CCC8C0", fontFamily: "var(--font-dm-mono), monospace" }}
                />
                <button
                  onClick={submit}
                  disabled={status === "loading" || !email}
                  className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-medium text-[#FDFAF6] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: status === "loading" ? "#CCC8C0" : "#C9974A" }}
                >
                  {status === "loading" ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="5.5" stroke="#FDFAF6" strokeWidth="1.5" strokeDasharray="8 6" />
                      </svg>
                      Saving…
                    </span>
                  ) : "Notify me"}
                </button>
                <button onClick={() => setDismissed(true)} aria-label="Dismiss" className="text-[#5C5550] hover:text-[#0A0908] transition-colors text-lg leading-none flex-shrink-0 px-1">✕</button>
              </div>

              {/* Error */}
              {status === "error" && errorMsg && (
                <p className="text-xs text-[#8B3A2A] mt-1 sm:mt-0 sm:absolute sm:bottom-1">{errorMsg}</p>
              )}
              {errorMsg && status !== "error" && (
                <p className="text-xs text-[#8B3A2A] mt-1">{errorMsg}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
