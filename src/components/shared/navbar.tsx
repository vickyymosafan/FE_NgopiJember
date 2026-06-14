import Link from "next/link";
import { Coffee, Heart } from "lucide-react";
import { SearchBar } from "@/components/shared/search-bar";
import { AuthNav } from "@/components/shared/auth-nav";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Jelajah", href: "/search" },
  { label: "Trending", href: "/trending" },
  { label: "Peta", href: "/map" },
  { label: "Distrik", href: "/districts" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 hidden border-b border-border bg-background/80 backdrop-blur md:block">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-6 px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-semibold text-foreground"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Coffee className="size-5" aria-hidden="true" />
          </span>
          <span className="text-lg tracking-tight">NgopiJember</span>
        </Link>

        <div className="hidden flex-1 lg:block">
          <SearchBar className="shadow-none" />
        </div>

        <nav aria-label="Navigasi utama" className="flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/favorites"
            aria-label="Favorit"
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
          >
            <Heart className="size-5" aria-hidden="true" />
          </Link>
          <AuthNav />
        </div>
      </div>
    </header>
  );
}