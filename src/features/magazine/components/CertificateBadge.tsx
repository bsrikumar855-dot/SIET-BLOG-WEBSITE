import { Certificate } from "../types";
import { Award, Calendar, ExternalLink } from "lucide-react";

interface CertificateBadgeProps {
  certificates: Certificate[];
}

export function CertificateBadge({ certificates }: CertificateBadgeProps) {
  if (!certificates || certificates.length === 0) return null;

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Verified Project Certificates
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="flex items-start justify-between gap-4 rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-4 shadow-sm group"
          >
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                <Award className="h-5 w-5" />
              </div>
              <div className="space-y-1 text-xs">
                <h5 className="font-bold text-foreground leading-tight">{cert.title}</h5>
                <p className="text-muted-foreground text-[10px] font-semibold">
                  Authority: {cert.authority}
                </p>
                <span className="text-muted-foreground/60 text-[9px] flex items-center gap-1">
                  <Calendar className="h-2.5 w-2.5" />
                  {cert.issueDate}
                </span>
              </div>
            </div>

            {cert.credentialUrl && (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-md p-1 hover:bg-muted text-muted-foreground hover:text-primary transition-colors self-start"
                aria-label={`View certificate for ${cert.title}`}
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
