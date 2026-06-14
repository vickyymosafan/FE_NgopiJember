"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FACILITY_OPTIONS,
  PRICE_OPTIONS,
  RATING_OPTIONS,
} from "@/features/search/constants/filters";
import { DISTRICTS } from "@/constants/districts";
import type {
  FilterPatch,
  SearchFilters,
} from "@/features/search/hooks/use-search-filters";

interface FilterPanelProps {
  filters: SearchFilters;
  activeCount: number;
  onChange: (patch: FilterPatch) => void;
  onReset: () => void;
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3 border-b border-border pb-5 last:border-0 last:pb-0">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {children}
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "border-accent bg-accent/10 text-accent"
          : "border-border bg-surface text-foreground hover:border-accent",
      )}
    >
      {children}
    </button>
  );
}

export function FilterPanel({
  filters,
  activeCount,
  onChange,
  onReset,
}: FilterPanelProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">
          Filter
          {activeCount > 0 ? (
            <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">
              {activeCount}
            </span>
          ) : null}
        </h2>
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={onReset}
            className="text-sm font-medium text-accent hover:underline"
          >
            Reset
          </button>
        ) : null}
      </div>

      <FilterGroup title="Buka sekarang">
        <label className="flex cursor-pointer items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={filters.openNow}
            onClick={() => onChange({ openNow: !filters.openNow })}
            className={cn(
              "relative h-6 w-11 rounded-full transition-colors",
              filters.openNow ? "bg-accent" : "bg-muted",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 size-5 rounded-full bg-white transition-transform",
                filters.openNow ? "translate-x-[22px]" : "translate-x-0.5",
              )}
            />
          </button>
          <span className="text-sm text-foreground">Hanya yang buka 24 jam</span>
        </label>
      </FilterGroup>

      <FilterGroup title="Distrik">
        <div className="flex flex-wrap gap-2">
          {DISTRICTS.map((district) => (
            <Pill
              key={district.slug}
              active={filters.district === district.name}
              onClick={() =>
                onChange({
                  district:
                    filters.district === district.name
                      ? undefined
                      : district.name,
                })
              }
            >
              {district.name}
            </Pill>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Rating">
        <div className="flex flex-wrap gap-2">
          {RATING_OPTIONS.map((option) => (
            <Pill
              key={option.value}
              active={filters.rating === option.value}
              onClick={() =>
                onChange({
                  rating:
                    filters.rating === option.value ? undefined : option.value,
                })
              }
            >
              {option.label}
            </Pill>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Harga">
        <div className="flex flex-wrap gap-2">
          {PRICE_OPTIONS.map((option) => (
            <Pill
              key={option.value}
              active={filters.priceRange === option.value}
              onClick={() =>
                onChange({
                  priceRange:
                    filters.priceRange === option.value
                      ? undefined
                      : option.value,
                })
              }
            >
              {option.label}
            </Pill>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Fasilitas">
        <div className="space-y-2">
          {FACILITY_OPTIONS.map((option) => {
            const active = filters.facility === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() =>
                  onChange({ facility: active ? undefined : option.id })
                }
                aria-pressed={active}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left text-sm text-foreground transition-colors hover:bg-muted"
              >
                <span
                  className={cn(
                    "flex size-5 items-center justify-center rounded-md border",
                    active
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border",
                  )}
                >
                  {active ? <Check className="size-3.5" aria-hidden="true" /> : null}
                </span>
                {option.name}
              </button>
            );
          })}
        </div>
      </FilterGroup>
    </div>
  );
}