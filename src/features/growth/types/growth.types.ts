export interface SearchLog {
  term: string;
  createdAt: string;
}

export interface PopularSearch {
  term: string;
  count: number;
}

export interface SearchAnalytics {
  totalSearches: number;
  uniqueTerms: number;
  popularSearches: PopularSearch[];
  recentSearches: SearchLog[];
}