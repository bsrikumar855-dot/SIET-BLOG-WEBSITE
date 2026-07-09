import Link from "next/link";

const columns = [
  {
    title: "Archive",
    links: [
      ["News", "/news"],
      ["Articles", "/articles"],
      ["Magazine", "/magazine"],
      ["Domains", "/domains"],
    ],
  },
  {
    title: "Lab",
    links: [
      ["About", "/about"],
      ["Contact", "/contact"],
      ["Search", "/search"],
      ["Admin", "/admin"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="footer">
      <section className="footer-newsletter" aria-labelledby="newsletter-title">
        <div>
          <p className="eyebrow">Newsletter</p>
          <h2 id="newsletter-title">Letters from the AI Research Lab</h2>
        </div>
        <form>
          <label className="sr-only" htmlFor="newsletter-email">
            Email address
          </label>
          <input id="newsletter-email" placeholder="Email address" type="email" />
          <button type="submit">Sign up</button>
        </form>
      </section>

      <div className="footer-grid">
        <Link className="footer-brand" href="/">
          SIET News
        </Link>
        {columns.map((column) => (
          <nav aria-label={column.title} key={column.title}>
            <p className="eyebrow">{column.title}</p>
            {column.links.map(([label, href]) => (
              <Link href={href} key={href}>
                {label}
              </Link>
            ))}
          </nav>
        ))}
      </div>

      <p className="footer-credit">© AI Research Lab · Sri Shakthi Institute of Engineering and Technology</p>
    </footer>
  );
}
