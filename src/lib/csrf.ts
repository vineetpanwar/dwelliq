const ALLOWED = new Set(
  (process.env.ALLOWED_ORIGINS ?? "https://dwelliq-ten.vercel.app,http://localhost:3000")
    .split(",")
    .map((o) => o.trim())
);

// Returns a 403 Response if the request Origin is a foreign site, null if OK.
// Server-to-server calls (no Origin header) are allowed — they can't carry browser cookies.
// Exempt routes that intentionally accept cross-origin POST (e.g. Gmail one-click unsubscribe).
export function checkCsrf(request: Request): Response | null {
  const origin = request.headers.get("origin");
  if (!origin) return null;
  if (ALLOWED.has(origin)) return null;
  return Response.json({ error: "Forbidden" }, { status: 403 });
}
