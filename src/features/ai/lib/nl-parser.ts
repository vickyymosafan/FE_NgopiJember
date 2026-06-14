import type { CoffeeShopQuery } from "@/features/coffee-shop/types/coffee-shop.types";

export interface ParsedIntent {
  filters: CoffeeShopQuery;
  keywords: string[];
  summary: string;
}

const FACILITY_KEYWORDS: Array<{ terms: string[]; id: string }> = [
  { terms: ["wifi", "wi-fi", "internet"], id: "wifi" },
  { terms: ["stop kontak", "power", "colokan", "power outlet"], id: "power-outlet" },
  { terms: ["nugas", "belajar", "study", "kuliah", "kerja"], id: "study-friendly" },
  { terms: ["outdoor", "luar", "taman", "alam"], id: "outdoor" },
  { terms: ["indoor", "dalam", "ac"], id: "indoor" },
  { terms: ["parkir", "parking", "mobil"], id: "parking" },
  { terms: ["meeting", "rapat", "diskusi"], id: "meeting-area" },
  { terms: ["merokok", "smoking"], id: "smoking-area" },
];

const DISTRICT_KEYWORDS: Array<{ terms: string[]; district: string }> = [
  { terms: ["unej", "kampus", "universitas", "tegal boto"], district: "Sumbersari" },
  { terms: ["sumbersari"], district: "Sumbersari" },
  { terms: ["patrang"], district: "Patrang" },
  { terms: ["kaliwates", "kota"], district: "Kaliwates" },
  { terms: ["ajung"], district: "Ajung" },
];

const PRICE_KEYWORDS: Array<{ terms: string[]; priceRange: number }> = [
  { terms: ["murah", "hemat", "budget", "terjangkau"], priceRange: 1 },
  { terms: ["premium", "mewah", "mahal", "eksklusif"], priceRange: 4 },
];

export function parseNaturalLanguage(query: string): ParsedIntent {
  const lower = query.toLowerCase();
  const filters: CoffeeShopQuery = {};
  const keywords: string[] = [];

  for (const { terms, id } of FACILITY_KEYWORDS) {
    if (terms.some((term) => lower.includes(term))) {
      filters.facility = id;
      keywords.push(id);
    }
  }

  for (const { terms, district } of DISTRICT_KEYWORDS) {
    if (terms.some((term) => lower.includes(term))) {
      filters.district = district;
      keywords.push(`district:${district}`);
      break;
    }
  }

  for (const { terms, priceRange } of PRICE_KEYWORDS) {
    if (terms.some((term) => lower.includes(term))) {
      filters.priceRange = priceRange;
      keywords.push(`price:${priceRange}`);
      break;
    }
  }

  if (/\b24\s*(jam|hours)\b/.test(lower) || lower.includes("buka 24") || lower.includes("sepanjang hari")) {
    filters.openNow = true;
    keywords.push("24jam");
  }

  if (lower.includes("rating") || lower.includes("terbaik") || lower.includes("tertinggi")) {
    filters.rating = 4.5;
    keywords.push("rating:4.5+");
  }

  const leftover = lower
    .replace(/[?.,!]/g, "")
    .replace(/\b(cari|carikan|rekomendasi|rekomendasikan|tolong|mau|butuh|ada|mana|where|find|quiet|tenang)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (leftover.length >= 3 && !filters.facility) {
    filters.search = leftover;
    keywords.push(`search:${leftover}`);
  }

  const summary = buildSummary(filters);

  return { filters, keywords, summary };
}

function buildSummary(filters: CoffeeShopQuery): string {
  const parts: string[] = [];
  if (filters.search) parts.push(`kata kunci "${filters.search}"`);
  if (filters.facility) parts.push(`fasilitas ${filters.facility}`);
  if (filters.district) parts.push(`di ${filters.district}`);
  if (filters.openNow) parts.push("buka 24 jam");
  if (typeof filters.priceRange === "number") {
    parts.push(`kisaran harga ${filters.priceRange}`);
  }
  if (typeof filters.rating === "number") {
    parts.push(`rating minimal ${filters.rating}`);
  }
  if (parts.length === 0) return "Saya butuh detail lebih jelas.";
  return `Oke, saya carikan coffee shop ${parts.join(", ")}.`;
}