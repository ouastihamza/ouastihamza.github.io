"use client";

import { useEffect } from "react";

/** Content is always visible in CSS. Only animate an observed entrance;
 * script failures and unsupported browser APIs leave the document intact. */
export function ScrollReveal() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Map<Element, Animation>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (preference.matches || typeof entry.target.animate !== "function") continue;
        const stagger = Number.parseFloat(getComputedStyle(entry.target).getPropertyValue("--stagger")) || 0;
        const animation = entry.target.animate(
          [{ opacity: 0, translate: "0 20px" }, { opacity: 1, translate: "0 0" }],
          { duration: 700, delay: Math.min(stagger, 3) * 70, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "backwards" },
        );
        animations.set(entry.target, animation);
        animation.onfinish = () => animations.delete(entry.target);
      }
    }, { threshold: 0, rootMargin: "0px 0px -8% 0px" });

    // A parent reveal already animates its contents. Never animate both.
    for (const target of document.querySelectorAll<HTMLElement>("[data-reveal]")) {
      if (!target.parentElement?.closest("[data-reveal]")) observer.observe(target);
    }
    const cancelAnimations = () => {
      for (const animation of animations.values()) animation.cancel();
      animations.clear();
    };
    const onPreferenceChange = () => {
      if (preference.matches) cancelAnimations();
    };
    const onFocus = () => cancelAnimations();
    preference.addEventListener("change", onPreferenceChange);
    document.addEventListener("focusin", onFocus);
    return () => {
      observer.disconnect();
      cancelAnimations();
      preference.removeEventListener("change", onPreferenceChange);
      document.removeEventListener("focusin", onFocus);
    };
  }, []);
  return null;
}
