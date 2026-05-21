import { presignedUploadUrl } from "@/lib/engine/storage";
import { checkCsrf } from "@/lib/csrf";
import { checkRate } from "@/lib/engine/rate-limit";

export async function POST(request: Request) {
  const csrf = checkCsrf(request); if (csrf) return csrf;

  if (process.env.NODE_ENV !== "test") {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
    const rateCheck = await checkRate(
      `upload:${ip}`,
      parseInt(process.env.RATE_LIMIT_UPLOAD_PER_SEC ?? "10")
    );
    if (!rateCheck.allowed) {
      return new Response("Rate limited", {
        status: 429,
        headers: { "Retry-After": String(rateCheck.retryAfter ?? 1) },
      });
    }
  }


  try {
    const r = await presignedUploadUrl();
    return Response.json({ photo_id: r.photo_id, upload_url: r.upload_url, path: r.path });
  } catch (err) {
    console.error("[upload-url] error", err);
    return Response.json({ error: "Could not mint upload URL" }, { status: 500 });
  }
}
