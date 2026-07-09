import Image from "next/image";
import Link from "next/link";
import { User, BadgeCheck, BookOpen, Mail } from "lucide-react";
import { User as UserType } from "@/types";
import { Badge } from "@/components/ui/badge";

interface AuthorCardProps {
  author: UserType;
  bio?: string;
}

export function AuthorCard({ author, bio = "Faculty investigator/Student builder at Sri Shakthi Institute of Engineering and Technology, specializing in emerging domains." }: AuthorCardProps) {
  return (
    <div className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Avatar Container */}
      <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full border border-border bg-muted overflow-hidden shrink-0">
        {author.avatarUrl ? (
          <Image
            src={author.avatarUrl}
            alt={author.name}
            fill
            sizes="(max-width: 640px) 64px, 80px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground bg-muted">
            <User className="h-8 w-8" />
          </div>
        )}
      </div>

      {/* Details Area */}
      <div className="space-y-3 w-full text-center sm:text-left">
        <div className="space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
            <h4 className="font-bold text-base text-foreground leading-none">
              {author.name}
            </h4>
            {author.role === "admin" && (
              <BadgeCheck className="h-4 w-4 text-primary" />
            )}
            <Badge variant="secondary" className="text-[9px] px-1.5 py-0 font-medium">
              {author.role.toUpperCase()}
            </Badge>
          </div>
          
          <p className="text-xs text-muted-foreground font-medium">
            {author.department}
          </p>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed max-w-xl mx-auto sm:mx-0">
          {bio}
        </p>

        {/* Action icons */}
        <div className="flex items-center justify-center sm:justify-start gap-4 pt-1 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" />
            <span>{author.email}</span>
          </span>
          <Link
            href={`/blog?authorId=${author.id}`}
            className="flex items-center gap-1 hover:text-primary transition-colors font-semibold"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>View Publications</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
