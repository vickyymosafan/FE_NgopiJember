"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "@/types/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FormError } from "@/components/ui/form-helpers";
import { FACILITIES } from "@/features/coffee-shop/constants/facilities";
import {
  adminCoffeeShopSchema,
  toFormValues,
  toPayload,
  type AdminFormValues,
} from "@/features/admin/schemas/admin.schema";
import { useOwnerUpdateCoffeeShop } from "@/features/owner/queries/owner-queries";
import type { CoffeeShop } from "@/features/coffee-shop/types/coffee-shop.types";

const PRICE_OPTIONS = [
  { value: 1, label: "Rp1K - 25K" },
  { value: 2, label: "Rp25K - 50K" },
  { value: 3, label: "Rp50K - 100K" },
  { value: 4, label: "Rp100K+" },
];

interface OwnerCoffeeShopFormProps {
  shop: CoffeeShop;
}

export function OwnerCoffeeShopForm({ shop }: OwnerCoffeeShopFormProps) {
  const router = useRouter();
  const updateMutation = useOwnerUpdateCoffeeShop();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AdminFormValues>({
    resolver: zodResolver(adminCoffeeShopSchema),
    defaultValues: toFormValues(shop),
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const facilityIds = watch("facilityIds");

  function toggleFacility(id: string) {
    const next = facilityIds.includes(id)
      ? facilityIds.filter((item) => item !== id)
      : [...facilityIds, id];
    setValue("facilityIds", next, { shouldDirty: true });
  }

  async function onSubmit(values: AdminFormValues) {
    setServerError(null);
    try {
      await updateMutation.mutateAsync({ id: shop.id, payload: toPayload(values) });
      router.push("/owner/coffee-shops");
    } catch (error) {
      if (error instanceof ApiError) {
        setServerError(error.message);
      } else {
        setServerError("Gagal menyimpan perubahan.");
      }
    }
  }

  const submitting = isSubmitting || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <FormError message={serverError} />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Nama" error={errors.name} htmlFor="owner-name">
          <Input id="owner-name" {...register("name")} />
        </Field>
        <Field label="Slug" error={errors.slug} htmlFor="owner-slug">
          <Input id="owner-slug" {...register("slug")} />
        </Field>
      </div>

      <Field label="Deskripsi" error={errors.description} htmlFor="owner-desc">
        <textarea
          id="owner-desc"
          rows={4}
          className="w-full rounded-xl border border-input bg-surface px-4 py-3 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          {...register("description")}
        />
      </Field>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Alamat" error={errors.address} htmlFor="owner-address">
          <Input id="owner-address" {...register("address")} />
        </Field>
        <Field label="Distrik" error={errors.district} htmlFor="owner-district">
          <Input id="owner-district" {...register("district")} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Latitude" error={errors.latitude} htmlFor="owner-lat">
          <Input id="owner-lat" inputMode="decimal" {...register("latitude")} />
        </Field>
        <Field label="Longitude" error={errors.longitude} htmlFor="owner-lng">
          <Input id="owner-lng" inputMode="decimal" {...register("longitude")} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Telepon" error={errors.phone} htmlFor="owner-phone">
          <Input id="owner-phone" {...register("phone")} />
        </Field>
        <Field label="Instagram" error={errors.instagram} htmlFor="owner-ig">
          <Input id="owner-ig" {...register("instagram")} />
        </Field>
      </div>

      <Field label="Website" error={errors.website} htmlFor="owner-web">
        <Input id="owner-web" type="url" {...register("website")} />
      </Field>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Jam Buka (HH:mm)" error={errors.openingTime} htmlFor="owner-open">
          <Input id="owner-open" placeholder="08:00" {...register("openingTime")} />
        </Field>
        <Field label="Jam Tutup (HH:mm)" error={errors.closingTime} htmlFor="owner-close">
          <Input id="owner-close" placeholder="22:00" {...register("closingTime")} />
        </Field>
      </div>

      <Field label="Kisaran Harga" error={errors.priceRange} htmlFor="owner-price">
        <select
          id="owner-price"
          className="h-12 w-full rounded-full border border-input bg-surface px-4 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          {...register("priceRange")}
        >
          <option value="">-- Pilih --</option>
          {PRICE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>

      <div className="space-y-2">
        <span className="block text-sm font-medium text-foreground">Fasilitas</span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {Object.values(FACILITIES).map((facility) => {
            const checked = facilityIds.includes(facility.id);
            return (
              <label
                key={facility.id}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleFacility(facility.id)}
                  className="size-4 accent-accent"
                />
                {facility.name}
              </label>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" variant="primary" size="lg" disabled={submitting}>
          {submitting ? "Menyimpan..." : "Simpan perubahan"}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
          Batal
        </Button>
      </div>
    </form>
  );
}