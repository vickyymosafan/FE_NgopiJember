import type { CoffeeEvent } from "@/features/event/types/event.types";

export const MOCK_EVENTS: CoffeeEvent[] = [
  {
    id: "event-01",
    slug: "jember-coffee-fest-2026",
    title: "Jember Coffee Fest 2026",
    description:
      "Festival kopi tahunan yang mempertemukan roaster, barista, dan pecinta kopi se-Jember.",
    cityId: "city-jember",
    coffeeShopId: null,
    startDate: "2026-07-12",
    endDate: "2026-07-14",
    coverImage: null,
  },
  {
    id: "event-02",
    slug: "latte-art-competition",
    title: "Latte Art Competition",
    description: "Kompetisi latte art antar barista coffee shop Sumbersari.",
    cityId: "city-jember",
    coffeeShopId: "mock-01",
    startDate: "2026-06-28",
    endDate: "2026-06-28",
    coverImage: null,
  },
  {
    id: "event-03",
    slug: "surabaya-brew-meetup",
    title: "Surabaya Brew Meetup",
    description: "Komunitas manual brew Surabaya bertemu bulanan.",
    cityId: "city-surabaya",
    coffeeShopId: null,
    startDate: "2026-07-05",
    endDate: "2026-07-05",
    coverImage: null,
  },
];