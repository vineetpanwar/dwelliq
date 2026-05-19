import { presignedUploadUrl } from "@/lib/engine/storage";

export async function POST(_request: Request) {
  try {
    const r = await presignedUploadUrl();
    return Response.json({ photo_id: r.photo_id, upload_url: r.upload_url, path: r.path });
  } catch (err) {
    console.error("[upload-url] error", err);
    return Response.json({ error: "Could not mint upload URL" }, { status: 500 });
  }
}
