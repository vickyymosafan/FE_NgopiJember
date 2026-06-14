"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AuthNav() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  if (!isAuthenticated || !user) {
    return (
      <Link
        href="/login"
        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
      >
        <User className="size-4" aria-hidden="true" />
        Masuk
      </Link>
    );
  }

  const initial = user.name.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-2">
      <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
        {initial}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={async () => {
          await logout();
          router.replace("/");
        }}
        aria-label="Keluar"
      >
        <LogOut className="size-4" aria-hidden="true" />
        Keluar
      </Button>
    </div>
  );
}