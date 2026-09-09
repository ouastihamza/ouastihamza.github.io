import { motion, useReducedMotion } from 'framer-motion';
import { startTransition, useEffect, useRef, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { EndingSection } from './sections/EndingSection';
import { HowIWorkSection } from './sections/HowIWorkSection';
import { HomeSection } from './sections/HomeSection';
import { SimulationSection } from './sections/SimulationSection';
import { StableIntegrationsSection } from './sections/StableIntegrationsSection';
import { StorefrontDebuggingSection } from './sections/StorefrontDebuggingSection';

const sectionOrder = [
  'home',
  'simulation',
  'storefront-debugging',
  'stable-integrations',
  'how-i-work',
  'ending',
] as const;

export type SectionId = (typeof sectionOrder)[number];

const sectionIndexMap: Record<SectionId, number> = {
  home: 0,
  simulation: 1,
  'storefront-debugging': 2,
  'stable-integrations': 3,
  'how-i-work': 4,
  ending: 5,
};

const SECTION_TRANSITION_MS = 760;
const WHEEL_SECTION_THRESHOLD = 8;

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [viewportHeight, setViewportHeight] = useState(() => window.innerHeight);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const activeIndexRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const hasMountedRef = useRef(false);
  const transitionTimeoutRef = useRef<number | null>(null);
  const scrollAreasRef = useRef<Record<SectionId, HTMLDivElement | null>>({
    home: null,
    simulation: null,
    'storefront-debugging': null,
    'stable-integrations': null,
    'how-i-work': null,
    ending: null,
  });
  const prefersReducedMotion = useReducedMotion();

  const activeIndex = sectionIndexMap[activeSection];
  useEffect(() => {
    trackRef.current?.querySelectorAll<HTMLElement>('.section').forEach((section, index) => {
      section.querySelectorAll<HTMLElement>('.section__scroll, [data-nested-scroll="true"]').forEach((region) => {
        region.tabIndex = 0;
        region.setAttribute('role', 'region');
        region.setAttribute('aria-label', 'Scrollable study content');
      });
      section.inert = index !== activeIndex;
      section.setAttribute('aria-hidden', String(index !== activeIndex));
    });
  }, [activeIndex]);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const updateViewport = () => {
      setViewportHeight(window.innerHeight);
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
    };
  }, []);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      isTransitioningRef.current = false;
      return;
    }

    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current);
    }

    isTransitioningRef.current = true;
    transitionTimeoutRef.current = window.setTimeout(() => {
      isTransitioningRef.current = false;
    }, prefersReducedMotion ? 160 : SECTION_TRANSITION_MS);

    return () => {
      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [activeSection, prefersReducedMotion]);

  useEffect(() => {
    const viewport = trackRef.current;

    if (!viewport) {
      return;
    }

    const moveTo = (nextIndex: number) => {
      const clampedIndex = Math.max(
        0,
        Math.min(sectionOrder.length - 1, nextIndex),
      );
      const nextId = sectionOrder[clampedIndex];

      if (nextId === activeSection) {
        return;
      }

      isTransitioningRef.current = true;

      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
      }

      transitionTimeoutRef.current = window.setTimeout(() => {
        isTransitioningRef.current = false;
      }, prefersReducedMotion ? 160 : SECTION_TRANSITION_MS);

      startTransition(() => {
        setActiveSection(nextId);
      });
    };

    const handleWheel = (event: WheelEvent) => {
      const direction = Math.sign(event.deltaY);

      if (direction === 0) {
        return;
      }

      const currentId = sectionOrder[activeIndexRef.current];
      const innerScrollArea = scrollAreasRef.current[currentId];
      const nestedScrollArea = resolveNestedScrollArea(
        event.target,
        innerScrollArea,
      );

      if (tryScrollArea(nestedScrollArea, event.deltaY)) {
        event.preventDefault();
        return;
      }

      if (tryScrollArea(innerScrollArea, event.deltaY)) {
        event.preventDefault();
        return;
      }

      if (Math.abs(event.deltaY) < WHEEL_SECTION_THRESHOLD) {
        event.preventDefault();
        return;
      }

      if (isTransitioningRef.current) {
        event.preventDefault();
        return;
      }

      const nextIndex = activeIndexRef.current + direction;

      if (nextIndex < 0 || nextIndex >= sectionOrder.length) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      moveTo(nextIndex);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || (event.target instanceof Element && event.target.closest('button, a, input, textarea, select, [role="tab"], [contenteditable="true"]'))) return;
      if (
        event.key !== 'ArrowDown' &&
        event.key !== 'ArrowUp' &&
        event.key !== 'PageDown' &&
        event.key !== 'PageUp' &&
        event.key !== ' '
      ) {
        return;
      }

      const direction =
        event.key === 'ArrowUp' || event.key === 'PageUp' ? -1 : 1;
      const inner = scrollAreasRef.current[sectionOrder[activeIndexRef.current]];
      const delta = direction * (event.key.startsWith('Arrow') ? 60 : viewportHeight * 0.8);
      if (tryScrollArea(inner, delta)) { event.preventDefault(); return; }
      const nextIndex = activeIndexRef.current + direction;

      if (nextIndex < 0 || nextIndex >= sectionOrder.length) {
        return;
      }

      event.preventDefault();
      moveTo(nextIndex);
    };

    viewport.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      viewport.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeSection, prefersReducedMotion, viewportHeight]);

  const handleSectionSelect = (sectionId: SectionId) => {
    if (sectionId === activeSection) {
      return;
    }

    startTransition(() => {
      setActiveSection(sectionId);
    });
  };

  const sectionTransition = prefersReducedMotion
    ? { duration: 0.2 }
    : {
        type: 'spring',
        stiffness: 120,
        damping: 26,
        mass: 0.95,
      };

  return (
    <div className="app-shell">
      <Sidebar activeSection={activeSection} onSelect={handleSectionSelect} />

      <main className="content-shell">
        <div className="content-shell__viewport" ref={trackRef}>
          <motion.div
            className="content-shell__track"
            animate={{ y: -(activeIndex * viewportHeight) }}
            transition={sectionTransition}
          >
            <HomeSection
              viewportHeight={viewportHeight}
              registerScrollArea={(node) => {
                scrollAreasRef.current.home = node;
              }}
            />
            <SimulationSection
              isActive={activeSection === 'simulation'}
              viewportHeight={viewportHeight}
              registerScrollArea={(node) => {
                scrollAreasRef.current.simulation = node;
              }}
            />
            <StorefrontDebuggingSection
              isActive={activeSection === 'storefront-debugging'}
              viewportHeight={viewportHeight}
              registerScrollArea={(node) => {
                scrollAreasRef.current['storefront-debugging'] = node;
              }}
            />
            <StableIntegrationsSection
              isActive={activeSection === 'stable-integrations'}
              viewportHeight={viewportHeight}
              registerScrollArea={(node) => {
                scrollAreasRef.current['stable-integrations'] = node;
              }}
            />
            <HowIWorkSection
              viewportHeight={viewportHeight}
              registerScrollArea={(node) => {
                scrollAreasRef.current['how-i-work'] = node;
              }}
            />
            <EndingSection
              viewportHeight={viewportHeight}
              registerScrollArea={(node) => {
                scrollAreasRef.current.ending = node;
              }}
            />
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function tryScrollArea(
  area: HTMLElement | null,
  deltaY: number,
) {
  if (!area) {
    return false;
  }

  const maxScroll = area.scrollHeight - area.clientHeight;

  if (maxScroll <= 1) {
    return false;
  }

  const nextScrollTop = Math.max(
    0,
    Math.min(maxScroll, area.scrollTop + deltaY),
  );

  if (Math.abs(nextScrollTop - area.scrollTop) < 0.5) {
    return false;
  }

  area.scrollTop = nextScrollTop;
  return true;
}

function resolveNestedScrollArea(
  target: EventTarget | null,
  boundary: HTMLElement | null,
) {
  if (!(target instanceof Element) || !boundary) {
    return null;
  }

  const nested = target.closest<HTMLElement>('[data-nested-scroll="true"]');

  if (!nested || nested === boundary || !boundary.contains(nested)) {
    return null;
  }

  return nested;
}
