import Link from "next/link";

export default function V4Landing() {
  return (
    <div className="min-h-screen bg-[#FDFAF6] flex items-center justify-center">
      <div className="text-center">
        <p className="text-sm text-[#9C948C] mb-4">Version 4 — archived</p>
        <Link href="/" className="text-[#C9974A] hover:underline">← Back to current version</Link>
      </div>
    </div>
  );
}
