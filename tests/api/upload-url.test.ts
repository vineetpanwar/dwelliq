import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/engine/storage", () => ({
  presignedUploadUrl: vi.fn(async () => ({
    photo_id: "00000000-0000-0000-0000-000000000001",
    upload_url: "https://signed/uploads/x.jpg",
    path: "uploads/x.jpg",
    token: "tok",
  })),
}));

const { POST } = await import("@/app/api/upload-url/route");

describe("POST /api/upload-url", () => {
  it("returns photo_id and upload_url", async () => {
    const res = await POST(new Request("http://x/api/upload-url", { method: "POST" }));
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.photo_id).toMatch(/^[0-9a-f-]{36}$/);
    expect(body.upload_url).toContain("https://signed/");
  });
});
