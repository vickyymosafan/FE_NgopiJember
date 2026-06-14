import { z } from "zod";

export const claimSchema = z.object({
  coffeeShopId: z.string().min(1, "Pilih coffee shop"),
  notes: z
    .string()
    .max(500, "Catatan maksimal 500 karakter")
    .or(z.literal(""))
    .optional(),
});

export type ClaimFormValues = z.infer<typeof claimSchema>;