import type { City } from "@/features/city/types/city.types";

export const MOCK_CITIES: City[] = [
  {
    id: "city-jember",
    slug: "jember",
    name: "Jember",
    province: "Jawa Timur",
    description:
      "Kota pelajar dengan ratusan coffee shop tersebar di Sumbersari, Patrang, dan Kaliwates.",
    coffeeShopCount: 19,
  },
  {
    id: "city-malang",
    slug: "malang",
    name: "Malang",
    province: "Jawa Timur",
    description:
      "Kota wisata dengan suasana sejuk dan budaya kopi yang berkembang pesat.",
    coffeeShopCount: 0,
  },
  {
    id: "city-surabaya",
    slug: "surabaya",
    name: "Surabaya",
    province: "Jawa Timur",
    description:
      "Ibu kota Jawa Timur dengan scene coffee shop metropolitan yang beragam.",
    coffeeShopCount: 0,
  },
  {
    id: "city-banyuwangi",
    slug: "banyuwangi",
    name: "Banyuwangi",
    province: "Jawa Timur",
    description:
      "Gerbang timur Pulau Jawa, rumah bagi kopi robusta khas Osing.",
    coffeeShopCount: 0,
  },
];