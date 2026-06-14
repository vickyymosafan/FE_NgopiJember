import Link from "next/link";
import { MapPin, Users } from "lucide-react";
import type { CoffeeCommunity } from "@/features/community/types/community.types";

interface CommunityCardProps {
  community: CoffeeCommunity;
}

export function CommunityCard({ community }: CommunityCardProps) {
  return (
    <Link
      href={`/communities/${community.slug}`}
      className="group flex flex-col gap-3 rounded-card border border-border bg-surface p-5 transition-colors hover:border-accent"
    >
      <h3 className="text-lg font-semibold text-foreground">
        {community.name}
      </h3>
      <p className="line-clamp-2 text-sm text-muted-foreground">
        {community.description}
      </p>
      <div className="mt-auto flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="size-3" aria-hidden="true" />
          {community.cityName ?? "-"}
        </span>
        <span className="flex items-center gap-1">
          <Users className="size-3" aria-hidden="true" />
          {community.memberCount.toLocaleString("id-ID")} anggota
        </span>
      </div>
    </Link>
  );
}