import type { MetadataRoute } from "next";

const BASE = "https://dwelliq-ten.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/v2", "/v3", "/v4", "/v5"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
