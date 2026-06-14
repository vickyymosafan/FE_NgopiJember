import { z } from "zod";

export const reviewSchema = z.object({
  rating: z.number({ error: "Pilih rating" })
    .int()
    .min(1, "Rating minimal 1")
    .max(5, "Rating maksimal 5"),
  comment: z
    .string()
    .min(10, "Komentar minimal 10 karakter")
    .max(2000, "Komentar maksimal 2000 karakter"),
  images: z.array(z.string().url()).max(4, "Maksimal 4 foto"),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;