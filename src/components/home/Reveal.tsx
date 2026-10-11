"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export const SILK_EASE = [0.16, 1, 0.3, 1] as const;

// `data-reveal` lets globals.css force the final state under prefers-reduced-motion.

/** Section that rises 28px and un-blurs from 8px the first time it scrolls into view. */
export function Reveal({
  children,
  id,
  className = "",
  ariaLabel,
}: {
  children: ReactNode;
  id?: string;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <motion.section
      id={id}
      aria-label={ariaLabel}
      data-reveal
      className={`scroll-mt-6 ${className}`}
      initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1, ease: SILK_EASE }}
    >
      {children}
    </motion.section>
  );
}

/** Mono uppercase section label with a 1px rule that draws left to right. */
export function SectionHeading({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-1.5 flex items-center gap-3.5">
      <h2 className="m-0 font-mono text-[13px] font-medium uppercase tracking-[.06em] text-faint">{children}</h2>
      <motion.span
        aria-hidden="true"
        data-reveal
        className="h-px flex-1 origin-left bg-gradient-to-r from-[#2a2a30] to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.3, ease: SILK_EASE }}
      />
      {action}
    </div>
  );
}
