import { PageContainer } from "@/components/shared/PageContainer";
import { AchievementListing } from "@/features/magazine/components/AchievementListing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SIET Magazine & Achievements",
  description: "Explore students athletic championships, smart hackathon titles, and faculty publications at Sri Shakthi Institute.",
};

export default function MagazinePage() {
  return (
    <PageContainer>
      <AchievementListing />
    </PageContainer>
  );
}
