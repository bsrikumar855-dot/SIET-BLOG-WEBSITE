import Image from "next/image";
import type { Author } from "@/lib/types";

type AuthorCardProps = {
  author: Author;
};

export function AuthorCard({ author }: AuthorCardProps) {
  return (
    <article className="author-card">
      {author.avatar ? (
        <Image
          src={author.avatar}
          alt={author.name}
          width={64}
          height={64}
          className="author-card-avatar object-cover"
        />
      ) : (
        <div aria-hidden="true" className="author-card-avatar author-card-placeholder" />
      )}
      <div>
        <h3>{author.name}</h3>
        <p>
          {author.role}
          {author.role && author.department ? " · " : ""}
          {author.department}
        </p>
      </div>
    </article>
  );
}
