"use client";
import React, { useEffect, useState } from "react";

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
        if (!res.ok) {
          throw new Error('Failed to fetch projects');
        }
        return res.json();
      })
      .then((data) => {
        // Ensure data is an array
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
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Projects</h1>
        <div className="text-center text-white/60">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Projects</h1>
        <div className="text-center text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Projects</h1>
      {projects.length === 0 ? (
        <div className="text-center text-white/60">No projects found. Add some projects to get started!</div>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2">
          {projects.map((project, idx) => (
            <div key={idx} className="glass p-6 flex flex-col gap-3">
              <h2 className="font-semibold text-xl">{project.name}</h2>
              <p className="text-white/80">{project.description}</p>
              <div className="flex flex-wrap gap-2 text-xs mt-2">
                {project.tags?.map((tag) => (
                  <span key={tag} className="bg-cyan-600/30 px-2 py-1 rounded">{tag}</span>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <a href={project.github} className="text-cyan-400 underline" target="_blank" rel="noopener noreferrer">GitHub</a>
                {project.video && (project.video.includes("youtube") || project.video.includes("vimeo")) ? (
                  <a href={project.video} className="text-cyan-400 underline" target="_blank" rel="noopener noreferrer">Video Demo</a>
                ) : project.video ? (
                  <video src={project.video} controls className="w-full rounded mt-2" />
                ) : null}
              </div>
              {project.technologies && (
                <div className="flex flex-wrap gap-2 mt-2 text-xs">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="bg-blue-600/30 px-2 py-1 rounded">{tech}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 