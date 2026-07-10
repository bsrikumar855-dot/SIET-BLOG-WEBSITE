import Image from "next/image";
import Link from "next/link";
import type { Achievement, Article, NewsItem } from "@/lib/types";
import { BookmarkButton, LikeButton, ShareButton } from "./ActionButtons";
import { TagChip } from "./TagChip";

type ContentCardProps =
  | { variant: "news"; item: NewsItem }
  | { variant: "article"; item: Article }
  | { variant: "achievement"; item: Achievement };

function formatDate(value?: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en", { month: "short", day: "2-digit", year: "numeric" }).format(
    new Date(value),
  );
}

export function ContentCard(props: ContentCardProps) {
  const { variant, item } = props;
  const href =
    variant === "news"
      ? `/news/${item.slug}`
      : variant === "article"
        ? `/articles/${item.slug}`
        : `/magazine/${item.slug}`;
  const image =
    variant === "news" ? item.image : variant === "article" ? item.cover : item.gallery[0];
  const excerpt =
    variant === "news" ? item.aiSummary : variant === "article" ? item.excerpt : item.description;
  const date = variant === "achievement" ? `${item.year}` : formatDate(item.publishedAt);
  const footer =
    variant === "news"
      ? `${item.sourceName} · ${item.likes} likes`
      : variant === "article"
        ? `${item.author.name} · ${item.readingMinutes} min read`
        : `${item.student.name} · ${item.department}`;

  return (
    <article className="content-card reveal group">
      <Link className="content-card-media relative" href={href}>
        {image ? (
          <Image
            src={image}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="ruled-placeholder" aria-hidden="true">
            <span>No image</span>
          </div>
        )}
      </Link>
      <div className="content-card-body">
        <p className="eyebrow">
          {item.domain.name} · {date}
        </p>
        <h3>
          <Link href={href}>{item.title}</Link>
        </h3>
        <p>{excerpt}</p>
      </div>
      <div className="content-card-tags">
        {variant === "achievement" ? (
          <TagChip label={item.type} />
        ) : (
          item.tags.slice(0, 2).map((tag) => <TagChip key={tag.slug} label={tag.name} />)
        )}
      </div>
      <footer className="content-card-footer">
        <span>{footer}</span>
        <div>
          {"likes" in item ? (
            <LikeButton
              type={variant === "news" ? "news" : variant === "article" ? "articles" : "magazine"}
              slug={item.slug}
              count={item.likes}
            />
          ) : null}
          {"bookmarked" in item ? (
            <BookmarkButton
              type={variant === "news" ? "news" : variant === "article" ? "articles" : "magazine"}
              slug={item.slug}
              bookmarked={item.bookmarked}
            />
          ) : null}
          <ShareButton title={item.title} url={href} />
        </div>
      </footer>
    </article>
  );
}
