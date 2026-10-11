"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { label: "Work", href: "/#work" },
  { label: "Projects", href: "/#projects" },
  { label: "Writing", href: "/writing" },
];

/** Event the ⌘K command menu listens for. */
export const OPEN_COMMAND_MENU_EVENT = "open-command-menu";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (menuOpen) {
      firstLinkRef.current?.focus();
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setMenuOpen(false);
      };
      window.addEventListener("keydown", onKey);
      wasOpen.current = true;
      return () => window.removeEventListener("keydown", onKey);
    }
    if (wasOpen.current) {
      toggleRef.current?.focus();
      wasOpen.current = false;
    }
  }, [menuOpen]);

  const openCommandMenu = () => window.dispatchEvent(new Event(OPEN_COMMAND_MENU_EVENT));

  return (
    <header id="top" className="relative z-10 mx-auto w-full max-w-[768px] px-6 pt-7 [view-transition-name:site-header]">
      <div className="silk-up flex items-center justify-between gap-3">
        <Link href="/" className="inline-flex items-center gap-2 font-semibold tracking-[-0.02em] text-foreground">
          <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_var(--accent)]" aria-hidden="true" />
          Fatin
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-5 text-sm sm:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-muted hover:text-foreground">
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={openCommandMenu}
            aria-label="Open search"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#26262b] bg-white/[.03] px-2.5 py-1.5 font-mono text-xs text-muted hover:text-foreground"
          >
            ⌘ K
          </button>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="rounded-lg border border-[#26262b] bg-white/[.03] px-3 py-1.5 text-sm text-muted sm:hidden"
        >
          Menu
        </button>
      </div>

      {/* Mobile sheet */}
      <div
        aria-hidden="true"
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-[55] bg-black/40 backdrop-blur-[8px] transition-opacity duration-300 ease-silk sm:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!menuOpen}
        className={`fixed inset-x-0 top-0 z-[60] border-b border-border bg-[#08080b]/95 px-6 pb-8 pt-7 transition-transform duration-[400ms] ease-silk sm:hidden ${
          menuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 font-semibold tracking-[-0.02em]">
            <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_var(--accent)]" aria-hidden="true" />
            Fatin
          </span>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="rounded-lg border border-[#26262b] bg-white/[.03] px-3 py-1.5 text-sm text-muted"
          >
            Close
          </button>
        </div>
        <nav aria-label="Mobile" className="mt-8 flex flex-col gap-1">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              ref={i === 0 ? firstLinkRef : undefined}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="py-3 text-2xl font-medium tracking-[-0.02em] text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              openCommandMenu();
            }}
            className="mt-4 w-fit rounded-lg border border-[#26262b] bg-white/[.03] px-3 py-2 text-left text-sm text-muted"
          >
            Search the site
          </button>
        </nav>
      </div>
    </header>
  );
}
