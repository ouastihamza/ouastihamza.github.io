import { StudyControls } from '../components/StudyControls';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  startTransition,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from 'react';

interface StableIntegrationsSectionProps {
  isActive: boolean;
  registerScrollArea: (node: HTMLDivElement | null) => void;
  viewportHeight: number;
}

const integrationSteps = [
  {
    eyebrow: 'Step 01',
    title: 'Start with a stable storefront',
    body:
      'The page loads cleanly while reviews, bundles, search, sticky cart, and analytics stay quietly active.',
  },
  {
    eyebrow: 'Step 02',
    title: 'Introduce one more integration',
    body:
      'A new app or customization enters the same storefront ecosystem and touches the same rendered page.',
  },
  {
    eyebrow: 'Step 03',
    title: 'The conflict becomes visible',
    body:
      'The symptom shows up as duplicated UI, a missing widget, layout movement, or an interaction that stops responding.',
  },
  {
    eyebrow: 'Step 04',
    title: 'The visible symptom gets blamed first',
    body:
      'Merchants often blame the app that looks broken, even when another integration caused the failure upstream.',
  },
  {
    eyebrow: 'Step 05',
    title: 'Trace the storefront ecosystem',
    body:
      'The diagnosis looks across shared selectors, event collisions, duplicated initialization, CSS overlap, and async rendering.',
  },
  {
    eyebrow: 'Step 06',
    title: 'Stabilize the integration layer',
    body:
      'Safer selectors, scoped initialization, defensive checks, and clean rebind logic keep integrations from stepping on each other.',
  },
  {
    eyebrow: 'Step 07',
    title: 'Replay the interaction safely',
    body:
      'The same storefront action runs again with multiple integrations active, and the interface remains stable.',
  },
];

export function StableIntegrationsSection({
  isActive,
  registerScrollArea,
  viewportHeight,
}: StableIntegrationsSectionProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const deferredStep = useDeferredValue(activeStep);
  const prefersReducedMotion = useReducedMotion();
  const segmentHeight = Math.max(Math.round(viewportHeight * 0.68), 340);
  const renderedStep = deferredStep;
  const activeCopy = integrationSteps[renderedStep] ?? integrationSteps[0];

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
        integrationSteps.length - 1,
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
      aria-labelledby="stable-integrations-title"
      className="section section--stable"
      style={{ height: viewportHeight }}
    >
      <div
        className="section__scroll section__scroll--stable"
        ref={(node) => {
          scrollRef.current = node;
          registerScrollArea(node);
        }}
      >
        <div className="stable-story">
          <div className="stable-shell">
            <div className="stable-copy">
              <div className="stable-problem">
                <p className="stable-problem__eyebrow">The Problem</p>
                <h2
                  id="stable-integrations-title"
                  className="stable-problem__headline"
                >
                  The app that looks broken is not always the app causing the
                  issue.
                </h2>
                <p className="stable-problem__subhead">
                  Many Shopify storefront issues come from multiple integrations
                  interacting with the same markup, events, templates, or
                  rendering flow. The visible symptom is often far away from the
                  actual cause.
                </p>
              </div>

              <div className="stable-copy__meta">
                <span className="section-label">Stable integrations</span>
                <span className="stable-copy__progress">
                  {(renderedStep + 1).toString().padStart(2, '0')} /{' '}
                  {integrationSteps.length.toString().padStart(2, '0')}
                </span>
              </div>

              <StudyControls step={activeStep} total={integrationSteps.length} onStep={next => { setActiveStep(next); if (!isMobileLayout && scrollRef.current) scrollRef.current.scrollTop = next * segmentHeight; }} />
              <div className="stable-copy__panel">
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
                    <p className="stable-copy__eyebrow">{activeCopy.eyebrow}</p>
                    <h3 className="stable-copy__title">{activeCopy.title}</h3>
                    <p className="stable-copy__body">{activeCopy.body}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <StableIntegrationsBoard step={renderedStep} />
          </div>

          <div className="stable-story__track" style={{ paddingBottom: viewportHeight }} aria-hidden="true">
            {integrationSteps.map((step) => (
              <div
                key={step.eyebrow}
                className="stable-story__segment"
                style={{ minHeight: segmentHeight }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StableIntegrationsBoard({ step }: { step: number }) {
  const hasNewIntegration = step >= 1;
  const hasConflict = step >= 2 && step < 6;
  const showWrongBlame = step >= 3 && step < 5;
  const showDiagnosis = step >= 4 && step < 6;
  const showCode = step >= 5;
  const isFixed = step >= 6;

  return (
    <div
      className={`stable-board${hasConflict ? ' is-conflicted' : ''}${
        isFixed ? ' is-fixed' : ''
      }`}
    >
      <div className="stable-board__topbar">
        <div>
          <p className="stable-board__eyebrow">Product Page Ecosystem</p>
          <h3>Multiple apps, one storefront surface</h3>
        </div>
        <span className="stable-board__status">
          {isFixed ? 'Stable together' : hasConflict ? 'Conflict visible' : 'Stable'}
        </span>
      </div>

      <div className="stable-integrations-row">
        {['Reviews', 'Bundles', 'Filters', 'Sticky cart', 'Analytics'].map(
          (label) => (
            <span className="stable-integration-pill" key={label}>
              {label}
            </span>
          ),
        )}
        <motion.span
          className={`stable-integration-pill stable-integration-pill--new${
            hasNewIntegration ? ' is-active' : ''
          }`}
          animate={{ opacity: hasNewIntegration ? 1 : 0.36 }}
          transition={{ duration: 0.34 }}
        >
          Promo drawer
        </motion.span>
      </div>

      <div className="stable-board__content">
        <div className="stable-storefront">
          <motion.div
            className="stable-product-shell"
            animate={{ y: hasConflict ? 5 : 0 }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="stable-product-media" />
            <div className="stable-product-detail">
              <p className="stable-product-detail__eyebrow">Linen Travel Bag</p>
              <h4>Clean product page baseline</h4>
              <div className="stable-widget-row">
                <motion.span
                  className={`stable-widget stable-widget--reviews${
                    showWrongBlame ? ' is-symptom' : ''
                  }`}
                  animate={{ opacity: hasConflict ? 0.5 : 1 }}
                  transition={{ duration: 0.28 }}
                >
                  Reviews widget
                </motion.span>
                <span className="stable-widget">Bundle offer</span>
              </div>
              <motion.span
                className="stable-drawer-button"
                animate={{ opacity: hasConflict && !isFixed ? 0.58 : 1 }}

              >
                {hasConflict && !isFixed ? 'Drawer detached' : 'Open cart drawer'}
              </motion.span>
            </div>
          </motion.div>

          <AnimatePresence>
            {hasConflict && !isFixed && (
              <motion.div
                className="stable-symptoms"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.32 }}
              >
                <span>Duplicated promo block</span>
                <span>Reviews disappear</span>
                <span>Drawer no longer opens</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showWrongBlame && (
              <motion.div
                className="stable-blame"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.32 }}
              >
                <span>Visible symptom</span>
                <strong>Reviews app blamed first</strong>
                <em>Actual source is upstream.</em>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showDiagnosis && (
              <motion.div
                className="stable-callouts"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.34 }}
              >
                <svg
                  aria-hidden="true"
                  className="stable-callouts__lines"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <path d="M 18 20 C 36 13, 50 14, 66 22" />
                  <path d="M 72 42 C 55 41, 43 47, 30 56" />
                  <path d="M 71 70 C 56 63, 45 67, 32 78" />
                </svg>
                <span className="stable-callout stable-callout--selectors">
                  shared selectors
                </span>
                <span className="stable-callout stable-callout--events">
                  event collision
                </span>
                <span className="stable-callout stable-callout--async">
                  async rendering conflict
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          className={`stable-code${showCode ? ' is-visible' : ''}`}
          animate={{ opacity: showCode ? 1 : 0.28 }}
        >
          <div className="stable-code__header">
            <span>Integration-safe init</span>
          </div>
          {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- Scrollable code needs keyboard focus. */}
            <pre tabIndex={0} aria-label="Code walkthrough">
{`function initStorefront(scope = document) {
  scope.querySelectorAll('[data-integration]').forEach((node) => {
    if (node.dataset.ready) return;
    node.dataset.ready = 'true';
    bindIntegration(node);
  });
}`}
          </pre><p className="lab-caveat">Illustrative guard, not a complete integration. Production code also needs error handling, cleanup and a clear lifecycle; set ready only after binding succeeds.</p>
        </motion.div>
      </div>
    </div>
  );
}
