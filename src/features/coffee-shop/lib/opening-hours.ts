import type { CoffeeShop } from "@/features/coffee-shop/types/coffee-shop.types";

export function formatOpeningHours(shop: CoffeeShop): string {
  if (shop.isOpen24Hours) {
    return "Buka 24 jam";
  }
  if (shop.openingTime && shop.closingTime) {
    return `${shop.openingTime} - ${shop.closingTime}`;
  }
  return "Jam buka belum tersedia";
}

function toMinutes(time: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time);
  if (!match) {
    return null;
  }
  return Number(match[1]) * 60 + Number(match[2]);
}

export function isOpenNow(shop: CoffeeShop, now: Date = new Date()): boolean {
  if (shop.isOpen24Hours) {
    return true;
  }
  if (!shop.openingTime || !shop.closingTime) {
    return false;
  }
  const open = toMinutes(shop.openingTime);
  const close = toMinutes(shop.closingTime);
  if (open === null || close === null) {
    return false;
  }
  const current = now.getHours() * 60 + now.getMinutes();
  if (close <= open) {
    return current >= open || current < close;
  }
  return current >= open && current < close;
}