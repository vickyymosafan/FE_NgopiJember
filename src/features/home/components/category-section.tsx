import Link from "next/link";
import { POPULAR_CATEGORIES } from "@/constants/categories";

export function CategorySection() {
  return (
    <section className="mx-auto max-w-[1280px] px-6 py-12">
      <h2 className="sr-only">Kategori populer</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {POPULAR_CATEGORIES.map((category) => (
          <Link
            key={category.query}
            href={`/search?category=${category.query}`}
            className="shrink-0 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            {category.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
