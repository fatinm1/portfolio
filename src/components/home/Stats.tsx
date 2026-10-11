"use client";

import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const COUNT_MS = 1400;

const STATS = [
  { format: (p: number) => `${(12.6 * p).toFixed(1)} tok/s`, label: "LLM Engine on an M4" },
  { format: (p: number) => `${Math.round(87 * p)}% faster`, label: "contract review, in testing" },
  { format: (p: number) => `${Math.round(60 * p)}+ runs`, label: "validated automatically" },
  { format: (p: number) => `${Math.round(6 * p)} agents`, label: "coordinated in LectureKit" },
];

export default function Stats() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true });
  const [progress, setProgress] = useState(0);

  // Count up from 0 with an ease-out cubic, once, when the strip first enters view.
  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / COUNT_MS);
      setProgress(1 - Math.pow(1 - t, 3));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView]);

  return (
    <section
      ref={ref}
      aria-label="Highlights"
      className="silk-up silk-u6 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-px overflow-hidden rounded-2xl border border-border bg-border"
    >
      {STATS.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-1 bg-[rgba(8,8,11,.85)] p-5">
          <span className="text-[22px] font-semibold sm:text-[26px] tracking-[-0.03em] tabular-nums">{stat.format(progress)}</span>
          <span className="text-xs leading-[1.4] text-[#8b8b93]">{stat.label}</span>
        </div>
      ))}
    </section>
  );
}
