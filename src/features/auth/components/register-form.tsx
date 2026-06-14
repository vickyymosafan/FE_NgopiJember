"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "@/types/api";
import { useAuth } from "@/providers/auth-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FormError } from "@/components/ui/form-helpers";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/schemas/auth.schema";

export function RegisterForm() {
  const router = useRouter();
  const { register: registerUser, login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setServerError(null);
    try {
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      await login({ email: values.email, password: values.password });
      router.replace("/search");
    } catch (error) {
      if (error instanceof ApiError) {
        setServerError(error.message);
      } else {
        setServerError("Terjadi kesalahan. Coba lagi.");
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <FormError message={serverError} />

      <Field label="Nama" error={errors.name} htmlFor="register-name">
        <Input
          id="register-name"
          type="text"
          autoComplete="name"
          {...register("name")}
        />
      </Field>

      <Field label="Email" error={errors.email} htmlFor="register-email">
        <Input
          id="register-email"
          type="email"
          autoComplete="email"
          {...register("email")}
        />
      </Field>

      <Field label="Kata Sandi" error={errors.password} htmlFor="register-password">
        <Input
          id="register-password"
          type="password"
          autoComplete="new-password"
          {...register("password")}
        />
      </Field>

      <Field
        label="Konfirmasi Kata Sandi"
        error={errors.confirmPassword}
        htmlFor="register-confirm"
      >
        <Input
          id="register-confirm"
          type="password"
          autoComplete="new-password"
          {...register("confirmPassword")}
        />
      </Field>

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Memproses..." : "Daftar"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-medium text-accent hover:underline">
          Masuk
        </Link>
      </p>
    </form>
  );
}