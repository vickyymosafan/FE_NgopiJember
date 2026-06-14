export interface FavoriteRecord {
  id: string;
  coffeeShopId: string;
  createdAt: string;
}

export interface FavoriteActionPayload {
  coffeeShopId: string;
}