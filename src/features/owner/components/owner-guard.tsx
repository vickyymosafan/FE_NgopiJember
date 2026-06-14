"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";

interface OwnerGuardProps {
  children: ReactNode;
}

export function OwnerGuard({ children }: OwnerGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || !user) {
      router.replace(`/login?next=/owner`);
      return;
    }
    if (user.role !== "OWNER" && user.role !== "ADMIN") {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1280px] px-6 py-10">
        <div className="h-6 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-4 h-40 w-full animate-pulse rounded-card bg-muted" />
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;
  if (user.role !== "OWNER" && user.role !== "ADMIN") return null;

  return <>{children}</>;
}