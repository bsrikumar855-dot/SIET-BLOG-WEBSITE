"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { TransparentLogo } from "./TransparentLogo";
import { api } from "@/lib/api";
import type { User } from "@/lib/types";

const navItems = [
  ["Home", "/"],
  ["News", "/news"],
  ["Articles", "/articles"],
  ["Magazine", "/magazine"],
  ["About", "/about"],
  ["Contact", "/contact"],
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isHeroActive, setIsHeroActive] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // Close menu and refresh session state when route changes
  useEffect(() => {
    setOpen(false);
    api.getCurrentUser()
      .then((u) => {
        if (u) {
          setUser(u);
          localStorage.setItem("siet_logged_in", "true");
          localStorage.setItem("siet_user_role", u.role);
        } else {
          // If the API call returned null (offline or unauthorized), check offline session flags
          const hasSessionFlag = localStorage.getItem("siet_logged_in") === "true";
          const sessionRole = localStorage.getItem("siet_user_role");
          if (hasSessionFlag && sessionRole) {
            setUser({
              id: `u-mock-${sessionRole}`,
              name: sessionRole === "reader" ? "Dr. Babus" : "Offline Admin",
              email: `${sessionRole}@siet.edu`,
              role: sessionRole as any
            });
          } else {
            setUser(null);
            localStorage.removeItem("siet_logged_in");
            localStorage.removeItem("siet_user_role");
          }
        }
      })
      .finally(() => setLoading(false));
  }, [pathname]);

  // Prevent scroll when overlay is active
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Handle shrink on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Track F1 Hero active threshold (homepage only)
  useEffect(() => {
    if (pathname !== "/") {
      setIsHeroActive(false);
      return;
    }

    const checkHeroThreshold = () => {
      const vh = window.innerHeight;
      setIsHeroActive(window.scrollY < vh - 80);
    };

    // Run initial check
    checkHeroThreshold();

    window.addEventListener("scroll", checkHeroThreshold, { passive: true });
    window.addEventListener("resize", checkHeroThreshold);

    return () => {
      window.removeEventListener("scroll", checkHeroThreshold);
      window.removeEventListener("resize", checkHeroThreshold);
    };
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await api.logout();
      localStorage.removeItem("siet_logged_in");
      localStorage.removeItem("siet_user_role");
      setUser(null);
      window.location.href = "/";
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  return (
    <header className={`navbar ${open ? "navbar-open" : ""} ${scrolled ? "navbar-scrolled" : ""} ${isHeroActive ? "navbar-hero-mode" : ""}`}>
      <div className="navbar-inner">
        <Link className="navbar-brand" href="/">
          <div className="navbar-brand-logo-wrapper">
            <TransparentLogo
              src="/api/logo"
              alt="SIET Logo"
              width={34}
              height={34}
              className="navbar-brand-logo"
            />
            <div className="navbar-brand-text">
              <span>SIET News</span>
              <small>AI Research Lab · SIET</small>
            </div>
          </div>
        </Link>

        <div className="navbar-actions">
          <button
            aria-expanded={open}
            aria-label="Toggle menu"
            className="menu-toggle-btn"
            onClick={() => setOpen((current) => !current)}
            type="button"
          >
            <div className="hamburger-box">
              <span className="hamburger-line line-1"></span>
              <span className="hamburger-line line-2"></span>
              <span className="hamburger-line line-3"></span>
            </div>
          </button>
        </div>
      </div>

      {/* Full-screen Menu Overlay */}
      <div className="menu-overlay" data-open={open}>
        <div className="menu-overlay-inner">
          {/* Main Menu Links Column (Aligned Right) */}
          <div className="menu-links-container">
            <nav aria-label="Primary overlay">
              {navItems.map(([label, href], index) => {
                const numStr = String(index + 1).padStart(2, "0");
                return (
                  <div key={href} className="menu-item-wrapper">
                    <Link href={href} className="menu-item-link" onClick={() => setOpen(false)}>
                      <span className="menu-item-num">{numStr}.</span>
                      <span className="menu-item-label">{label}</span>
                    </Link>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Footer Row inside Menu */}
          <div className="menu-overlay-footer">
            <div className="menu-footer-credit">
              © Sri Shakthi Institute of Engineering and Technology
            </div>
            <div className="menu-footer-links flex flex-wrap items-center gap-x-2 gap-y-1">
              {!loading && (
                <>
                  {user ? (
                    <>
                      <span className="font-util text-[10px] text-ink-soft uppercase">Hello, {user.name}</span>
                      <span className="separator">·</span>
                      {user.role === "reader" ? (
                        <Link href="/profile" onClick={() => setOpen(false)}>My Profile</Link>
                      ) : (
                        <Link href="/admin" onClick={() => setOpen(false)}>Admin Console</Link>
                      )}
                      <span className="separator">·</span>
                      <button onClick={handleLogout} className="hover:text-accent bg-transparent border-none cursor-pointer text-ink font-util text-xs p-0 uppercase tracking-wider underline">
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setOpen(false)}>Login</Link>
                      <span className="separator">·</span>
                      <Link href="/register" onClick={() => setOpen(false)}>Register</Link>
                      <span className="separator">·</span>
                      <Link href="/admin" onClick={() => setOpen(false)}>Admin</Link>
                    </>
                  )}
                  <span className="separator">·</span>
                </>
              )}
              <Link href="/about" onClick={() => setOpen(false)}>About Lab</Link>
              <span className="separator">·</span>
              <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
