import Link from "next/link";

type PaginationProps = {
  page: number;
  pages: number;
  basePath?: string;
};

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

export function Pagination({ page, pages, basePath = "#" }: PaginationProps) {
  const previous = Math.max(page - 1, 1);
  const next = Math.min(page + 1, pages);
  const separator = basePath.includes("?") ? "&" : "?";

  return (
    <nav aria-label="Pagination" className="pagination">
      <Link aria-label="Previous page" href={`${basePath}${separator}page=${previous}`}>
        ‹
      </Link>
      <span>
        {pad(page)} / {pad(pages)}
      </span>
      <Link aria-label="Next page" href={`${basePath}${separator}page=${next}`}>
        ›
      </Link>
    </nav>
  );
}
