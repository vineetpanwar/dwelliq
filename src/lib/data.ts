import { C } from "./tokens";

export const ENGINE_INPUTS = [
  { label: "Room Images",       icon: "📸", desc: "Uploaded photos + dimensions" },
  { label: "Style + Lifestyle", icon: "✦",  desc: "7 style families · household type" },
  { label: "Budget Mode",       icon: "◈",  desc: "Fixed · Flexible · Time-constrained" },
  { label: "Location",          icon: "◎",  desc: "ZIP → lat/long → local inventory" },
];

export const ENGINE_OUTPUTS = [
  { label: "Budget-Friendly", pct: 68,  color: C.sage,  desc: "$2,800 across 3 rooms" },
  { label: "Balanced",        pct: 85,  color: C.brass, desc: "$4,200 — recommended" },
  { label: "Premium",         pct: 100, color: C.terra, desc: "$6,500 — full upgrade" },
];
