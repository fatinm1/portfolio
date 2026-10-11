import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects by Fatin Mojumder: AI agents, an LLM inference engine in C++, and full stack apps.",
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
