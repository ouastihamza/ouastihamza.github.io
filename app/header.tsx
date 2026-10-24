"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { ArrowUpRight } from "lucide-react";
import { GITHUB_PROFILE } from "./data/projects";
import { MobileNavigation } from "./mobile-navigation";
import { navigationItems } from "./navigation-items";
import { Monogram } from "./monogram";
import { profile } from "./data/profile";

const subscribeToHydration = () => () => {};

export function Header() {
  const ready = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    let frame = 0;
    const updateScrolled = () => {
      frame = 0;
      if (document.getElementById("mobile-navigation")?.hasAttribute("open")) return;
      setScrolled(window.scrollY > 8);
      const sections = ["experience", "projects", "skills", "about", "contact"];
      const current = sections.filter(id => (document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= 180).at(-1);
      const atEnd = window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
      setActive(atEnd && document.getElementById("contact") ? "contact" : current ?? "");
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateScrolled);
    };

    updateScrolled();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className={`site-header wrap${ready ? " has-mobile-menu" : ""}${scrolled ? " is-scrolled" : ""}`}>
        <a className="wordmark" href="/" aria-label="Hamza Ouasti, home">
          <Monogram />
        </a>
        <span className="header-name">
          {profile.name.toUpperCase()}
          <br />
          <span>{profile.title.toUpperCase()}</span>
        </span>
        <nav aria-label="Main navigation">
          {navigationItems.map(([id, label]) => <a key={id} href={`/#${id}`} aria-current={active === id ? "location" : undefined}>{label}</a>)}
          <a className="github-nav" href={GITHUB_PROFILE} target="_blank" rel="noreferrer">
            GitHub <ArrowUpRight size={16} />
          </a>
        </nav>
        <MobileNavigation active={active} />
      </header>
    </>
  );
}
