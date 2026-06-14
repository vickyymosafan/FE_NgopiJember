"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  defaultValue?: string;
  className?: string;
}

export function SearchBar({
  placeholder = "Cari coffee shop, lokasi, atau fasilitas",
  defaultValue = "",
  className,
}: SearchBarProps) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = value.trim();
    router.push(term ? `/search?q=${encodeURIComponent(term)}` : "/search");
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn(
        "flex w-full items-center gap-2 rounded-full border border-border bg-surface p-2 shadow-lg shadow-black/5",
        className,
      )}
    >
      <Search
        className="ml-3 size-5 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <label htmlFor="home-search" className="sr-only">
        Cari coffee shop
      </label>
      <Input
        id="home-search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="h-10 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
      />
      <Button type="submit" variant="accent" size="md" className="shrink-0">
        Cari
      </Button>
    </form>
  );
}
