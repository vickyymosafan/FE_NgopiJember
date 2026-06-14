export interface ReviewAuthor {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export interface Review {
  id: string;
  coffeeShopId: string;
  rating: number;
  comment: string;
  images: string[];
  createdAt: string;
  updatedAt: string | null;
  author: ReviewAuthor;
}

export interface ReviewCreatePayload {
  coffeeShopId: string;
  rating: number;
  comment: string;
  images?: string[];
}