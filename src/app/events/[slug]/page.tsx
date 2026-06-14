import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { BottomNav } from "@/components/shared/bottom-nav";
import { EventDetailClient } from "@/features/event/components/event-detail-client";
import { getEvent } from "@/features/event/services/event.service";
import { ApiError } from "@/types/api";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const event = await getEvent(slug);
    return {
      title: event.title,
      description: event.description,
    };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return { title: "Event tidak ditemukan" };
    }
    return { title: "Detail Event" };
  }
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main
        id="main-content"
        className="mx-auto w-full max-w-[1280px] flex-1 px-6 py-10 pb-24 md:pb-0"
      >
        <EventDetailClient slug={slug} />
      </main>
      <BottomNav />
    </div>
  );
}