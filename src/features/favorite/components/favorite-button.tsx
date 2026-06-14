"use client";

import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import {
  useIsFavorite,
  useToggleFavorite,
} from "@/features/favorite/queries/favorite-queries";

interface FavoriteButtonProps {
  coffeeShopId: string;
  coffeeShopName: string;
  className?: string;
}

export function FavoriteButton({
  coffeeShopId,
  coffeeShopName,
  className,
}: FavoriteButtonProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { isFavorite, isLoading } = useIsFavorite(coffeeShopId);
  const toggleMutation = useToggleFavorite();

  const busy = toggleMutation.isPending;

  async function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent("/favorites")}`);
      return;
    }
    if (busy) return;
    await toggleMutation.mutateAsync({
      coffeeShopId,
      add: !isFavorite,
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading || busy}
      aria-pressed={isFavorite}
      aria-label={
        isFavorite
          ? `Hapus ${coffeeShopName} dari favorit`
          : `Simpan ${coffeeShopName} ke favorit`
      }
      className={cn(
        "flex size-9 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60",
        className,
      )}
    >
      <Heart
        className={cn(
          "size-4",
          isFavorite ? "fill-danger text-danger" : "text-muted-foreground",
        )}
        aria-hidden="true"
      />
    </button>
  );
}