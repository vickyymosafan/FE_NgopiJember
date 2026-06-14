import type { CoffeeCommunity } from "@/features/community/types/community.types";

export const MOCK_COMMUNITIES: CoffeeCommunity[] = [
  {
    id: "community-01",
    slug: "jember-coffee-lovers",
    name: "Jember Coffee Lovers",
    description:
      "Komunitas pecinta kopi Jember. Rutin cupping dan jelajah coffee shop.",
    cityId: "city-jember",
    memberCount: 482,
    coverImage: null,
  },
  {
    id: "community-02",
    slug: "barista-jember",
    name: "Barista Jember",
    description:
      "Forum barista Jember untuk berbagi resep, teknik, dan lowongan kerja.",
    cityId: "city-jember",
    memberCount: 128,
    coverImage: null,
  },
  {
    id: "community-03",
    slug: "surabaya-manual-brew",
    name: "Surabaya Manual Brew",
    description: "Komunitas manual brew Surabaya, meetup bulanan.",
    cityId: "city-surabaya",
    memberCount: 210,
    coverImage: null,
  },
];