import type { CoffeeShop, Facility } from "@/features/coffee-shop/types/coffee-shop.types";

export interface CoffeeShopCreatePayload {
  name: string;
  slug: string;
  description: string | null;
  address: string;
  district: string;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  instagram: string | null;
  website: string | null;
  openingTime: string | null;
  closingTime: string | null;
  priceRange: number;
  facilityIds: string[];
}

export type CoffeeShopUpdatePayload = Partial<CoffeeShopCreatePayload>;

export interface AdminCoffeeShop extends CoffeeShop {
  facilities: Facility[];
}