import type { Facility } from "@/features/coffee-shop/types/coffee-shop.types";

export const FACILITIES: Record<string, Facility> = {
  wifi: { id: "wifi", name: "Wifi", icon: "wifi" },
  "power-outlet": { id: "power-outlet", name: "Power Outlet", icon: "plug" },
  "study-friendly": {
    id: "study-friendly",
    name: "Study Friendly",
    icon: "book-open",
  },
  indoor: { id: "indoor", name: "Indoor", icon: "armchair" },
  outdoor: { id: "outdoor", name: "Outdoor", icon: "trees" },
  parking: { id: "parking", name: "Parking", icon: "car" },
  "meeting-area": {
    id: "meeting-area",
    name: "Meeting Area",
    icon: "users",
  },
  "air-conditioning": {
    id: "air-conditioning",
    name: "Air Conditioning",
    icon: "snowflake",
  },
  "large-capacity": {
    id: "large-capacity",
    name: "Large Capacity",
    icon: "expand",
  },
  "modern-interior": {
    id: "modern-interior",
    name: "Modern Interior",
    icon: "sparkles",
  },
  "grab-and-go": { id: "grab-and-go", name: "Grab & Go", icon: "shopping-bag" },
};

export function getFacilities(ids: string[]): Facility[] {
  return ids
    .map((id) => FACILITIES[id])
    .filter((facility): facility is Facility => Boolean(facility));
}
