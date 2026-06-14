import { describe, expect, it } from "vitest";
import { parseNaturalLanguage } from "@/features/ai/lib/nl-parser";

describe("parseNaturalLanguage", () => {
  it("detects wifi facility", () => {
    const result = parseNaturalLanguage("Cari coffee shop dengan wifi kencang");
    expect(result.filters.facility).toBe("wifi");
  });

  it("detects district from campus keyword", () => {
    const result = parseNaturalLanguage("Dekat UNEJ ada cafe bagus?");
    expect(result.filters.district).toBe("Sumbersari");
  });

  it("detects 24 hours keyword", () => {
    const result = parseNaturalLanguage("Cafe buka 24 jam");
    expect(result.filters.openNow).toBe(true);
  });

  it("detects budget price range", () => {
    const result = parseNaturalLanguage("Cari cafe murah buat nugas");
    expect(result.filters.priceRange).toBe(1);
    expect(result.filters.facility).toBe("study-friendly");
  });

  it("returns summary describing filters", () => {
    const result = parseNaturalLanguage("Cafe wifi di Sumbersari");
    expect(result.summary).toMatch(/fasilitas wifi/);
    expect(result.summary).toMatch(/Sumbersari/);
  });

  it("falls back to search when no keywords match", () => {
    const result = parseNaturalLanguage("arabica jember");
    expect(result.filters.search).toBe("arabica jember");
  });
});