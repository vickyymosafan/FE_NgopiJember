import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { parseNaturalLanguage } from "@/features/ai/lib/nl-parser";
import { MOCK_COFFEE_SHOPS } from "@/features/coffee-shop/constants/mock-coffee-shops";
import { MOCK_CHAT_HISTORY } from "@/features/ai/constants/mock-chat-history";
import type {
  ChatMessage,
  ChatRequest,
  ChatResponse,
} from "@/features/ai/types/ai.types";
import type { CoffeeShop } from "@/features/coffee-shop/types/coffee-shop.types";

function filterMock(
  items: CoffeeShop[],
  filters: ReturnType<typeof parseNaturalLanguage>["filters"],
): CoffeeShop[] {
  return items.filter((shop) => {
    if (filters.search) {
      const term = filters.search.toLowerCase();
      const haystack = `${shop.name} ${shop.address} ${shop.district}`.toLowerCase();
      if (!haystack.includes(term)) return false;
    }
    if (filters.district && shop.district !== filters.district) return false;
    if (typeof filters.rating === "number" && shop.rating < filters.rating) return false;
    if (filters.openNow && !shop.isOpen24Hours) return false;
    if (typeof filters.priceRange === "number" && shop.priceRange !== filters.priceRange) return false;
    if (
      filters.facility &&
      !shop.facilities.some((facility) => facility.id === filters.facility)
    )
      return false;
    return true;
  });
}

function formatReply(
  intent: ReturnType<typeof parseNaturalLanguage>,
  count: number,
): string {
  if (count === 0) {
    return "Hmm, saya tidak menemukan coffee shop yang cocok. Coba ubah kata kuncinya ya.";
  }
  const top = `Saya menemukan ${count} coffee shop. Ini beberapa yang paling cocok untuk Anda:`;
  return `${intent.summary} ${top}`;
}

async function realProxy(body: ChatRequest) {
  const response = await fetch(`${env.apiUrl}/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const text = await response.text();
    return new NextResponse(text, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  }
  const payload = (await response.json()) as { data: ChatResponse };
  return NextResponse.json({ success: true, data: payload.data });
}

export async function POST(request: Request) {
  const body = (await request.json()) as ChatRequest;
  const message = body.message?.trim() ?? "";
  if (!message) {
    return NextResponse.json(
      { success: false, message: "Pesan wajib diisi." },
      { status: 400 },
    );
  }

  if (!env.useMock) {
    return realProxy(body);
  }

  const intent = parseNaturalLanguage(message);
  const matches = filterMock(MOCK_COFFEE_SHOPS, intent.filters)
    .slice()
    .sort(
      (a, b) =>
        b.rating * b.reviewCount - a.rating * a.reviewCount,
    )
    .slice(0, 6);
  const reply = formatReply(intent, matches.length);

  const userMsg: ChatMessage = {
    id: `chat-${Date.now()}-u`,
    role: "user",
    content: message,
    createdAt: new Date().toISOString(),
  };
  const assistantMsg: ChatMessage = {
    id: `chat-${Date.now()}-a`,
    role: "assistant",
    content: reply,
    createdAt: new Date().toISOString(),
    shops: matches,
  };
  MOCK_CHAT_HISTORY.push(userMsg, assistantMsg);

  return NextResponse.json({
    success: true,
    data: {
      reply,
      shops: matches,
      filtersApplied: intent.filters as unknown as Record<string, unknown>,
    } satisfies ChatResponse,
  });
}

export async function GET() {
  if (!env.useMock) {
    return NextResponse.json(
      { success: true, data: [] },
    );
  }
  return NextResponse.json({ success: true, data: MOCK_CHAT_HISTORY });
}