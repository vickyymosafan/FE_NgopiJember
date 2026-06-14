import { z } from "zod";

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const adminCoffeeShopSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nama wajib diisi")
      .max(255, "Nama maksimal 255 karakter"),
    slug: z
      .string()
      .min(1, "Slug wajib diisi")
      .max(255, "Slug maksimal 255 karakter")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug hanya boleh huruf kecil, angka, dan tanda pisah",
      ),
    description: z.string().max(2000, "Deskripsi maksimal 2000 karakter").or(z.literal("")).optional(),
    address: z.string().min(1, "Alamat wajib diisi"),
    district: z.string().min(1, "Distrik wajib diisi"),
    latitude: z
      .string()
      .optional()
      .refine(
        (value) => !value || (Number(value) >= -90 && Number(value) <= 90),
        "Latitude tidak valid",
      ),
    longitude: z
      .string()
      .optional()
      .refine(
        (value) => !value || (Number(value) >= -180 && Number(value) <= 180),
        "Longitude tidak valid",
      ),
    phone: z.string().optional(),
    instagram: z.string().optional(),
    website: z
      .string()
      .optional()
      .refine(
        (value) =>
          !value || /^https?:\/\/.+/.test(value),
        "Website harus URL http(s)",
      ),
    openingTime: z
      .string()
      .optional()
      .refine((v) => !v || TIME_REGEX.test(v), "Format HH:mm"),
    closingTime: z
      .string()
      .optional()
      .refine((v) => !v || TIME_REGEX.test(v), "Format HH:mm"),
    priceRange: z.string().min(1, "Pilih kisaran harga").regex(/^[1-4]$/, "Harga tidak valid"),
    facilityIds: z.array(z.string()),
  })
  .refine(
    (data) =>
      (data.openingTime || "") !== "" || (data.closingTime || "") === "",
    { message: "Isi jam buka juga", path: ["closingTime"] },
  );

export type AdminFormValues = z.infer<typeof adminCoffeeShopSchema>;

export interface AdminCoffeeShopData {
  name: string;
  slug: string;
  description: string;
  address: string;
  district: string;
  latitude: string;
  longitude: string;
  phone: string;
  instagram: string;
  website: string;
  openingTime: string;
  closingTime: string;
  priceRange: string;
  facilityIds: string[];
}

export function toFormValues(shop: {
  name: string;
  slug: string;
  description: string | null;
  address: string;
  district: string;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  instagram: string | null;
  website: string | null;
  openingTime: string | null;
  closingTime: string | null;
  priceRange: number;
  facilities: { id: string }[];
}): AdminCoffeeShopData {
  return {
    name: shop.name,
    slug: shop.slug,
    description: shop.description ?? "",
    address: shop.address,
    district: shop.district,
    latitude: shop.latitude?.toString() ?? "",
    longitude: shop.longitude?.toString() ?? "",
    phone: shop.phone ?? "",
    instagram: shop.instagram ?? "",
    website: shop.website ?? "",
    openingTime: shop.openingTime ?? "",
    closingTime: shop.closingTime ?? "",
    priceRange: shop.priceRange.toString(),
    facilityIds: shop.facilities.map((facility) => facility.id),
  };
}

export function toPayload(values: AdminFormValues) {
  return {
    name: values.name,
    slug: values.slug,
    description: values.description ? values.description : null,
    address: values.address,
    district: values.district,
    latitude: values.latitude ? Number(values.latitude) : null,
    longitude: values.longitude ? Number(values.longitude) : null,
    phone: values.phone ? values.phone : null,
    instagram: values.instagram ? values.instagram : null,
    website: values.website ? values.website : null,
    openingTime: values.openingTime ? values.openingTime : null,
    closingTime: values.closingTime ? values.closingTime : null,
    priceRange: Number(values.priceRange),
    facilityIds: values.facilityIds,
  };
}