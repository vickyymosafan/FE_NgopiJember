import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Coffee } from "lucide-react";
import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = {
  title: "Daftar",
  description: "Buat akun NgopiJember baru.",
};

export default function RegisterPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
            <span className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Coffee className="size-5" aria-hidden="true" />
            </span>
            <span className="text-lg tracking-tight">NgopiJember</span>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-h4">
            Buat akun baru
          </h1>
          <p className="text-sm text-muted-foreground">
            Bergabung dan nikmati fitur lengkap NgopiJember.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6">
          <Suspense fallback={null}>
            <RegisterForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}