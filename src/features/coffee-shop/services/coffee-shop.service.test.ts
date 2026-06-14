import { describe, expect, it } from "vitest";
import {
  getCoffeeShops,
  getTrendingCoffeeShops,
} from "@/features/coffee-shop/services/coffee-shop.service";
import { MOCK_COFFEE_SHOPS } from "@/features/coffee-shop/constants/mock-coffee-shops";

describe("coffee-shop.service (mock mode)", () => {
  it("returns paginated result with default limit", async () => {
    const result = await getCoffeeShops();
    expect(result.meta.total).toBe(MOCK_COFFEE_SHOPS.length);
    expect(result.items.length).toBeLessThanOrEqual(12);
    expect(result.meta.totalPages).toBe(
      Math.ceil(MOCK_COFFEE_SHOPS.length / 12),
    );
  });

  it("filters by search term across name and address", async () => {
    const result = await getCoffeeShops({ search: "perasa", limit: 50 });
    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.slug).toBe("perasa-coffee-eatery");
  });

  it("filters openNow to only 24-hour shops", async () => {
    const result = await getCoffeeShops({ openNow: true, limit: 50 });
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.every((shop) => shop.isOpen24Hours)).toBe(true);
  });

  it("filters by minimum rating", async () => {
    const result = await getCoffeeShops({ rating: 4.8, limit: 50 });
    expect(result.items.every((shop) => shop.rating >= 4.8)).toBe(true);
  });

  it("filters by facility id", async () => {
    const result = await getCoffeeShops({
      facility: "study-friendly",
      limit: 50,
    });
    expect(result.items.length).toBeGreaterThan(0);
    expect(
      result.items.every((shop) =>
        shop.facilities.some((facility) => facility.id === "study-friendly"),
      ),
    ).toBe(true);
  });

  it("filters by price range", async () => {
    const result = await getCoffeeShops({ priceRange: 1, limit: 50 });
    expect(result.items.every((shop) => shop.priceRange === 1)).toBe(true);
  });

  it("sorts by rating descending", async () => {
    const result = await getCoffeeShops({ sort: "rating", limit: 50 });
    const ratings = result.items.map((shop) => shop.rating);
    const sorted = [...ratings].sort((a, b) => b - a);
    expect(ratings).toEqual(sorted);
  });

  it("sorts by reviews descending", async () => {
    const result = await getCoffeeShops({ sort: "reviews", limit: 50 });
    const reviews = result.items.map((shop) => shop.reviewCount);
    const sorted = [...reviews].sort((a, b) => b - a);
    expect(reviews).toEqual(sorted);
  });

  it("paginates with page and limit", async () => {
    const page1 = await getCoffeeShops({ page: 1, limit: 5 });
    const page2 = await getCoffeeShops({ page: 2, limit: 5 });
    expect(page1.items).toHaveLength(5);
    expect(page1.items[0]?.id).not.toBe(page2.items[0]?.id);
  });

  it("returns trending limited by count", async () => {
    const trending = await getTrendingCoffeeShops(4);
    expect(trending).toHaveLength(4);
  });
});