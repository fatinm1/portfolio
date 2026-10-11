import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Writing | Fatin Mojumder",
  description: "Technical writeups by Fatin Mojumder.",
};

const posts = [
  {
    href: "/writing/llm-engine-benchmark",
    title: "Why llama.cpp generates text almost 9x faster than my from scratch LLM engine",
    summary:
      "I benchmarked my C++ inference engine against llama.cpp on an Apple M4, found where the time and memory go, and tested the fixes.",
    date: "October 2026",
  },
];

export default function WritingPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">
      <h1 className="text-3xl sm:text-4xl font-medium text-white mb-10">Writing</h1>
      <ul className="space-y-6">
        {posts.map((post) => (
          <li key={post.href}>
            <Link
              href={post.href}
              className="block p-6 rounded-xl bg-white/5 border border-white/10 hover:border-[#C8FF00]/50 transition-colors"
            >
              <p className="text-white/50 text-sm mb-2">{post.date}</p>
              <h2 className="text-xl font-medium text-white mb-2">{post.title}</h2>
              <p className="text-white/70">{post.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
