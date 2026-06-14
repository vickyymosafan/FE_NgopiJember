"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Field, FormError } from "@/components/ui/form-helpers";
import { RatingInput } from "@/features/review/components/rating-input";
import { useCreateReview } from "@/features/review/queries/review-queries";
import {
  reviewSchema,
  type ReviewFormValues,
} from "@/features/review/schemas/review.schema";

interface ReviewFormProps {
  coffeeShopId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ coffeeShopId, onSuccess }: ReviewFormProps) {
  const createMutation = useCreateReview();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
      images: [],
    },
  });

  async function onSubmit(values: ReviewFormValues) {
    setServerError(null);
    try {
      await createMutation.mutateAsync({
        coffeeShopId,
        rating: values.rating,
        comment: values.comment,
        images: values.images,
      });
      reset();
      onSuccess?.();
    } catch (error) {
      if (error instanceof ApiError) {
        setServerError(error.message);
      } else {
        setServerError("Gagal mengirim ulasan. Coba lagi.");
      }
    }
  }

  const submitting = isSubmitting || createMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <FormError message={serverError} />

      <Field label="Rating" error={errors.rating}>
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <RatingInput value={field.value} onChange={field.onChange} />
          )}
        />
      </Field>

      <Field label="Komentar" error={errors.comment} htmlFor="review-comment">
        <textarea
          id="review-comment"
          rows={4}
          className="w-full rounded-xl border border-input bg-surface px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Ceritakan pengalamanmu di coffee shop ini..."
          {...register("comment")}
        />
      </Field>

      <Button type="submit" variant="primary" size="md" disabled={submitting}>
        {submitting ? "Mengirim..." : "Kirim ulasan"}
      </Button>
    </form>
  );
}