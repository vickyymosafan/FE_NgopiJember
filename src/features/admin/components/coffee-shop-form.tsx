"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
import {
  useAdminCreateCoffeeShop,
  useAdminUpdateCoffeeShop,
} from "@/features/admin/queries/admin-queries";
import type { CoffeeShop } from "@/features/coffee-shop/types/coffee-shop.types";

const PRICE_OPTIONS = [
  { value: 1, label: "Rp1K - 25K" },
  { value: 2, label: "Rp25K - 50K" },
  { value: 3, label: "Rp50K - 100K" },
  { value: 4, label: "Rp100K+" },
];

interface CoffeeShopFormProps {
  initialShop?: CoffeeShop;
}

export function CoffeeShopForm({ initialShop }: CoffeeShopFormProps) {
  const router = useRouter();
  const createMutation = useAdminCreateCoffeeShop();
  const updateMutation = useAdminUpdateCoffeeShop();
  const [serverError, setServerError] = useState<string | null>(null);

  const isEdit = Boolean(initialShop);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AdminFormValues>({
    resolver: zodResolver(adminCoffeeShopSchema),
    defaultValues: initialShop
      ? toFormValues(initialShop)
      : {
          name: "",
          slug: "",
          description: "",
          address: "",
          district: "",
          latitude: "",
          longitude: "",
          phone: "",
          instagram: "",
          website: "",
          openingTime: "",
          closingTime: "",
          priceRange: "",
          facilityIds: [],
        },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const facilityIds = watch("facilityIds");

  useEffect(() => {
    if (!initialShop) return;
    const values = toFormValues(initialShop);
    (Object.keys(values) as (keyof typeof values)[]).forEach((key) => {
      setValue(key, values[key] as never);
    });
  }, [initialShop, setValue]);

  function toggleFacility(id: string) {
    const next = facilityIds.includes(id)
      ? facilityIds.filter((item) => item !== id)
      : [...facilityIds, id];
    setValue("facilityIds", next, { shouldDirty: true });
  }

  async function onSubmit(values: AdminFormValues) {
    setServerError(null);
    try {
      if (isEdit && initialShop) {
        await updateMutation.mutateAsync({
          id: initialShop.id,
          payload: toPayload(values),
        });
      } else {
        await createMutation.mutateAsync(toPayload(values));
      }
      router.push("/admin");
    } catch (error) {
      if (error instanceof ApiError) {
        setServerError(error.message);
      } else {
        setServerError("Terjadi kesalahan. Coba lagi.");
      }
    }
  }

  const submitting = isSubmitting || createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <FormError message={serverError} />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Nama" error={errors.name} htmlFor="admin-name">
          <Input id="admin-name" {...register("name")} />
        </Field>
        <Field label="Slug" error={errors.slug} htmlFor="admin-slug">
          <Input id="admin-slug" {...register("slug")} />
        </Field>
      </div>

      <Field label="Deskripsi" error={errors.description} htmlFor="admin-desc">
        <textarea
          id="admin-desc"
          rows={4}
          className="w-full rounded-xl border border-input bg-surface px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          {...register("description")}
        />
      </Field>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Alamat" error={errors.address} htmlFor="admin-address">
          <Input id="admin-address" {...register("address")} />
        </Field>
        <Field label="Distrik" error={errors.district} htmlFor="admin-district">
          <Input id="admin-district" {...register("district")} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Latitude" error={errors.latitude} htmlFor="admin-lat">
          <Input id="admin-lat" inputMode="decimal" {...register("latitude")} />
        </Field>
        <Field label="Longitude" error={errors.longitude} htmlFor="admin-lng">
          <Input id="admin-lng" inputMode="decimal" {...register("longitude")} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Telepon" error={errors.phone} htmlFor="admin-phone">
          <Input id="admin-phone" {...register("phone")} />
        </Field>
        <Field label="Instagram" error={errors.instagram} htmlFor="admin-ig">
          <Input id="admin-ig" {...register("instagram")} />
        </Field>
      </div>

      <Field label="Website" error={errors.website} htmlFor="admin-website">
        <Input id="admin-website" type="url" {...register("website")} />
      </Field>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Jam Buka (HH:mm)" error={errors.openingTime} htmlFor="admin-open">
          <Input id="admin-open" placeholder="08:00" {...register("openingTime")} />
        </Field>
        <Field label="Jam Tutup (HH:mm)" error={errors.closingTime} htmlFor="admin-close">
          <Input id="admin-close" placeholder="22:00" {...register("closingTime")} />
        </Field>
      </div>

      <Field label="Kisaran Harga" error={errors.priceRange} htmlFor="admin-price">
        <select
          id="admin-price"
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
          {submitting ? "Menyimpan..." : isEdit ? "Simpan perubahan" : "Tambah coffee shop"}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
          Batal
        </Button>
      </div>
    </form>
  );
}