"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { usePersonalizedSuggestions } from "@/features/ai/queries/ai-queries";
import {
  CoffeeShopCard,
  CoffeeShopCardSkeleton,
} from "@/features/coffee-shop/components/coffee-shop-card";

export function PersonalizedSuggestions() {
  const { isAuthenticated } = useAuth();
  const { data, isPending, isError } = usePersonalizedSuggestions();

  if (!isAuthenticated) return null;
  if (isError) return null;

  if (isPending) {
    return (
      <section className="space-y-5">
        <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-h4">
          Rekomendasi untuk Anda
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <CoffeeShopCardSkeleton key={index} />
          ))}
        </div>
      </section>
    );
  }

  if (!data || data.length === 0) return null;

  return (
    <div className="space-y-8">
      {data.map((group) => (
        <section key={group.reason} className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-accent" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-foreground">
              {group.reason}
            </h2>
            <Link
              href="/trending"
              className="ml-auto text-sm font-medium text-accent hover:underline"
            >
              Lihat lainnya
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {group.shops.map((shop) => (
              <CoffeeShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}