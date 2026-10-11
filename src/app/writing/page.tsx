import type { Metadata } from "next";
import Link from "next/link";
import SilkBackground from "@/components/SilkBackground";

export const metadata: Metadata = {
  title: "Writing | Fatin Mojumder",
  description: "Technical writeups by Fatin Mojumder.",
};

const posts = [
  {
    href: "/writing/llm-engine-benchmark",
    title: "Why llama.cpp generates text almost 9x faster than my from scratch LLM engine",
    summary:
      "I built my own program for running an AI language model on a laptop, raced it against llama.cpp, the most popular open source one, and dug into why mine is slower.",
    date: "October 2026",
  },
];

export default function WritingPage() {
  return (
    <>
      <SilkBackground />
      <div className="content-column pt-20">
        <section className="flex flex-col gap-3.5">
          <h1 className="silk-up m-0 mb-4 text-[clamp(30px,4vw,40px)] font-semibold tracking-[-0.04em]">Writing</h1>
          <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
            {posts.map((post) => (
              <li key={post.href}>
                <Link href={post.href} className="silk-glowborder block">
                  <div className="flex flex-col gap-2 rounded-[17px] bg-[#0a0a0d] p-6">
                    <span className="font-mono text-xs text-accent">{post.date}</span>
                    <h2 className="m-0 text-[19px] font-semibold leading-[1.35] text-foreground">
                      {post.title} <span className="silk-arrow text-[#8b8b93]">↗</span>
                    </h2>
                    <p className="m-0 text-sm leading-[1.6] text-[#8b8b93]">{post.summary}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
