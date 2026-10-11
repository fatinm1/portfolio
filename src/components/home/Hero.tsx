"use client";

import { useEffect, useState } from "react";

const WORDS = ["AI agents.", "inference engines.", "full stack apps."];
const ROTATE_MS = 2600;

const pillClass = "silk-pill rounded-full px-[18px] py-[11px] text-sm";
const ghostClass = `${pillClass} silk-ghost border border-[#2a2a30] text-foreground`;

interface Resume {
  filename: string;
  url: string;
}

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0);
  const [resume, setResume] = useState<Resume | null>(null);

  useEffect(() => {
    fetch("/api/resume")
      .then((res) => (res.ok ? res.json() : { resume: null }))
      .then((data) => setResume(data?.resume || null))
      .catch(() => setResume(null));
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setWordIndex((i) => (i + 1) % WORDS.length), ROTATE_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="flex flex-col gap-[22px]">
      <span className="silk-up silk-u2 inline-flex w-fit items-center gap-2 rounded-full border border-[#1f2a10] bg-accent/5 px-3 py-1.5 text-xs text-[#c9d78f]">
        <span className="silk-ping h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
        Open to new grad roles from January 2027
      </span>

      <h1 className="silk-up silk-u3 m-0 text-[clamp(34px,5vw,50px)] font-semibold leading-[1.12] tracking-[-0.04em]">
        <span className="silk-shimmer">Fatin Mojumder</span>{" "}
        <span className="font-normal text-[#8b8b93]">is a software engineer building</span>{" "}
        <span className="silk-swap">
          {WORDS.map((word, i) => {
            // 0 = showing, 1 = waiting below, 2 = just left upwards
            const offset = (i - wordIndex + WORDS.length) % WORDS.length;
            const showing = offset === 0;
            return (
              <span
                key={word}
                aria-hidden={!showing}
                className="text-foreground"
                style={{
                  transform: `translateY(${showing ? 0 : offset === 1 ? 100 : -100}%)`,
                  opacity: showing ? 1 : 0,
                  filter: showing ? "none" : "blur(6px)",
                }}
              >
                {word}
              </span>
            );
          })}
        </span>
      </h1>

      <p className="silk-up silk-u4 m-0 text-[17px] leading-[1.7] text-muted">
        CS at UMBC, graduating December 2026. Lately I&apos;ve been writing an LLM inference engine in C++ and
        measuring exactly why it&apos;s slower than llama.cpp.
      </p>

      <div className="silk-up silk-u5 flex flex-wrap gap-2.5">
        {resume ? (
          <a
            href={resume.url}
            download={resume.filename}
            className={`${pillClass} silk-primary bg-accent font-medium text-[#0a0a0a] hover:text-[#0a0a0a]`}
          >
            Resume <span className="silk-arrow">↗</span>
          </a>
        ) : (
          <span
            aria-disabled="true"
            className={`${pillClass} bg-accent/40 font-medium text-[#0a0a0a]/70`}
            title="Resume is not available right now"
          >
            Resume <span>↗</span>
          </span>
        )}
        <a href="#contact" className={ghostClass}>
          Get in touch
        </a>
        <a href="https://github.com/fatinm1" target="_blank" rel="noopener noreferrer" className={ghostClass}>
          GitHub
        </a>
        <a
          href="https://linkedin.com/in/fatin-mojumder"
          target="_blank"
          rel="noopener noreferrer"
          className={ghostClass}
        >
          LinkedIn
        </a>
      </div>
    </section>
  );
}
