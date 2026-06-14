import { FACILITIES } from "@/features/coffee-shop/constants/facilities";
import type { CoffeeShopSort } from "@/features/coffee-shop/types/coffee-shop.types";

export interface FacilityOption {
  id: string;
  name: string;
}

export const FACILITY_OPTIONS: FacilityOption[] = Object.values(FACILITIES).map(
  (facility) => ({ id: facility.id, name: facility.name }),
);

export interface RatingOption {
  value: number;
  label: string;
}

export const RATING_OPTIONS: RatingOption[] = [
  { value: 4.5, label: "4.5+" },
  { value: 4, label: "4.0+" },
  { value: 3.5, label: "3.5+" },
];

export interface PriceOption {
  value: number;
  label: string;
}

export const PRICE_OPTIONS: PriceOption[] = [
  { value: 1, label: "Rp1K - 25K" },
  { value: 2, label: "Rp25K - 50K" },
];

export interface SortOption {
  value: CoffeeShopSort;
  label: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { value: "trending", label: "Trending" },
  { value: "rating", label: "Rating tertinggi" },
  { value: "reviews", label: "Ulasan terbanyak" },
  { value: "newest", label: "Terbaru" },
];