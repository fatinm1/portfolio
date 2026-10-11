"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { OPEN_COMMAND_MENU_EVENT } from "./SiteHeader";
import { navigateWithTransition } from "./ViewTransitions";
import type { Project } from "./ProjectShowcase";

type Item = {
  id: string;
  group: "Sections" | "Pages" | "Projects" | "Links";
  label: string;
  hint?: string;
  keywords?: string;
  href: string;
  external?: boolean;
};

const STATIC_ITEMS: Item[] = [
  { id: "s-work", group: "Sections", label: "Experience", keywords: "work jobs timeline education", href: "/#work" },
  { id: "s-projects", group: "Sections", label: "Projects", keywords: "work portfolio", href: "/#projects" },
  { id: "s-writing", group: "Sections", label: "Latest writing", keywords: "blog post article", href: "/#writing" },
  { id: "s-contact", group: "Sections", label: "Contact", keywords: "message hire email form", href: "/#contact" },
  { id: "p-home", group: "Pages", label: "Home", href: "/" },
  { id: "p-projects", group: "Pages", label: "All projects", href: "/projects" },
  { id: "p-writing", group: "Pages", label: "Writing", keywords: "blog posts articles", href: "/writing" },
  { id: "p-chatbot", group: "Pages", label: "Chatbot", keywords: "ai assistant ask", href: "/chatbot" },
  { id: "p-login", group: "Pages", label: "Admin login", keywords: "sign in dashboard", href: "/login" },
  { id: "l-github", group: "Links", label: "GitHub", hint: "github.com/fatinm1", keywords: "code repos", href: "https://github.com/fatinm1", external: true },
  { id: "l-linkedin", group: "Links", label: "LinkedIn", hint: "in/fatin-mojumder", href: "https://linkedin.com/in/fatin-mojumder", external: true },
  { id: "l-email", group: "Links", label: "Email", hint: "fatinm1@umbc.edu", keywords: "mail contact", href: "mailto:fatinm1@umbc.edu", external: true },
];

const GROUP_ORDER: Item["group"][] = ["Sections", "Pages", "Projects", "Links"];

const matches = (item: Item, query: string) => {
  const haystack = `${item.label} ${item.hint ?? ""} ${item.keywords ?? ""} ${item.group}`.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
};

export default function CommandMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [dynamicItems, setDynamicItems] = useState<Item[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const openMenu = useCallback(() => {
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    setQuery("");
    setActive(0);
    setOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setOpen(false);
    // Return focus to whatever opened the menu.
    restoreFocusRef.current?.focus?.();
  }, []);

  // ⌘K / Ctrl+K anywhere, plus the header button's event.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) closeMenu();
        else openMenu();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_COMMAND_MENU_EVENT, openMenu);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_COMMAND_MENU_EVENT, openMenu);
    };
  }, [open, openMenu, closeMenu]);

  // Projects and the resume link are loaded the first time the menu opens.
  useEffect(() => {
    if (!open || dynamicItems) return;
    Promise.all([
      fetch("/api/projects").then((r) => (r.ok ? r.json() : [])).catch(() => []),
      fetch("/api/resume").then((r) => (r.ok ? r.json() : null)).catch(() => null),
    ]).then(([projects, resumeData]) => {
      const items: Item[] = (Array.isArray(projects) ? (projects as Project[]) : []).map((p) => ({
        id: `project-${p.id}`,
        group: "Projects",
        label: p.name,
        hint: p.status?.trim() || undefined,
        keywords: [...(p.technologies ?? []), ...(p.tags ?? [])].join(" "),
        href: p.live_url?.trim() || p.github,
        external: true,
      }));
      if (resumeData?.resume?.url) {
        items.push({ id: "l-resume", group: "Links", label: "Resume", hint: "PDF", keywords: "cv", href: resumeData.resume.url, external: true });
      }
      setDynamicItems(items);
    });
  }, [open, dynamicItems]);

  // Lock page scroll while open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const results = useMemo(() => {
    const all = [...STATIC_ITEMS, ...(dynamicItems ?? [])];
    const filtered = query.trim() ? all.filter((item) => matches(item, query)) : all;
    return GROUP_ORDER.flatMap((group) => filtered.filter((item) => item.group === group));
  }, [query, dynamicItems]);

  useEffect(() => setActive(0), [query]);

  // Keep the highlighted option in view while arrowing through the list.
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const run = (item: Item) => {
    setOpen(false);
    if (item.href.startsWith("mailto:")) {
      window.location.href = item.href;
    } else if (item.external) {
      window.open(item.href, "_blank", "noopener,noreferrer");
    } else if (item.href.startsWith("/#") && pathname === "/") {
      const target = document.getElementById(item.href.slice(2));
      target?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      history.replaceState(null, "", item.href);
      return;
    } else {
      navigateWithTransition(router, item.href);
      return;
    }
    restoreFocusRef.current?.focus?.();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(Math.max(0, results.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[active]) run(results[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeMenu();
    } else if (e.key === "Tab") {
      // The input is the only focus stop; options are reached with the arrow keys.
      e.preventDefault();
    }
  };

  const duration = reduceMotion ? 0 : 0.25;
  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="command-menu"
          className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration, ease }}
        >
          <div aria-hidden="true" className="absolute inset-0 bg-black/50 backdrop-blur-[8px]" onClick={closeMenu} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search the site"
            className="relative w-full max-w-[560px] overflow-hidden rounded-2xl border border-[#26262b] bg-[#0a0a0d]/95 shadow-[0_24px_80px_rgba(0,0,0,.6)]"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration, ease }}
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--faint)" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                ref={inputRef}
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                role="combobox"
                aria-expanded="true"
                aria-controls="command-menu-list"
                aria-activedescendant={results[active] ? `cmd-${results[active].id}` : undefined}
                aria-autocomplete="list"
                placeholder="Search sections, projects and links"
                className="h-14 flex-1 bg-transparent text-[15px] text-foreground placeholder:text-faint focus:outline-none"
              />
              <kbd className="rounded-md border border-[#26262b] px-1.5 py-0.5 font-mono text-[11px] text-faint">esc</kbd>
            </div>

            <ul ref={listRef} id="command-menu-list" role="listbox" aria-label="Results" className="m-0 max-h-[min(420px,60vh)] list-none overflow-y-auto p-2">
              {results.length === 0 ? (
                <li className="px-3 py-8 text-center text-sm text-faint">No results for &ldquo;{query}&rdquo;</li>
              ) : (
                results.map((item, i) => {
                  const showGroup = i === 0 || results[i - 1].group !== item.group;
                  return (
                    <li key={item.id} role="presentation">
                      {showGroup ? (
                        <div role="presentation" className="px-3 pb-1 pt-3 font-mono text-[11px] uppercase tracking-[.06em] text-faint">
                          {item.group}
                        </div>
                      ) : null}
                      <div
                        id={`cmd-${item.id}`}
                        role="option"
                        aria-selected={i === active}
                        data-index={i}
                        onMouseMove={() => setActive(i)}
                        onClick={() => run(item)}
                        className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm ${
                          i === active ? "bg-white/[.06] text-foreground" : "text-muted"
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                        <span className="flex shrink-0 items-center gap-2 font-mono text-xs text-faint">
                          {item.hint}
                          {item.external ? <span aria-hidden="true">↗</span> : null}
                        </span>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
