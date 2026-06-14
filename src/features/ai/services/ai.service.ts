import { ApiError } from "@/types/api";
import type {
  ChatHistory,
  ChatRequest,
  ChatResponse,
  PersonalizedSuggestion,
} from "@/features/ai/types/ai.types";

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, { ...init, credentials: "same-origin" });
  const text = await response.text();
  let payload:
    | { success?: boolean; message?: string; data?: T }
    | null = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }
  if (!response.ok) {
    throw new ApiError(
      payload?.message ?? "Permintaan gagal.",
      response.status,
    );
  }
  return (payload?.data ?? payload) as T;
}

export async function sendChatMessage(
  payload: ChatRequest,
): Promise<ChatResponse> {
  return call<ChatResponse>("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function getChatHistory(): Promise<ChatHistory> {
  return call<ChatHistory>("/api/ai/chat");
}

export async function getPersonalizedSuggestions(): Promise<
  PersonalizedSuggestion[]
> {
  return call<PersonalizedSuggestion[]>("/api/ai/suggestions");
}

export const aiService = {
  sendChatMessage,
  getChatHistory,
  getPersonalizedSuggestions,
};