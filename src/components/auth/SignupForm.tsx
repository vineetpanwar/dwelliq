"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData(e.currentTarget);
    const email     = (data.get("email")     as string).trim().toLowerCase();
    const password  =  data.get("password")  as string;
    const firstName = (data.get("firstName") as string).trim();
    const lastName  = (data.get("lastName")  as string).trim();

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="text-3xl mb-4">✉️</div>
        <h2 className="font-[var(--font-cormorant)] text-2xl font-light text-[#1C1C1C] mb-2">
          Check your email.
        </h2>
        <p className="text-sm text-[#5A5A5A] leading-relaxed">
          We sent a confirmation link to your inbox. Click it to activate your account and start designing.
        </p>
        <Link href="/" className="inline-block mt-6 text-sm text-[#C9974A] hover:underline">
          ← Back to home
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-[#5A5A5A] uppercase tracking-wider mb-2">
            First name
          </label>
          <input
            name="firstName"
            type="text"
            placeholder="Maya"
            required
            className="w-full border border-[#D9CEBC] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C9974A] transition-colors bg-[#FDFAF6] placeholder:text-[#8A8A8A]"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#5A5A5A] uppercase tracking-wider mb-2">
            Last name
          </label>
          <input
            name="lastName"
            type="text"
            placeholder="Rivera"
            required
            className="w-full border border-[#D9CEBC] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C9974A] transition-colors bg-[#FDFAF6] placeholder:text-[#8A8A8A]"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-[#5A5A5A] uppercase tracking-wider mb-2">
          Email
        </label>
        <input
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          className="w-full border border-[#D9CEBC] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C9974A] transition-colors bg-[#FDFAF6] placeholder:text-[#8A8A8A]"
        />
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-[#5A5A5A] uppercase tracking-wider mb-2">
          Password
        </label>
        <input
          name="password"
          type="password"
          placeholder="Min. 8 characters"
          required
          minLength={8}
          className="w-full border border-[#D9CEBC] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C9974A] transition-colors bg-[#FDFAF6] placeholder:text-[#8A8A8A]"
        />
      </div>

      {error && (
        <p className="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#C9974A] text-[#1C1C1C] py-4 rounded-2xl text-sm font-semibold hover:bg-[#D4A96A] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Creating account…" : "Create free account →"}
      </button>

      <p className="text-center text-[10px] text-[#707070] leading-relaxed">
        By signing up you agree to our Terms of Service and Privacy Policy.
      </p>
    </form>
  );
}
