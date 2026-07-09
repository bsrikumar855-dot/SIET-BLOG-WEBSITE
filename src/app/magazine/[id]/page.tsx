import { notFound } from "next/navigation";
import { PageContainer } from "@/components/shared/PageContainer";
import { AchievementDetail } from "@/features/magazine/components/AchievementDetail";
import { Achievement } from "@/features/magazine/types";

// ==========================================
// MOCK DATA STORE matching MOCK_ACHIEVEMENT_DATA
// ==========================================
const MOCK_ACHIEVEMENT_STORE: Record<string, Achievement> = {
  "ac-1": {
    id: "ac-1",
    title: "1st Place Smart India Hackathon (SIH) 2026",
    description: "Competing against 200+ teams nationwide in the Smart India Hackathon software finals, our IT students engineered an autonomous logistics routing platform that optimizes delivery paths by 30%.",
    category: "hackathon",
    winners: ["Sanjay Kumar", "Abishek R", "Keerthana M"],
    date: "2026-07-02T10:00:00Z",
    mentors: [
      { name: "Dr. Arul Prasad", email: "arulprasad@siet.edu.in", role: "Professor", department: "Information Technology" },
    ],
    certificates: [
      { id: "c-1", title: "Smart India Hackathon Winners Certificate", authority: "Ministry of Education, Govt of India", issueDate: "July 2026", credentialUrl: "https://example.com" },
    ],
    projectLinks: [
      { id: "l-1", label: "GitHub Repository", url: "https://github.com" },
    ],
    gallery: [
      { src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80", alt: "SIH Award Ceremony", caption: "Team receiving the championship trophy at the SIH nodal center." },
    ],
    timeline: [
      { id: "t-1", date: "April 2026", title: "Internal Hackathon Screening", description: "Selected among 30 internal college teams to represent SIET." },
      { id: "t-2", date: "May 2026", title: "Proposal Submission", description: "Design submission accepted by Ministry of Education evaluations." },
      { id: "t-3", date: "July 2026", title: "National Grand Finale", description: "Won first prize under smart logistics category." },
    ],
    views: 1450,
  },
  "ac-2": {
    id: "ac-2",
    title: "Anna University Zone Volleyball Championship Trophy",
    description: "SIET Volleyball Team clinches the zone tournament cup, defeating rival engineering colleges in the final round of the inter-college athletics tournament.",
    category: "sports",
    winners: ["Varun C", "Hari Prasad", "Jeevan Kumar", "Ramesh K"],
    date: "2026-06-28T14:30:00Z",
    mentors: [
      { name: "Mr. R. Selvam", email: "selvam@siet.edu.in", role: "Physical Director", department: "Physical Education" },
    ],
    certificates: [],
    projectLinks: [],
    gallery: [
      { src: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80", alt: "Volleyball Winners", caption: "SIET Volleyball squad holding the championship trophy." },
    ],
    timeline: [],
    views: 890,
  },
  "ac-3": {
    id: "ac-3",
    title: "Faculty honored with Best Young Scientist Award 2026",
    description: "Dr. K. Deepa of ECE department recognized at the National Science Congress for publishing 15 high-impact SCI research papers in renewable semiconductor fields.",
    category: "academic",
    winners: ["Dr. K. Deepa (ECE Faculty)"],
    date: "2026-06-25T11:00:00Z",
    mentors: [],
    certificates: [
      { id: "c-2", title: "Best Young Scientist Credential", authority: "National Academy of Sciences", issueDate: "June 2026" },
    ],
    projectLinks: [],
    gallery: [],
    timeline: [],
    views: 650,
  },
  "ac-4": {
    id: "ac-4",
    title: "Student secures Rs 12 Lakhs CTC package in Placement Drive",
    description: "Final year IT student accepted an offer from a multinational software firm as a Cloud Infrastructure Consultant, setting a campus record.",
    category: "placement",
    winners: ["Karthik Raja (IT Student)"],
    date: "2026-06-20T09:00:00Z",
    mentors: [
      { name: "Prof. K. Vignesh", email: "vignesh.placement@siet.edu.in", role: "Placement Head", department: "Training & Placements" },
    ],
    certificates: [],
    projectLinks: [],
    gallery: [],
    timeline: [],
    views: 980,
  },
};

interface AchievementDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: AchievementDetailPageProps) {
  const { id } = await params;
  const item = MOCK_ACHIEVEMENT_STORE[id];

  if (!item) {
    return {
      title: "Milestone Not Found",
    };
  }

  return {
    title: item.title,
    description: item.description,
  };
}

export default async function AchievementDetailPage({ params }: AchievementDetailPageProps) {
  const { id } = await params;
  const item = MOCK_ACHIEVEMENT_STORE[id];

  if (!item) {
    notFound();
  }

  return (
    <PageContainer>
      <AchievementDetail achievement={item} />
    </PageContainer>
  );
}
