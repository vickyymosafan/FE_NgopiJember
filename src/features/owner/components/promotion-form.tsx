"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "@/types/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FormError } from "@/components/ui/form-helpers";
import { useOwnerCoffeeShops } from "@/features/owner/queries/owner-queries";
import { useOwnerCreatePromotion } from "@/features/owner/queries/owner-queries";
import {
  promotionSchema,
  type PromotionFormValues,
} from "@/features/owner/schemas/promotion.schema";

export function PromotionForm() {
  const router = useRouter();
  const shopsQuery = useOwnerCoffeeShops();
  const createMutation = useOwnerCreatePromotion();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      coffeeShopId: "",
      title: "",
      description: "",
      startDate: "",
      endDate: "",
    },
  });

  async function onSubmit(values: PromotionFormValues) {
    setServerError(null);
    try {
      await createMutation.mutateAsync({
        coffeeShopId: values.coffeeShopId,
        title: values.title,
        description: values.description ? values.description : undefined,
        startDate: values.startDate,
        endDate: values.endDate,
      });
      router.push("/owner/promotions");
    } catch (error) {
      if (error instanceof ApiError) {
        setServerError(error.message);
      } else {
        setServerError("Gagal membuat promosi.");
      }
    }
  }

  const shops = shopsQuery.data ?? [];
  const submitting = isSubmitting || createMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <FormError message={serverError} />

      <Field label="Coffee Shop" error={errors.coffeeShopId} htmlFor="promo-shop">
        <select
          id="promo-shop"
          className="h-12 w-full rounded-full border border-input bg-surface px-4 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          {...register("coffeeShopId")}
        >
          <option value="">-- Pilih coffee shop --</option>
          {shops.map((shop) => (
            <option key={shop.id} value={shop.id}>
              {shop.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Judul" error={errors.title} htmlFor="promo-title">
        <Input id="promo-title" {...register("title")} />
      </Field>

      <Field label="Deskripsi" error={errors.description} htmlFor="promo-desc">
        <textarea
          id="promo-desc"
          rows={3}
          className="w-full rounded-xl border border-input bg-surface px-4 py-3 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          {...register("description")}
        />
      </Field>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Tanggal Mulai" error={errors.startDate} htmlFor="promo-start">
          <Input id="promo-start" type="date" {...register("startDate")} />
        </Field>
        <Field label="Tanggal Selesai" error={errors.endDate} htmlFor="promo-end">
          <Input id="promo-end" type="date" {...register("endDate")} />
        </Field>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" variant="primary" size="lg" disabled={submitting}>
          {submitting ? "Menyimpan..." : "Buat promosi"}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
          Batal
        </Button>
      </div>
    </form>
  );
}