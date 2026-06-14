import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "@/features/auth/schemas/auth.schema";

describe("loginSchema", () => {
  it("validates a valid login", () => {
    const result = loginSchema.safeParse({
      email: "a@b.com",
      password: "Password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty fields", () => {
    const result = loginSchema.safeParse({ email: "", password: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email format", () => {
    const result = loginSchema.safeParse({ email: "nope", password: "x" });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  const valid = {
    name: "Budi",
    email: "budi@example.com",
    password: "Password123",
    confirmPassword: "Password123",
  };

  it("validates a valid registration", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects short password", () => {
    const result = registerSchema.safeParse({
      ...valid,
      password: "Ab1",
      confirmPassword: "Ab1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password without uppercase", () => {
    const result = registerSchema.safeParse({
      ...valid,
      password: "password1",
      confirmPassword: "password1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password without number", () => {
    const result = registerSchema.safeParse({
      ...valid,
      password: "PasswordX",
      confirmPassword: "PasswordX",
    });
    expect(result.success).toBe(false);
  });

  it("rejects mismatched confirm password", () => {
    const result = registerSchema.safeParse({
      ...valid,
      confirmPassword: "OtherPassword1",
    });
    expect(result.success).toBe(false);
  });
});