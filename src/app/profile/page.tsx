import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { BottomNav } from "@/components/shared/bottom-nav";

export const metadata: Metadata = {
  title: "Profil",
  description: "Profil pengguna NgopiJember.",
};

export default function ProfilePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="mx-auto flex max-w-[1280px] flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-h3">
          Profil
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          Halaman profil lengkap akan hadir di phase berikutnya. Anda sudah
          berhasil masuk.
        </p>
      </main>
      <BottomNav />
    </div>
  );
}