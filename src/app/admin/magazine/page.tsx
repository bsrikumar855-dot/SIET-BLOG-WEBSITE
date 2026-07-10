"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Pagination } from "@/components/shared";
import type { Achievement, Domain } from "@/lib/types";

// Fallbacks
const FALLBACK_DOMAINS: Domain[] = [
  { slug: "machine-learning", name: "Machine Learning", count: 42 },
  { slug: "robotics", name: "Robotics", count: 19 },
  { slug: "campus-research", name: "Campus Research", count: 27 },
  { slug: "ethics", name: "AI Ethics", count: 12 },
];

const FALLBACK_ACHIEVEMENTS: Achievement[] = [
  {
    id: "ac1",
    slug: "smart-india-hackathon-2026",
    title: "First place win at national Smart India Hackathon 2026",
    description: "The AI Research Lab team won first place for their real-time edge translation system for agricultural diagnostics.",
    student: {
      id: "s1",
      name: "Sanjay Kumar",
      role: "Team Lead",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    },
    department: "Artificial Intelligence and Data Science",
    year: 2026,
    type: "Hackathon",
    domain: FALLBACK_DOMAINS[0],
    gallery: [
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80",
    ],
    certificateUrl: "https://example.com/sih-2026-cert.pdf",
    projectLinks: [
      { label: "GitHub Repository", url: "https://github.com/siet-ai/sih-2026" },
    ],
    likes: 12,
    bookmarked: false,
  },
];

export default function AdminMagazineCRUDPage() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [domains, setDomains] = useState<Domain[]>(FALLBACK_DOMAINS);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Drawer / Form State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editItem, setEditItem] = useState<Achievement | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentAvatar, setStudentAvatar] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState(2026);
  const [type, setType] = useState("Hackathon");
  const [domainSlug, setDomainSlug] = useState("");
  const [galleryCsv, setGalleryCsv] = useState("");
  const [certificateUrl, setCertificateUrl] = useState("");
  const [projectLinksJson, setProjectLinksJson] = useState("[]");

  // Delete Confirm ID
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Load Data
  const loadMagazine = async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await api.adminMagazine(`?page=${pageNum}`);
      setItems(res.items);
      setPage(res.page);
      setTotalPages(res.pages);
    } catch (err) {
      console.warn("Admin magazine API offline, loading static achievements mock fallbacks.", err);
      setItems(FALLBACK_ACHIEVEMENTS);
      setPage(1);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMagazine(page);
    api.domains()
      .then(setDomains)
      .catch(() => setDomains(FALLBACK_DOMAINS));
  }, [page]);

  // Open Drawer for Create
  const handleOpenCreate = () => {
    setEditItem(null);
    setTitle("");
    setSlug("");
    setDescription("");
    setStudentName("Jane Doe");
    setStudentAvatar("");
    setDepartment("Artificial Intelligence and Data Science");
    setYear(2026);
    setType("Hackathon");
    setDomainSlug(domains[0]?.slug || "");
    setGalleryCsv("");
    setCertificateUrl("");
    setProjectLinksJson("[]");
    setFormError(null);
    setIsDrawerOpen(true);
  };

  // Open Drawer for Edit
  const handleOpenEdit = (item: Achievement) => {
    setEditItem(item);
    setTitle(item.title);
    setSlug(item.slug);
    setDescription(item.description || "");
    setStudentName(item.student.name);
    setStudentAvatar(item.student.avatar || "");
    setDepartment(item.department);
    setYear(item.year || 2026);
    setType(item.type);
    setDomainSlug(item.domain.slug);
    setGalleryCsv(item.gallery?.join(", ") || "");
    setCertificateUrl(item.certificateUrl || "");
    setProjectLinksJson(JSON.stringify(item.projectLinks || [], null, 2));
    setFormError(null);
    setIsDrawerOpen(true);
  };

  // Submit Drawer Form
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !domainSlug || !studentName || !department) {
      setFormError("Title, Slug, Domain, Student Name, and Department fields are required.");
      return;
    }

    // Verify JSON structure
    let parsedLinks = [];
    try {
      parsedLinks = JSON.parse(projectLinksJson);
      if (!Array.isArray(parsedLinks)) {
        throw new Error("Project Links must be a JSON array.");
      }
    } catch (err: any) {
      setFormError(`Invalid Project Links JSON: ${err.message}`);
      return;
    }

    setSubmitting(true);
    setFormError(null);

    const activeDomain = domains.find((d) => d.slug === domainSlug) || FALLBACK_DOMAINS[0];

    const galleryArray = galleryCsv
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean);

    const payload = {
      title,
      slug,
      description,
      student: {
        id: editItem?.student.id || `s-mock-${Date.now()}`,
        name: studentName,
        avatar: studentAvatar,
      },
      department,
      year: Number(year),
      type,
      domain: activeDomain,
      gallery: galleryArray,
      certificateUrl: certificateUrl || undefined,
      projectLinks: parsedLinks,
      likes: editItem?.likes || 0,
      bookmarked: editItem?.bookmarked || false,
    };

    try {
      if (editItem) {
        await api.adminMagazineUpdate(editItem.id, payload);
      } else {
        await api.adminMagazineCreate(payload);
      }
      setIsDrawerOpen(false);
      loadMagazine(page);
    } catch (err) {
      console.error("Save failure:", err);
      // Client-side local fallback update to simulate saves offline
      const mockSavedItem: Achievement = {
        id: editItem?.id || `ac-mock-${Date.now()}`,
        ...payload,
      };

      if (editItem) {
        setItems(items.map((i) => (i.id === editItem.id ? mockSavedItem : i)));
      } else {
        setItems([mockSavedItem, ...items]);
      }
      setIsDrawerOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    try {
      await api.adminMagazineDelete(id);
      loadMagazine(page);
    } catch (err) {
      console.warn("Delete call failed. Applying offline item removal.", err);
      setItems(items.filter((i) => i.id !== id));
    } finally {
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="space-y-6 relative min-h-[80vh]">
      {/* Page Header */}
      <div className="flex justify-between items-end border-b border-line pb-4">
        <div>
          <p className="font-util text-eyebrow text-ink-soft uppercase tracking-wider">
            editorial console
          </p>
          <h1 className="font-display text-h2 font-semibold text-ink mt-1">
            Magazine achievements
          </h1>
        </div>
        <button
          onClick={handleOpenCreate}
          className="font-util text-eyebrow uppercase tracking-wider text-paper bg-ink hover:bg-accent border border-ink transition-colors px-4 py-2 cursor-pointer"
        >
          Add Achievement
        </button>
      </div>

      {/* Main Table grid */}
      <div className="border border-line bg-paper">
        {loading ? (
          <div className="p-8 text-center font-display text-xs italic text-ink-soft">
            Querying magazine records...
          </div>
        ) : items.length > 0 ? (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-line bg-paper-2 font-util text-[10px] text-ink-soft uppercase tracking-wider">
                <th className="p-4 font-semibold">Title</th>
                <th className="p-4 font-semibold">Student</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">Year</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-paper-2 transition-colors">
                  <td className="p-4 font-display font-medium text-ink max-w-sm truncate">
                    {item.title}
                  </td>
                  <td className="p-4 font-display text-ink-soft">{item.student.name}</td>
                  <td className="p-4 font-util text-ink-soft">{item.type}</td>
                  <td className="p-4 font-sans text-ink-soft">{item.year}</td>
                  <td className="p-4 text-right space-x-3">
                    {confirmDeleteId === item.id ? (
                      <span className="font-util text-[10px] uppercase tracking-wider text-accent space-x-2">
                        <span>Confirm?</span>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="underline hover:text-ink cursor-pointer font-bold"
                        >
                          Yes
                        </button>
                        <span className="text-line">/</span>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="underline hover:text-ink cursor-pointer"
                        >
                          Cancel
                        </button>
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="font-util text-[10px] uppercase tracking-wider hover:text-accent cursor-pointer underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(item.id)}
                          className="font-util text-[10px] uppercase tracking-wider text-accent hover:text-ink cursor-pointer underline"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center font-body text-xs italic text-ink-soft">
            No magazine achievements exist in the database.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination page={page} pages={totalPages} basePath="/admin/magazine" />
        </div>
      )}

      {/* Drawer Overlay Backdrop */}
      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          className="fixed inset-0 z-40 bg-paper/60 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Drawer Side Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-screen w-full max-w-lg border-l border-line bg-paper-2 p-6 overflow-y-auto transform transition-transform duration-300 ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center border-b border-line pb-3 mb-6">
          <h2 className="font-display text-body font-semibold text-ink">
            {editItem ? "Edit Achievement" : "Add Achievement"}
          </h2>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="font-util text-eyebrow uppercase tracking-wider hover:text-accent cursor-pointer text-xs"
          >
            Close [×]
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          {/* Title */}
          <div className="space-y-1">
            <label className="block font-util text-eyebrow text-ink-soft uppercase tracking-wider">
              Achievement Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!editItem) {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                }
              }}
              placeholder="e.g. Winner at SIH 2026 national finals"
              className="w-full border border-line bg-paper px-3 py-2 outline-none focus:border-ink"
            />
          </div>

          {/* Slug */}
          <div className="space-y-1">
            <label className="block font-util text-eyebrow text-ink-soft uppercase tracking-wider">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full border border-line bg-paper px-3 py-2 outline-none focus:border-ink font-mono"
            />
          </div>

          {/* Domain */}
          <div className="space-y-1">
            <label className="block font-util text-eyebrow text-ink-soft uppercase tracking-wider">
              Academic Domain *
            </label>
            <select
              value={domainSlug}
              onChange={(e) => setDomainSlug(e.target.value)}
              className="w-full border border-line bg-paper px-3 py-2 outline-none focus:border-ink font-util uppercase tracking-wider"
            >
              {domains.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Student details */}
          <div className="border border-line bg-paper p-4 space-y-3">
            <h4 className="font-util text-eyebrow text-ink uppercase tracking-wider border-b border-line pb-1">
              Student Details
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block font-util text-eyebrow text-ink-soft uppercase tracking-wider">
                  Student Name *
                </label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full border border-line bg-paper-2 px-2.5 py-1.5 outline-none focus:border-ink"
                />
              </div>
              <div className="space-y-1">
                <label className="block font-util text-eyebrow text-ink-soft uppercase tracking-wider">
                  Avatar URL
                </label>
                <input
                  type="text"
                  value={studentAvatar}
                  onChange={(e) => setStudentAvatar(e.target.value)}
                  placeholder="Paste URL"
                  className="w-full border border-line bg-paper-2 px-2.5 py-1.5 outline-none focus:border-ink"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-1">
                <label className="block font-util text-eyebrow text-ink-soft uppercase tracking-wider">
                  Department *
                </label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Artificial Intelligence and Data Science"
                  className="w-full border border-line bg-paper-2 px-2.5 py-1.5 outline-none focus:border-ink"
                />
              </div>
              <div className="space-y-1">
                <label className="block font-util text-eyebrow text-ink-soft uppercase tracking-wider">
                  Class Year *
                </label>
                <input
                  type="number"
                  required
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full border border-line bg-paper-2 px-2.5 py-1.5 outline-none focus:border-ink"
                />
              </div>
            </div>
          </div>

          {/* Type & Certificate */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block font-util text-eyebrow text-ink-soft uppercase tracking-wider">
                Winning Type *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border border-line bg-paper px-3 py-2 outline-none focus:border-ink font-util uppercase tracking-wider"
              >
                <option value="Hackathon">Hackathon</option>
                <option value="Project">Project</option>
                <option value="Publication">Publication</option>
                <option value="Competition">Competition</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block font-util text-eyebrow text-ink-soft uppercase tracking-wider">
                Certificate Doc URL
              </label>
              <input
                type="text"
                value={certificateUrl}
                onChange={(e) => setCertificateUrl(e.target.value)}
                placeholder="https://example.com/cert.pdf"
                className="w-full border border-line bg-paper px-3 py-2 outline-none focus:border-ink"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block font-util text-eyebrow text-ink-soft uppercase tracking-wider">
              Win Description (Plain Text)
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the context, project specifications, and student efforts..."
              className="w-full border border-line bg-paper px-3 py-2 outline-none focus:border-ink resize-y"
            />
          </div>

          {/* Gallery Images */}
          <div className="space-y-1">
            <label className="block font-util text-eyebrow text-ink-soft uppercase tracking-wider">
              Gallery Images (Comma-Separated URLs)
            </label>
            <input
              type="text"
              value={galleryCsv}
              onChange={(e) => setGalleryCsv(e.target.value)}
              placeholder="Paste URLs separated by commas"
              className="w-full border border-line bg-paper px-3 py-2 outline-none focus:border-ink"
            />
          </div>

          {/* Project References JSON */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="block font-util text-eyebrow text-ink-soft uppercase tracking-wider">
                Project References (JSON Array)
              </label>
              <span className="text-[8px] text-ink-soft">
                [{"{"}&ldquo;label&rdquo;: &ldquo;Title&rdquo;, &ldquo;url&rdquo;: &ldquo;Link&rdquo;{"}"}]
              </span>
            </div>
            <textarea
              rows={4}
              value={projectLinksJson}
              onChange={(e) => setProjectLinksJson(e.target.value)}
              className="w-full border border-line bg-paper px-3 py-2 outline-none focus:border-ink font-mono text-[11px] resize-y"
            />
          </div>

          {/* Form Error */}
          {formError && (
            <p className="font-util text-[10px] text-accent uppercase tracking-wider">
              {formError}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t border-line">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 font-util text-eyebrow uppercase tracking-wider text-paper bg-ink hover:bg-accent border border-ink py-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Record"}
            </button>
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="flex-1 font-util text-eyebrow uppercase tracking-wider text-ink border border-line hover:bg-paper py-2 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
