import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { BottomNav } from "@/components/shared/bottom-nav";
import { ProfileClient } from "@/features/profile/components/profile-client";

export const metadata: Metadata = {
  title: "Profil",
  description: "Profil, ulasan, dan favorit Anda di NgopiJember.",
};

export default function ProfilePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main id="main-content" className="mx-auto w-full max-w-[1280px] flex-1 px-6 py-8 pb-24 md:pb-0">
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-h3">
            Profil
          </h1>
          <p className="text-sm text-muted-foreground">
            Informasi akun, ulasan, dan favorit Anda.
          </p>
        </div>
        <ProfileClient />
      </main>
      <BottomNav />
    </div>
  );
}