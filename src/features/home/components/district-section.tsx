import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DISTRICTS } from "@/constants/districts";
import { SectionHeading } from "@/features/home/components/section-heading";

export function DistrictSection() {
  return (
    <section className="mx-auto max-w-[1280px] px-6 py-12">
      <SectionHeading
        title="Jelajah per distrik"
        description="Temukan coffee shop berdasarkan kecamatan di Jember."
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {DISTRICTS.map((district) => (
          <Link
            key={district.slug}
            href={`/search?district=${encodeURIComponent(district.name)}`}
            className="group flex flex-col gap-3 rounded-card border border-border bg-surface p-5 transition-colors hover:border-accent"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                {district.name}
              </h3>
              <ArrowRight
                className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent"
                aria-hidden="true"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {district.description}
            </p>
            <span className="mt-auto text-sm font-medium text-accent">
              {district.shopCount > 0
                ? `${district.shopCount} coffee shop`
                : "Segera hadir"}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
