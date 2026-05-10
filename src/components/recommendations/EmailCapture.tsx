"use client";

import { useState } from "react";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="sticky bottom-0 z-40 bg-stone border-t border-border shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        {submitted ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-sage flex items-center justify-center">
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="#FDFAF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-sm text-ink">
                You're on the list. We'll notify you when prices change.
              </p>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="text-warm-grey text-xs hover:text-ink transition-colors"
            >
              ✕ Dismiss
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-ink">
                Price drop alerts
              </p>
              <p className="text-xs text-warm-grey">
                Get notified when any of your recommendations changes price or goes out of stock.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && email.includes("@") && setSubmitted(true)}
                placeholder="your@email.com"
                className="flex-1 sm:w-52 px-3 py-2 border border-border rounded bg-cream text-sm text-ink placeholder:text-warm-grey/50 focus:outline-none focus:border-gold transition-colors"
              />
              <button
                onClick={() => email.includes("@") && setSubmitted(true)}
                className="btn-gold px-4 py-2 rounded text-sm font-medium whitespace-nowrap flex-shrink-0"
              >
                Notify me
              </button>
              <button
                onClick={() => setDismissed(true)}
                className="text-warm-grey text-lg leading-none hover:text-ink transition-colors flex-shrink-0 ml-1"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
