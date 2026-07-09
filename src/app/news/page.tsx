import { PageContainer } from "@/components/shared/PageContainer";
import { NewsListing } from "@/features/news/components/NewsListing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News Portal",
  description: "Browse academic updates, placement drives, and research announcements at Sri Shakthi Institute.",
};

export default function NewsPage() {
  return (
    <PageContainer>
      <NewsListing />
    </PageContainer>
  );
}
