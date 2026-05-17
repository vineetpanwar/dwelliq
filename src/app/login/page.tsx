import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Log in — DwellIQ",
  description: "Log in to your DwellIQ account.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F5F2EE] flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 sm:px-10 h-16">
        <Link href="/" className="font-[var(--font-cormorant)] text-2xl font-light tracking-[.1em] hover:text-[#C9974A] transition-colors text-[#0A0908]">
          dwelliq
        </Link>
        <p className="text-sm text-[#5C5550]">
          No account?{" "}
          <Link href="/signup" className="text-[#C9974A] hover:underline">Sign up free →</Link>
        </p>
      </nav>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md bg-[#FDFAF6] rounded-3xl border border-[#D4CFC8] shadow-xl p-8 sm:p-10">
          <div className="mb-8">
            <h1 className="font-[var(--font-cormorant)] text-4xl font-light text-[#0A0908] mb-2">Welcome back.</h1>
            <p className="text-sm text-[#5C5550]">Log in to access your projects, saved designs, and the 3D Studio.</p>
          </div>

          <form className="space-y-4" action="/design">
            <div>
              <label className="block text-[11px] font-semibold text-[#5C5550] uppercase tracking-wider mb-2">Email</label>
              <input type="email" placeholder="you@example.com" className="w-full border border-[#D4CFC8] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C9974A] transition-colors bg-[#FDFAF6] placeholder:text-[#9C948C]" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#5C5550] uppercase tracking-wider mb-2">Password</label>
              <input type="password" placeholder="••••••••" className="w-full border border-[#D4CFC8] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C9974A] transition-colors bg-[#FDFAF6] placeholder:text-[#9C948C]" />
            </div>
            <div className="flex justify-end">
              <Link href="#" className="text-[11px] text-[#C9974A] hover:underline">Forgot password?</Link>
            </div>
            <button type="submit" className="w-full bg-[#0A0908] text-[#FDFAF6] py-4 rounded-2xl text-sm font-semibold hover:bg-[#C9974A] hover:text-[#0A0908] transition-colors">
              Log in →
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#EAE6DF]" /></div>
            <div className="relative flex justify-center"><span className="bg-[#FDFAF6] px-4 text-[11px] text-[#9C948C]">or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {["Google", "Apple"].map(provider => (
              <button key={provider} className="border border-[#D4CFC8] rounded-xl py-3 text-sm text-[#5C5550] hover:border-[#C9974A] hover:text-[#C9974A] transition-all">
                {provider}
              </button>
            ))}
          </div>

          <p className="text-center text-[11px] text-[#9C948C] mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#C9974A] hover:underline">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
