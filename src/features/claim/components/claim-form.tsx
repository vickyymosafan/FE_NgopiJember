"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "@/types/api";
import { useCoffeeShops } from "@/features/coffee-shop/queries/use-coffee-shops";
import { useCreateClaim } from "@/features/claim/queries/claim-queries";
import {
  claimSchema,
  type ClaimFormValues,
} from "@/features/claim/schemas/claim.schema";
import { Button } from "@/components/ui/button";
import { Field, FormError } from "@/components/ui/form-helpers";

export function ClaimForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetId = searchParams.get("coffeeShopId") ?? "";

  const shopsQuery = useCoffeeShops({ limit: 200 });
  const createMutation = useCreateClaim();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClaimFormValues>({
    resolver: zodResolver(claimSchema),
    defaultValues: {
      coffeeShopId: presetId,
      notes: "",
    },
  });

  async function onSubmit(values: ClaimFormValues) {
    setServerError(null);
    try {
      await createMutation.mutateAsync({
        coffeeShopId: values.coffeeShopId,
        notes: values.notes ? values.notes : undefined,
      });
      router.push("/claims?created=1");
    } catch (error) {
      if (error instanceof ApiError) {
        setServerError(error.message);
      } else {
        setServerError("Gagal mengirim klaim. Coba lagi.");
      }
    }
  }

  const shops = shopsQuery.data?.items ?? [];
  const submitting = isSubmitting || createMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <FormError message={serverError} />

      <Field label="Coffee Shop" error={errors.coffeeShopId} htmlFor="claim-shop">
        <select
          id="claim-shop"
          className="h-12 w-full rounded-full border border-input bg-surface px-4 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          {...register("coffeeShopId")}
        >
          <option value="">-- Pilih coffee shop --</option>
          {shops.map((shop) => (
            <option key={shop.id} value={shop.id} disabled={shop.verified}>
              {shop.name}
              {shop.verified ? " (sudah diverifikasi)" : ""}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Catatan (opsional)"
        error={errors.notes}
        htmlFor="claim-notes"
      >
        <textarea
          id="claim-notes"
          rows={4}
          placeholder="Contoh: Saya adalah pemilik sah, berikut bukti kepemilikan..."
          className="w-full rounded-xl border border-input bg-surface px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          {...register("notes")}
        />
      </Field>

      <div className="flex items-center gap-3">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={submitting}
        >
          {submitting ? "Mengirim..." : "Ajukan klaim"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.back()}
        >
          Batal
        </Button>
      </div>
    </form>
  );
}