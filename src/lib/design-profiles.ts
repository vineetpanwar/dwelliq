import { StylePreference, HouseholdType } from "./types";

export type ColorSwatch = {
  name: string;
  hex: string;
  role: "wall" | "floor" | "primary" | "secondary" | "accent";
  tip: string;
};

export type MaterialTag = {
  label: string;
  icon: string;
};

export type DesignProfile = {
  style: StylePreference;
  headline: string;
  tagline: string;
  personality: string[];
  colors: ColorSwatch[];
  materials: MaterialTag[];
  avoid: string[];
  roomTips: string[];
  accessories: AccessorySuggestion[];
};

export type AccessorySuggestion = {
  name: string;
  why: string;
  priceRange: string;
  searchQuery: string;
};

export type RoomScaleAdvice = {
  label: string;
  tip: string;
  icon: string;
};

export const DESIGN_PROFILES: Record<StylePreference, DesignProfile> = {
  "warm-mid-century": {
    style: "warm-mid-century",
    headline: "Warm Mid-Century Modern",
    tagline: "Walnut, wool, and warm light — a room that feels lived-in and intentional.",
    personality: ["Confident", "Warm", "Timeless", "Curated"],
    colors: [
      { name: "Greige Wall",       hex: "#E2D9CA", role: "wall",      tip: "Sherwin-Williams 'Accessible Beige' or similar — adds warmth without going yellow." },
      { name: "Walnut Floor",      hex: "#7B4F2E", role: "floor",     tip: "Dark walnut or medium oak; avoid grey-toned laminate." },
      { name: "Amber Textile",     hex: "#C9974A", role: "primary",   tip: "Your primary accent — cushions, lampshades, small accessories." },
      { name: "Cognac Leather",    hex: "#8B4513", role: "secondary", tip: "A second warm tone — throw, bench, or single accent chair." },
      { name: "Forest Green",      hex: "#2D5016", role: "accent",    tip: "One bold plant or a single chair in this tone — anchors the warmth." },
    ],
    materials: [
      { label: "Walnut wood", icon: "🪵" },
      { label: "Boucle fabric", icon: "🧶" },
      { label: "Brass metal", icon: "✨" },
      { label: "Wool rug", icon: "🟤" },
      { label: "Linen curtains", icon: "🪟" },
    ],
    avoid: ["Grey-toned woods", "Chrome or silver metals", "Cool white walls", "All-white colour scheme"],
    roomTips: [
      "Keep max 3 wood tones — walnut, oak, or teak. Mixing more reads as cluttered.",
      "A warm-tinted bulb (2700K) is as important as the lamp itself.",
      "Low-profile furniture makes ceilings feel taller.",
      "Leave 18 inches between sofa and coffee table for comfortable flow.",
    ],
    accessories: [
      { name: "Ceramic table lamp", why: "Adds organic warmth to flat walnut surfaces", priceRange: "$60–$180", searchQuery: "ceramic table lamp warm brown mid century" },
      { name: "Throw in mustard or rust", why: "Layering a second warm tone prevents a flat look", priceRange: "$45–$120", searchQuery: "wool throw blanket mustard rust mid century" },
      { name: "Fiddle leaf fig or olive tree", why: "Tall plants fill vertical space and soften hard edges", priceRange: "$40–$200", searchQuery: "large indoor plant fiddle leaf fig" },
      { name: "Framed abstract print set", why: "2–3 warm-toned prints replace a gallery wall without clutter", priceRange: "$80–$250", searchQuery: "abstract warm tones art print set framed" },
      { name: "Travertine tray or coasters", why: "Natural stone on the coffee table adds texture contrast", priceRange: "$30–$90", searchQuery: "travertine tray coasters coffee table decor" },
    ],
  },

  "scandinavian-minimal": {
    style: "scandinavian-minimal",
    headline: "Scandinavian Minimal",
    tagline: "Restraint as a design decision — every piece earns its place.",
    personality: ["Calm", "Considered", "Light", "Functional"],
    colors: [
      { name: "Warm White Wall",   hex: "#F5F0E8", role: "wall",      tip: "Off-white with a warm undertone — never pure brilliant white which reads cold." },
      { name: "Light Oak Floor",   hex: "#C4A870", role: "floor",     tip: "Light or natural oak — whitewashed works if room lacks natural light." },
      { name: "Slate Blue",        hex: "#8B9EA8", role: "primary",   tip: "A muted blue-grey — not navy, not sky blue. Think Nordic fjord." },
      { name: "Pebble",            hex: "#B8B0A4", role: "secondary", tip: "Warm grey for textiles — keeps the palette cohesive without contrast." },
      { name: "Terracotta Pop",    hex: "#C4714A", role: "accent",    tip: "One terracotta piece — a pot, cushion, or vase — prevents the room feeling clinical." },
    ],
    materials: [
      { label: "Light oak wood", icon: "🪵" },
      { label: "Linen fabric",   icon: "🧵" },
      { label: "Matte black",    icon: "⬛" },
      { label: "Concrete",       icon: "🪨" },
      { label: "Sheepskin",      icon: "🐑" },
    ],
    avoid: ["Heavy ornate patterns", "Warm brown woods", "Gold or brass metals", "Maximalist layering"],
    roomTips: [
      "Negative space is not emptiness — it's intentional breathing room.",
      "Storage that hides clutter is as important as the furniture you show.",
      "One statement plant, not a jungle — a single sculptural cactus or snake plant.",
      "Keep rugs smaller than you think; floating furniture on a large rug reads Scandinavian.",
    ],
    accessories: [
      { name: "Ceramic vase set (3 heights)", why: "Asymmetric groupings feel curated, not staged", priceRange: "$35–$110", searchQuery: "white ceramic vase set minimal scandinavian" },
      { name: "Sheepskin throw", why: "Adds the tactile warmth Scandi rooms need to not feel cold", priceRange: "$55–$140", searchQuery: "sheepskin throw rug chair drape" },
      { name: "Concrete candle holder", why: "Material contrast against light oak and linen", priceRange: "$20–$60", searchQuery: "concrete candle holder minimal decor" },
      { name: "Linen cushion covers (neutral set)", why: "Texture over colour — mix weaves, not hues", priceRange: "$40–$90", searchQuery: "linen cushion covers natural oatmeal set" },
      { name: "Woven wall hanging", why: "Soft texture on a blank wall without heavy art framing", priceRange: "$50–$160", searchQuery: "woven wall hanging minimal neutral boho" },
    ],
  },

  "modern-glam": {
    style: "modern-glam",
    headline: "Modern Glam",
    tagline: "Confident, luxurious, and unapologetically bold.",
    personality: ["Dramatic", "Luxurious", "Confident", "Layered"],
    colors: [
      { name: "Charcoal Wall",     hex: "#2D2A35", role: "wall",      tip: "A deep charcoal or warm black — creates drama without reading gloomy." },
      { name: "Champagne Floor",   hex: "#C9A84C", role: "floor",     tip: "Light parquet or herringbone pattern in a warm champagne tone." },
      { name: "Jewel Purple",      hex: "#7B68C8", role: "primary",   tip: "Velvet sofa or statement chair — the hero piece." },
      { name: "Champagne Gold",    hex: "#D4AF37", role: "secondary", tip: "Brass and gold hardware, lamp bases, coffee table legs." },
      { name: "Blush Smoke",       hex: "#E8D5C4", role: "accent",    tip: "Softens the drama — blush cushions, sheer curtains, soft rug." },
    ],
    materials: [
      { label: "Velvet fabric",    icon: "👑" },
      { label: "Brass & gold",     icon: "✨" },
      { label: "Marble surface",   icon: "⬜" },
      { label: "Mirrored glass",   icon: "🪞" },
      { label: "Faux fur",         icon: "🦁" },
    ],
    avoid: ["Rustic wood finishes", "Jute or sisal textures", "Muted earth tones as main palette", "Flat matte finishes throughout"],
    roomTips: [
      "Every glam room needs one mirror — it doubles light and adds depth.",
      "Layer lighting: overhead, table lamp, floor lamp. Glam is never a single bulb.",
      "Metallics should be consistent — don't mix gold and silver in the same room.",
      "Symmetry reads as intentional luxury — pair your lamps, frame artwork in sets.",
    ],
    accessories: [
      { name: "Oversized statement mirror", why: "Reflects light, creates the illusion of space, anchors glam rooms", priceRange: "$150–$600", searchQuery: "large arched mirror gold frame glam" },
      { name: "Crystal or glass table lamp", why: "Refracts light beautifully in evening settings", priceRange: "$90–$280", searchQuery: "crystal glass table lamp brass gold base" },
      { name: "Faux fur throw", why: "Luxury texture that photographs well and feels indulgent", priceRange: "$60–$180", searchQuery: "faux fur throw blanket white cream" },
      { name: "Velvet cushion set in jewel tones", why: "Layering jewel tones adds depth — emerald, sapphire, amethyst", priceRange: "$50–$140", searchQuery: "velvet cushion covers jewel tones emerald sapphire" },
      { name: "Gold tray and decorative objects", why: "Coffee table styling — grouped odd numbers, varying heights", priceRange: "$40–$120", searchQuery: "gold decorative tray coffee table styling set" },
    ],
  },

  "earthy-organic": {
    style: "earthy-organic",
    headline: "Earthy Organic",
    tagline: "Grounded in nature — textures you want to touch, tones that calm.",
    personality: ["Grounded", "Natural", "Textural", "Serene"],
    colors: [
      { name: "Warm Sand Wall",    hex: "#D4C5A9", role: "wall",      tip: "Earthy sand or warm taupe — Farrow & Ball 'Elephant's Breath' is a reference point." },
      { name: "Terracotta Floor",  hex: "#8B6355", role: "floor",     tip: "Medium brown or terracotta tile; natural stone or concrete also works beautifully." },
      { name: "Terracotta",        hex: "#C4714A", role: "primary",   tip: "Your anchor accent — rattan, terracotta pots, linen in rust or clay tones." },
      { name: "Olive Green",       hex: "#4A5E3A", role: "secondary", tip: "A second natural tone — olive throw, sage plant pots, eucalyptus branches." },
      { name: "Raw Camel",         hex: "#C4A882", role: "accent",    tip: "Leather or jute in camel tones — bags, baskets, bench upholstery." },
    ],
    materials: [
      { label: "Rattan & cane",    icon: "🧺" },
      { label: "Linen & cotton",   icon: "🧵" },
      { label: "Terracotta",       icon: "🏺" },
      { label: "Jute & seagrass",  icon: "🌿" },
      { label: "Raw wood",         icon: "🪵" },
    ],
    avoid: ["Shiny synthetic materials", "Chrome or silver metals", "High-gloss furniture", "All-white or all-grey palette"],
    roomTips: [
      "Layer 3–5 natural textures — rough, smooth, woven, soft, hard.",
      "Plants are furniture in organic rooms — large statement and small grouped pots.",
      "Keep all metals matte black or bronze — no chrome.",
      "Use baskets as storage — they're decor and function in one.",
    ],
    accessories: [
      { name: "Rattan pendant light", why: "Defines the organic aesthetic from above — works in any room", priceRange: "$80–$300", searchQuery: "rattan wicker pendant light shade natural" },
      { name: "Terracotta pot set (3 sizes)", why: "Grouping pots with live plants is the fastest room transformation", priceRange: "$35–$90", searchQuery: "terracotta plant pots set sizes" },
      { name: "Jute storage baskets", why: "Natural storage that adds texture while hiding clutter", priceRange: "$25–$80", searchQuery: "jute woven storage basket set" },
      { name: "Linen table runner or cloth", why: "Softens surfaces, adds natural texture instantly", priceRange: "$20–$55", searchQuery: "linen table runner natural oatmeal earthy" },
      { name: "Dried pampas grass arrangement", why: "No-maintenance statement piece — warm tone year-round", priceRange: "$30–$80", searchQuery: "dried pampas grass arrangement vase natural" },
    ],
  },

  "eclectic-maximalist": {
    style: "eclectic-maximalist",
    headline: "Eclectic Maximalist",
    tagline: "Every piece has a story. Your room is the collection.",
    personality: ["Bold", "Adventurous", "Layered", "Personal"],
    colors: [
      { name: "Deep Ink Wall",     hex: "#1A2332", role: "wall",      tip: "A dark, moody backdrop makes colourful pieces pop and reads as intentional, not chaotic." },
      { name: "Rich Walnut",       hex: "#5D4037", role: "floor",     tip: "Rich walnut or dark stained wood — grounds the mix of colours above." },
      { name: "Jewel Red",         hex: "#C0392B", role: "primary",   tip: "Your boldest statement — one large piece in a true saturated tone." },
      { name: "Saffron",           hex: "#F39C12", role: "secondary", tip: "Layered warm accent — cushions, lampshades, throws." },
      { name: "Emerald",           hex: "#27AE60", role: "accent",    tip: "Third colour in the story — keep it smaller: a plant, a vase, a frame mat." },
    ],
    materials: [
      { label: "Mixed metals",     icon: "✨" },
      { label: "Bold pattern",     icon: "🎨" },
      { label: "Vintage wood",     icon: "🪵" },
      { label: "Global textiles",  icon: "🌍" },
      { label: "Gallery walls",    icon: "🖼" },
    ],
    avoid: ["Matching furniture sets", "Single colour story", "Bare walls", "Playing it safe"],
    roomTips: [
      "The rule of maximalism: every piece is chosen, nothing is random.",
      "Anchor with a large neutral — dark wall or plain sofa — then layer boldly.",
      "A gallery wall needs an anchor piece (largest) and works in odd groups.",
      "Group collectibles by material or colour — not theme — for a curated feel.",
    ],
    accessories: [
      { name: "Gallery wall starter set (mixed frames)", why: "The defining move of maximalist rooms — varied frames in one metal finish", priceRange: "$80–$300", searchQuery: "gallery wall frame set mixed sizes black gold" },
      { name: "Bold patterned cushion set", why: "Pattern mixing is the skill — geometric + floral + solid in 3 complementary tones", priceRange: "$60–$180", searchQuery: "bold pattern cushion cover set maximalist" },
      { name: "Global textile throw or kilim", why: "Adds a worldly, collected feel — Turkish kilim or Indian block print", priceRange: "$70–$250", searchQuery: "kilim throw blanket global textile colourful" },
      { name: "Statement table lamp with shade", why: "An unusual silhouette and bold shade colour reads as confident design", priceRange: "$90–$350", searchQuery: "statement table lamp bold colourful shade maximalist" },
      { name: "Vintage-look book stack with objects", why: "Coffee table styling — books, objects, candles in a collected arrangement", priceRange: "$30–$100", searchQuery: "coffee table styling books objects candles stack" },
    ],
  },
};

// ── Room scale advisor ────────────────────────────────────────────────────────

export function getRoomScaleAdvice(
  length: number,
  width: number,
  style: StylePreference
): RoomScaleAdvice[] {
  const sqft = length * width;
  const advice: RoomScaleAdvice[] = [];

  if (sqft < 150) {
    advice.push({ icon: "📐", label: "Sofa sizing", tip: `For a ${length}×${width} ft room, a 2-seat sofa (72–84") or loveseat keeps flow open. Avoid sectionals.` });
    advice.push({ icon: "🟫", label: "Rug sizing", tip: "A 5×7 ft rug works best — anything larger will make the space feel smaller." });
    advice.push({ icon: "💡", label: "Lighting", tip: "Skip a floor lamp if space is tight. A wall sconce or table lamp frees up floor space." });
  } else if (sqft < 250) {
    advice.push({ icon: "📐", label: "Sofa sizing", tip: `A 3-seat sofa (84–96") is ideal for your ${length}×${width} ft room. Leave 18" between sofa and coffee table.` });
    advice.push({ icon: "🟫", label: "Rug sizing", tip: "An 8×10 ft rug anchors the seating area perfectly — front legs of all furniture on the rug." });
    advice.push({ icon: "🪑", label: "Accent chair", tip: "You have space for one accent chair opposite the sofa — creates a conversation zone." });
  } else {
    advice.push({ icon: "📐", label: "Sofa sizing", tip: `Your ${length}×${width} ft room can take a full sectional or two sofas facing each other.` });
    advice.push({ icon: "🟫", label: "Rug sizing", tip: "A 9×12 or 10×14 ft rug — go larger than you think. Small rugs in large rooms look lost." });
    advice.push({ icon: "💡", label: "Zoning", tip: "Define two zones: a seating area and a secondary zone (reading nook, desk, or dining end)." });
  }

  if (style === "scandinavian-minimal") {
    advice.push({ icon: "🌿", label: "Negative space", tip: "Leave at least 30% of your floor visible — empty space is a design element in Scandinavian interiors." });
  }
  if (style === "eclectic-maximalist") {
    advice.push({ icon: "🖼", label: "Wall usage", tip: "In a large room, a gallery wall needs to span at least 6 ft wide to read as intentional, not lonely." });
  }
  if (style === "earthy-organic") {
    advice.push({ icon: "🌱", label: "Plant scale", tip: "Large rooms need large plants — a fiddle leaf fig or monstera at 4–5 ft fills vertical space without furniture." });
  }

  return advice;
}

// ── Household durability guide ─────────────────────────────────────────────────

export const HOUSEHOLD_MATERIAL_GUIDE: Record<HouseholdType, { headline: string; tips: string[] }> = {
  "solo": {
    headline: "You have the most freedom",
    tips: ["Premium fabrics are fine — linen, boucle, and velvet all work.", "Choose what you love, not what's practical for others."],
  },
  "couple": {
    headline: "Shared space, shared taste",
    tips: ["Mid-weight fabrics like performance velvet or textured weaves work well.", "Consider a sofa with removable covers for easy cleaning."],
  },
  "family-kids": {
    headline: "Durability is the real luxury",
    tips: ["Performance fabrics (Crypton, Sunbrella) resist stains without sacrificing look.", "Round-edged coffee tables. Nothing with sharp corners at toddler height.", "Ruggable or washable rugs — you'll thank yourself in 6 months."],
  },
  "family-pets": {
    headline: "Pet-proof doesn't mean ugly",
    tips: ["Tightly woven fabrics (microfibre, leather) resist claw pulls better than loose weaves.", "Dark or patterned rugs hide pet hair between washes.", "Avoid boucle or bouclé-style fabrics — pets will pull the loops."],
  },
  "roommates": {
    headline: "Flexible and durable",
    tips: ["Modular sofas reconfigure when living situations change.", "Mid-grade materials — not precious, not cheap. You want durability, not heirlooms."],
  },
};
