"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface Project {
  name: string;
  description: string;
  technologies: string[];
  github: string;
  video?: string;
  tags?: string[];
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch projects");
        return res.json();
      })
      .then((data) => {
        setProjects(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-16 px-6 sm:px-10">
        <div className="text-white/60">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-16 px-6 sm:px-10">
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-16 px-6 sm:px-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
        <h1 className="text-4xl sm:text-5xl font-medium text-white">Works</h1>
        <Link 
          href="/projects" 
          className="text-[#C8FF00] hover:text-[#C8FF00]/80 transition-colors flex items-center gap-1 text-sm font-medium tracking-wide"
        >
          VIEW ALL PROJECTS <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-white/60 text-center py-20">
          No projects found. Add some projects in the admin panel to get started!
        </div>
      ) : (
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
          {projects.map((project, idx) => (
            <a
              key={idx}
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="bg-white/5 border border-white/10 p-6 rounded-xl hover:border-[#C8FF00]/20 transition-colors h-full flex flex-col">
                {/* Placeholder for project screenshot - could add image URL to project model later */}
                <div className="aspect-video bg-white/5 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  {project.video && (project.video.includes("youtube") || project.video.includes("vimeo")) ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <a
                        href={project.video}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#C8FF00] text-sm hover:underline"
                      >
                        Watch Video Demo →
                      </a>
                    </div>
                  ) : project.video ? (
                    <video src={project.video} className="w-full h-full object-cover" muted playsInline />
                  ) : (
                    <div className="text-white/30 text-sm">No preview</div>
                  )}
                </div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h2 className="font-medium text-xl text-white group-hover:text-[#C8FF00] transition-colors flex-1">
                    {project.name}
                  </h2>
                  <ArrowUpRight className="w-5 h-5 text-[#C8FF00] shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <p className="text-white/70 text-sm mb-4 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-2 text-xs mb-3">
                  {project.tags?.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-1 rounded bg-[#C8FF00]/10 text-[#C8FF00]/90">
                      {tag}
                    </span>
                  ))}
                </div>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 text-xs text-white/50 mt-auto">
                    {project.technologies.slice(0, 4).join(" • ")}
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
