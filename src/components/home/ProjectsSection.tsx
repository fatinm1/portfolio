"use client";

import Link from "next/link";
import {
  FeaturedProjectCard,
  ProjectGrid,
  ProjectsSkeleton,
  splitFeatured,
  useProjects,
} from "@/components/ProjectShowcase";
import { Reveal, SectionHeading } from "./Reveal";

/** Cards shown under the featured project on the homepage; /projects lists the rest. */
const HOME_CARD_COUNT = 3;

export default function ProjectsSection() {
  const state = useProjects();
  const projects = state.status === "ready" ? state.projects : [];
  const { featured, rest } = splitFeatured(projects);
  const hasMore = rest.length > HOME_CARD_COUNT;

  return (
    <Reveal id="projects" className="flex flex-col gap-3.5">
      <SectionHeading
        action={
          hasMore ? (
            <Link href="/projects" className="shrink-0 font-mono text-xs text-muted hover:text-foreground">
              All projects <span className="silk-arrow">↗</span>
            </Link>
          ) : null
        }
      >
        Projects
      </SectionHeading>

      {state.status === "loading" ? (
        <ProjectsSkeleton />
      ) : state.status === "error" ? (
        <p className="text-sm text-muted">Projects are unavailable right now. Please check back soon.</p>
      ) : !featured ? (
        <p className="text-sm text-muted">No projects yet.</p>
      ) : (
        <>
          <FeaturedProjectCard project={featured} />
          {rest.length > 0 ? <ProjectGrid projects={rest.slice(0, HOME_CARD_COUNT)} /> : null}
        </>
      )}
    </Reveal>
  );
}
