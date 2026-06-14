"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getPersonalizedSuggestions,
  sendChatMessage,
} from "@/features/ai/services/ai.service";
import type { ChatRequest } from "@/features/ai/types/ai.types";
import { useAuth } from "@/providers/auth-provider";

export const aiKeys = {
  suggestions: ["ai", "suggestions"] as const,
};

export function usePersonalizedSuggestions() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: aiKeys.suggestions,
    queryFn: getPersonalizedSuggestions,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });
}

export function useSendChatMessage() {
  return useMutation({
    mutationFn: (payload: ChatRequest) => sendChatMessage(payload),
  });
}