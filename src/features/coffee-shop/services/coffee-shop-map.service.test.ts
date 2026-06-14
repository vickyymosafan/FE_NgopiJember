import { describe, expect, it } from "vitest";
import { getMapCoffeeShops } from "@/features/coffee-shop/services/coffee-shop.service";
import { MOCK_COFFEE_SHOPS } from "@/features/coffee-shop/constants/mock-coffee-shops";

describe("getMapCoffeeShops (mock mode)", () => {
  it("returns only shops with coordinates", async () => {
    const shops = await getMapCoffeeShops();
    expect(shops.length).toBeGreaterThan(0);
    expect(
      shops.every(
        (shop) => shop.latitude !== null && shop.longitude !== null,
      ),
    ).toBe(true);
  });

  it("includes every mock shop because all have coordinates", async () => {
    const shops = await getMapCoffeeShops();
    expect(shops).toHaveLength(MOCK_COFFEE_SHOPS.length);
  });

  it("applies search filter", async () => {
    const shops = await getMapCoffeeShops({ search: "nugas" });
    expect(shops).toHaveLength(1);
    expect(shops[0]?.slug).toBe("nugas-jember");
  });

  it("applies openNow filter", async () => {
    const shops = await getMapCoffeeShops({ openNow: true });
    expect(shops.every((shop) => shop.isOpen24Hours)).toBe(true);
  });
});