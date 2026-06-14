export interface District {
  name: string;
  slug: string;
  description: string;
  shopCount: number;
}

export const DISTRICTS: District[] = [
  {
    name: "Sumbersari",
    slug: "sumbersari",
    description: "Pusat kampus dan coffee shop ternugas.",
    shopCount: 19,
  },
  {
    name: "Patrang",
    slug: "patrang",
    description: "Area utara kota dengan cafe santai.",
    shopCount: 0,
  },
  {
    name: "Kaliwates",
    slug: "kaliwates",
    description: "Pusat kota dan kuliner malam.",
    shopCount: 0,
  },
  {
    name: "Ajung",
    slug: "ajung",
    description: "Suasana pinggiran yang tenang.",
    shopCount: 0,
  },
];
