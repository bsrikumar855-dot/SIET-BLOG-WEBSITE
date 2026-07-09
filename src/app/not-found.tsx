import * as React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex flex-col justify-center items-center text-center px-4 space-y-6">
      <p className="font-util text-eyebrow text-accent uppercase tracking-widest text-sm">
        Error 404
      </p>
      <h1 className="font-display text-h1 font-semibold text-ink leading-tight max-w-lg">
        This record could not be located in the archive.
      </h1>
      <p className="font-body text-body text-ink-soft max-w-md leading-relaxed">
        The requested URL may have been cataloged under a different domain or removed. Return to the home dashboard to explore active research feeds.
      </p>
      <div className="pt-4">
        <Link
          href="/"
          className="font-util text-eyebrow uppercase tracking-wider text-paper bg-ink hover:bg-accent hover:border-accent border border-ink transition-colors px-6 py-3"
        >
          Return to Home
        </Link>
      </div>
    </main>
  );
}
