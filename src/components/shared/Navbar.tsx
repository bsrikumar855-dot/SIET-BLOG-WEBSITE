"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const navItems = [
  ["Home", "/"],
  ["News", "/news"],
  ["Articles", "/articles"],
  ["Magazine", "/magazine"],
  ["Domains", "/domains"],
  ["Search", "/search"],
  ["About", "/about"],
  ["Contact", "/contact"],
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setOpen(false);
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

  return (
    <header className={`navbar ${open ? "navbar-open" : ""}`}>
      <div className="navbar-inner">
        <Link className="navbar-brand" href="/">
          <span>SIET News</span>
          <small>AI Research Lab · SIET</small>
        </Link>

        <div className="navbar-actions">
          <Link
            href="/search"
            className="navbar-search-btn"
            aria-label="Search the archive"
          >
            <Search size={18} strokeWidth={1.8} />
          </Link>

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
                    <Link href={href} className="menu-item-link">
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
            <div className="menu-footer-links">
              <Link href="/admin">Admin Console</Link>
              <span className="separator">·</span>
              <Link href="/about">About Lab</Link>
              <span className="separator">·</span>
              <Link href="/contact">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
