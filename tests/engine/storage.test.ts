import { describe, it, expect, vi } from "vitest";
import { presignedUploadUrl } from "@/lib/engine/storage";

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: {
    storage: {
      from: () => ({
        createSignedUploadUrl: vi.fn(async (path: string) => ({
          data: { signedUrl: `https://signed/${path}`, path, token: "tok" },
          error: null,
        })),
      }),
    },
  },
}));

describe("presignedUploadUrl", () => {
  it("returns photo_id and signed URL", async () => {
    const r = await presignedUploadUrl();
    expect(r.photo_id).toMatch(/^[0-9a-f-]{36}$/);
    expect(r.upload_url).toContain("https://signed/");
  });

  it("uses .jpg extension by default", async () => {
    const r = await presignedUploadUrl();
    expect(r.upload_url).toMatch(/\.jpg$/);
  });
});
