import { describe, expect, it } from "vitest";
import { reviewSchema } from "@/features/review/schemas/review.schema";

describe("reviewSchema", () => {
  it("accepts a valid review", () => {
    const result = reviewSchema.safeParse({
      rating: 4,
      comment: "Tempat enak untuk nugas bersama teman.",
      images: [],
    });
    expect(result.success).toBe(true);
  });

  it("rejects rating out of range", () => {
    const result = reviewSchema.safeParse({
      rating: 6,
      comment: "Komentar cukup panjang di sini.",
    });
    expect(result.success).toBe(false);
  });

  it("rejects rating of zero", () => {
    const result = reviewSchema.safeParse({
      rating: 0,
      comment: "Komentar cukup panjang di sini.",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short comment", () => {
    const result = reviewSchema.safeParse({
      rating: 3,
      comment: "singkat",
    });
    expect(result.success).toBe(false);
  });

  it("rejects more than 4 images", () => {
    const result = reviewSchema.safeParse({
      rating: 5,
      comment: "Komentar cukup panjang di sini.",
      images: ["http://a", "http://b", "http://c", "http://d", "http://e"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-url image", () => {
    const result = reviewSchema.safeParse({
      rating: 5,
      comment: "Komentar cukup panjang di sini.",
      images: ["not a url"],
    });
    expect(result.success).toBe(false);
  });
});