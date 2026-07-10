import * as React from "react";
import { ObamaCardStack, ObamaHorizontalTimeline } from "@/components/signature/ObamaSlideAnimations";

const SLIDE_ITEMS = [
  {
    id: "slide1",
    number: "01",
    category: "Foundation & Vision",
    title: "Bridging AI Research & Institutional Practice",
    description: "The SIET AI Research Lab was conceived as an open collaborative where students develop resource-efficient models, moving theoretical studies into physical, compiled, and benchmarked prototypes.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
    link: "/about"
  },
  {
    id: "slide2",
    number: "02",
    category: "Robotics & Edge Systems",
    title: "Autonomous Corridor Navigation & Mapping",
    description: "Deploying custom Real-Time OS rovers mapping campus pathways. Our teams calibrate low-cost LiDAR and multi-spectral cameras to design highly reliable spatial awareness algorithms.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
    link: "/magazine"
  },
  {
    id: "slide3",
    number: "03",
    category: "Natural Language Processing",
    title: "Retrieval-Augmented Generation (RAG) at Scale",
    description: "Engineering secure retrieval models targeting large university course files. We benchmark accuracy metrics, source references, and context precision on resource-constrained hardware.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    link: "/articles"
  },
  {
    id: "slide4",
    number: "04",
    category: "Student Achievements",
    title: "National Recognition & Hackathon Victories",
    description: "Our lab delegates compete globally. From Smart India Hackathon wins to accepted conference publications, student milestones are registered as permanent commits on the SIET News index.",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    link: "/news"
  }
];

const TIMELINE_EVENTS = [
  {
    year: "2024",
    category: "Conception",
    title: "Drafting the AI Research Lab charter",
    description: "Faculties and students meet to propose an open-source development and research program, centering hardware-constrained deep learning."
  },
  {
    year: "2025",
    category: "Robotics Core",
    title: "Benchmarks for indoor mapping rovers",
    description: "The robotics division calibrates multi-sensor suites and registers autonomous navigation logs on student clusters."
  },
  {
    year: "2026",
    category: "Hackathon Win",
    title: "First place at Smart India Hackathon",
    description: "Winning national recognition for an edge agricultural translation program assisting localized crop disease analysis."
  },
  {
    year: "2027",
    category: "Open Research",
    title: "Five publications accepted in IEEE",
    description: "Publishing research papers on model transparency, responsible dataset collection, and green AI energy footprints."
  }
];

export default function ShowcasePage() {
  return (
    <div className="w-full bg-paper min-h-screen">
      {/* Introduction Banner */}
      <section className="px-8 lg:px-16 pt-32 pb-16 flex flex-col gap-4 reveal">
        <p className="eyebrow text-accent">Motion & Interaction Showcase</p>
        <h1 className="font-display text-masthead font-semibold leading-none text-ink">
          Interactive Animations
        </h1>
        <p className="font-body text-lede text-ink-soft max-w-2xl leading-relaxed">
          Replicating the premium motion components from the Columbia Obama Oral History digital project. 
          Scroll down to experience the sticky stacking slides and the horizontal milestone rail.
        </p>
      </section>

      {/* Animation Component 1: Sticky Card Stack Storytelling */}
      <section className="border-t border-line">
        <ObamaCardStack slides={SLIDE_ITEMS} />
      </section>

      {/* Mid-point Gap Content */}
      <section className="px-8 lg:px-16 py-32 bg-paper border-y border-line flex flex-col items-center text-center gap-6">
        <p className="font-util text-eyebrow text-accent tracking-widest uppercase">Transition</p>
        <h2 className="font-display text-h1 font-semibold text-ink max-w-xl leading-tight">
          Seamlessly Moving into Chronological Milestones
        </h2>
        <p className="font-body text-body text-ink-soft max-w-lg leading-relaxed">
          The scrolling velocity transforms directly from slide overlays into a horizontal progression track.
        </p>
      </section>

      {/* Animation Component 2: Horizontal Scroll Timeline */}
      <section>
        <ObamaHorizontalTimeline events={TIMELINE_EVENTS} />
      </section>

      {/* Footer CTA */}
      <section className="px-8 lg:px-16 py-24 bg-paper-2 border-t border-line flex flex-col items-center text-center gap-4">
        <h3 className="font-display text-h2 font-semibold text-ink">Integrated Motion Patterns</h3>
        <p className="font-body text-xs text-ink-soft max-w-md leading-relaxed">
          Both components are fully responsive, performant, and render client-side using React window metrics and CSS compositing.
        </p>
      </section>
    </div>
  );
}
