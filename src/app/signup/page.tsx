import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign up free — DwellIQ",
  description: "Create your DwellIQ account. Free for homeowners, always.",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#F2EBE2] flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 sm:px-10 h-16">
        <Link href="/" className="font-[var(--font-cormorant)] text-2xl font-light tracking-[.1em] hover:text-[#C9974A] transition-colors text-[#1C1C1C]">
          dwelliq
        </Link>
        <p className="text-sm text-[#5A5A5A]">
          Have an account?{" "}
          <Link href="/login" className="text-[#C9974A] hover:underline">Log in →</Link>
        </p>
      </nav>

      <div className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md bg-[#FDFAF6] rounded-3xl border border-[#D9CEBC] shadow-xl p-8 sm:p-10">
          <div className="mb-8">
            <span className="inline-block text-[10px] font-semibold bg-[#5C7A50]/15 text-[#5C7A50] px-3 py-1 rounded-full mb-4">Free forever for homeowners</span>
            <h1 className="font-[var(--font-cormorant)] text-4xl font-light text-[#1C1C1C] mb-2">Create your account.</h1>
            <p className="text-sm text-[#5A5A5A]">Design your first room in under 2 minutes. No credit card required.</p>
          </div>

          <form className="space-y-4" action="/design">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#5A5A5A] uppercase tracking-wider mb-2">First name</label>
                <input type="text" placeholder="Maya" className="w-full border border-[#D9CEBC] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C9974A] transition-colors bg-[#FDFAF6] placeholder:text-[#8A8A8A]" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#5A5A5A] uppercase tracking-wider mb-2">Last name</label>
                <input type="text" placeholder="Rivera" className="w-full border border-[#D9CEBC] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C9974A] transition-colors bg-[#FDFAF6] placeholder:text-[#8A8A8A]" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#5A5A5A] uppercase tracking-wider mb-2">Email</label>
              <input type="email" placeholder="you@example.com" className="w-full border border-[#D9CEBC] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C9974A] transition-colors bg-[#FDFAF6] placeholder:text-[#8A8A8A]" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#5A5A5A] uppercase tracking-wider mb-2">Password</label>
              <input type="password" placeholder="••••••••" className="w-full border border-[#D9CEBC] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C9974A] transition-colors bg-[#FDFAF6] placeholder:text-[#8A8A8A]" />
            </div>
            <button type="submit" className="w-full bg-[#C9974A] text-[#1C1C1C] py-4 rounded-2xl text-sm font-semibold hover:bg-[#D4A96A] transition-colors">
              Create free account →
            </button>
            <p className="text-center text-[10px] text-[#707070] leading-relaxed">
              By signing up you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E8DFCF]" /></div>
            <div className="relative flex justify-center"><span className="bg-[#FDFAF6] px-4 text-[11px] text-[#707070]">or sign up with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {["Google", "Apple"].map(provider => (
              <button key={provider} className="border border-[#D9CEBC] rounded-xl py-3 text-sm text-[#5A5A5A] hover:border-[#C9974A] hover:text-[#C9974A] transition-all">
                {provider}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
