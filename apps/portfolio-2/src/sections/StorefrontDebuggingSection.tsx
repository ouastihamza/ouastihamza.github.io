import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  startTransition,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from 'react';

interface StorefrontDebuggingSectionProps {
  isActive: boolean;
  registerScrollArea: (node: HTMLDivElement | null) => void;
  viewportHeight: number;
}

interface DebuggingStep {
  eyebrow: string;
  title: string;
  body: string;
}

const debuggingSteps: DebuggingStep[] = [
  {
    eyebrow: 'Step 01',
    title: 'Healthy storefront state',
    body:
      'The collection module loads cleanly. Product cards, badges, tabs, and quick-add controls are visible and responsive.',
  },
  {
    eyebrow: 'Step 02',
    title: 'A shopper filters the collection',
    body:
      'One simple filter click asks the theme to replace part of the page with fresh markup.',
  },
  {
    eyebrow: 'Step 03',
    title: 'The interface disconnects',
    body:
      'After the update, part of the UI disappears and the quick-add behavior is no longer attached.',
  },
  {
    eyebrow: 'Step 04',
    title: 'Trace what changed',
    body:
      'The problem is not the first render. It is the markup replacement that removed the nodes the scripts were using.',
  },
  {
    eyebrow: 'Step 05',
    title: 'Rebind after the section update',
    body:
      'The safer pattern initializes behavior inside the updated section instead of assuming the old DOM is still present.',
  },
  {
    eyebrow: 'Step 06',
    title: 'Fixed state',
    body:
      'The same filter runs again, but the storefront remains stable after the dynamic update.',
  },
];

export function StorefrontDebuggingSection({
  isActive,
  registerScrollArea,
  viewportHeight,
}: StorefrontDebuggingSectionProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const deferredStep = useDeferredValue(activeStep);
  const prefersReducedMotion = useReducedMotion();
  const segmentHeight = Math.max(Math.round(viewportHeight * 0.68), 340);
  const renderedStep = isMobileLayout
    ? debuggingSteps.length - 1
    : deferredStep;
  const activeCopy = debuggingSteps[renderedStep] ?? debuggingSteps[0];

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 760px)');
    const syncLayout = () => {
      setIsMobileLayout(mediaQuery.matches);
    };

    syncLayout();
    mediaQuery.addEventListener('change', syncLayout);

    return () => {
      mediaQuery.removeEventListener('change', syncLayout);
    };
  }, []);

  useEffect(() => {
    const node = scrollRef.current;

    if (!node || isMobileLayout) {
      return;
    }

    const syncStep = () => {
      const nextStep = Math.min(
        debuggingSteps.length - 1,
        Math.floor((node.scrollTop + segmentHeight * 0.45) / segmentHeight),
      );

      startTransition(() => {
        setActiveStep((current) =>
          current === nextStep ? current : nextStep,
        );
      });
    };

    syncStep();
    node.addEventListener('scroll', syncStep, { passive: true });

    return () => {
      node.removeEventListener('scroll', syncStep);
    };
  }, [isMobileLayout, segmentHeight]);

  useEffect(() => {
    if (isActive) {
      return;
    }

    setActiveStep(0);

    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [isActive]);

  return (
    <section
      aria-labelledby="debugging-title"
      className="section section--debugging"
      style={{ height: viewportHeight }}
    >
      <div
        className="section__scroll section__scroll--debugging"
        ref={(node) => {
          scrollRef.current = node;
          registerScrollArea(node);
        }}
      >
        <div className="debugging-story">
            <div className="debugging-shell">
              <div className="debugging-copy">
                <div className="debugging-problem">
                  <p className="debugging-problem__eyebrow">The Problem</p>
                  <h2 id="debugging-title" className="debugging-problem__headline">
                    The storefront looks fine until someone interacts with it.
                  </h2>
                  <p className="debugging-problem__subhead">
                    Some Shopify issues only appear after a customer filters a
                    collection, switches a tab, changes a variant, or opens a
                    dynamic section. The page looked stable at first, but the
                    interaction replaced the markup the scripts were attached to.
                  </p>
                </div>

                <div className="debugging-copy__meta">
                <span className="section-label">Storefronts that don&apos;t break</span>
                <span className="debugging-copy__progress">
                  {(renderedStep + 1).toString().padStart(2, '0')} /{' '}
                  {debuggingSteps.length.toString().padStart(2, '0')}
                </span>
              </div>

              <div className="debugging-copy__panel">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCopy.eyebrow}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{
                      duration: prefersReducedMotion ? 0.16 : 0.38,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <p className="debugging-copy__eyebrow">
                      {activeCopy.eyebrow}
                    </p>
                    <h3 className="debugging-copy__title">{activeCopy.title}</h3>
                    <p className="debugging-copy__body">
                      {activeCopy.body}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <DebuggingBoard step={renderedStep} />
          </div>

          <div className="debugging-story__track" aria-hidden="true">
            {debuggingSteps.map((step) => (
              <div
                key={step.eyebrow}
                className="debugging-story__segment"
                style={{ minHeight: segmentHeight }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DebuggingBoard({ step }: { step: number }) {
  const isAction = step >= 1;
  const isBroken = step >= 2 && step < 5;
  const showDiagnosis = step >= 3 && step < 5;
  const showCode = step >= 4;
  const isFixed = step >= 5;

  return (
    <div className={`debugging-board${isBroken ? ' is-broken' : ''}${isFixed ? ' is-fixed' : ''}`}>
      <div className="debugging-board__topbar">
        <div>
          <p className="debugging-board__eyebrow">Collection Template</p>
          <h3>Summer Essentials</h3>
        </div>
        <span className="debugging-board__status">
          {isFixed ? 'Stable after update' : isBroken ? 'Binding lost' : 'Healthy'}
        </span>
      </div>

      <div className="debugging-controls">
        <motion.span
          className={`debugging-control${isAction ? ' is-active' : ''}`}

          animate={{ y: isAction && !isFixed ? [0, -2, 0] : 0 }}
          transition={{ duration: 0.42 }}
        >
          Filter: In stock
        </motion.span>
        <span className="debugging-control" >
          Sort: Best sellers
        </span>
        <span className="debugging-control" >
          Quick add
        </span>
      </div>

      <div className="debugging-board__content">
        <div className="debugging-grid-wrap">
          <motion.div
            className="debugging-grid"
            animate={{
              opacity: isBroken ? 0.62 : 1,
              y: isBroken ? 6 : 0,
            }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
          >
            {['Linen Shirt', 'Canvas Tote', 'Travel Pouch', 'Daily Cap'].map(
              (product, index) => (
                <motion.article
                  className={`debugging-product${isBroken && index > 1 ? ' is-missing' : ''}`}
                  key={product}
                  animate={{
                    opacity: isBroken && index > 1 ? 0 : 1,
                    scale: isBroken && index > 1 ? 0.96 : 1,
                  }}
                  transition={{ duration: 0.28, delay: index * 0.04 }}
                >
                  <div className="debugging-product__media" />
                  <div>
                    <h4>{product}</h4>
                    <p>{isFixed ? 'Button rebound' : 'Quick add ready'}</p>
                  </div>
                  <span className="debugging-product__button">
                    {isBroken ? 'Inactive' : 'Add'}
                  </span>
                </motion.article>
              ),
            )}
          </motion.div>

          <AnimatePresence>
            {isBroken && (
              <motion.div
                className="debugging-breakage"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.32 }}
              >
                <span>UI state mismatch</span>
                <span>Events detached</span>
                <span>Cards removed</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showDiagnosis && (
              <motion.div
                className="debugging-callouts"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.34 }}
              >
                <svg
                  aria-hidden="true"
                  className="debugging-callouts__lines"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <path d="M 27 25 C 42 18, 52 18, 64 22" />
                  <path d="M 68 52 C 54 51, 43 54, 33 64" />
                  <path d="M 69 76 C 57 72, 45 75, 36 84" />
                </svg>
                <span className="debugging-callout debugging-callout--dom">
                  DOM replaced
                </span>
                <span className="debugging-callout debugging-callout--bindings">
                  bindings lost
                </span>
                <span className="debugging-callout debugging-callout--nodes">
                  old nodes removed
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="debugging-diagnostics">
          <motion.div
            className={`debugging-code${showCode ? ' is-visible' : ''}`}
            animate={{ opacity: showCode ? 1 : 0.28 }}
          >
            <div className="debugging-code__header">
              <span>Safer rebind logic</span>
            </div>
            {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- Scrollable code needs keyboard focus. */}
            <pre tabIndex={0} aria-label="Code walkthrough">
	{`document.addEventListener('shopify:section:load', (event) => {
  initProductGrid(event.target);
});

function initProductGrid(scope = document) {
  scope.querySelectorAll('[data-product-card]').forEach(bindCard);
}`}
            </pre>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
