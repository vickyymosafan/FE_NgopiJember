export interface Facility {
  id: string;
  name: string;
  icon: string;
}

export interface CoffeeShop {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string;
  district: string;
  cityId: string;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  instagram: string | null;
  website: string | null;
  openingTime: string | null;
  closingTime: string | null;
  isOpen24Hours: boolean;
  priceRange: number;
  priceLabel: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  ownerId: string | null;
  views: number;
  imageUrl: string | null;
  facilities: Facility[];
}

export interface CoffeeShopDetail extends CoffeeShop {
  gallery: string[];
}

export type CoffeeShopSort = "trending" | "rating" | "reviews" | "newest";

export interface CoffeeShopQuery {
  page?: number;
  limit?: number;
  search?: string;
  district?: string;
  cityId?: string;
  rating?: number;
  facility?: string;
  openNow?: boolean;
  priceRange?: number;
  sort?: CoffeeShopSort;
}