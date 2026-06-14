import type { SearchLog } from "@/features/growth/types/growth.types";

export const MOCK_SEARCH_LOGS: SearchLog[] = [
  { term: "wifi kencang", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { term: "nugas", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
  { term: "wifi kencang", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { term: "kopi susu", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() },
  { term: "outdoor", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString() },
  { term: "nugas", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() },
  { term: "24 jam", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString() },
  { term: "wifi kencang", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString() },
  { term: "kopi susu", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString() },
  { term: "nugas", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
];