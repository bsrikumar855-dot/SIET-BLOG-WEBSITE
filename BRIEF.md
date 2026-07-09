# SIET News — Build Brief for the Coding Agent

> **Published by:** AI Research Lab · Sri Shakthi Institute of Engineering and Technology (SIET), Coimbatore
> **What it is:** an editorial archive for the department — AI news, student articles, and a record of student achievements (the "Magazine").
> **Design reference:** the Obama Presidency Oral History site (Huncwot). **Goal: match its look faithfully** — warm-cream canvas, near-monochrome, editorial serif, huge feature mosaic, running counters, italic "Explore all →" links. Photography carries the color; the UI stays quiet.
> **Masthead name:** `SIET News`. Credit line: "AI Research Lab · Sri Shakthi Institute of Engineering and Technology".

---

## 0. How to use this brief (read first, agent)

- Build **incrementally, in the phase order in §10.** Finish and verify each phase before the next. Do not scaffold all 40 components at once.
- **Every color, font, and spacing value comes from §2.** Do not invent values or use Tailwind default colors.
- **This is a faithful reproduction of the reference** — see §3. When in doubt, do what the reference does: more whitespace, hairline rules, monochrome, let images provide color.
- The backend is an existing **FastAPI** service. Endpoints in §6 are fixed — match them exactly.
- Ask before adding any dependency not in §1.

---

## 1. Stack & setup

**Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · React Server Components where possible.**

```bash
npx create-next-app@latest siet-news --typescript --tailwind --app --eslint --src-dir --import-alias "@/*"
cd siet-news
npm i lucide-react clsx swr embla-carousel-react
```

- `lucide-react` — thin editorial icons.
- `clsx` — conditional classes.
- `swr` — client fetching for search/admin/interactive lists. Server components use `fetch`.
- `embla-carousel-react` — the horizontal rails + feature mosaic scrolling.

```bash
# .env.local
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

---

## 2. Design system (tokens — the source of truth)

### Fonts (via `next/font/google` in root layout)

Faithful to the reference: an editorial serif for display, a readable serif for body, a **grotesque** for utility caps (nav, eyebrows, counters). *Not* mono.

- **Fraunces** — display serif (masthead, section titles, card titles). 400/500/600, high `opsz`. `--font-display`
- **Newsreader** — body serif (article text, descriptions, long copy). 400/500. `--font-body`
- **Space Grotesk** — utility (nav, eyebrows, counters, tags, dates), uppercase + letterspaced for labels. 400/500. `--font-util`

### `src/app/globals.css` (Tailwind v4 `@theme`)

```css
@import "tailwindcss";

@theme {
  /* palette — warm cream, near-monochrome, one restrained accent */
  --color-paper:    #F1EDE4; /* canvas */
  --color-paper-2:  #E8E2D6; /* raised sections / cards */
  --color-ink:      #171511; /* primary text (warm near-black) */
  --color-ink-soft: #6B6558; /* muted labels, captions */
  --color-line:     #D6CFC0; /* hairline rules & borders */
  --color-accent:   #8A1E1E; /* restrained crimson — counters, active nav, explore → ONLY.
                                SWAP to SIET's official brand color. */

  /* type roles (wired from next/font) */
  --font-display: var(--font-fraunces);
  --font-body:    var(--font-newsreader);
  --font-util:    var(--font-space-grotesk);

  /* type scale (editorial, generous) */
  --text-eyebrow:  0.72rem;  /* util, uppercase, tracked +0.14em */
  --text-body:     1.05rem;
  --text-lede:     1.35rem;
  --text-h3:       1.6rem;
  --text-h2:       2.4rem;
  --text-h1:       3.4rem;
  --text-masthead: clamp(3rem, 8vw, 7rem);

  --radius: 2px;         /* archival = near-zero radius */
  --section-y: 6.5rem;   /* big breathing room between sections */
}

html { background: var(--color-paper); color: var(--color-ink); }
body { font-family: var(--font-body); font-size: var(--text-body); line-height: 1.55; }

.rule { border-top: 1px solid var(--color-line); }

.eyebrow {
  font-family: var(--font-util);
  font-size: var(--text-eyebrow);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-ink-soft);
}

/* counters + explore arrows — the only place accent appears at size */
.counter { font-family: var(--font-util); color: var(--color-accent); }

@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; scroll-behavior: auto !important; }
}
```

**Layout language:** hairline `--line` rules and whitespace instead of boxes/shadows. Near-zero radius. Images are the color; everything else is ink-on-cream.

---

## 3. Design guardrails — faithful reproduction (do / don't)

**Do (match the reference)**
- **Feature mosaic hero** (§9): a large grid/rail of feature tiles — student authors, achievements, and news thumbnails — with name + role/label beneath, exactly like the reference's portrait wall. This is the signature.
- Every collection section shows a **running counter** in the accent color (like the reference's `462 Interviews`).
- Horizontal **card rails** (embla) per section, each closing with an italic **"Explore all →"** (arrow in `--accent`).
- Near-**monochrome** UI: ink on cream, hairline rules. Let photography carry all the color.
- Utility text (nav, eyebrows, counters, tags, dates) in **Space Grotesk**, uppercase + letterspaced for labels. Body in Newsreader. Titles in Fraunces.
- Big vertical whitespace between sections (`--section-y`).
- Quality floor: responsive to 360px, visible keyboard focus (2px accent outline), `prefers-reduced-motion` respected, semantic landmarks, alt text.

**Don't**
- ❌ No shadows, no gradients, no glassmorphism, no rounded-2xl cards.
- ❌ Don't add a second accent color. Crimson (or the swapped institute color) is the *only* non-neutral, used sparingly.
- ❌ Don't set body copy in the display or utility face. Newsreader for reading.
- ❌ No big-number-with-gradient hero — the hero is the mosaic + masthead.
- ❌ Don't invent colors outside §2.

---

## 4. Folder structure

```
src/
  app/
    (public)/
      layout.tsx            # Navbar + Footer wrapper
      page.tsx              # Home  → GET /home
      news/
        page.tsx            # GET /news (+ latest, trending, domain filter)
        [slug]/page.tsx     # GET /news/{slug}
      articles/
        page.tsx            # GET /articles
        [slug]/page.tsx     # GET /articles/{slug}
      magazine/
        page.tsx            # GET /magazine  (Achievements)
        [slug]/page.tsx     # GET /magazine/{slug}
      domains/
        page.tsx            # GET /domains
        [domain]/page.tsx   # GET /domains/{domain}
      search/page.tsx       # GET /search
      about/page.tsx        # about the AI Research Lab / SIET
      contact/page.tsx
    admin/
      layout.tsx            # AdminSidebar wrapper, auth-gated
      login/page.tsx        # POST /login
      page.tsx              # dashboard → GET /admin/dashboard
      news/page.tsx         # CRUD /admin/news
      articles/page.tsx     # CRUD /admin/articles
      magazine/page.tsx     # CRUD /admin/magazine
      media/page.tsx        # /admin/media
      domains/page.tsx      # /admin/domains
      users/page.tsx        # /admin/users
      analytics/page.tsx
      settings/page.tsx
    not-found.tsx
    globals.css
  components/
    shared/                 # §7
    news/  articles/  magazine/  search/  admin/
    signature/FeatureMosaic.tsx   # §9
  lib/
    api.ts   types.ts   auth.ts   utils.ts
```

---

## 5. TypeScript data models — `src/lib/types.ts`

Mirror the backend DB modules; correct field names when the real API responses land — this file is the contract.

```ts
export type Domain = { slug: string; name: string; count: number };
export type Tag = { slug: string; name: string };
export type Author = { id: string; name: string; role?: string; avatar?: string; department?: string };

export interface NewsItem {
  id: string; slug: string; title: string;
  aiSummary: string; sourceUrl: string; sourceName: string;
  domain: Domain; tags: Tag[];
  image?: string; publishedAt: string;
  trending?: boolean; likes: number; bookmarked?: boolean;
}

export interface Article {
  id: string; slug: string; title: string; excerpt: string; body: string;
  author: Author; domain: Domain; tags: Tag[];
  cover?: string; publishedAt: string;
  readingMinutes: number; likes: number; bookmarked?: boolean;
}

export interface Achievement {           // "Magazine"
  id: string; slug: string; title: string; description: string;
  student: Author; department: string; year: number; type: string;
  domain: Domain; gallery: string[];
  certificateUrl?: string; projectLinks: { label: string; url: string }[];
}

export interface Paginated<T> { items: T[]; page: number; pages: number; total: number }
export interface User { id: string; name: string; email: string; role: "admin" | "editor" }
```

---

## 6. API layer — `src/lib/api.ts`

Cookie-session client (`credentials: "include"`); each function maps to a fixed endpoint.

```ts
const BASE = process.env.NEXT_PUBLIC_API_BASE!;

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return res.json();
}

export const api = {
  login:  (b: {email: string; password: string}) => req("/login", { method: "POST", body: JSON.stringify(b) }),
  logout: () => req("/logout", { method: "POST" }),
  me:     () => req<User>("/me"),

  home:   () => req("/home"),

  news:         (q = "") => req<Paginated<NewsItem>>(`/news${q}`),
  newsBySlug:   (s: string) => req<NewsItem>(`/news/${s}`),
  newsLatest:   () => req<NewsItem[]>("/news/latest"),
  newsTrending: () => req<NewsItem[]>("/news/trending"),
  newsByDomain: (d: string) => req<Paginated<NewsItem>>(`/news/domain/${d}`),
  newsSearch:   (q: string) => req<Paginated<NewsItem>>(`/news/search?q=${encodeURIComponent(q)}`),

  articles:        (q = "") => req<Paginated<Article>>(`/articles${q}`),
  articleBySlug:   (s: string) => req<Article>(`/articles/${s}`),
  articlesByDomain:(d: string) => req<Paginated<Article>>(`/articles/domain/${d}`),

  magazine:  (q = "") => req<Paginated<Achievement>>(`/magazine${q}`),
  magBySlug: (s: string) => req<Achievement>(`/magazine/${s}`),
  magByType: (t: string) => req<Paginated<Achievement>>(`/magazine/type/${t}`),
  magByYear: (y: number) => req<Paginated<Achievement>>(`/magazine/year/${y}`),

  domains: () => req<Domain[]>("/domains"),
  domain:  (d: string) => req<Domain>(`/domains/${d}`),
  search:  (q: string) => req(`/search?q=${encodeURIComponent(q)}`),
};
```

Admin CRUD (`/admin/*`) mirrors this with `POST/PUT/DELETE`.

---

## 7. Shared components (contracts)

| Component | Contract / behavior |
|---|---|
| `Navbar` | Sticky, hairline bottom rule. Left: `SIET News` wordmark (Fraunces) + tiny util subline "AI Research Lab · SIET". Center: util-caps nav (Home, News, Articles, Magazine, Domains, Search, About, Contact). Right: search + "Admin". Slide-in menu < 900px. |
| `Footer` | Newsletter signup (util input + "Sign up"), nav columns, credit `© AI Research Lab · Sri Shakthi Institute of Engineering and Technology`. |
| `SearchBar` | Util input, accent underline on focus, submits to `/search`. |
| `DomainFilter` | Row of domain `TagChip`s; active = ink fill, paper text. |
| `Pagination` | Util `‹ 01 / 07 ›`. |
| `Breadcrumb` | Util, `Home / News / …`, `/` separators in `--line`. |
| `ContentCard` | Workhorse. `variant: news \| article \| achievement`. Image (or ruled placeholder), eyebrow (domain · date, util), Fraunces title, Newsreader excerpt, footer (author / reading time / likes). Hairline separators, no shadow. |
| `TagChip` | Util, small, hairline border, hover = ink border. |
| `AuthorCard` | Square avatar (2px radius), name (Fraunces), role + dept (util). |
| `LikeButton` / `BookmarkButton` / `ShareButton` | Optimistic toggles; count in util; Web Share + copy-link fallback. |
| `LoadingSkeleton` | Ruled shimmer blocks in `--paper-2`, no rounded pills. |
| `EmptyState` | Direction not mood: util line "Nothing here yet." + one action. |
| `SectionRail` | Embla horizontal rail + header (eyebrow + Fraunces title + accent **counter**) + italic **"Explore all →"**. Wraps `ContentCard`s. The repeated home unit. |

---

## 8. Pages (route → data → layout)

**Home** `/` → `GET /home` — mirrors the reference structure, section by section:
1. **Masthead** — `SIET News` (Fraunces, `--text-masthead`), subline "AI Research Lab · Sri Shakthi Institute of Engineering and Technology", one-line thesis ("AI news, student writing, and the record of what we build").
2. **Feature Mosaic** hero (§9) — the signature wall of feature tiles.
3. **News** rail — accent counter (`87 News`) + `SectionRail` + "Explore all news →".
4. **Intro paragraph + "Learn more"** — one editorial paragraph about the lab/publication → `/about`. (Reference's "Between 2019–2023…" block.)
5. **Articles** rail — counter (`142 Articles`) + rail + "Explore all articles →".
6. **Domains** grid — topic tiles with counts + "See more domains →". (Reference's Topics.)
7. **Achievements** showcase — gallery/rail of student wins by year. (Reference's Navigate/Discover.)
8. **News & Events** — 3 dated items, list style. (Reference's News & Events.)
9. **Newsletter** signup + footer credit.

**News** `/news` → list + `DomainFilter` + `Pagination`; Latest / Trending tabs. `/news/[slug]` → hero, **AI Summary** callout (ruled block, util "AI SUMMARY" eyebrow), body, **Source link** (`sourceName ↗`), date, tags, like/bookmark/share, related.

**Articles** `/articles` → card grid. `/articles/[slug]` → title, `AuthorCard`, reading time, rich-text body, tags, related.

**Magazine** `/magazine` → achievements grid + filters (type/year/department). `/magazine/[slug]` → title, student profile, `Gallery` (lightbox), `CertificateViewer`, `ProjectLinks`.

**Domains** `/domains` → all domains + counts. `/domains/[domain]` → mixed feed (news + articles + achievements).

**Search** `/search` → universal search, filters (type/domain), suggestions, grouped results.

**About** → the AI Research Lab / SIET story, mission, team — editorial static page in-system. **Contact** → form + lab details. **not-found** → error page in-system.

**Admin** (gate in `admin/layout.tsx` via `api.me()`, redirect to `/admin/login`): login · dashboard (stat tiles + recent activity) · news/articles/magazine (data table + create/edit drawer) · media (upload grid → `POST /admin/media/upload`) · domains · users · analytics · settings. Denser than public, same palette.

---

## 9. Signature — `FeatureMosaic` (matches the reference hero)

A large mosaic wall of feature tiles directly under the masthead — the college's answer to the reference's portrait grid.

- Grid/rail of image tiles (student authors, achievements, top news), each with **name + role/label** in util caps beneath, drawn from `/home`.
- Slow ambient horizontal drift (embla autoplay) that **pauses on hover** and is **fully static under `prefers-reduced-motion`**.
- One tile featured large at left with a caption (like the reference's highlighted narrator), the rest tiled to the right.
- Images are the only color on the page — keep the surrounding UI monochrome.

```
┌───────────────────────────────────────────────────────────┐
│  SIET News                                                     │
│  AI Research Lab · Sri Shakthi Institute of Eng. & Tech.    │
│  AI news, student writing, and the record of what we build.│
│ ┌─────────────┐ ┌────┐┌────┐┌────┐┌────┐┌────┐  ← drifts   │
│ │  FEATURED   │ │tile││tile││tile││tile││tile│             │
│ │   (large)   │ └────┘└────┘└────┘└────┘└────┘             │
│ │  Name·Role  │ │tile││tile││tile││tile││tile│             │
│ └─────────────┘ └────┘└────┘└────┘└────┘└────┘             │
└───────────────────────────────────────────────────────────┘
```

---

## 10. Build order (verify each phase before the next)

1. **Foundation** — install, fonts in root layout, `globals.css` tokens, `types.ts`, `api.ts`, `utils.ts`. Render a tokens test page.
2. **Shared components** (§7) on a `/kitchen-sink` scratch route.
3. **Public shell** — `(public)/layout.tsx` (Navbar + Footer).
4. **Home** — masthead + `FeatureMosaic` + `SectionRail`s wired to `/home`.
5. **News** module (list + detail + AI summary + source).
6. **Articles** module.
7. **Magazine** module (gallery + certificate + project links).
8. **Domains + Search.**
9. **About** (lab story) **/ Contact / not-found.**
10. **Admin** — auth gate, login, dashboard, CRUD tables, media/analytics/settings.
11. **Polish** — responsive at 360/768/1280, keyboard focus, reduced-motion, empty/loading/error states, alt text, Lighthouse.

---

## 11. Acceptance checklist

- [ ] All colors/fonts trace to §2; no stray hex or default Tailwind colors.
- [ ] Warm-cream, near-monochrome, hairline-rule layout; images provide the color; no shadows/gradients/rounded-2xl.
- [ ] `FeatureMosaic` hero works; pauses on hover; static under reduced-motion.
- [ ] Every collection has an accent **counter**; every rail has "Explore all →".
- [ ] Counters/dates/domains/tags/nav in Space Grotesk; body in Newsreader; headings in Fraunces.
- [ ] Footer credits "AI Research Lab · Sri Shakthi Institute of Engineering and Technology".
- [ ] Each page hits the exact §6 endpoint; loading + empty + error states present.
- [ ] Admin gated by `api.me()`; CRUD works against `/admin/*`.
- [ ] Responsive to 360px; visible keyboard focus; semantic landmarks + alt text.

---

*Feed this file to the Gemini agent as the project brief. Keep it in the repo root as `BRIEF.md` so the agent re-reads it between phases. Set `--color-accent` to SIET's official brand color before the polish phase.*
