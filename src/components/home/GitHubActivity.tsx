"use client";

import { useEffect, useRef, useState } from "react";
import type { ContributionCalendar } from "@/app/api/github/route";
import { Reveal, SectionHeading } from "./Reveal";

// 5 shades from the empty cell color to the accent.
const SHADES = ["#16161b", "#435014", "#6f8b0e", "#9cc507", "#C8FF00"];

const dayLabel = (count: number, date: string) =>
  `${count === 0 ? "No" : count} contribution${count === 1 ? "" : "s"} on ${new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}`;

/** Contribution graph for fatinm1. Renders nothing unless real data loads. */
export default function GitHubActivity() {
  const [calendar, setCalendar] = useState<ContributionCalendar | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load after the page is idle so it never competes with the first paint.
  useEffect(() => {
    let cancelled = false;
    const load = () =>
      fetch("/api/github")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (!cancelled && data?.weeks?.length) setCalendar(data);
        })
        .catch(() => {});
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500));
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout;
    const handle = idle(load);
    return () => {
      cancelled = true;
      cancelIdle(handle);
    };
  }, []);

  // Show the most recent weeks first when the graph is wider than the column.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [calendar]);

  if (!calendar) return null;

  return (
    <Reveal ariaLabel="GitHub activity" className="flex flex-col gap-3.5">
      <SectionHeading
        action={
          <a
            href="https://github.com/fatinm1"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 font-mono text-xs text-muted hover:text-foreground"
          >
            fatinm1 <span className="silk-arrow">↗</span>
          </a>
        }
      >
        GitHub activity
      </SectionHeading>
      <div className="rounded-2xl border border-border bg-white/[.02] p-5">
        {/* A year of 11px squares is wider than the column: scroll without a scrollbar, fade the oldest weeks */}
        <div
          ref={scrollRef}
          className="overflow-x-auto [mask-image:linear-gradient(90deg,transparent,#000_48px)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div
            role="img"
            aria-label={`${calendar.total} contributions in the last year`}
            className="grid w-max grid-flow-col grid-rows-[repeat(7,11px)] gap-[3px]"
          >
            {calendar.weeks.map((week, w) =>
              week.map((day) => (
                <span
                  key={day.date}
                  title={dayLabel(day.count, day.date)}
                  className="h-[11px] w-[11px] rounded-[3px]"
                  style={{
                    background: SHADES[day.level] ?? SHADES[0],
                    gridColumn: w + 1,
                    gridRow: new Date(`${day.date}T00:00:00Z`).getUTCDay() + 1,
                  }}
                />
              ))
            )}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-faint">
          <span>{calendar.total.toLocaleString("en-US")} contributions in the last year</span>
          <span className="flex items-center gap-1.5" aria-hidden="true">
            Less
            {SHADES.map((shade) => (
              <span key={shade} className="h-[11px] w-[11px] rounded-[3px]" style={{ background: shade }} />
            ))}
            More
          </span>
        </div>
      </div>
    </Reveal>
  );
}
