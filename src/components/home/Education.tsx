import { Reveal, SectionHeading } from "./Reveal";
import { RowHeading, cardClass } from "./TimelineRow";

const EDUCATION = {
  mono: "BS",
  role: "B.S. Computer Science",
  org: "University of Maryland, Baltimore County",
  dates: "Expected Dec 2026",
};

export default function Education() {
  return (
    <Reveal id="education" className="flex flex-col gap-3.5">
      <SectionHeading>Education</SectionHeading>
      <div className={`${cardClass} flex items-center gap-3.5 px-5 py-[18px]`}>
        <RowHeading {...EDUCATION} />
      </div>
    </Reveal>
  );
}
