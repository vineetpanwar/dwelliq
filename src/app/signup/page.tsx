import type { Metadata } from "next";
import Link from "next/link";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Sign up free — DwellIQ",
  description: "Create your DwellIQ account. Free for homeowners, always.",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#F2EBE2] flex flex-col">
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
            <span className="inline-block text-[10px] font-semibold bg-[#5C7A50]/15 text-[#5C7A50] px-3 py-1 rounded-full mb-4">
              Free forever for homeowners
            </span>
            <h1 className="font-[var(--font-cormorant)] text-4xl font-light text-[#1C1C1C] mb-2">
              Create your account.
            </h1>
            <p className="text-sm text-[#5A5A5A]">
              Design your first room in under 2 minutes. No credit card required.
            </p>
          </div>

          <SignupForm />
        </div>
      </div>
    </div>
  );
}
