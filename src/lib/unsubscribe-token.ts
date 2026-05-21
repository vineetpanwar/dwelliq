import { createHmac, timingSafeEqual } from "crypto";

const SECRET = process.env.UNSUBSCRIBE_SECRET ?? "dev-unsubscribe-secret-change-in-prod";

export function generateUnsubscribeToken(email: string): string {
  const encoded = Buffer.from(email.toLowerCase()).toString("base64url");
  const sig = createHmac("sha256", SECRET).update(email.toLowerCase()).digest("base64url");
  return `${encoded}.${sig}`;
}

export function verifyUnsubscribeToken(token: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [encoded, sig] = parts;

  let email: string;
  try {
    email = Buffer.from(encoded, "base64url").toString("utf8");
  } catch {
    return null;
  }

  const expected = createHmac("sha256", SECRET).update(email.toLowerCase()).digest("base64url");

  // Constant-time comparison prevents timing attacks
  try {
    const sigBuf      = Buffer.from(sig,      "base64url");
    const expectedBuf = Buffer.from(expected, "base64url");
    if (sigBuf.length !== expectedBuf.length) return null;
    if (!timingSafeEqual(sigBuf, expectedBuf)) return null;
  } catch {
    return null;
  }

  return email.toLowerCase();
}
