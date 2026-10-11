"use client";

import { useEffect, useRef } from "react";

/**
 * Fixed animated backdrop from the Silk mockup: aurora, drifting orbs, vignette,
 * panning dot grid, film grain and a cursor glow. Styles and keyframes live in
 * globals.css under the `silk-` prefix; everything animates transform/opacity only.
 */
export default function SilkBackground() {
  const glowRef = useRef<HTMLDivElement>(null);

  // Cursor glow: write the transform directly once per frame (no React state);
  // the CSS transition on .silk-cursor supplies the 0.35s eased lag.
  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduceMotion) return;

    let frame = 0;
    let x = 0;
    let y = 0;
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        glow.style.opacity = "1";
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div aria-hidden="true" className="silk-bg">
        <div className="silk-aurora" />
        <div className="silk-orb silk-o1" />
        <div className="silk-orb silk-o2" />
        <div className="silk-orb silk-o3" />
        <div className="silk-orb silk-o4" />
        <div className="silk-vignette" />
        <div className="silk-grid" />
        <svg className="silk-grain">
          <filter id="silk-grain-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#silk-grain-filter)" />
        </svg>
      </div>
      <div ref={glowRef} aria-hidden="true" className="silk-cursor" />
    </>
  );
}
