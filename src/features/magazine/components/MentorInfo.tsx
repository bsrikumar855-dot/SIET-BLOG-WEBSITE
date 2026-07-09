import { Mentor } from "../types";
import { UserCheck, Mail, Briefcase } from "lucide-react";

interface MentorInfoProps {
  mentors: Mentor[];
}

export function MentorInfo({ mentors }: MentorInfoProps) {
  if (!mentors || mentors.length === 0) return null;

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Faculty Guidance & Mentors
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mentors.map((mentor, index) => (
          <div
            key={index}
            className="flex items-start gap-3 rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-4 shadow-sm"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserCheck className="h-4.5 w-4.5" />
            </div>
            
            <div className="space-y-1 text-xs">
              <h5 className="font-bold text-foreground leading-none">{mentor.name}</h5>
              <p className="text-muted-foreground font-mono text-[10px] flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                <span>{mentor.role} • {mentor.department}</span>
              </p>
              <a
                href={`mailto:${mentor.email}`}
                className="text-primary hover:underline flex items-center gap-1 text-[10px] pt-1"
              >
                <Mail className="h-3 w-3" />
                <span>{mentor.email}</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
