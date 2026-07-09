"use client";

import * as React from "react";
import { useState, useEffect } from "react";

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState("SIET News");
  const [creditLine, setCreditLine] = useState("AI Research Lab · Sri Shakthi Institute of Engineering and Technology");
  const [accentColor, setAccentColor] = useState("#0F2B5C");
  const [newsletterEnabled, setNewsletterEnabled] = useState(true);
  const [featuredDomains, setFeaturedDomains] = useState("machine-learning, robotics");

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load config from localStorage if present
  useEffect(() => {
    const savedName = localStorage.getItem("siet_settings_name");
    const savedCredit = localStorage.getItem("siet_settings_credit");
    const savedAccent = localStorage.getItem("siet_settings_accent");
    const savedNews = localStorage.getItem("siet_settings_newsletter");
    const savedFeat = localStorage.getItem("siet_settings_featured");

    if (savedName) setSiteName(savedName);
    if (savedCredit) setCreditLine(savedCredit);
    if (savedAccent) setAccentColor(savedAccent);
    if (savedNews) setNewsletterEnabled(savedNews === "true");
    if (savedFeat) setFeaturedDomains(savedFeat);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    // Simulate saving process
    setTimeout(() => {
      localStorage.setItem("siet_settings_name", siteName);
      localStorage.setItem("siet_settings_credit", creditLine);
      localStorage.setItem("siet_settings_accent", accentColor);
      localStorage.setItem("siet_settings_newsletter", String(newsletterEnabled));
      localStorage.setItem("siet_settings_featured", featuredDomains);

      setSaving(false);
      setSaveSuccess(true);

      // Dismiss confirmation message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-line pb-4">
        <p className="font-util text-eyebrow text-ink-soft uppercase tracking-wider">
          system options
        </p>
        <h1 className="font-display text-h1 font-semibold text-ink mt-1">
          Console Settings
        </h1>
      </div>

      {/* Gap Warning Banner */}
      <div className="border border-line bg-paper-2 p-4 text-xs">
        <p className="font-util text-eyebrow text-accent uppercase font-bold tracking-wider">
          Backend Integration Gap
        </p>
        <p className="font-body text-ink mt-1 leading-relaxed">
          Because the backend API specification does not define a dedicated settings storage endpoint (e.g. `/admin/settings`),
          changes saved here will be stored in your local browser’s `localStorage`. Live production synchronization is pending API deployment.
        </p>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="border border-line bg-paper p-6 max-w-2xl space-y-6 text-xs">
        <h2 className="font-display text-body font-semibold text-ink border-b border-line pb-2">
          Global Layout Preferences
        </h2>

        {/* Site Name Title */}
        <div className="space-y-1">
          <label className="block font-util text-eyebrow text-ink-soft uppercase tracking-wider">
            Site Masthead Title
          </label>
          <input
            type="text"
            required
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="w-full border border-line bg-paper px-3 py-2 outline-none focus:border-ink font-display font-medium text-sm text-ink"
          />
          <p className="text-[10px] text-ink-soft italic">Alters the title text in the main header brand slot.</p>
        </div>

        {/* Credit Subline */}
        <div className="space-y-1">
          <label className="block font-util text-eyebrow text-ink-soft uppercase tracking-wider">
            Lab/Institute Credit Subline
          </label>
          <input
            type="text"
            required
            value={creditLine}
            onChange={(e) => setCreditLine(e.target.value)}
            className="w-full border border-line bg-paper px-3 py-2 outline-none focus:border-ink text-ink"
          />
          <p className="text-[10px] text-ink-soft italic">Appears under the main masthead and inside footer copy.</p>
        </div>

        {/* Accent Color Hex */}
        <div className="space-y-1">
          <label className="block font-util text-eyebrow text-ink-soft uppercase tracking-wider">
            Accent Brand Color (Hex)
          </label>
          <div className="flex gap-3 items-center">
            <input
              type="text"
              required
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              placeholder="#0F2B5C"
              className="w-48 border border-line bg-paper px-3 py-2 outline-none focus:border-ink font-mono text-ink"
            />
            <div
              className="w-6 h-6 border border-line"
              style={{ backgroundColor: accentColor }}
              title="Accent preview swatch"
            />
          </div>
          <p className="text-[10px] text-ink-soft italic">Accent color applied to running counters, borders and CTA arrows.</p>
        </div>

        {/* Featured Domains list */}
        <div className="space-y-1">
          <label className="block font-util text-eyebrow text-ink-soft uppercase tracking-wider">
            Featured Domain Slugs
          </label>
          <input
            type="text"
            required
            value={featuredDomains}
            onChange={(e) => setFeaturedDomains(e.target.value)}
            className="w-full border border-line bg-paper px-3 py-2 outline-none focus:border-ink font-mono text-ink"
          />
          <p className="text-[10px] text-ink-soft italic">Comma-separated list of domain slugs to pin to main homepage rail.</p>
        </div>

        {/* Newsletter Option */}
        <div className="flex items-center gap-2.5 pt-2">
          <input
            id="newsletter-toggle"
            type="checkbox"
            checked={newsletterEnabled}
            onChange={(e) => setNewsletterEnabled(e.target.checked)}
            className="h-4 w-4 border border-line rounded-none bg-paper accent-ink cursor-pointer"
          />
          <label
            htmlFor="newsletter-toggle"
            className="font-util text-eyebrow text-ink uppercase tracking-wider cursor-pointer"
          >
            Enable Footer Newsletter Form
          </label>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-4 pt-4 border-t border-line">
          <button
            type="submit"
            disabled={saving}
            className="font-util text-eyebrow uppercase tracking-wider text-paper bg-ink hover:bg-accent border border-ink py-2.5 px-6 cursor-pointer disabled:opacity-50"
          >
            {saving ? "Storing..." : "Save Preferences"}
          </button>
          
          {saveSuccess && (
            <span className="font-util text-[10px] uppercase tracking-wider text-accent font-bold">
              ✓ Preferences recorded in browser storage
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
