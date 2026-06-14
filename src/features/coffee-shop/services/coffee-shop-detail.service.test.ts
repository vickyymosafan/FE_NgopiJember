import { describe, expect, it } from "vitest";
import {
  getCoffeeShopBySlug,
  getNearbyCoffeeShops,
} from "@/features/coffee-shop/services/coffee-shop.service";
import { ApiError } from "@/types/api";

describe("coffee-shop detail service (mock mode)", () => {
  it("returns a detail with gallery array by slug", async () => {
    const shop = await getCoffeeShopBySlug("perasa-coffee-eatery");
    expect(shop.slug).toBe("perasa-coffee-eatery");
    expect(Array.isArray(shop.gallery)).toBe(true);
  });

  it("throws ApiError 404 for unknown slug", async () => {
    await expect(getCoffeeShopBySlug("does-not-exist")).rejects.toMatchObject({
      status: 404,
    });
    await expect(getCoffeeShopBySlug("does-not-exist")).rejects.toBeInstanceOf(
      ApiError,
    );
  });

  it("returns nearby shops excluding the current slug", async () => {
    const nearby = await getNearbyCoffeeShops("perasa-coffee-eatery", 4);
    expect(nearby.length).toBeGreaterThan(0);
    expect(nearby.length).toBeLessThanOrEqual(4);
    expect(nearby.every((shop) => shop.slug !== "perasa-coffee-eatery")).toBe(
      true,
    );
  });
});