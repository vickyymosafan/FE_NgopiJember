import Link from "next/link";
import { MapPin, Navigation } from "lucide-react";

export function MapPreviewSection() {
  return (
    <section className="mx-auto max-w-[1280px] px-6 py-12">
      <div className="relative overflow-hidden rounded-card border border-border bg-surface">
        <div
          className="relative flex min-h-[320px] flex-col items-start justify-end gap-4 p-8"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(192,132,87,0.18), transparent 45%), radial-gradient(circle at 80% 70%, rgba(15,23,42,0.12), transparent 40%)",
          }}
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.4] [background-image:linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] [background-size:40px_40px]"
          />
          <span className="absolute left-[30%] top-[35%] flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg">
            <MapPin className="size-5" aria-hidden="true" />
          </span>
          <span className="absolute left-[60%] top-[55%] flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
            <MapPin className="size-4" aria-hidden="true" />
          </span>

          <div className="relative z-10 max-w-md space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-h3">
              Jelajahi lewat peta
            </h2>
            <p className="text-muted-foreground">
              Lihat sebaran coffee shop di sekitarmu dan temukan yang terdekat
              dengan lokasimu sekarang.
            </p>
            <Link
              href="/map"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90"
            >
              <Navigation className="size-4" aria-hidden="true" />
              Buka peta
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
