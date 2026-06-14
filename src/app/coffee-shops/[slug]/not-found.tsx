import Link from "next/link";
import { Coffee } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { BottomNav } from "@/components/shared/bottom-nav";

export default function CoffeeShopNotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-6 pb-20 md:pb-0">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Coffee className="size-7" aria-hidden="true" />
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Coffee shop tidak ditemukan
          </h1>
          <p className="text-muted-foreground">
            Coffee shop yang kamu cari mungkin sudah dihapus atau alamatnya
            keliru.
          </p>
          <Link
            href="/search"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90"
          >
            Jelajah coffee shop lain
          </Link>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}