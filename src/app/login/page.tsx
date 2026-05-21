import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log in — DwellIQ",
  description: "Log in to your DwellIQ account.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F5F2EE] flex flex-col">
      <nav className="flex items-center justify-between px-6 sm:px-10 h-16">
        <Link href="/" className="font-[var(--font-cormorant)] text-2xl font-light tracking-[.1em] hover:text-[#C9974A] transition-colors text-[#0A0908]">
          dwelliq
        </Link>
        <p className="text-sm text-[#5C5550]">
          No account?{" "}
          <Link href="/signup" className="text-[#C9974A] hover:underline">Sign up free →</Link>
        </p>
      </nav>

      <div className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md bg-[#FDFAF6] rounded-3xl border border-[#D4CFC8] shadow-xl p-8 sm:p-10">
          <div className="mb-8">
            <h1 className="font-[var(--font-cormorant)] text-4xl font-light text-[#0A0908] mb-2">
              Welcome back.
            </h1>
            <p className="text-sm text-[#5C5550]">
              Log in to access your projects, saved designs, and the 3D Studio.
            </p>
          </div>

          <LoginForm />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#EAE6DF]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#FDFAF6] px-4 text-[11px] text-[#9C948C]">or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {["Google", "Apple"].map((provider) => (
              <button
                key={provider}
                disabled
                className="border border-[#D4CFC8] rounded-xl py-3 text-sm text-[#9C948C] cursor-not-allowed opacity-50"
                title="Coming soon"
              >
                {provider}
              </button>
            ))}
          </div>
          <p className="text-center text-[10px] text-[#9C948C] mt-2">OAuth coming soon</p>
        </div>
      </div>
    </div>
  );
}
