"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  readOnly?: boolean;
}

export function RatingInput({ value, onChange, readOnly }: RatingInputProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Rating"
      className="flex items-center gap-1"
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= value;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`${n} bintang`}
            disabled={readOnly}
            onClick={() => onChange(n)}
            className={cn(
              "rounded p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              readOnly ? "cursor-default" : "cursor-pointer hover:scale-110",
            )}
          >
            <Star
              className={cn(
                "size-6",
                active
                  ? "fill-warning text-warning"
                  : "fill-transparent text-muted-foreground",
              )}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
}

interface RatingStarsProps {
  value: number;
  size?: number;
}

export function RatingStars({ value, size = 16 }: RatingStarsProps) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Rating ${value}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          style={{ width: size, height: size }}
          className={cn(
            n <= value
              ? "fill-warning text-warning"
              : "fill-transparent text-muted-foreground",
          )}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}