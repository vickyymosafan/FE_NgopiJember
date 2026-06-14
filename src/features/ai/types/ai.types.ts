import type { CoffeeShop } from "@/features/coffee-shop/types/coffee-shop.types";

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  shops?: CoffeeShop[];
}

export type ChatHistory = ChatMessage[];

export interface ChatRequest {
  message: string;
  history?: Array<{ role: ChatRole; content: string }>;
}

export interface ChatResponse {
  reply: string;
  shops: CoffeeShop[];
  filtersApplied: Record<string, unknown>;
}

export interface PersonalizedSuggestion {
  reason: string;
  shops: CoffeeShop[];
}