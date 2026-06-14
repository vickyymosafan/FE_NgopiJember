import Link from "next/link";
import type { ReactNode } from "react";

interface SectionHeadingProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  children?: ReactNode;
}

export function SectionHeading({
  title,
  description,
  actionLabel,
  actionHref,
}: SectionHeadingProps) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-h3">
          {title}
        </h2>
        {description ? (
          <p className="max-w-xl text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="shrink-0 text-sm font-medium text-accent hover:underline"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
