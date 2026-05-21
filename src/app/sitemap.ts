import type { MetadataRoute } from "next";

const BASE = "https://dwelliq-ten.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`,               lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/design`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/recommendations`,lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/marketplace`,    lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/studio`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/pricing`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/resources`,      lastModified: new Date(), changeFrequency: "weekly",  priority: 0.6 },
    { url: `${BASE}/signup`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/login`,          lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  ];
}
