"use client";

import { useState, useRef, useLayoutEffect } from "react";

type Lines = 2 | 3;

export function ExpandableDescription({
  text,
  className = "",
  lines = 3,
}: {
  text: string;
  className?: string;
  lines?: Lines;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  const clampClass = lines === 2 ? "line-clamp-2" : "line-clamp-3";

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !text.trim()) {
      setShowToggle(false);
      return;
    }
    if (expanded) {
      setShowToggle(true);
      return;
    }
    requestAnimationFrame(() => {
      setShowToggle(el.scrollHeight > el.clientHeight + 2);
    });
  }, [text, expanded]);

  return (
    <div className="mb-4">
      <p
        ref={ref}
        className={`${className} ${expanded ? "" : clampClass}`.trim()}
      >
        {text}
      </p>
      {showToggle && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="mt-2 text-sm text-[#C8FF00] hover:text-[#C8FF00]/80 transition-colors"
        >
          {expanded ? "Show less" : "Expand"}
        </button>
      )}
    </div>
  );
}
