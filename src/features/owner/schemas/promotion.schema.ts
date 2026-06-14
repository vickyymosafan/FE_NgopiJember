import { z } from "zod";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const promotionSchema = z
  .object({
    coffeeShopId: z.string().min(1, "Pilih coffee shop"),
    title: z
      .string()
      .min(1, "Judul wajib diisi")
      .max(120, "Judul maksimal 120 karakter"),
    description: z
      .string()
      .max(500, "Deskripsi maksimal 500 karakter")
      .or(z.literal(""))
      .optional(),
    startDate: z
      .string()
      .min(1, "Tanggal mulai wajib")
      .regex(DATE_REGEX, "Format YYYY-MM-DD"),
    endDate: z
      .string()
      .min(1, "Tanggal selesai wajib")
      .regex(DATE_REGEX, "Format YYYY-MM-DD"),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "Tanggal selesai harus setelah tanggal mulai",
    path: ["endDate"],
  });

export type PromotionFormValues = z.infer<typeof promotionSchema>;