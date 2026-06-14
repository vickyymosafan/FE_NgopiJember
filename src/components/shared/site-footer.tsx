import { Coffee } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-6 py-10 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <span className="flex size-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Coffee className="size-4" aria-hidden="true" />
          </span>
          NgopiJember
        </div>
        <p>Discover Every Coffee Shop in Jember.</p>
        <p>&copy; {new Date().getFullYear()} NgopiJember</p>
      </div>
    </footer>
  );
}
