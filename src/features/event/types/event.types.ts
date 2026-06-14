export interface CoffeeEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  cityId: string;
  coffeeShopId: string | null;
  startDate: string;
  endDate: string;
  coverImage: string | null;
  cityName?: string;
  coffeeShopName?: string | null;
}