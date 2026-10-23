import { useEffect, useRef, type ReactNode } from 'react';

const DESKTOP_POINTER = '(min-width: 1121px) and (pointer: fine)';
// Elements that keep their own wheel behaviour. Add data-wheel-passthrough to opt out anything else.
const OWNS_WHEEL = 'input,select,textarea,[contenteditable]:not([contenteditable="false"]),[role="textbox"],[role="combobox"],[role="listbox"],[data-wheel-passthrough]';
const STEP_DISTANCE = 40;
// A gesture ends after this much wheel silence.
const GESTURE_GAP_MS = 220;
const MIN_STEP_INTERVAL_MS = 550;
// Momentum only fades. Input that arrives at notch strength, or keeps rising for a few events, is a new push.
const NOTCH_SIZE = 40;
const RISING_EVENTS = 3;
// Last resort: never hold input back longer than this; afterwards it scrolls the page, so something always moves.
const MAX_HOLD_MS = 3000;

function scrollsItself(target: Element, region: Element) {
  for (let el: Element | null = target; el && el !== region; el = el.parentElement) {
    const css = getComputedStyle(el);
    if (/(auto|scroll)/.test(css.overflowY) && el.scrollHeight > el.clientHeight + 1) return true;
    if (/(auto|scroll)/.test(css.overflowX) && el.scrollWidth > el.clientWidth + 1) return true;
  }
  return false;
}

function normalise(event: WheelEvent) {
  return event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
}

/**
 * Wheel over the preview moves one step per gesture; wheel anywhere else scrolls the page.
 * The listener is on window and hit-tests the pointer, because Chrome can keep delivering a wheel
 * sequence to the node that was under the pointer when it began, even after that node changes.
 */
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
    let lastEvent = 0, lastStep = 0, lastSize = 0, rising = 0, sum = 0, direction = 0, consumed = false;
    const wheel = (event: WheelEvent) => {
      if (!desktop.matches || event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const box = node.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) return;
      const target = event.target instanceof Element && event.target.isConnected && node.contains(event.target)
        ? event.target
        : document.elementFromPoint(event.clientX, event.clientY);
      // Something drawn on top of the preview, such as the sticky header, keeps the wheel.
      if (!target || !node.contains(target) || target.closest(OWNS_WHEEL) || scrollsItself(target, node)) return;
      // Never change an explanation that is outside the reader's viewport.
      const explanation = node.parentElement?.querySelector('[aria-live="polite"]')?.getBoundingClientRect();
      if (!explanation || explanation.top < 90 || explanation.bottom > innerHeight) return;
      const sign = Math.sign(event.deltaY);
      if (!sign) return;

      const now = performance.now();
      const size = Math.abs(normalise(event));
      const continuous = now - lastEvent <= GESTURE_GAP_MS;
      rising = continuous && size >= lastSize && size >= 4 ? rising + 1 : 0;
      const freshPush = continuous && ((size >= NOTCH_SIZE && size >= lastSize) || rising >= RISING_EVENTS);
      lastEvent = now; lastSize = size;
      if (consumed && (!continuous || freshPush || sign !== direction) && now - lastStep > MIN_STEP_INTERVAL_MS) consumed = false;
      if (!continuous) sum = 0;

      const { step: current, total: count, onStep: go } = state.current;
      const atBoundary = (sign < 0 && current === 0) || (sign > 0 && current === count - 1);
      // Momentum from a gesture that just reached a boundary must not scroll the page; a new gesture there does.
      if (atBoundary && !(consumed && continuous)) return;
      if (consumed) {
        if (now - lastStep > MAX_HOLD_MS) return;
        event.preventDefault();
        return;
      }
      if (sign !== direction) { sum = 0; direction = sign; }
      sum += normalise(event);
      event.preventDefault();
      if (Math.abs(sum) < STEP_DISTANCE) return;
      consumed = true; lastStep = now; sum = 0;
      go(current + sign);
    };
    window.addEventListener('wheel', wheel, { passive: false });
    return () => window.removeEventListener('wheel', wheel);
  }, []);
  return <div ref={region} className="walkthrough-preview">
    <p className="preview-instruction">Preview · <span>Scroll here to explore; scroll outside to move the page. </span>Previous / Next also works.</p>
    {children}
  </div>;
}
