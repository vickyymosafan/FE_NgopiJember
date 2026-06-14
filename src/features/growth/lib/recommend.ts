import type { CoffeeShop } from "@/features/coffee-shop/types/coffee-shop.types";

export interface RecommendOptions {
  current: CoffeeShop;
  candidates: CoffeeShop[];
  limit?: number;
}

function similarityScore(
  current: CoffeeShop,
  other: CoffeeShop,
): number {
  if (current.id === other.id) return -1;

  let score = 0;
  if (current.district === other.district) score += 3;
  if (current.priceRange === other.priceRange) score += 1;

  const a = new Set(current.facilities.map((facility) => facility.id));
  const b = new Set(other.facilities.map((facility) => facility.id));
  let shared = 0;
  for (const id of a) if (b.has(id)) shared += 1;
  score += shared;

  score += Math.min(3, other.rating * 0.5);
  score += Math.min(2, Math.log10(other.reviewCount + 1));
  return score;
}

export function recommendCoffeeShops({
  current,
  candidates,
  limit = 4,
}: RecommendOptions): CoffeeShop[] {
  return candidates
    .map((shop) => ({ shop, score: similarityScore(current, shop) }))
    .filter((item) => item.score >= 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.shop);
}