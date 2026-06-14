import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { BottomNav } from "@/components/shared/bottom-nav";
import { CommunityDetailClient } from "@/features/community/components/community-detail-client";
import { getCommunity } from "@/features/community/services/community.service";
import { ApiError } from "@/types/api";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const community = await getCommunity(slug);
    return {
      title: community.name,
      description: community.description,
    };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return { title: "Komunitas tidak ditemukan" };
    }
    return { title: "Detail Komunitas" };
  }
}

export default async function CommunityDetailPage({ params }: PageProps) {
  const { slug } = await params;
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main
        id="main-content"
        className="mx-auto w-full max-w-[1280px] flex-1 px-6 py-10 pb-24 md:pb-0"
      >
        <CommunityDetailClient slug={slug} />
      </main>
      <BottomNav />
    </div>
  );
}