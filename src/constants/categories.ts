export interface Category {
  label: string;
  query: string;
  icon: string;
}

export const POPULAR_CATEGORIES: Category[] = [
  { label: "Wifi", query: "wifi", icon: "wifi" },
  { label: "Outdoor", query: "outdoor", icon: "trees" },
  { label: "24 Hours", query: "24-hours", icon: "clock" },
  { label: "Study Friendly", query: "study-friendly", icon: "book-open" },
  { label: "Cheap", query: "cheap", icon: "wallet" },
  { label: "Premium", query: "premium", icon: "crown" },
];

export const POPULAR_SEARCHES: string[] = [
  "Kopi murah dekat UNEJ",
  "Coffee shop 24 jam",
  "Tempat nugas wifi kencang",
  "Cafe outdoor Jalan Jawa",
];
