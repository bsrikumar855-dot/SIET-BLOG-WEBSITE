import * as React from "react";
import { api } from "@/lib/api";
import { ContentCard, Pagination, EmptyState, TagChip } from "@/components/shared";
import type { Achievement, Domain, Paginated } from "@/lib/types";

// Static fallbacks for achievements
const FALLBACK_DOMAINS: Domain[] = [
  { slug: "machine-learning", name: "Machine Learning", count: 42 },
  { slug: "robotics", name: "Robotics", count: 19 },
  { slug: "campus-research", name: "Campus Research", count: 27 },
  { slug: "ethics", name: "AI Ethics", count: 12 },
];

const FALLBACK_ACHIEVEMENTS: Achievement[] = [
  {
    id: "ac1",
    slug: "smart-india-hackathon-2026",
    title: "First place win at national Smart India Hackathon 2026",
    description: "The AI Research Lab team won first place for their real-time edge translation system for agricultural diagnostics.",
    student: {
      id: "s1",
      name: "Sanjay Kumar",
      role: "Team Lead",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    },
    department: "Artificial Intelligence and Data Science",
    year: 2026,
    type: "Hackathon",
    domain: FALLBACK_DOMAINS[0],
    gallery: [
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=900&q=80",
    ],
    certificateUrl: "https://example.com/sih-2026-cert.pdf",
    projectLinks: [
      { label: "GitHub Repository", url: "https://github.com/siet-ai/sih-2026" },
      { label: "Project Demo", url: "https://sih2026.siet.edu" }
    ],
    likes: 32,
    bookmarked: false,
  },
  {
    id: "ac2",
    slug: "ieee-robotics-paper",
    title: "IEEE robotics paper on low-cost LiDAR calibration accepted",
    description: "A student paper analyzing uncertainty parameters in local mapping rigs was published in the IEEE Robotics Letters journal.",
    student: {
      id: "s2",
      name: "Pooja Hegde",
      role: "Lead Author",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
    },
    department: "Computer Science",
    year: 2025,
    type: "Publication",
    domain: FALLBACK_DOMAINS[1],
    gallery: [
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
    ],
    certificateUrl: "https://example.com/ieee-paper-cert.pdf",
    projectLinks: [
      { label: "IEEE Publisher Link", url: "https://ieeexplore.ieee.org" }
    ],
    likes: 45,
    bookmarked: false,
  },
  {
    id: "ac3",
    slug: "autonomous-rover-demo",
    title: "Autonomous navigation rover successfully demoed to board",
    description: "Students successfully demonstrated a micro-RTOS rover steering and mapping a warehouse simulation layout.",
    student: {
      id: "s3",
      name: "Hari Prasad",
      role: "Hardware Architect",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    },
    department: "Mechatronics",
    year: 2025,
    type: "Project",
    domain: FALLBACK_DOMAINS[1],
    gallery: [
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=80",
    ],
    projectLinks: [
      { label: "Demo Video", url: "https://youtube.com/siet-rover" }
    ],
    likes: 21,
    bookmarked: false,
  }
];

const TYPES = [
  { label: "All Types", value: "" },
  { label: "Hackathons", value: "Hackathon" },
  { label: "Projects", value: "Project" },
  { label: "Publications", value: "Publication" },
];

const YEARS = [
  { label: "All Years", value: "" },
  { label: "2026", value: "2026" },
  { label: "2025", value: "2025" },
  { label: "2024", value: "2024" },
];

const DEPARTMENTS = [
  { label: "All Departments", value: "" },
  { label: "AI & DS", value: "Artificial Intelligence and Data Science" },
  { label: "Computer Science", value: "Computer Science" },
  { label: "Mechatronics", value: "Mechatronics" },
];

type SearchParams = Promise<{
  type?: string;
  year?: string;
  department?: string;
  page?: string;
}>;

export default async function MagazinePage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const activeType = searchParams.type || "";
  const activeYear = searchParams.year || "";
  const activeDept = searchParams.department || "";
  const pageNum = parseInt(searchParams.page || "1", 10);

  let achievements: Achievement[] = [];
  let currentPage = pageNum;
  let totalPages = 1;
  let isPaginated = true;

  try {
    if (activeType) {
      const res = await api.magByType(activeType);
      achievements = res.items;
      currentPage = res.page;
      totalPages = res.pages;

      if (activeYear) {
        achievements = achievements.filter((a) => a.year.toString() === activeYear);
      }
    } else if (activeYear) {
      const res = await api.magByYear(parseInt(activeYear, 10));
      achievements = res.items;
      currentPage = res.page;
      totalPages = res.pages;
    } else {
      const q = `?page=${pageNum}`;
      const res = await api.magazine(q);
      achievements = res.items;
      currentPage = res.page;
      totalPages = res.pages;
    }
  } catch (error) {
    console.warn("Magazine API failed. Falling back to static mock achievements.", error);
    let filtered = [...FALLBACK_ACHIEVEMENTS];
    if (activeType) {
      filtered = filtered.filter((a) => a.type.toLowerCase() === activeType.toLowerCase());
    }
    if (activeYear) {
      filtered = filtered.filter((a) => a.year.toString() === activeYear);
    }
    achievements = filtered;
    currentPage = 1;
    totalPages = 1;
    isPaginated = false;
  }

  // Filter department client-side (no dedicated API endpoint exists in §6)
  if (activeDept) {
    achievements = achievements.filter((a) => a.department === activeDept);
    isPaginated = false; // client-side filter invalidates absolute API pagination count
  }

  // Query-param URL builders for the filters
  const buildHref = (key: string, value: string) => {
    const params = new URLSearchParams();
    if (key === "type") {
      if (value) params.set("type", value);
      if (activeYear) params.set("year", activeYear);
      if (activeDept) params.set("department", activeDept);
    } else if (key === "year") {
      if (activeType) params.set("type", activeType);
      if (value) params.set("year", value);
      if (activeDept) params.set("department", activeDept);
    } else if (key === "department") {
      if (activeType) params.set("type", activeType);
      if (activeYear) params.set("year", activeYear);
      if (value) params.set("department", value);
    }
    const qs = params.toString();
    return `/magazine${qs ? `?${qs}` : ""}`;
  };

  return (
    <main className="kitchen-page">
      {/* Header */}
      <header className="flex flex-col gap-2 reveal">
        <p className="eyebrow">SIET Magazine</p>
        <h1 className="font-display text-h1 font-semibold leading-tight text-ink">
          Student Achievements
        </h1>
      </header>

      {/* Filter Dashboard */}
      <div className="flex flex-col gap-4 py-4 border-y border-line reveal">
        {/* Type Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-util text-eyebrow text-ink-soft uppercase w-20">Type:</span>
          <div className="flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <TagChip
                key={t.value}
                active={activeType === t.value}
                label={t.label}
                href={buildHref("type", t.value)}
              />
            ))}
          </div>
        </div>

        {/* Year Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-util text-eyebrow text-ink-soft uppercase w-20">Year:</span>
          <div className="flex flex-wrap gap-2">
            {YEARS.map((y) => (
              <TagChip
                key={y.value}
                active={activeYear === y.value}
                label={y.label}
                href={buildHref("year", y.value)}
              />
            ))}
          </div>
        </div>

        {/* Department Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-util text-eyebrow text-ink-soft uppercase w-20">Dept:</span>
          <div className="flex flex-wrap gap-2">
            {DEPARTMENTS.map((d) => (
              <TagChip
                key={d.value}
                active={activeDept === d.value}
                label={d.label}
                href={buildHref("department", d.value)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      {achievements.length > 0 ? (
        <div className="card-grid">
          {achievements.map((item) => (
            <ContentCard key={item.id} variant="achievement" item={item} />
          ))}
        </div>
      ) : (
        <EmptyState actionHref="/magazine" actionLabel="Clear all filters" />
      )}

      {/* Pagination */}
      {isPaginated && totalPages > 1 && (
        <div className="flex justify-center pt-8 border-t border-line">
          <Pagination
            page={currentPage}
            pages={totalPages}
            basePath={`/magazine`}
          />
        </div>
      )}
    </main>
  );
}
