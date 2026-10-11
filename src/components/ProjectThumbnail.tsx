"use client";

import { useState } from "react";

// Gradient placeholder from the Silk mockup, shown when a project has no photo
// or its photo fails to load (e.g. uploads lost after a redeploy).
const PLACEHOLDER_BACKGROUND =
  "radial-gradient(120% 90% at 20% 10%, rgba(200,255,0,.10), transparent 60%), radial-gradient(90% 90% at 90% 90%, rgba(91,108,255,.14), transparent 60%), #0e0e12";

export function ProjectThumbnail({ src, name }: { src?: string | null; name: string }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (src && src !== failedSrc) {
    return (
      <img
        src={src}
        alt={`${name} preview`}
        className="w-full h-full object-cover"
        onError={() => setFailedSrc(src)}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`${name} thumbnail`}
      className="w-full h-full flex items-center justify-center px-4 text-center font-mono text-xs text-faint"
      style={{ background: PLACEHOLDER_BACKGROUND }}
    >
      {name}
    </div>
  );
}
