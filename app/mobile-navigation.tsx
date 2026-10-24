"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Monogram } from "./monogram";
import { navigationItems } from "./navigation-items";

export function MobileNavigation({ active }: { active: string }) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    const panel = dialog.current;
    if (!panel) return;
    const y = window.scrollY;
    const bodyStyle = document.body.style.cssText;
    document.body.style.position = "fixed";
    document.body.style.top = `-${y}px`;
    document.body.style.width = "100%";
    panel.showModal();
    firstLink.current?.focus();
    const wide = window.matchMedia("(min-width: 821px)");
    const resize = () => { if (wide.matches) panel.close(); };
    wide.addEventListener("change", resize);
    return () => {
      wide.removeEventListener("change", resize);
      if (panel.open) panel.close();
      document.body.style.cssText = bodyStyle;
      window.scrollTo({ top: y, behavior: "instant" });
    };
  }, [open]);

  const navigate = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    dialog.current?.close();
    // Let the scroll lock restore first, then use native hash navigation/history.
    window.setTimeout(() => {
      window.location.href = `/#${id}`;
      const target = document.getElementById(id);
      if (target) {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
        target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
      }
    }, 0);
  };

  return <>
    <button className="mobile-toggle" type="button" aria-label="Open navigation menu" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(true)}>
      <span>Menu</span><svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8h18M3 16h18" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
    </button>
    {/* oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- Native modal dialog handles Escape and focus; click only dismisses its backdrop. */}
    <dialog ref={dialog} id="mobile-navigation" className="mobile-navigation" aria-label="Navigation menu" onKeyDown={event => {
      if (event.key !== "Tab") return;
      const controls = event.currentTarget.querySelectorAll<HTMLElement>("button, a[href]");
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }} onClose={() => setOpen(false)} onClick={event => {
      if (event.target !== event.currentTarget) return;
      const box = event.currentTarget.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) event.currentTarget.close();
    }}>
      <div className="mobile-menu-heading"><span className="mobile-menu-identity"><Monogram /><span>Hamza Ouasti</span></span><button type="button" aria-label="Close navigation menu" onClick={() => dialog.current?.close()}><svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg></button></div>
      <p className="mobile-menu-label">Explore the portfolio</p>
      <nav aria-label="Mobile navigation">
        {navigationItems.map(([id, label], index) => <a ref={index === 0 ? firstLink : undefined} key={id} href={`/#${id}`} aria-current={active === id ? "location" : undefined} onClick={event => navigate(event, id)}><span className="mobile-menu-index">0{index + 1}</span>{label}<span aria-hidden="true" className="mobile-menu-arrow">↗</span></a>)}
      </nav>
    </dialog>
  </>;
}
