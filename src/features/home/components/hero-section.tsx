import Link from "next/link";
import { SearchBar } from "@/components/shared/search-bar";
import { POPULAR_SEARCHES } from "@/constants/categories";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-secondary">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-8 px-6 py-20 text-center md:py-28">
        <span className="rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-muted-foreground">
          Direktori coffee shop terlengkap di Jember
        </span>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-h1">
          Temukan coffee shop terbaik di Jember
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Cari berdasarkan lokasi, fasilitas, dan suasana. Mulai dari tempat
          nugas 24 jam sampai cafe outdoor favorit mahasiswa.
        </p>

        <div className="w-full max-w-2xl">
          <SearchBar />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">Populer:</span>
          {POPULAR_SEARCHES.map((term) => (
            <Link
              key={term}
              href={`/search?q=${encodeURIComponent(term)}`}
              className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
            >
              {term}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
