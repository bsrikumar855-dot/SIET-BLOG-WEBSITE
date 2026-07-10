"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { TransparentLogo } from "./TransparentLogo";

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
