import { randomUUID } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase";

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? "room-photos";

export interface PresignedUpload {
  photo_id: string;
  upload_url: string;
  path: string;
  token: string;
}

/**
 * Mint a presigned URL the client can PUT a JPEG to.
 * Returns the stable photo_id the rest of the pipeline references.
 */
export async function presignedUploadUrl(): Promise<PresignedUpload> {
  const photo_id = randomUUID();
  const path = `uploads/${photo_id}.jpg`;
  const { data, error } = await supabaseAdmin
    .storage.from(BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data) {
    throw new Error(`presignedUploadUrl failed: ${error?.message ?? "unknown"}`);
  }

  return { photo_id, upload_url: data.signedUrl, path: data.path, token: data.token };
}
