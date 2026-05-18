// Central registry for AI-generated and design assets.
// Swap URLs here when Recraft/Lovart/Runway outputs are ready.

// ── Cinematic hero video ──────────────────────────────────────────────────────
// Place your video files in /public/video/ and update the paths below.
// WebM is served first (smaller, better quality); MP4 is the universal fallback.
//
// To swap later: just update the strings — no component changes needed.
//   WebM:   export const HERO_VIDEO_WEBM_URL = "/video/hero-walkthrough.webm";
//   MP4:    export const HERO_VIDEO_MP4_URL   = "/video/hero-walkthrough.mp4";
//   Poster: export const HERO_VIDEO_POSTER_URL = "/video/hero-poster.jpg";
//
// Leave empty to show the gradient placeholder instead of the video.
export const HERO_VIDEO_WEBM_URL   = "/video/hero-walkthrough.webm";
export const HERO_VIDEO_MP4_URL    = "/video/hero-walkthrough.mp4";
export const HERO_VIDEO_POSTER_URL = "/video/hero-poster.jpg";

// Legacy single-URL slot (kept for backward compat with other landing versions).
export const HERO_VIDEO_URL = "";

// Lovart illustrations — replace placeholder SVGs with Lovart output URLs
export const ILLUSTRATIONS = {
  step1: "", // "Person answering a home quiz on their phone"
  step2: "", // "AI matching products across hundreds of options"
  step3: "", // "Choosing between 3 perfect furniture options"
  emptyState: "", // Empty recommendations fallback
};

// Recraft product lifestyle images — keyed by catalog SKU
// Overrides the Unsplash image in the catalog when set
export const PRODUCT_IMAGES: Record<string, string> = {
  "sofa-001": "",
  "sofa-002": "",
  "sofa-003": "",
  "ct-001": "",
  "ct-002": "",
  "fl-001": "",
  "fl-002": "",
  "rug-001": "",
  "rug-002": "",
  "ac-001": "",
  "ac-002": "",
};

// Press logos — swap in real SVG/PNG URLs from Kittl or brand kits
export const PRESS = [
  { name: "Apartment Therapy", url: "" },
  { name: "Architectural Digest", url: "" },
  { name: "House Beautiful", url: "" },
  { name: "Domino", url: "" },
  { name: "Dezeen", url: "" },
];
