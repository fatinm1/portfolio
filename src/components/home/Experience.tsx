"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Reveal, SectionHeading, SILK_EASE } from "./Reveal";

const JOBS = [
  {
    mono: "UR",
    role: "Undergraduate Research Assistant",
    org: "UMBC Computer Science",
    dates: "2026",
    detail:
      "Built a Python tool that checked 60+ quantum simulation runs against reference solutions, cutting manual review from 4 hours to 5 minutes.",
  },
  {
    mono: "JMC",
    role: "Part Time Software Engineer (Contract)",
    org: "JMC Family Office",
    dates: "2025",
    detail:
      "Built the API and data model for an AI contract review prototype with the firm's VP. Review time went from 40 to 5 minutes per document in testing.",
  },
  {
    mono: "GA",
    role: "Information Technology Assistant",
    org: "UMBC Graduate Admissions",
    dates: "2023 to 2025",
    detail:
      "Processed records for 5,000+ applicants a cycle and wrote Python scripts to automate parts of data entry.",
  },
];

const EDUCATION = {
  mono: "BS",
  role: "B.S. Computer Science",
  org: "University of Maryland, Baltimore County",
  dates: "Expected Dec 2026",
};

const cardClass = "silk-soft rounded-2xl border border-border bg-white/[.02]";
const monoBadgeClass =
  "flex h-[38px] flex-[0_0_38px] items-center justify-center rounded-[10px] border border-[#26262b] bg-[#15151a] font-mono text-xs text-[#8b8b93]";

function TimelineDot({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="absolute left-[-22px] top-[26px] h-[9px] w-[9px] rounded-full transition-[background-color,box-shadow] duration-[400ms]"
      style={{
        background: active ? "var(--accent)" : "#2a2a30",
        boxShadow: active ? "0 0 12px var(--accent)" : "none",
      }}
    />
  );
}

function RowHeading({ mono, role, org, dates }: { mono: string; role: string; org: string; dates: string }) {
  return (
    <>
      <span aria-hidden="true" className={monoBadgeClass}>
        {mono}
      </span>
      <span className="flex min-w-0 flex-auto flex-col gap-[3px]">
        <span className="font-medium">{role}</span>
        <span className="text-[13px] text-[#8b8b93]">{org}</span>
        {/* On phones the date sits under the org so the title keeps its width */}
        <span className="font-mono text-xs text-faint sm:hidden">{dates}</span>
      </span>
      <span className="hidden shrink-0 font-mono text-xs text-faint sm:inline">{dates}</span>
    </>
  );
}

export default function Experience() {
  const [open, setOpen] = useState(0);

  return (
    <Reveal id="work" className="flex flex-col gap-3.5">
      <SectionHeading>Experience</SectionHeading>
      <div className="relative pl-[22px]">
        <motion.span
          aria-hidden="true"
          data-reveal
          className="absolute bottom-2.5 left-1 top-2.5 w-px origin-top bg-[linear-gradient(180deg,var(--accent),var(--secondary)_60%,transparent)]"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, delay: 0.5, ease: SILK_EASE }}
        />
        <ol className="m-0 flex list-none flex-col gap-3.5 p-0">
          {JOBS.map((job, i) => {
            const isOpen = open === i;
            const panelId = `job-panel-${i}`;
            return (
              <li key={job.role} className="relative">
                <TimelineDot active={isOpen} />
                <div className={cardClass}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full cursor-pointer items-center gap-3.5 border-0 bg-transparent px-5 py-[18px] text-left text-foreground"
                  >
                    <RowHeading {...job} />
                    <svg
                      className="silk-chev shrink-0"
                      aria-hidden="true"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#8b8b93"
                      strokeWidth="2"
                      strokeLinecap="round"
                      style={{ transform: `rotate(${isOpen ? 180 : 0}deg)` }}
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  <div
                    id={panelId}
                    className="silk-acc"
                    aria-hidden={!isOpen}
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr", opacity: isOpen ? 1 : 0 }}
                  >
                    <div className="overflow-hidden">
                      <p className="m-0 pb-5 pl-5 pr-5 text-[15px] leading-[1.65] text-muted sm:pl-[72px]">{job.detail}</p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
          <li className="relative">
            <TimelineDot active={false} />
            <div className={`${cardClass} flex items-center gap-3.5 px-5 py-[18px]`}>
              <RowHeading {...EDUCATION} />
              {/* Chevron-width spacer keeps the date aligned with the rows above */}
              <span aria-hidden="true" className="hidden w-4 shrink-0 sm:inline" />
            </div>
          </li>
        </ol>
      </div>
    </Reveal>
  );
}
