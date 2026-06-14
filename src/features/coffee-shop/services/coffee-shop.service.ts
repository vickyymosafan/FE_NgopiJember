import { apiClient } from "@/lib/api-client";
import { env } from "@/lib/env";
import { ApiError, type PaginatedResult } from "@/types/api";
import type {
  CoffeeShop,
  CoffeeShopDetail,
  CoffeeShopQuery,
} from "@/features/coffee-shop/types/coffee-shop.types";
import { MOCK_COFFEE_SHOPS } from "@/features/coffee-shop/constants/mock-coffee-shops";

const MOCK_DELAY_MS = 400;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sortMock(
  items: CoffeeShop[],
  sort: CoffeeShopQuery["sort"],
): CoffeeShop[] {
  const copy = [...items];
  switch (sort) {
    case "rating":
      return copy.sort((a, b) => b.rating - a.rating);
    case "reviews":
      return copy.sort((a, b) => b.reviewCount - a.reviewCount);
    case "trending":
      return copy.sort(
        (a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount,
      );
    default:
      return copy;
  }
}

function filterMock(items: CoffeeShop[], params: CoffeeShopQuery): CoffeeShop[] {
  return items.filter((shop) => {
    if (params.search) {
      const term = params.search.toLowerCase();
      const haystack =
        `${shop.name} ${shop.address} ${shop.district}`.toLowerCase();
      if (!haystack.includes(term)) {
        return false;
      }
    }
    if (params.district && shop.district !== params.district) {
      return false;
    }
    if (typeof params.rating === "number" && shop.rating < params.rating) {
      return false;
    }
    if (params.openNow && !shop.isOpen24Hours) {
      return false;
    }
    if (
      typeof params.priceRange === "number" &&
      shop.priceRange !== params.priceRange
    ) {
      return false;
    }
    if (
      params.facility &&
      !shop.facilities.some((facility) => facility.id === params.facility)
    ) {
      return false;
    }
    return true;
  });
}

function toDetail(shop: CoffeeShop): CoffeeShopDetail {
  return { ...shop, gallery: [] };
}

async function getCoffeeShopsMock(
  params: CoffeeShopQuery,
): Promise<PaginatedResult<CoffeeShop>> {
  await delay(MOCK_DELAY_MS);

  const page = params.page ?? 1;
  const limit = params.limit ?? 12;
  const filtered = sortMock(filterMock(MOCK_COFFEE_SHOPS, params), params.sort);
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);

  return {
    items,
    meta: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / limit)),
    },
  };
}

export async function getCoffeeShops(
  params: CoffeeShopQuery = {},
): Promise<PaginatedResult<CoffeeShop>> {
  if (env.useMock) {
    return getCoffeeShopsMock(params);
  }

  return apiClient<PaginatedResult<CoffeeShop>>("/coffee-shops", {
    query: {
      page: params.page,
      limit: params.limit,
      search: params.search,
      district: params.district,
      rating: params.rating,
      facility: params.facility,
      openNow: params.openNow,
      priceRange: params.priceRange,
      sort: params.sort,
    },
  });
}

export async function getTrendingCoffeeShops(limit = 8): Promise<CoffeeShop[]> {
  const result = await getCoffeeShops({ sort: "trending", limit });
  return result.items;
}

export async function getCoffeeShopBySlug(
  slug: string,
): Promise<CoffeeShopDetail> {
  if (env.useMock) {
    await delay(MOCK_DELAY_MS);
    const shop = MOCK_COFFEE_SHOPS.find((item) => item.slug === slug);
    if (!shop) {
      throw new ApiError("Coffee shop tidak ditemukan.", 404);
    }
    return toDetail(shop);
  }

  return apiClient<CoffeeShopDetail>(`/coffee-shops/${slug}`);
}

export async function getNearbyCoffeeShops(
  slug: string,
  limit = 4,
): Promise<CoffeeShop[]> {
  if (env.useMock) {
    await delay(MOCK_DELAY_MS);
    const current = MOCK_COFFEE_SHOPS.find((item) => item.slug === slug);
    return MOCK_COFFEE_SHOPS.filter(
      (item) =>
        item.slug !== slug &&
        (!current || item.district === current.district),
    )
      .sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount)
      .slice(0, limit);
  }

  const result = await getCoffeeShops({ limit });
  return result.items.filter((item) => item.slug !== slug).slice(0, limit);
}

export async function getMapCoffeeShops(
  params: CoffeeShopQuery = {},
): Promise<CoffeeShop[]> {
  const result = await getCoffeeShops({ ...params, page: 1, limit: 200 });
  return result.items.filter(
    (shop) => shop.latitude !== null && shop.longitude !== null,
  );
}

export const coffeeShopService = {
  getCoffeeShops,
  getTrendingCoffeeShops,
  getCoffeeShopBySlug,
  getNearbyCoffeeShops,
  getMapCoffeeShops,
};