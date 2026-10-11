"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

type Router = ReturnType<typeof useRouter>;

// Resolves the pending view transition once the new route has rendered.
let finishPending: (() => void) | null = null;

/**
 * Client-side navigation wrapped in the View Transitions API (fade + 8px rise, styled in
 * globals.css). Falls back to a plain router.push when unsupported or under reduced motion.
 */
export function navigateWithTransition(router: Router, href: string) {
  const url = new URL(href, window.location.href);
  const samePage = url.pathname === window.location.pathname;
  const canAnimate =
    typeof document.startViewTransition === "function" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (samePage || !canAnimate) {
    router.push(href);
    return;
  }

  document.startViewTransition(
    () =>
      new Promise<void>((resolve) => {
        finishPending?.();
        finishPending = resolve;
        router.push(href);
        // Never leave the page frozen if a navigation is slow or fails.
        window.setTimeout(resolve, 1500);
      })
  );
}

/** Mount once: animates internal link clicks between pages. */
export default function ViewTransitions() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    finishPending?.();
    finishPending = null;
  }, [pathname]);

  useEffect(() => {
    if (typeof document.startViewTransition !== "function") return;

    // Capture phase runs before next/link's handler, which skips default-prevented clicks.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element | null)?.closest?.("a");
      if (!anchor || !anchor.href || anchor.hasAttribute("download")) return;
      if (anchor.target && anchor.target !== "_self") return;
      const url = new URL(anchor.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      // Route handlers (uploads, API) are not pages.
      if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/uploads/")) return;

      e.preventDefault();
      navigateWithTransition(router, `${url.pathname}${url.search}${url.hash}`);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return null;
}
