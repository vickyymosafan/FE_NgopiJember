import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { MOCK_USERS } from "@/features/auth/constants/mock-users";
import { MOCK_COFFEE_SHOPS } from "@/features/coffee-shop/constants/mock-coffee-shops";
import { MOCK_FAVORITES } from "@/features/favorite/constants/mock-favorites";
import { MOCK_REVIEWS } from "@/features/review/constants/mock-reviews";
import type {
  PersonalizedSuggestion,
} from "@/features/ai/types/ai.types";
import type { CoffeeShop } from "@/features/coffee-shop/types/coffee-shop.types";

const COOKIE_NAME = "ngopi_token";

async function ensureAuth() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  if (env.useMock) {
    return MOCK_USERS[0];
  }
  const res = await fetch(`${env.apiUrl}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const payload = (await res.json()) as {
    data: { id: string; name: string };
  };
  return payload.data;
}

function scorePersonalized(
  shop: CoffeeShop,
  facilityPrefs: Map<string, number>,
  districtPrefs: Map<string, number>,
  interactedIds: Set<string>,
): number {
  if (interactedIds.has(shop.id)) return -1;
  let score = 0;
  for (const facility of shop.facilities) {
    score += facilityPrefs.get(facility.id) ?? 0;
  }
  score += (districtPrefs.get(shop.district) ?? 0) * 2;
  score += shop.rating * 0.5;
  return score;
}

export async function GET() {
  const user = await ensureAuth();
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Belum login." },
      { status: 401 },
    );
  }

  if (env.useMock) {
    const favoriteIds = new Set(
      MOCK_FAVORITES.map((fav) => fav.coffeeShopId),
    );
    const reviewedIds = new Set(
      MOCK_REVIEWS
        .filter((review) => review.author.id === user.id)
        .map((review) => review.coffeeShopId),
    );
    const interactedIds = new Set([...favoriteIds, ...reviewedIds]);

    const favorites = MOCK_COFFEE_SHOPS.filter((shop) =>
      favoriteIds.has(shop.id),
    );
    const facilityPrefs = new Map<string, number>();
    const districtPrefs = new Map<string, number>();

    for (const shop of favorites) {
      for (const facility of shop.facilities) {
        facilityPrefs.set(
          facility.id,
          (facilityPrefs.get(facility.id) ?? 0) + 1,
        );
      }
      districtPrefs.set(
        shop.district,
        (districtPrefs.get(shop.district) ?? 0) + 1,
      );
    }

    const scored = MOCK_COFFEE_SHOPS.map((shop) => ({
      shop,
      score: scorePersonalized(shop, facilityPrefs, districtPrefs, interactedIds),
    }))
      .filter((item) => item.score >= 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((item) => item.shop);

    const suggestions: PersonalizedSuggestion[] = [];
    if (favorites.length > 0 && scored.length > 0) {
      suggestions.push({
        reason: "Berdasarkan coffee shop favorit Anda",
        shops: scored.slice(0, 4),
      });
    }
    const trending = [...MOCK_COFFEE_SHOPS]
      .sort(
        (a, b) =>
          b.rating * b.reviewCount - a.rating * a.reviewCount,
      )
      .filter((shop) => !interactedIds.has(shop.id))
      .slice(0, 4);
    if (trending.length > 0) {
      suggestions.push({
        reason: "Sedang trending di Jember",
        shops: trending,
      });
    }

    return NextResponse.json({ success: true, data: suggestions });
  }

  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value ?? "";
  const apiResponse = await fetch(`${env.apiUrl}/ai/suggestions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!apiResponse.ok) {
    const text = await apiResponse.text();
    return new NextResponse(text, {
      status: apiResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  }
  const payload = (await apiResponse.json()) as {
    data: PersonalizedSuggestion[];
  };
  return NextResponse.json({ success: true, data: payload.data });
}