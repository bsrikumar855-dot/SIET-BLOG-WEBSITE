import { PageContainer } from "@/components/shared/PageContainer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen, GraduationCap, Trophy, Users } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Sri Shakthi Portal",
  description: "Learn about the mission, statistics, and academic research goals of the SIET blog and publication ecosystem.",
};

const STATS = [
  { id: "s-1", label: "Research Publications", value: "350+", icon: <BookOpen className="h-5 w-5 text-primary" /> },
  { id: "s-2", label: "Student Contributors", value: "1,200+", icon: <Users className="h-5 w-5 text-primary" /> },
  { id: "s-3", label: "National Achievements", value: "45+", icon: <Trophy className="h-5 w-5 text-primary" /> },
  { id: "s-4", label: "Academic Departments", value: "12", icon: <GraduationCap className="h-5 w-5 text-primary" /> },
];

export default function AboutPage() {
  return (
    <PageContainer className="space-y-12">
      {/* Title Header */}
      <div className="border-b border-border/40 pb-4 text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Sri Shakthi Knowledge Hub</h1>
        <p className="text-sm text-muted-foreground">
          Empowering student builders and faculty investigators to publish research and share project milestones
        </p>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {STATS.map((stat) => (
          <Card key={stat.id} className="bg-card/50 backdrop-blur-sm shadow-sm text-center">
            <CardHeader className="p-4 pb-2 flex flex-col items-center justify-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/5 text-primary mb-2">
                {stat.icon}
              </div>
              <CardTitle className="text-2xl font-bold text-foreground leading-none">
                {stat.value}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-xs text-muted-foreground font-semibold">
              {stat.label}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Vision Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <Card className="bg-card/50 backdrop-blur-sm shadow-sm flex flex-col">
          <CardHeader className="p-6">
            <CardTitle className="text-lg font-bold">Our Vision</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed flex-1">
            To build a collaborative, open-access knowledge repository that showcases Sri Shakthi Institute of Engineering and Technology&apos;s academic advancements and engineering achievements. By providing student builders with writing frameworks and code citation tools, we prepare the next generation of engineers for technical communication excellence.
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm shadow-sm flex flex-col">
          <CardHeader className="p-6">
            <CardTitle className="text-lg font-bold">Research Ecosystem</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed flex-1">
            Academic research requires transparent reference tracking and robust citation structures. Through the SIET portal, faculty members and department heads can verify project reports, collaborate with national labs (such as smart grid and edge-computing models), and index publications directly to IEEE platforms.
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
