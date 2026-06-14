export interface Promotion {
  id: string;
  coffeeShopId: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  createdAt: string;
  coffeeShopName?: string;
}

export interface PromotionPayload {
  coffeeShopId: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
}

export interface OwnerAnalytics {
  coffeeShopCount: number;
  totalReviews: number;
  averageRating: number;
  totalViews: number;
}