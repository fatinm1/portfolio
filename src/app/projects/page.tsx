"use client";

import SilkBackground from "@/components/SilkBackground";
import {
  FeaturedProjectCard,
  ProjectGrid,
  ProjectsSkeleton,
  splitFeatured,
  useProjects,
} from "@/components/ProjectShowcase";

export default function ProjectsPage() {
  const state = useProjects();
  const { featured, rest } = splitFeatured(state.status === "ready" ? state.projects : []);

  return (
    <>
      <SilkBackground />
      <div className="content-column pt-20">
        <section className="flex flex-col gap-3.5">
          <h1 className="silk-up m-0 mb-4 text-[clamp(30px,4vw,40px)] font-semibold tracking-[-0.04em]">Projects</h1>
          {state.status === "loading" ? (
            <ProjectsSkeleton />
          ) : state.status === "error" ? (
            <p className="text-sm text-muted">Projects are unavailable right now. Please check back soon.</p>
          ) : !featured ? (
            <p className="text-sm text-muted">No projects yet.</p>
          ) : (
            <>
              <FeaturedProjectCard project={featured} />
              {rest.length > 0 ? <ProjectGrid projects={rest} /> : null}
            </>
          )}
        </section>
      </div>
    </>
  );
}
