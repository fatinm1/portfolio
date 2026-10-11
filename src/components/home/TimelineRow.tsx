// Shared card pieces for the Experience and Education sections. Not a client module,
// so server components (Education) can import the plain class strings.

export const cardClass = "silk-soft rounded-2xl border border-border bg-white/[.02]";
const monoBadgeClass =
  "flex h-[38px] flex-[0_0_38px] items-center justify-center rounded-[10px] border border-[#26262b] bg-[#15151a] font-mono text-xs text-[#8b8b93]";

export function RowHeading({ mono, role, org, dates }: { mono: string; role: string; org: string; dates: string }) {
  return (
    <>
      <span aria-hidden="true" className={monoBadgeClass}>
        {mono}
      </span>
      <span className="flex min-w-0 flex-auto flex-col gap-[3px]">
        <span className="font-medium">{role}</span>
        <span className="text-[13px] text-[#8b8b93]">{org}</span>
        {/* On phones the date sits under the org so the title keeps its width */}
        <span className="font-mono text-xs text-faint sm:hidden">{dates}</span>
      </span>
      <span className="hidden shrink-0 font-mono text-xs text-faint sm:inline">{dates}</span>
    </>
  );
}
