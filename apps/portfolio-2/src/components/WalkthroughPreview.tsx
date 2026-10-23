import { useEffect, useRef, type ReactNode } from 'react';

const DESKTOP_POINTER = '(min-width: 1121px) and (pointer: fine)';
// Elements that keep their own wheel behaviour. Add data-wheel-passthrough to opt out anything else.
const OWNS_WHEEL = 'input,select,textarea,[contenteditable]:not([contenteditable="false"]),[role="textbox"],[role="combobox"],[role="listbox"],[data-wheel-passthrough]';
const STEP_DISTANCE = 40;
// A gesture ends after this much wheel silence; trackpad momentum keeps it alive.
const GESTURE_GAP_MS = 220;
const MIN_STEP_INTERVAL_MS = 550;

function scrollsItself(target: Element, region: Element) {
  for (let el: Element | null = target; el && el !== region; el = el.parentElement) {
    const css = getComputedStyle(el);
    if (/(auto|scroll)/.test(css.overflowY) && el.scrollHeight > el.clientHeight + 1) return true;
    if (/(auto|scroll)/.test(css.overflowX) && el.scrollWidth > el.clientWidth + 1) return true;
  }
  return false;
}

/** Wheel ownership is local to the preview, never the document or explanation. */
export function WalkthroughPreview({ step, total, onStep, children }: {
  step: number; total: number; onStep: (step: number) => void; children: ReactNode;
}) {
  const region = useRef<HTMLDivElement>(null);
  const state = useRef({ step, total, onStep });
  state.current = { step, total, onStep };
  useEffect(() => {
    const node = region.current;
    if (!node) return;
    const desktop = matchMedia(DESKTOP_POINTER);
    let lastEvent = 0, lastStep = 0, sum = 0, direction = 0, consumed = false;
    const wheel = (event: WheelEvent) => {
      if (!desktop.matches || event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const target = event.target;
      if (!(target instanceof Element) || target.closest(OWNS_WHEEL) || scrollsItself(target, node)) return;
      // Never change an explanation that is outside the reader's viewport.
      const explanation = node.parentElement?.querySelector('[aria-live="polite"]')?.getBoundingClientRect();
      if (!explanation || explanation.top < 90 || explanation.bottom > innerHeight) return;
      const sign = Math.sign(event.deltaY);
      if (!sign) return;
      const now = performance.now();
      const continuous = now - lastEvent <= GESTURE_GAP_MS;
      lastEvent = now;
      if (!continuous) {
        sum = 0;
        if (now - lastStep > MIN_STEP_INTERVAL_MS) consumed = false;
      }
      const { step: current, total: count, onStep: go } = state.current;
      const atBoundary = (sign < 0 && current === 0) || (sign > 0 && current === count - 1);
      // Momentum from a gesture that just reached a boundary must not scroll the page; a new gesture there does.
      if (atBoundary && !(consumed && continuous)) return;
      if (consumed) { event.preventDefault(); return; }
      if (sign !== direction) { sum = 0; direction = sign; }
      sum += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
      event.preventDefault();
      if (Math.abs(sum) < STEP_DISTANCE) return;
      consumed = true; lastStep = now; sum = 0;
      go(current + sign);
    };
    node.addEventListener('wheel', wheel, { passive: false });
    return () => node.removeEventListener('wheel', wheel);
  }, []);
  return <div ref={region} className="walkthrough-preview">
    <p className="preview-instruction">Preview · <span>Scroll here to explore; scroll outside to move the page. </span>Previous / Next also works.</p>
    {children}
  </div>;
}
