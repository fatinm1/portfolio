import Link from "next/link";
import { Reveal } from "./Reveal";

export default function LatestWriting() {
  return (
    <Reveal id="writing" ariaLabel="Latest writing">
      <Link href="/writing/llm-engine-benchmark" className="silk-glowborder block">
        <div className="flex flex-col gap-2 rounded-[17px] bg-[#0a0a0d] p-6">
          <span className="font-mono text-xs text-accent">Latest writing</span>
          <span className="text-[19px] font-semibold leading-[1.35] text-foreground">
            Why llama.cpp generates text almost 9x faster than my engine{" "}
            <span className="silk-arrow text-[#8b8b93]">↗</span>
          </span>
          <span className="text-sm text-[#8b8b93]">
            Benchmarks on an Apple M4, where the time goes, and what I&apos;d fix first.
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
