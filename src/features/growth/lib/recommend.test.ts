import { describe, expect, it } from "vitest";
import { recommendCoffeeShops } from "@/features/growth/lib/recommend";
import type { CoffeeShop } from "@/features/coffee-shop/types/coffee-shop.types";

function shop(overrides: Partial<CoffeeShop>): CoffeeShop {
  return {
    id: "x",
    name: "X",
    slug: "x",
    description: null,
    address: "Jl. X",
    district: "Sumbersari",
    latitude: null,
    longitude: null,
    phone: null,
    instagram: null,
    website: null,
    openingTime: null,
    closingTime: null,
    isOpen24Hours: false,
    priceRange: 2,
    priceLabel: "Rp25K - 50K",
    rating: 4,
    reviewCount: 50,
    verified: true,
    imageUrl: null,
    facilities: [],
    ownerId: null,
    views: 0,
    ...overrides,
  };
}

describe("recommendCoffeeShops", () => {
  it("returns empty for no candidates", () => {
    const current = shop({ id: "a", district: "Sumbersari" });
    expect(recommendCoffeeShops({ current, candidates: [] })).toEqual([]);
  });

  it("excludes current and prefers same district", () => {
    const current = shop({ id: "a", district: "Sumbersari" });
    const others = [
      shop({ id: "a", district: "Sumbersari" }),
      shop({ id: "b", district: "Sumbersari" }),
      shop({ id: "c", district: "Patrang" }),
    ];
    const rec = recommendCoffeeShops({
      current,
      candidates: others,
      limit: 2,
    });
    expect(rec.map((item) => item.id)).toEqual(["b", "c"]);
  });

  it("prefers shared facilities", () => {
    const current = shop({
      id: "a",
      district: "Sumbersari",
      facilities: [{ id: "wifi", name: "Wifi", icon: "wifi" }],
    });
    const others = [
      shop({ id: "b", district: "Sumbersari", facilities: [] }),
      shop({
        id: "c",
        district: "Sumbersari",
        facilities: [{ id: "wifi", name: "Wifi", icon: "wifi" }],
      }),
    ];
    const rec = recommendCoffeeShops({ current, candidates: others });
    expect(rec[0]?.id).toBe("c");
  });
});