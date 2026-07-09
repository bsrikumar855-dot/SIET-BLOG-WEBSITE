"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared";

export default function ContactPage() {
  // Form submission state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in all required fields.");
      return;
    }
    // Simulate submission
    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", subject: "", message: "" });
    setSubmitted(false);
  };

  return (
    <main className="kitchen-page">
      {/* Header */}
      <header className="space-y-4">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
        <h1 className="font-display text-h1 font-semibold leading-tight text-ink">
          Contact the Lab
        </h1>
      </header>

      {/* Main split grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start py-4">
        {/* Contact Form (Left) */}
        <div className="lg:col-span-8">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="font-body text-xs text-ink-soft">
                Fields marked with <span className="text-accent">*</span> are required.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="block font-util text-eyebrow text-ink-soft uppercase text-xs">
                    Your Name <span className="text-accent">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sanjay Kumar"
                    className="w-full border border-line bg-paper px-4 py-3 outline-none focus:border-accent text-sm font-sans"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="contact-email" className="block font-util text-eyebrow text-ink-soft uppercase text-xs">
                    Email Address <span className="text-accent">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. sanjay@example.com"
                    className="w-full border border-line bg-paper px-4 py-3 outline-none focus:border-accent text-sm font-sans"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label htmlFor="contact-subject" className="block font-util text-eyebrow text-ink-soft uppercase text-xs">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Research Collaboration / Student Project query"
                  className="w-full border border-line bg-paper px-4 py-3 outline-none focus:border-accent text-sm font-sans"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label htmlFor="contact-message" className="block font-util text-eyebrow text-ink-soft uppercase text-xs">
                  Message <span className="text-accent">*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your inquiry in detail..."
                  className="w-full border border-line bg-paper px-4 py-3 outline-none focus:border-accent text-sm font-sans resize-y"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="font-util text-eyebrow uppercase tracking-wider text-paper bg-ink hover:bg-accent hover:border-accent border border-ink transition-colors px-6 py-3 cursor-pointer"
              >
                Send Message
              </button>
            </form>
          ) : (
            <div className="border border-line bg-paper-2 p-8 text-center space-y-4">
              <span className="text-2xl font-util text-accent" role="img" aria-label="success">
                ✉️
              </span>
              <h2 className="font-display text-h3 font-medium text-ink">Inquiry Received</h2>
              <p className="font-body text-body text-ink-soft max-w-md mx-auto leading-relaxed">
                Thank you for contacting the AI Research Lab. Our student coordinators or faculty supervisors will review your inquiry and get in touch shortly.
              </p>
              <button
                onClick={handleReset}
                className="font-util text-eyebrow uppercase tracking-wider text-ink border border-line hover:border-accent hover:text-accent transition-colors px-4 py-2 mt-2 cursor-pointer bg-paper"
              >
                Send Another Message
              </button>
            </div>
          )}
        </div>

        {/* Lab Contact Details (Right Sidebar) */}
        <div className="lg:col-span-4 space-y-8 border-t lg:border-t-0 lg:border-l border-line pt-8 lg:pt-0 lg:pl-8">
          {/* Details */}
          <div className="space-y-4">
            <h3 className="font-util text-eyebrow text-ink-soft uppercase tracking-wider">
              Lab Location
            </h3>
            <p className="font-body text-xs text-ink leading-relaxed">
              <strong>AI Research Lab</strong>
              <br />
              Department of Artificial Intelligence and Data Science
              <br />
              Sri Shakthi Institute of Engineering and Technology
              <br />
              L&T Bypass Road, Chinniyampalayam
              <br />
              Coimbatore — 641062
              <br />
              Tamil Nadu, India
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-util text-eyebrow text-ink-soft uppercase tracking-wider">
              Direct Channels
            </h3>
            <p className="font-body text-xs text-ink">
              Email: <a href="mailto:ai.lab@siet.ac.in" className="text-accent hover:underline">ai.lab@siet.ac.in</a>
              <br />
              Phone: +91 422 2360333
            </p>
          </div>

          <div className="pt-4 border-t border-line">
            <p className="font-body text-xs text-ink-soft leading-relaxed">
              Interested in reading our mission and story before reaching out?
            </p>
            <Link
              href="/about"
              className="explore-link font-util text-eyebrow uppercase tracking-wider inline-block text-accent mt-2"
            >
              Read About the Lab →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
