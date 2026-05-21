import { supabaseAdmin } from "@/lib/supabase";
import { runInpaintStubs } from "./inpaint-stub";
import type { Pick } from "./types";

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? "room-photos";
const GEMINI_MODEL = "gemini-2.5-flash-image";
const GEMINI_TIMEOUT_MS = 60_000;

/**
 * For each pick, generate a "mood image" that places the product into the user's
 * room photo. Returns a map { role: imageUrl }.
 *
 * If GOOGLE_API_KEY is set, runs real Gemini 2.5 Flash Image. Otherwise falls
 * back to the stub (which returns the room photo unchanged).
 */
export async function runInpaint(
  photoUrl: string,
  picks: Pick[],
): Promise<Record<string, string>> {
  const key = process.env.GOOGLE_API_KEY;
  if (!key || picks.length === 0) {
    return runInpaintStubs(photoUrl, picks.map((p) => p.role));
  }

  const out: Record<string, string> = {};
  await Promise.all(
    picks.map(async (pick) => {
      try {
        const url = await generateMoodImage(photoUrl, pick, key);
        out[pick.role] = url;
      } catch (err) {
        console.warn(`[inpaint] Gemini failed for role ${pick.role}, using stub:`, (err as Error).message);
        out[pick.role] = photoUrl;
      }
    }),
  );
  return out;
}

async function generateMoodImage(roomUrl: string, pick: Pick, apiKey: string): Promise<string> {
  const ctl = AbortSignal.timeout(GEMINI_TIMEOUT_MS);

  const [roomB64, productB64] = await Promise.all([
    fetchAsBase64(roomUrl),
    fetchAsBase64(pick.product.image),
  ]);

  const prompt = [
    `Place this ${pick.product.category.replace(/-/g, " ")} (second image, "${pick.product.name}")`,
    `naturally into the room shown in the first image.`,
    `Match the room's lighting, perspective, and shadows.`,
    `Preserve the room's existing structure — walls, floor, windows.`,
    `Output a single photorealistic image.`,
  ].join(" ");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    signal: ctl,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType: "image/jpeg", data: roomB64.data } },
            { inlineData: { mimeType: productB64.mimeType, data: productB64.data } },
            { text: prompt },
          ],
        },
      ],
      generationConfig: { responseModalities: ["IMAGE"] },
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Gemini ${res.status}: ${text.slice(0, 200)}`);
  }

  const json = (await res.json()) as GeminiResponse;
  const parts = json.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((p) => p.inlineData?.data);
  if (!imagePart?.inlineData) {
    throw new Error("Gemini response had no image data");
  }

  const bytes = Buffer.from(imagePart.inlineData.data, "base64");
  return await uploadAndSign(bytes, pick.role);
}

async function fetchAsBase64(url: string): Promise<{ data: string; mimeType: string }> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`fetch ${url} → ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  const mimeType = r.headers.get("content-type")?.split(";")[0] ?? "image/jpeg";
  return { data: buf.toString("base64"), mimeType };
}

async function uploadAndSign(bytes: Buffer, role: string): Promise<string> {
  const db = supabaseAdmin();
  const path = `mood/${crypto.randomUUID()}-${role}.jpg`;
  const { error: upErr } = await db.storage.from(BUCKET).upload(path, bytes, {
    contentType: "image/jpeg",
    upsert: false,
  });
  if (upErr) throw new Error(`storage upload failed: ${upErr.message}`);

  const { data, error: signErr } = await db.storage
    .from(BUCKET)
    .createSignedUrl(path, 60 * 60 * 24); // 24h
  if (signErr || !data) throw new Error(`signed url failed: ${signErr?.message}`);
  return data.signedUrl;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
        inlineData?: { mimeType: string; data: string };
      }>;
    };
  }>;
}
