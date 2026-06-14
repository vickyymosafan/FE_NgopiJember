"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, Edit3 } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useProfile, useUpdateProfile } from "@/features/profile/queries/profile-queries";
import { ProfileMyReviews } from "@/features/profile/components/profile-my-reviews";
import { ProfileMyFavorites } from "@/features/profile/components/profile-my-favorites";
import { ApiError } from "@/types/api";

export function ProfileClient() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: profile, isLoading, isError } = useProfile();
  const updateMutation = useUpdateProfile();

  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace(`/login?next=/profile`);
    }
  }, [authLoading, isAuthenticated, router]);


  if (authLoading || isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-40 w-full animate-pulse rounded-card bg-muted" />
        <div className="h-60 w-full animate-pulse rounded-card bg-muted" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-card border border-border bg-surface px-6 py-12 text-center">
        <AlertCircle className="size-8 text-danger" aria-hidden="true" />
        <p className="text-muted-foreground">Gagal memuat profil.</p>
      </div>
    );
  }

  async function handleSave() {
    setError(null);
    try {
      await updateMutation.mutateAsync({ name: draftName.trim() });
      setEditing(false);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Gagal menyimpan profil.");
      }
    }
  }

  const initial = profile.name.charAt(0).toUpperCase();

  return (
    <div className="space-y-8">
      <section className="rounded-card border border-border bg-surface p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex size-16 items-center justify-center rounded-full bg-accent text-2xl font-semibold text-accent-foreground">
              {initial}
            </span>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {profile.name}
              </h2>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
              <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {profile.role}
              </p>
            </div>
          </div>
          {!editing ? (
            <button
              type="button"
              onClick={() => { setDraftName(profile.name); setEditing(true); }}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              <Edit3 className="size-4" aria-hidden="true" />
              Edit profil
            </button>
          ) : null}
        </div>

        {editing ? (
          <div className="mt-6 space-y-3 border-t border-border pt-5">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-foreground">
                Nama
              </span>
              <input
                type="text"
                value={draftName}
                onChange={(event) => setDraftName(event.target.value)}
                maxLength={100}
                className="h-12 w-full rounded-full border border-input bg-surface px-5 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>
            {error ? (
              <p role="alert" className="text-sm text-danger">
                {error}
              </p>
            ) : null}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={updateMutation.isPending || draftName.trim().length < 3}
                className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-50"
              >
                {updateMutation.isPending ? "Menyimpan..." : "Simpan"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setDraftName(profile.name);
                  setError(null);
                }}
                className="rounded-full border border-border px-5 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                Batal
              </button>
            </div>
          </div>
        ) : null}
      </section>

      <ProfileMyFavorites />
      <ProfileMyReviews />

      <div className="rounded-card border border-border bg-surface p-5 text-sm text-muted-foreground">
        <p>
          Keluar dari akun akan menghapus sesi di perangkat ini.{" "}
          <Link
            href="/logout"
            className="font-medium text-danger hover:underline"
          >
            Keluar
          </Link>
        </p>
      </div>
    </div>
  );
}