export interface CoffeeCommunity {
  id: string;
  slug: string;
  name: string;
  description: string;
  cityId: string;
  memberCount: number;
  coverImage: string | null;
  cityName?: string;
}