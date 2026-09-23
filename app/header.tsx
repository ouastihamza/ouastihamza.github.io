"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { GITHUB_PROFILE } from "./data/projects";
import { profile } from "./data/profile";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    const updateScrolled = () => {
      frame = 0;
      setScrolled(window.scrollY > 8);
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateScrolled);
    };

    updateScrolled();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className={`site-header wrap${scrolled ? " is-scrolled" : ""}`}>
        <a className="wordmark" href="/" aria-label="Hamza Ouasti, home">
          h<span>↗</span>
        </a>
        <span className="header-name">
          {profile.name.toUpperCase()}
          <br />
          <span>{profile.title.toUpperCase()}</span>
        </span>
        <nav aria-label="Main navigation">
          <a href="/#experience">Experience</a>
          <a href="/#projects">Projects</a>
          <a href="/#contact">Contact</a>
          <a className="github-nav" href={GITHUB_PROFILE} target="_blank" rel="noreferrer">
            GitHub <ArrowUpRight size={16} />
          </a>
        </nav>
      </header>
    </>
  );
}
