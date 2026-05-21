"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData(e.currentTarget);
    const email    = (data.get("email")    as string).trim().toLowerCase();
    const password =  data.get("password") as string;

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/design");
    router.refresh();
  }

  async function handleForgotPassword() {
    const email = (document.querySelector<HTMLInputElement>('input[name="email"]')?.value ?? "").trim();
    if (!email) {
      setError("Enter your email address first, then click Forgot password.");
      return;
    }
    setResetting(true);
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });
    setResetSent(true);
    setResetting(false);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div>
        <label className="block text-[11px] font-semibold text-[#5C5550] uppercase tracking-wider mb-2">
          Email
        </label>
        <input
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          className="w-full border border-[#D4CFC8] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C9974A] transition-colors bg-[#FDFAF6] placeholder:text-[#9C948C]"
        />
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-[#5C5550] uppercase tracking-wider mb-2">
          Password
        </label>
        <input
          name="password"
          type="password"
          placeholder="••••••••"
          required
          className="w-full border border-[#D4CFC8] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C9974A] transition-colors bg-[#FDFAF6] placeholder:text-[#9C948C]"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleForgotPassword}
          disabled={resetting}
          className="text-[11px] text-[#C9974A] hover:underline disabled:opacity-50"
        >
          {resetting ? "Sending…" : "Forgot password?"}
        </button>
      </div>

      {resetSent && (
        <p className="text-[12px] text-[#5C7A50] bg-[#5C7A50]/10 border border-[#5C7A50]/20 rounded-xl px-4 py-3">
          Password reset email sent — check your inbox.
        </p>
      )}

      {error && (
        <p className="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#0A0908] text-[#FDFAF6] py-4 rounded-2xl text-sm font-semibold hover:bg-[#C9974A] hover:text-[#0A0908] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Logging in…" : "Log in →"}
      </button>

      <p className="text-center text-[11px] text-[#9C948C]">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-[#C9974A] hover:underline">
          Sign up free
        </Link>
      </p>
    </form>
  );
}
