import Link from "next/link";
import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { BottomNav } from "@/components/shared/bottom-nav";
import { AdminGuard } from "@/features/admin/components/admin-guard";

const ADMIN_LINKS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Coffee Shops", href: "/admin/coffee-shops" },
  { label: "Tambah", href: "/admin/coffee-shops/new" },
  { label: "Klaim", href: "/admin/claims" },
  { label: "Search Analytics", href: "/admin/analytics/searches" },
];

interface AdminShellProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

export function AdminShell({ title, description, action, children }: AdminShellProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <div className="mx-auto flex w-full max-w-[1280px] flex-1 gap-8 px-6 py-8">
        <aside className="hidden w-56 shrink-0 space-y-1 md:block">
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-accent/10 px-3 py-2 text-sm font-medium text-accent">
            <ShieldCheck className="size-4" aria-hidden="true" />
            Admin
          </div>
          {ADMIN_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </aside>

        <main className="min-w-0 flex-1 space-y-6 pb-20 md:pb-0">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-h3">
                {title}
              </h1>
              {description ? (
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              ) : null}
            </div>
            {action}
          </div>
          <AdminGuard>{children}</AdminGuard>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}