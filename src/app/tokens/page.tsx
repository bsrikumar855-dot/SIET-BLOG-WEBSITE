const colors = [
  ["paper", "var(--color-paper)"],
  ["paper-2", "var(--color-paper-2)"],
  ["ink", "var(--color-ink)"],
  ["ink-soft", "var(--color-ink-soft)"],
  ["line", "var(--color-line)"],
  ["accent", "var(--color-accent)"],
];

export default function TokensPage() {
  return (
    <main className="tokens-page">
      <header className="tokens-masthead">
        <p className="eyebrow">AI Research Lab · SIET</p>
        <h1 className="tokens-title">SIET News</h1>
        <p className="tokens-lede">
          AI news, student writing, and the record of what we build.
        </p>
      </header>

      <section className="tokens-section" aria-labelledby="palette-title">
        <p className="eyebrow">Phase 1 Token Test</p>
        <h2 id="palette-title">Palette</h2>
        <div className="tokens-grid">
          {colors.map(([name, value]) => (
            <article className="tokens-card" key={name}>
              <div
                aria-label={name}
                className="tokens-swatch"
                style={{ "--swatch": value } as React.CSSProperties}
              />
              <p className="tokens-util">{name}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="tokens-section" aria-labelledby="type-title">
        <p className="eyebrow">Fraunces · Newsreader · Space Grotesk</p>
        <h2 id="type-title">Typography</h2>
        <div className="tokens-raised">
          <p className="eyebrow">Counter Preview</p>
          <p className="tokens-sample-title">
            <span className="counter">87</span> News
          </p>
          <p>
            This body copy is Newsreader: warm, readable, and quiet against the
            cream canvas.
          </p>
          <p className="tokens-util">Utility labels stay uppercase and tracked</p>
          <a className="tokens-link" href="/tokens">
            Explore all tokens <span>→</span>
          </a>
        </div>
      </section>

      <section className="tokens-section" aria-labelledby="rules-title">
        <p className="eyebrow">Hairline Rules · Near-zero Radius</p>
        <h2 id="rules-title">Spacing</h2>
        <article className="tokens-card rule">
          <h3>Section rhythm comes from --section-y</h3>
          <p>
            This scratch page exists only to verify Phase 1 foundation tokens,
            fonts, and focus styling.
          </p>
        </article>
      </section>
    </main>
  );
}
