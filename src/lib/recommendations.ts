import {
  OnboardingData,
  Product,
  ProductCategory,
  RecommendationSet,
} from "./types";
import {
  CATALOG,
  CATEGORY_BUDGET_ALLOCATION,
  CATEGORY_LABELS,
} from "./catalog";

function getExplanation(
  option: "A" | "B" | "C",
  product: Product,
  categoryBudget: number
): string {
  if (option === "A") {
    return `Comfortably within your ${CATEGORY_LABELS[product.category].toLowerCase()} budget at $${product.price}. Solid ${product.rating}/5 rating — this is the confident, no-regrets choice that most people in your situation end up loving.`;
  }
  if (option === "B") {
    const over = product.price - categoryBudget;
    return `$${over} over your original target, but it earns that premium. ${product.retailer} is known for quality at this tier, and you'll notice the difference in five years.`;
  }
  return `From ${product.retailer}, ${product.localDistance ? `just ${product.localDistance} miles away` : "a local boutique near you"}. You can see it in person before buying, and your money stays in the neighborhood. ${product.rating === 5 ? "Rated 5 stars by everyone who's bought it." : `${product.rating}/5 stars.`}`;
}

function scoreProduct(
  product: Product,
  data: OnboardingData,
  targetBudget: number,
  mode: "A" | "B" | "C"
): number {
  let score = 0;

  // Style match
  if (product.styles.includes(data.style)) score += 3;

  // Household suitability
  if (product.householdSuitability.includes(data.household)) score += 2;

  // Rating
  score += product.rating;

  // Budget fit
  if (mode === "A") {
    const fit = 1 - Math.abs(product.price - targetBudget * 0.85) / targetBudget;
    score += fit * 2;
  }

  return score;
}

export function generateRecommendations(
  data: OnboardingData
): RecommendationSet[] {
  const MVP_CATEGORIES: ProductCategory[] = [
    "sofa",
    "coffee-table",
    "area-rug",
    "floor-lamp",
    "accent-chair",
  ];

  const results: RecommendationSet[] = [];

  for (const category of MVP_CATEGORIES) {
    const allocation = CATEGORY_BUDGET_ALLOCATION[category];
    const categoryBudget = Math.round(data.budget * allocation);
    const products = CATALOG.filter((p) => p.category === category);

    // Option A: within budget (≤ category budget × 0.92)
    const optionAPool = products
      .filter((p) => !p.isLocal && p.price <= categoryBudget * 0.92)
      .sort((a, b) => scoreProduct(b, data, categoryBudget, "A") - scoreProduct(a, data, categoryBudget, "A"));

    // Option B: stretch (between budget and budget × 1.35)
    const optionBPool = products
      .filter(
        (p) =>
          !p.isLocal &&
          p.price > categoryBudget &&
          p.price <= categoryBudget * 1.4
      )
      .sort((a, b) => (b.qualityTier === "premium" ? 1 : 0) - (a.qualityTier === "premium" ? 1 : 0));

    // Option C: local first, fallback to global
    const optionCPool = products
      .filter((p) => p.isLocal)
      .sort((a, b) => (a.localDistance ?? 99) - (b.localDistance ?? 99));

    const optionA = optionAPool[0] || products.sort((a, b) => a.price - b.price)[0];
    const optionB = optionBPool[0] || products.filter(p => !p.isLocal).sort((a, b) => b.rating - a.rating)[0];
    const optionC = optionCPool[0] || products.filter(p => !p.isLocal).sort((a, b) => b.rating - a.rating)[0];

    if (optionA && optionB && optionC) {
      results.push({
        category,
        categoryLabel: CATEGORY_LABELS[category],
        categoryBudget,
        optionA: { ...optionA, explanation: getExplanation("A", optionA, categoryBudget) },
        optionB: { ...optionB, explanation: getExplanation("B", optionB, categoryBudget) },
        optionC: { ...optionC, explanation: getExplanation("C", optionC, categoryBudget) },
      });
    }
  }

  return results;
}
