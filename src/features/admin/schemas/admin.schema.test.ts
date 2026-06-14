import { describe, expect, it } from "vitest";
import { adminCoffeeShopSchema, toPayload, toFormValues } from "@/features/admin/schemas/admin.schema";

const valid = {
  name: "Perasa Coffee",
  slug: "perasa-coffee",
  description: "Coffee shop enak",
  address: "Jl. Sumatra",
  district: "Sumbersari",
  latitude: "-8.168",
  longitude: "113.71",
  phone: "",
  instagram: "",
  website: "",
  openingTime: "08:00",
  closingTime: "22:00",
  priceRange: "2",
  facilityIds: ["wifi", "parking"],
};

describe("adminCoffeeShopSchema", () => {
  it("accepts a valid payload", () => {
    expect(adminCoffeeShopSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = adminCoffeeShopSchema.safeParse({ ...valid, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid slug characters", () => {
    const result = adminCoffeeShopSchema.safeParse({ ...valid, slug: "Bad Slug!" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid latitude", () => {
    const result = adminCoffeeShopSchema.safeParse({ ...valid, latitude: "999" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid website url", () => {
    const result = adminCoffeeShopSchema.safeParse({ ...valid, website: "not a url" });
    expect(result.success).toBe(false);
  });

  it("accepts empty website", () => {
    const result = adminCoffeeShopSchema.safeParse({ ...valid, website: "" });
    expect(result.success).toBe(true);
  });

  it("rejects closing time without opening time", () => {
    const result = adminCoffeeShopSchema.safeParse({
      ...valid,
      openingTime: "",
      closingTime: "22:00",
    });
    expect(result.success).toBe(false);
  });

  it("rejects out-of-range priceRange", () => {
    const result = adminCoffeeShopSchema.safeParse({ ...valid, priceRange: "7" });
    expect(result.success).toBe(false);
  });

  it("toPayload converts strings to typed values", () => {
    const payload = toPayload(valid);
    expect(payload.latitude).toBeCloseTo(-8.168, 3);
    expect(payload.longitude).toBeCloseTo(113.71, 2);
    expect(payload.priceRange).toBe(2);
    expect(payload.phone).toBeNull();
    expect(payload.website).toBeNull();
  });

  it("toFormValues converts a shop into form strings", () => {
    const shop = {
      name: "X",
      slug: "x",
      description: null,
      address: "A",
      district: "B",
      latitude: -8.1,
      longitude: 113.2,
      phone: null,
      instagram: "@x",
      website: null,
      openingTime: "08:00",
      closingTime: "22:00",
      priceRange: 2,
      facilities: [{ id: "wifi" }, { id: "indoor" }],
    };
    const values = toFormValues(shop);
    expect(values.latitude).toBe("-8.1");
    expect(values.priceRange).toBe("2");
    expect(values.facilityIds).toEqual(["wifi", "indoor"]);
  });
});