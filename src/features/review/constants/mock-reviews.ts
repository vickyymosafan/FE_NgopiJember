import type { Review } from "@/features/review/types/review.types";

interface MockReviewRow extends Review {
  coffeeShopId: string;
}

const AUTHORS = [
  { id: "mock-author-01", name: "Anisa", avatarUrl: null },
  { id: "mock-author-02", name: "Bagas", avatarUrl: null },
  { id: "mock-author-03", name: "Citra", avatarUrl: null },
];

function daysAgo(n: number) {
  return new Date(Date.now() - 1000 * 60 * 60 * 24 * n).toISOString();
}

export const MOCK_REVIEWS: MockReviewRow[] = [
  {
    id: "review-01",
    coffeeShopId: "mock-01",
    rating: 5,
    comment: "Wifi kencang dan stop kontak banyak, cocok buat nugas sampai pagi.",
    images: [],
    createdAt: daysAgo(3),
    updatedAt: null,
    author: AUTHORS[0],
  },
  {
    id: "review-02",
    coffeeShopId: "mock-01",
    rating: 4,
    comment: "Kopinya enak, tapi weekend agak ramai jadi harus datang pagi.",
    images: [],
    createdAt: daysAgo(10),
    updatedAt: null,
    author: AUTHORS[1],
  },
  {
    id: "review-03",
    coffeeShopId: "mock-08",
    rating: 5,
    comment: "Tempat favorit untuk meeting, tenang dan pelayanannya ramah.",
    images: [],
    createdAt: daysAgo(5),
    updatedAt: null,
    author: AUTHORS[2],
  },
  {
    id: "review-04",
    coffeeShopId: "mock-03",
    rating: 4,
    comment: "Area outdoor luas, menu banyak pilihan non-kopi juga.",
    images: [],
    createdAt: daysAgo(7),
    updatedAt: null,
    author: AUTHORS[0],
  },
];