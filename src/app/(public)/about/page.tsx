import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumb } from "@/components/shared";

const TEAM_MEMBERS = [
  {
    id: "t1",
    name: "Shreekumar B",
    role: "Lead Architect · Frontend",
    avatar: "https://github.com/bsrikumar855-dot.png",
    github: "https://github.com/bsrikumar855-dot",
    linkedin: "https://www.linkedin.com/in/shreekumar-b-103922381/",
    tag: "Frontend",
    description:
      "Designed and architected the entire frontend system — from the editorial design system to the ESPN-inspired scroll animations and responsive layout infrastructure.",
  },
  {
    id: "t2",
    name: "Suchit Sachin Chopade",
    role: "Lead Backend",
    avatar: "https://github.com/suchitchopade3110-arch.png",
    github: "https://github.com/suchitchopade3110-arch",
    linkedin: "https://www.linkedin.com/in/suchit-chopade-635347338/",
    tag: "Backend",
    description:
      "Built and maintains the FastAPI backend, database schema, authentication layer, and API integrations that power the SIET News platform at scale.",
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

      {/* ── DOMINANT TEAM SECTION ── */}
      <section className="py-16 border-t border-line">
        <div className="mb-12">
          <p className="eyebrow">Built by</p>
          <h2 className="font-display text-h1 font-semibold text-ink mt-2 leading-none">
            The Core Team
          </h2>
          <p className="font-body text-body text-ink-soft mt-3 max-w-xl">
            Two engineers who designed, built, and shipped the SIET News platform from the ground up.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.id}
              className="about-team-card"
            >
              {/* Top: avatar + name row */}
              <div className="about-team-top">
                <div className="about-team-avatar-wrap">
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    width={96}
                    height={96}
                    className="about-team-avatar"
                    unoptimized
                  />
                </div>
                <div className="about-team-identity">
                  <span className="about-team-tag">{member.tag}</span>
                  <h3 className="about-team-name">{member.name}</h3>
                  <p className="about-team-role">{member.role}</p>
                </div>
              </div>

              {/* Bio */}
              <p className="about-team-bio">{member.description}</p>

              {/* Links */}
              <div className="about-team-links">
                <Link
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-team-link"
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                  GitHub
                </Link>
                <Link
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-team-link about-team-link-linkedin"
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
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
