import * as React from "react";
import Link from "next/link";
import { Breadcrumb, AuthorCard } from "@/components/shared";
import type { Author } from "@/lib/types";

// Placeholder Team Roster
const TEAM_MEMBERS: Author[] = [
  {
    id: "t1",
    name: "Dr. S. Brikumar",
    role: "Lab Director & Professor",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    department: "Artificial Intelligence and Data Science",
  },
  {
    id: "t2",
    name: "Kaviya Raman",
    role: "Senior Student Researcher",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
    department: "Artificial Intelligence and Data Science",
  },
  {
    id: "t3",
    name: "Sanjay Kumar",
    role: "Systems & Edge Lead",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    department: "Computer Science",
  },
];

export default function AboutPage() {
  return (
    <main className="kitchen-page">
      {/* Header */}
      <header className="space-y-4">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About" }]} />
        <h1 className="font-display text-h1 font-semibold leading-tight text-ink">
          About the Research Lab
        </h1>
      </header>

      {/* Narrative Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start py-4">
        {/* Main story */}
        <div className="lg:col-span-8 space-y-6">
          <p className="font-body text-lede text-ink leading-relaxed font-medium">
            Founded within the Sri Shakthi Institute of Engineering and Technology, the AI Research Lab serves as a collaborative sandbox where undergraduate students and faculty mentors build, evaluate, and archive practical intelligent systems.
          </p>
          <div className="font-body text-body text-ink space-y-4 leading-relaxed">
            <p>
              We believe that engineering education is best served through the rigor of construction. Rather than relying solely on theoretical exercises, our students work on active projects: deploying quantized language models on resource-constrained campus hardware, developing low-cost LiDAR positioning rigs for robotics, and establishing transparent model evaluations.
            </p>
            <p>
              This publication, SIET News, stands as the permanent log of that work. Every news update, research note, and student win cataloged in these pages represents an active commit, a physical prototype, or a validated benchmark created within our department classrooms.
            </p>
          </div>
        </div>

        {/* Sidebar Mission block */}
        <div className="lg:col-span-4 border border-line bg-paper-2 p-6 space-y-4">
          <p className="font-util text-eyebrow text-accent uppercase tracking-wider">
            Our Mission
          </p>
          <h2 className="font-display text-h3 font-medium text-ink leading-tight">
            Rigorous Construction, Open Documentation
          </h2>
          <p className="font-body text-xs text-ink-soft leading-relaxed">
            To bridge the gap between AI theory and deployment by training student engineers to build resource-efficient, ethically-documented systems, and publishing all results openly.
          </p>
        </div>
      </section>

      {/* Roster / Team Grid */}
      <section className="py-8 border-t border-line space-y-6">
        <div>
          <p className="eyebrow">Roster</p>
          <h2 className="font-display text-h2 font-medium text-ink mt-2">
            Lab Contributors
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEAM_MEMBERS.map((member) => (
            <AuthorCard key={member.id} author={member} />
          ))}
        </div>
      </section>

      {/* Link to Contact */}
      <section className="py-8 border-t border-line flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h3 className="font-display text-h3 font-medium text-ink">Have questions or want to collaborate?</h3>
          <p className="font-body text-xs text-ink-soft mt-1">Get in touch with our researchers and coordinators.</p>
        </div>
        <Link
          href="/contact"
          className="explore-link font-util text-eyebrow uppercase tracking-wider inline-block text-accent border border-line px-5 py-2.5 hover:bg-paper-2 transition-colors"
        >
          Contact the Lab →
        </Link>
      </section>
    </main>
  );
}
