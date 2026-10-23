"use client";
import { useEffect } from "react";

export function PortraitMotion() {
  useEffect(() => {
    const stage = document.getElementById("portrait-stage");
    if (!stage) return;
    const hero = stage.closest<HTMLElement>(".hero")!;
    hero.dataset.motionReady = "true";
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0;
    let x = 0;
    let y = 0;
    const render = () => {
      frame = 0;
      if (reduce.matches) return;
      const rect = stage.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
      stage.style.setProperty("--portrait-scroll", `${progress * -18}px`);
      stage.style.setProperty("--ring-scroll", `${progress * 12}deg`);
      stage.style.setProperty("--portrait-x", `${x}px`);
      stage.style.setProperty("--portrait-y", `${y}px`);
      hero.style.setProperty("--branch-shift", `${progress * 12}px`);
    };
    const schedule = () => { if (!reduce.matches && !frame) frame = requestAnimationFrame(render); };
    const move = (event: PointerEvent) => {
      if (!pointer.matches || reduce.matches || event.pointerType === "touch") return;
      const rect = stage.getBoundingClientRect();
      x = Math.max(-5, Math.min(5, (event.clientX - rect.left) / rect.width * 10 - 5));
      y = Math.max(-4, Math.min(4, (event.clientY - rect.top) / rect.height * 8 - 4));
      schedule();
    };
    const leave = () => { x = 0; y = 0; schedule(); };
    const reset = () => {
      cancelAnimationFrame(frame); frame = 0; x = 0; y = 0;
      for (const key of ["--portrait-x", "--portrait-y", "--portrait-scroll", "--ring-scroll"]) stage.style.removeProperty(key);
      hero.style.removeProperty("--branch-shift");
      schedule();
    };
    stage.addEventListener("pointermove", move, { passive: true });
    stage.addEventListener("pointerleave", leave);
    window.addEventListener("scroll", schedule, { passive: true });
    reduce.addEventListener("change", reset);
    pointer.addEventListener("change", reset);
    reset();
    return () => {
      cancelAnimationFrame(frame);
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerleave", leave);
      window.removeEventListener("scroll", schedule);
      reduce.removeEventListener("change", reset);
      pointer.removeEventListener("change", reset);
      for (const key of ["--portrait-x", "--portrait-y", "--portrait-scroll", "--ring-scroll"]) stage.style.removeProperty(key);
      hero.style.removeProperty("--branch-shift");
    };
  }, []);
  return null;
}
