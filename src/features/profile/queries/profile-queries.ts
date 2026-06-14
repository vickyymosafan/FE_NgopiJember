"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMyReviews,
  getProfile,
  updateProfile,
} from "@/features/profile/services/profile.service";

const PROFILE_KEY = ["profile"] as const;
const MY_REVIEWS_KEY = ["profile", "reviews"] as const;

export function useProfile() {
  return useQuery({
    queryKey: PROFILE_KEY,
    queryFn: getProfile,
    staleTime: 1000 * 60 * 5,
  });
}

export function useMyReviews() {
  return useQuery({
    queryKey: MY_REVIEWS_KEY,
    queryFn: getMyReviews,
    staleTime: 1000 * 60,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; avatarUrl?: string | null }) =>
      updateProfile(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PROFILE_KEY });
      void queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}