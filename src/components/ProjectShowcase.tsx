"use client";

import { useEffect, useState } from "react";
import { ProjectThumbnail } from "./ProjectThumbnail";

export interface Project {
  id: number;
  name: string;
  description: string;
  technologies: string[];
  github: string;
  photo?: string | null;
  live_url?: string | null;
  tags?: string[];
  status?: string | null;
  featured?: boolean;
}

type ProjectsState = { status: "loading" } | { status: "error" } | { status: "ready"; projects: Project[] };

export function useProjects(): ProjectsState {
  const [state, setState] = useState<ProjectsState>({ status: "loading" });
  useEffect(() => {
    fetch("/api/projects")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load projects");
        return res.json();
      })
      .then((data) => setState({ status: "ready", projects: Array.isArray(data) ? data : [] }))
      .catch(() => setState({ status: "error" }));
  }, []);
  return state;
}

/** The project marked featured in the admin panel, otherwise the newest one. */
export function splitFeatured(projects: Project[]): { featured: Project | null; rest: Project[] } {
  const featured = projects.find((p) => p.featured) ?? projects[0] ?? null;
  return { featured, rest: projects.filter((p) => p !== featured) };
}

const projectHref = (p: Project) => p.live_url?.trim() || p.github;

// Stable attachment URLs redirect to a fresh streaming URL on each request.
// Keep the published videos outside the application bundle and Git history.
const PROJECT_DEMOS: Record<string, { src: string; development?: boolean }> = {
  "https://github.com/fatinm1/nida-proj": {
    src: "https://github.com/user-attachments/assets/da42192f-01f1-48c5-96e3-4b6222fd1575",
  },
  "https://github.com/fatinm1/llm-engine": {
    src: "https://github.com/user-attachments/assets/c306283c-325e-445d-86bf-2b1832349792",
  },
  "https://github.com/fatinm1/lecturekit": {
    src: "https://github.com/user-attachments/assets/995f1709-85bb-4c6b-8cf3-573899152b49",
  },
  "https://github.com/fatinm1/therapy-scheduling": {
    src: "https://github.com/user-attachments/assets/ad734257-3aa1-40c4-9f8a-e9261b54701f",
    development: true,
  },
};

function ProjectMedia({ project, featured = false }: { project: Project; featured?: boolean }) {
  const demo = PROJECT_DEMOS[project.github.trim().replace(/\.git$|\/$/g, "").toLowerCase()];
  if (demo) {
    return (
      <div className="flex flex-col gap-2">
        <video
          controls
          playsInline
          preload="none"
          poster={project.photo || undefined}
          aria-label={`${project.name} — 60-second demo`}
          className="aspect-video w-full rounded-xl border border-[#1f1f25] bg-black object-contain"
        >
          <source src={demo.src} type="video/mp4" />
          <a href={demo.src}>Watch the {project.name} demo</a>
        </video>
        <span className="px-1 font-mono text-[11px] text-muted">
          60-second demo{demo.development ? " · Development demo" : ""}
        </span>
      </div>
    );
  }
  return (
    <a
      href={projectHref(project)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Explore ${project.name}`}
      className="relative block aspect-[16/10] overflow-hidden rounded-xl border border-[#1f1f25]"
    >
      <ProjectThumbnail
        src={project.photo}
        name={project.name}
        variant={featured ? "featured" : "card"}
        sizes={featured ? "(max-width: 640px) calc(100vw - 80px), 340px" : "(max-width: 640px) calc(100vw - 72px), 240px"}
      />
    </a>
  );
}

const badgeBase = "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-[9px] py-[3px] text-[11px]";

export function StatusBadge({ status }: { status: string }) {
  const key = status.trim().toLowerCase();
  if (key === "live") {
    return (
      <span className={`${badgeBase} border-[#14402a] bg-success/[.06] text-success`}>
        <span className="silk-ping h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
        {status}
      </span>
    );
  }
  if (key === "prototype") {
    return <span className={`${badgeBase} border-[#3a2f10] bg-warning/[.06] text-warning`}>{status}</span>;
  }
  if (key === "open source") {
    return <span className={`${badgeBase} border-[#2f3a10] bg-accent/[.06] text-accent`}>{status}</span>;
  }
  return <span className={`${badgeBase} border-[#26262b] text-muted`}>{status}</span>;
}

export function FeaturedProjectCard({ project, highlighted = true }: { project: Project; highlighted?: boolean }) {
  const label = project.status?.trim() ? `Featured · ${project.status.trim()}` : "Featured";
  return (
    <article className="silk-beam block">
      <div className="flex flex-wrap items-center gap-5 rounded-[17px] bg-[#0a0a0d] p-3.5">
        <div className="min-w-0 flex-[1_1_260px]">
          <ProjectMedia project={project} featured />
        </div>
        <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-2.5 px-2 py-1.5">
          <span className="flex flex-wrap items-center justify-between gap-2">
            <a href={projectHref(project)} target="_blank" rel="noopener noreferrer" className="text-xl font-semibold tracking-[-0.02em] text-foreground hover:text-accent">
              {project.name} <span className="silk-arrow text-[#8b8b93]">↗</span>
            </a>
            {highlighted ? (
              <span className={`${badgeBase} border-[#2f3a10] bg-accent/[.06] text-accent`}>{label}</span>
            ) : project.status?.trim() ? <StatusBadge status={project.status.trim()} /> : null}
          </span>
          <span className="line-clamp-4 text-[15px] leading-[1.6] text-muted">{project.description}</span>
        </div>
      </div>
    </article>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return <FeaturedProjectCard project={project} highlighted={false} />;
}

export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="flex flex-col gap-3.5">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

/** Reserves roughly the final layout while projects load, to avoid a jump. */
export function ProjectsSkeleton() {
  const block = "rounded-2xl border border-border bg-white/[.02]";
  return (
    <div aria-busy="true" aria-label="Loading projects" className="flex flex-col gap-3.5">
      <div className={`${block} h-[220px]`} />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-3.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`${block} h-[220px]`} />
        ))}
      </div>
    </div>
  );
}

