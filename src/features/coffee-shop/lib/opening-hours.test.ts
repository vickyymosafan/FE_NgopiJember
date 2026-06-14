import { describe, expect, it } from "vitest";
import {
  formatOpeningHours,
  isOpenNow,
} from "@/features/coffee-shop/lib/opening-hours";
import type { CoffeeShop } from "@/features/coffee-shop/types/coffee-shop.types";

function baseShop(overrides: Partial<CoffeeShop>): CoffeeShop {
  return {
    id: "x",
    name: "Test",
    slug: "test",
    description: null,
    address: "Jl. Test",
    district: "Sumbersari",
    latitude: null,
    longitude: null,
    phone: null,
    instagram: null,
    website: null,
    openingTime: null,
    closingTime: null,
    isOpen24Hours: false,
    priceRange: 1,
    priceLabel: "Rp1K - 25K",
    rating: 4,
    reviewCount: 10,
    verified: true,
    imageUrl: null,
    facilities: [],
    ...overrides,
  };
}

describe("opening-hours", () => {
  it("labels 24-hour shops", () => {
    expect(formatOpeningHours(baseShop({ isOpen24Hours: true }))).toBe(
      "Buka 24 jam",
    );
  });

  it("formats normal hours", () => {
    expect(
      formatOpeningHours(
        baseShop({ openingTime: "08:00", closingTime: "22:00" }),
      ),
    ).toBe("08:00 - 22:00");
  });

  it("isOpenNow true within range", () => {
    const shop = baseShop({ openingTime: "08:00", closingTime: "22:00" });
    const at = new Date();
    at.setHours(12, 0, 0, 0);
    expect(isOpenNow(shop, at)).toBe(true);
  });

  it("isOpenNow false outside range", () => {
    const shop = baseShop({ openingTime: "08:00", closingTime: "22:00" });
    const at = new Date();
    at.setHours(23, 0, 0, 0);
    expect(isOpenNow(shop, at)).toBe(false);
  });

  it("isOpenNow handles overnight close (07:00 - 03:00)", () => {
    const shop = baseShop({ openingTime: "07:00", closingTime: "03:00" });
    const lateNight = new Date();
    lateNight.setHours(1, 0, 0, 0);
    expect(isOpenNow(shop, lateNight)).toBe(true);
    const afternoon = new Date();
    afternoon.setHours(15, 0, 0, 0);
    expect(isOpenNow(shop, afternoon)).toBe(true);
    const closed = new Date();
    closed.setHours(5, 0, 0, 0);
    expect(isOpenNow(shop, closed)).toBe(false);
  });
});