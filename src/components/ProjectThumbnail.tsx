"use client";

import Image from "next/image";
import { useState } from "react";

// Gradient placeholder from the Silk mockup, shown when a project has no photo
// or its photo fails to load (e.g. uploads lost after a redeploy).
const PLACEHOLDER_BACKGROUND = {
  card: "radial-gradient(120% 90% at 20% 10%, rgba(200,255,0,.10), transparent 60%), radial-gradient(90% 90% at 90% 90%, rgba(91,108,255,.14), transparent 60%), #0e0e12",
  featured:
    "radial-gradient(120% 90% at 20% 10%, rgba(200,255,0,.14), transparent 60%), radial-gradient(90% 90% at 90% 90%, rgba(91,108,255,.18), transparent 60%), #0e0e12",
};

/** Fills its (relatively positioned) parent. */
export function ProjectThumbnail({
  src,
  name,
  sizes,
  variant = "card",
}: {
  src?: string | null;
  name: string;
  sizes: string;
  variant?: "card" | "featured";
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (src && src !== failedSrc) {
    // Uploaded files are optimized by next/image; pasted external URLs are shown as-is
    // so the image optimizer never fetches arbitrary third-party hosts.
    const isRemote = /^https?:\/\//i.test(src);
    return (
      <Image
        src={src}
        alt={`${name} preview`}
        fill
        sizes={sizes}
        unoptimized={isRemote}
        className="silk-thumb object-cover"
        onError={() => setFailedSrc(src)}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`${name} thumbnail`}
      className="silk-thumb flex h-full w-full items-center justify-center px-4 text-center font-mono text-xs text-faint"
      style={{ background: PLACEHOLDER_BACKGROUND[variant] }}
    >
      {name}
    </div>
  );
}
