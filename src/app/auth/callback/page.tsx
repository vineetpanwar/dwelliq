"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "error">("loading");

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "PASSWORD_RECOVERY") {
        router.replace("/design");
      }
    });

    // Fallback: if already signed in, redirect immediately
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/design");
      else setTimeout(() => setStatus("error"), 5000);
    });
  }, [router]);

  if (status === "error") {
    return (
      <div className="min-h-screen bg-[#FDFAF6] flex items-center justify-center px-5">
        <div className="text-center max-w-sm">
          <p className="text-[#1C1C1C] font-[var(--font-cormorant)] text-2xl font-light mb-3">
            Link expired or invalid.
          </p>
          <p className="text-sm text-[#5A5A5A] mb-6">
            Try signing in again or request a new confirmation email.
          </p>
          <a href="/login" className="text-[#C9974A] text-sm hover:underline">
            Back to login →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFAF6] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#C9974A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-[#5A5A5A]">Confirming your account…</p>
      </div>
    </div>
  );
}
