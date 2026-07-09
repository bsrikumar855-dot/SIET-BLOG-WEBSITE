"use client";

import * as React from "react";
import { Achievement, AchievementCategory } from "../types";
import { AchievementCard } from "./AchievementCard";
import { SearchBar } from "@/components/shared/SearchBar";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState } from "@/components/shared/EmptyState";
import { BlogCardSkeleton } from "@/components/shared/LoadingSkeletons";
import { Trophy } from "lucide-react";
import { cn } from "@/utils/cn";

// ==========================================
// MOCK DATA STORAGE
// ==========================================
const MOCK_ACHIEVEMENT_DATA: Achievement[] = [
  {
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
  {
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
  {
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
  {
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
];

const CATEGORIES: { id: AchievementCategory; label: string }[] = [
  { id: "all", label: "All Achievements" },
  { id: "hackathon", label: "Hackathons" },
  { id: "sports", label: "Sports" },
  { id: "academic", label: "Academics" },
  { id: "placement", label: "Placements" },
  { id: "culturals", label: "Culturals" },
];

export function AchievementListing() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<AchievementCategory>("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);

  const itemsPerPage = 3;

  // Filter Logic
  const filteredAchievements = React.useMemo(() => {
    return MOCK_ACHIEVEMENT_DATA.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.winners.some((w) => w.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredAchievements.length / itemsPerPage);
  const paginatedItems = React.useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredAchievements.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredAchievements, currentPage]);

  const handleSearch = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleCategory = (category: AchievementCategory) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex items-center gap-2.5 border-b border-border/40 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Trophy className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">SIET Hall of Fame</h1>
          <p className="text-sm text-muted-foreground">
            Celebrating technical, athletic, and academic milestones achieved by our students and faculty
          </p>
        </div>
      </div>

      {/* Search & Custom Category Filter Pills */}
      <div className="space-y-4">
        <SearchBar onSearchChange={handleSearch} />
        
        {/* Category Pills (Horizontal Scroll Container) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategory(cat.id)}
                className={cn(
                  "whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow"
                    : "border border-border/80 bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Feed */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BlogCardSkeleton />
            <BlogCardSkeleton />
          </div>
        ) : paginatedItems.length === 0 ? (
          <EmptyState
            title="No achievements logged"
            description="We couldn't find any achievements matching your parameters. Adjust filters to browse active cards."
            actionText="Reset All Filters"
            onAction={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedItems.map((item) => (
                <AchievementCard key={item.id} achievement={item} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        )}
      </div>
    </div>
  );
}
