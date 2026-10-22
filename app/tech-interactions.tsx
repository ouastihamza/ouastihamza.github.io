"use client";

import { useEffect } from "react";

/** Progressive enhancement only: card content and entrances stay server rendered. */
export function TechInteractions() {
  useEffect(() => {
    const section = document.getElementById("skills");
    if (!section) return;
    const enabled = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let active: HTMLElement | null = null;
    let frame = 0;
    let x = 0;
    let y = 0;
    const clear = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (active) {
        for (const property of ["--rx", "--ry", "--light-x", "--light-y"]) active.style.removeProperty(property);
      }
      active = null;
    };
    const move = (event: PointerEvent) => {
      if (!enabled.matches || event.pointerType === "touch") return;
      const card = event.target instanceof Element ? event.target.closest<HTMLElement>(".tech-card") : null;
      if (card !== active) { clear(); active = card; }
      if (!active) return;
      x = event.clientX;
      y = event.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!active) return;
        // Measure the stable wrapper so the tilt never feeds back into pointer geometry.
        const rect = active.parentElement!.getBoundingClientRect();
        const px = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
        const py = Math.max(0, Math.min(1, (y - rect.top) / rect.height));
        active.style.setProperty("--rx", `${(0.5 - py) * 10}deg`);
        active.style.setProperty("--ry", `${(px - 0.5) * 10}deg`);
        active.style.setProperty("--light-x", `${px * 100}%`);
        active.style.setProperty("--light-y", `${py * 100}%`);
      });
    };
    section.addEventListener("pointermove", move, { passive: true });
    section.addEventListener("pointerleave", clear);
    enabled.addEventListener("change", clear);
    return () => {
      clear();
      section.removeEventListener("pointermove", move);
      section.removeEventListener("pointerleave", clear);
      enabled.removeEventListener("change", clear);
    };
  }, []);
  return null;
}
