"use client";

import { useEffect } from "react";

/**
 * Reveals every [data-reveal] element once it scrolls into view, then
 * stops watching it (no re-triggering on scroll back up). Elements are
 * visible by default in CSS, so a visitor who has JS disabled — or who
 * has requested reduced motion — never sees anything hidden.
 */
export function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (targets.length === 0) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      for (const target of targets) target.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    for (const target of targets) observer.observe(target);

    return () => observer.disconnect();
  }, []);

  return null;
}
