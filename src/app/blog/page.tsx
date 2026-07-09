import { PageContainer } from "@/components/shared/PageContainer";
import { ArticleListing } from "@/features/blog/components/ArticleListing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publications Hub",
  description: "Browse academic articles, research briefs, and placement guides published by SIET student and faculty authors.",
};

export default function BlogPage() {
  return (
    <PageContainer>
      <ArticleListing />
    </PageContainer>
  );
}
