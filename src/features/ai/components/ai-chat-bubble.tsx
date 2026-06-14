"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MessageCircle, Send, X, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSendChatMessage } from "@/features/ai/queries/ai-queries";
import type {
  ChatMessage,
  ChatResponse,
} from "@/features/ai/types/ai.types";

const SUGGESTION_PROMPTS = [
  "Cari coffee shop wifi kencang",
  "Cafe murah buat nugas",
  "Cafe buka 24 jam",
  "Dekat UNEJ",
];

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AiChatBubble() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const sendMutation = useSendChatMessage();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [open, messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      const userMessage: ChatMessage = {
        id: `u-${Date.now()}`,
        role: "user",
        content: text,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setDraft("");
      try {
        const response: ChatResponse = await sendMutation.mutateAsync({
          message: text,
        });
        const assistantMessage: ChatMessage = {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: response.reply,
          createdAt: new Date().toISOString(),
          shops: response.shops,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch {
        const fallback: ChatMessage = {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: "Maaf, saya kesulitan memahami permintaan Anda.",
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, fallback]);
      }
    },
    [sendMutation],
  );

  return (
    <>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-medium text-accent-foreground shadow-lg hover:opacity-90 md:bottom-6 md:right-6"
          aria-label="Buka asisten AI"
        >
          <Bot className="size-5" aria-hidden="true" />
          Tanya AI
        </button>
      ) : null}

      {open ? (
        <div
          className="fixed inset-x-2 bottom-20 z-40 flex max-h-[70dvh] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl md:inset-x-auto md:right-6 md:bottom-6 md:w-96"
          role="dialog"
          aria-label="Asisten AI"
        >
          <div className="flex items-center justify-between border-b border-border bg-accent px-4 py-3 text-accent-foreground">
            <div className="flex items-center gap-2">
              <Bot className="size-5" aria-hidden="true" />
              <span className="font-semibold">Asisten NgopiJember</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Tutup"
              className="rounded-full p-1 hover:bg-accent/70"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto bg-surface px-4 py-3"
          >
            {messages.length === 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Hai! Saya bisa bantu carikan coffee shop sesuai kebutuhan Anda.
                  Coba salah satu pertanyaan berikut:
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTION_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-foreground hover:border-accent hover:text-accent"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex flex-col",
                  message.role === "user" ? "items-end" : "items-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                    message.role === "user"
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-foreground",
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <span className="mt-1 block text-[10px] opacity-70">
                    {formatTime(message.createdAt)}
                  </span>
                </div>
                {message.shops && message.shops.length > 0 ? (
                  <ul className="mt-2 w-full max-w-[95%] space-y-2">
                    {message.shops.slice(0, 3).map((shop) => (
                      <li
                        key={shop.id}
                        className="rounded-xl border border-border bg-background p-2 text-xs"
                      >
                        <Link
                          href={`/coffee-shops/${shop.slug}`}
                          className="font-medium text-foreground hover:underline"
                        >
                          {shop.name}
                        </Link>
                        <p className="text-muted-foreground">
                          {shop.address}
                        </p>
                        <p className="text-muted-foreground">
                          Rating {shop.rating.toFixed(1)} · {shop.priceLabel}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}

            {sendMutation.isPending ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MessageCircle className="size-4 animate-pulse" aria-hidden="true" />
                Asisten sedang berpikir...
              </div>
            ) : null}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              const trimmed = draft.trim();
              if (!trimmed || sendMutation.isPending) return;
              void sendMessage(trimmed);
            }}
            className="flex items-center gap-2 border-t border-border bg-surface px-3 py-2"
          >
            <input
              type="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Tulis pesan..."
              className="h-10 flex-1 rounded-full border border-input bg-background px-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button
              type="submit"
              disabled={!draft.trim() || sendMutation.isPending}
              className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground hover:opacity-90 disabled:opacity-50"
              aria-label="Kirim"
            >
              <Send className="size-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}