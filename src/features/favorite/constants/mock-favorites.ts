export interface MockFavoriteRow {
  id: string;
  coffeeShopId: string;
  createdAt: string;
}

export const MOCK_FAVORITES: MockFavoriteRow[] = [
  {
    id: "fav-mock-01",
    coffeeShopId: "mock-01",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: "fav-mock-02",
    coffeeShopId: "mock-08",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];