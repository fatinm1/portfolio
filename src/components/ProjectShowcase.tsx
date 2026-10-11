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

export function FeaturedProjectCard({ project }: { project: Project }) {
  const label = project.status?.trim() ? `Featured · ${project.status.trim()}` : "Featured";
  return (
    <a href={projectHref(project)} target="_blank" rel="noopener noreferrer" className="silk-beam block">
      <div className="flex flex-wrap items-center gap-5 rounded-[17px] bg-[#0a0a0d] p-3.5">
        <div className="relative aspect-[16/10] flex-[1_1_260px] overflow-hidden rounded-xl border border-[#1f1f25]">
          <ProjectThumbnail
            src={project.photo}
            name={project.name}
            variant="featured"
            sizes="(max-width: 640px) calc(100vw - 80px), 340px"
          />
        </div>
        <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-2.5 px-2 py-1.5">
          <span className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xl font-semibold tracking-[-0.02em] text-foreground">
              {project.name} <span className="silk-arrow text-[#8b8b93]">↗</span>
            </span>
            <span className={`${badgeBase} border-[#2f3a10] bg-accent/[.06] text-accent`}>{label}</span>
          </span>
          <span className="line-clamp-4 text-[15px] leading-[1.6] text-muted">{project.description}</span>
        </div>
      </div>
    </a>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <a
      href={projectHref(project)}
      target="_blank"
      rel="noopener noreferrer"
      className="silk-soft silk-card flex flex-col gap-2.5 rounded-2xl border border-border bg-white/[.02] px-3 pb-5 pt-3"
    >
      <div className="relative mb-1.5 aspect-[16/10] overflow-hidden rounded-xl border border-[#1f1f25]">
        <ProjectThumbnail
          src={project.photo}
          name={project.name}
          sizes="(max-width: 640px) calc(100vw - 72px), 240px"
        />
      </div>
      <span className="flex items-center justify-between gap-2 px-2">
        <span className="font-semibold text-foreground">{project.name}</span>
        {project.status?.trim() ? <StatusBadge status={project.status.trim()} /> : null}
      </span>
      <span className="line-clamp-2 px-2 text-sm leading-[1.6] text-muted">{project.description}</span>
    </a>
  );
}

export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-3.5">
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
          <div key={i} className={`${block} h-[230px]`} />
        ))}
      </div>
    </div>
  );
}
