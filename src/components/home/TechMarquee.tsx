import { Reveal } from "./Reveal";

const STACK = ["Python", "C++", "TypeScript", "Next.js", "FastAPI", "PostgreSQL", "Docker", "LangChain", "MCP"];

function StackList({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <ul
      className="m-0 flex list-none flex-wrap gap-x-9 gap-y-2 p-0 pr-9"
      aria-hidden={duplicate || undefined}
      data-duplicate={duplicate || undefined}
    >
      {STACK.map((item) => (
        <li key={item} className="flex gap-9">
          <span>{item}</span>
          <span aria-hidden="true">·</span>
        </li>
      ))}
    </ul>
  );
}

export default function TechMarquee() {
  return (
    <Reveal
      ariaLabel="Tech stack"
      className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]"
    >
      <div className="silk-marquee whitespace-nowrap font-mono text-sm text-faint">
        <StackList />
        <StackList duplicate />
      </div>
    </Reveal>
  );
}
