import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import {
  Breadcrumb,
  SectionRail,
  ContentCard,
  LikeButton,
  BookmarkButton,
  ShareButton,
} from "@/components/shared";
import { GalleryLightbox } from "@/components/signature/GalleryLightbox";
import type { Achievement, Domain } from "@/lib/types";

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
    description: "The AI Research Lab team won first place for their real-time edge translation system for agricultural diagnostics.\n\nThe system utilizes heavily quantized transformer weights running on standard edge hardware to translate and process local language prompts from farmers into diagnostic queries. Our student team worked overnight in Coimbatore and Delhi to run live tests across various plant datasets.",
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
    ]
  },
  {
    id: "ac2",
    slug: "ieee-robotics-paper",
    title: "IEEE robotics paper on low-cost LiDAR calibration accepted",
    description: "A student paper analyzing uncertainty parameters in local mapping rigs was published in the IEEE Robotics Letters journal.\n\nBy evaluating error variances across different ambient reflection environments, the study models LiDAR sensor offsets to calibrate local hardware without expensive lab rigs.",
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
    ]
  },
  {
    id: "ac3",
    slug: "autonomous-rover-demo",
    title: "Autonomous navigation rover successfully demoed to board",
    description: "Students successfully demonstrated a micro-RTOS rover steering and mapping a warehouse simulation layout.\n\nUsing low-latency control logic, the prototype rover detects obstacles and computes real-time trajectories on-board without external network dependencies.",
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
    ]
  }
];

const getFallbackAchievement = (slug: string): Achievement => {
  return (
    FALLBACK_ACHIEVEMENTS.find((a) => a.slug === slug) || {
      id: `ac-fallback-${slug}`,
      slug: slug,
      title: slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      description: "Fallback achievement detail placeholder for offline local development.",
      student: {
        id: "s-fallback",
        name: "Anonymous Scholar",
        role: "Student Innovator",
      },
      department: "Information Technology",
      year: 2025,
      type: "Competition",
      domain: FALLBACK_DOMAINS[0],
      gallery: [],
      projectLinks: [],
    }
  );
};

type Params = Promise<{
  slug: string;
}>;

export default async function AchievementDetailPage(props: { params: Params }) {
  const { slug } = await props.params;

  let item: Achievement;
  let related: Achievement[] = [];

  try {
    item = await api.magBySlug(slug);
  } catch (error) {
    console.warn(`Achievement detail API for slug '${slug}' offline. Loading fallback.`, error);
    item = getFallbackAchievement(slug);
  }

  try {
    const res = await api.magByType(item.type);
    related = res.items.filter((r) => r.slug !== slug).slice(0, 4);
  } catch (error) {
    console.warn("Related achievements API call failed. Using filtered fallbacks.", error);
    related = FALLBACK_ACHIEVEMENTS.filter(
      (r) => (r.domain.slug === item.domain.slug || r.type === item.type) && r.slug !== slug,
    ).slice(0, 4);
    if (related.length === 0) {
      related = FALLBACK_ACHIEVEMENTS.filter((r) => r.slug !== slug).slice(0, 4);
    }
  }

  return (
    <main className="kitchen-page">
      {/* Header & Breadcrumb */}
      <header className="space-y-4">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Magazine", href: "/magazine" },
            { label: item.title },
          ]}
        />
        <h1 className="font-display text-h1 font-semibold leading-tight text-ink">
          {item.title}
        </h1>

        {/* Student Profile Card (reusing the styles of AuthorCard) */}
        <div className="py-4 border-y border-line">
          <article className="author-card">
            {item.student.avatar ? (
              <Image
                src={item.student.avatar}
                alt={item.student.name}
                width={64}
                height={64}
                className="author-card-avatar object-cover"
              />
            ) : (
              <div aria-hidden="true" className="author-card-avatar author-card-placeholder" />
            )}
            <div>
              <h3 className="font-display font-medium text-ink">{item.student.name}</h3>
              <p className="font-util text-eyebrow text-ink-soft uppercase tracking-wider mt-0.5">
                {item.type} · {item.department} · Class of {item.year}
              </p>
            </div>
          </article>
        </div>
      </header>

      {/* Description text */}
      <div className="font-body text-body text-ink space-y-6 max-w-2xl leading-relaxed">
        {item.description.split("\n\n").map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}
      </div>

      {/* Certificate Viewer (if present) */}
      {item.certificateUrl && (
        <div className="border border-line bg-paper-2 p-6 flex flex-col sm:flex-row justify-between items-center gap-4 my-8">
          <div className="flex items-center gap-3">
            <span className="text-xl font-util text-accent" role="img" aria-label="document">
              🗂️
            </span>
            <div>
              <h4 className="font-display text-body font-semibold text-ink">
                Official Achievement Certificate
              </h4>
              <p className="font-util text-eyebrow text-ink-soft uppercase">
                academic credentials verified
              </p>
            </div>
          </div>
          <a
            href={item.certificateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="explore-link font-util text-eyebrow uppercase tracking-wider inline-flex items-center gap-1 hover:text-accent border border-line px-4 py-2 hover:bg-paper-3 transition-colors"
          >
            View Certificate <span className="text-[10px] font-sans">↗</span>
          </a>
        </div>
      )}

      {/* Gallery component with interactive lightbox */}
      {item.gallery && item.gallery.length > 0 && <GalleryLightbox images={item.gallery} />}

      {/* Project References (if present) */}
      {item.projectLinks && item.projectLinks.length > 0 && (
        <div className="space-y-3 my-8">
          <h4 className="font-util text-eyebrow text-ink-soft uppercase tracking-wider">
            Project References
          </h4>
          <div className="flex flex-wrap gap-3">
            {item.projectLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-line bg-paper-2 px-3 py-1.5 text-xs font-util uppercase tracking-wider text-ink hover:text-accent hover:border-accent transition-colors"
              >
                {link.label} <span className="text-[9px] font-sans">↗</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Social Interactions Action Bar */}
      <div className="flex items-center gap-4 py-4 border-y border-line my-8">
        <LikeButton count={(item as any).likes || 0} />
        <BookmarkButton />
        <ShareButton title={item.title} url={`/magazine/${item.slug}`} />
      </div>

      {/* Related Achievements Rail */}
      {related.length > 0 && (
        <div className="pt-8 border-t border-line">
          <SectionRail
            eyebrow="Recommendations"
            title="Related Wins"
            count={related.length}
            countLabel="Achievements"
            exploreHref="/magazine"
            exploreLabel="Explore all achievements"
          >
            {related.map((r) => (
              <ContentCard key={r.id} variant="achievement" item={r} />
            ))}
          </SectionRail>
        </div>
      )}
    </main>
  );
}
