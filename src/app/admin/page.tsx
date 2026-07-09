import * as React from "react";
import { api } from "@/lib/api";

// Fallback data for offline/unconnected environments
const FALLBACK_DASHBOARD = {
  counts: {
    news: 124,
    articles: 42,
    achievements: 18,
    users: 5,
  },
  recentActivity: [
    {
      id: "act-1",
      action: "Created Article",
      timestamp: "2026-07-09T14:00:00Z",
      details: "Sanjay Kumar published the 'building-responsible-rag' article.",
    },
    {
      id: "act-2",
      action: "Updated Achievement",
      timestamp: "2026-07-08T11:30:00Z",
      details: "Pooja Hegde updated the 'ieee-robotics-paper' entry gallery.",
    },
    {
      id: "act-3",
      action: "Created News Item",
      timestamp: "2026-07-08T09:15:00Z",
      details: "Dr. S. Brikumar posted the 'open-models-campus-lab' news release.",
    },
    {
      id: "act-4",
      action: "System Configuration",
      timestamp: "2026-07-07T16:45:00Z",
      details: "Administrator changed general CORS configuration settings.",
    },
  ],
};

function formatTimestamp(isoStr: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoStr));
}

export default async function AdminDashboardPage() {
  let dashboardData = FALLBACK_DASHBOARD;

  try {
    dashboardData = await api.adminDashboard();
  } catch (error) {
    console.warn("Admin dashboard API offline. Resolving local mock statistics.", error);
    dashboardData = FALLBACK_DASHBOARD;
  }

  const stats = [
    { label: "News Updates", count: dashboardData.counts.news },
    { label: "Research Articles", count: dashboardData.counts.articles },
    { label: "Magazine Wins", count: dashboardData.counts.achievements },
    { label: "Active Editors", count: dashboardData.counts.users },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <p className="font-util text-eyebrow text-ink-soft uppercase tracking-wider">
          system console
        </p>
        <h1 className="font-display text-h1 font-semibold text-ink mt-1">
          Workspace Dashboard
        </h1>
      </div>

      {/* Stat Tiles (Home Counter Pattern) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, idx) => (
          <div
            key={idx}
            className="border border-line bg-paper-2 p-6 hover:border-ink transition-colors duration-200"
          >
            <p className="font-util text-h2 font-medium text-accent">{s.count}</p>
            <h3 className="font-display text-body font-medium mt-2 leading-tight text-ink">
              {s.label}
            </h3>
            <p className="text-ink-soft text-[9px] font-util uppercase tracking-widest mt-4">
              Registered Entries
            </p>
          </div>
        ))}
      </section>

      {/* Recent Activity Log */}
      <section className="space-y-4">
        <div className="border-b border-line pb-2">
          <h2 className="font-display text-h3 font-medium text-ink">
            Recent System Activity
          </h2>
          <p className="font-util text-[10px] text-ink-soft uppercase tracking-wider mt-0.5">
            Real-time audit log of database updates
          </p>
        </div>

        <div className="border border-line divide-y divide-line bg-paper">
          {dashboardData.recentActivity.length > 0 ? (
            dashboardData.recentActivity.map((act) => (
              <div
                key={act.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-paper-2 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-util text-[10px] uppercase tracking-wider text-paper bg-ink px-2 py-0.5">
                      {act.action}
                    </span>
                    <span className="font-util text-[10px] text-ink-soft">
                      ID: {act.id}
                    </span>
                  </div>
                  <p className="font-body text-xs text-ink leading-relaxed">
                    {act.details}
                  </p>
                </div>
                <div className="font-util text-[10px] text-ink-soft sm:text-right">
                  {formatTimestamp(act.timestamp)}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-ink-soft font-body text-xs italic">
              No recent changes have been recorded in the audit logs.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
