"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { User } from "@/lib/types";

interface AdminSidebarProps {
  user: User;
}

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin" },
  { label: "News Records", href: "/admin/news" },
  { label: "Articles Desk", href: "/admin/articles" },
  { label: "Magazine Wins", href: "/admin/magazine" },
  { label: "Media Library", href: "/admin/media" },
  { label: "Domains List", href: "/admin/domains" },
  { label: "User Access", href: "/admin/users" },
  { label: "Analytics Log", href: "/admin/analytics" },
  { label: "System Settings", href: "/admin/settings" },
];

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await api.logout();
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
      router.push("/admin/login");
    } finally {
      setLoggingOut(false);
    }
  };

  // Close mobile drawer on route change
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-3.5 left-4 z-50 p-1.5 border border-line bg-paper text-ink hover:text-accent transition-colors cursor-pointer font-util text-[10px] uppercase tracking-wider outline-none focus:outline-2 focus:outline-accent"
        aria-expanded={isOpen}
        aria-label="Toggle Navigation Menu"
      >
        {isOpen ? "Close [×]" : "Menu [≡]"}
      </button>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 z-30 bg-paper/60 backdrop-blur-xs transition-opacity"
        />
      )}

      <aside className={`w-64 border-r border-line bg-paper-2 flex flex-col justify-between h-screen lg:sticky lg:top-0 font-util text-xs uppercase tracking-wider
        fixed inset-y-0 left-0 z-40 lg:z-auto lg:static transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Top section: Brand & Navigation */}
        <div className="flex flex-col">
          {/* Brand Header */}
          <div className="p-6 border-b border-line">
            <Link href="/admin" className="font-display text-body font-semibold text-ink lowercase tracking-normal block outline-none focus:outline-2 focus:outline-accent">
              siet news admin
            </Link>
            <span className="text-[10px] text-ink-soft block mt-1">Management Desk</span>
          </div>

          {/* Navigation list */}
          <nav className="p-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 border transition-colors outline-none focus:outline-2 focus:outline-accent ${
                    isActive
                      ? "bg-ink text-paper border-ink"
                      : "border-transparent hover:border-line hover:bg-paper"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom section: User Info & Logout */}
        <div className="p-4 border-t border-line space-y-4">
          {/* User Card */}
          <div className="px-3 py-2 border border-line bg-paper">
            <p className="font-display font-medium text-ink normal-case tracking-normal truncate">
              {user.name}
            </p>
            <p className="text-[9px] text-ink-soft mt-0.5">{user.role}</p>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full text-left px-3 py-2 border border-line hover:border-accent hover:text-accent transition-colors cursor-pointer bg-paper outline-none focus:outline-2 focus:outline-accent"
          >
            {loggingOut ? "Logging out..." : "Log Out"}
          </button>
        </div>
      </aside>
    </>
  );
}
