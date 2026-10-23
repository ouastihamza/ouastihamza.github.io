import { StudyControls } from '../components/StudyControls';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'framer-motion';
import {
  startTransition,
  type ReactNode,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from 'react';

type FieldKey =
  | 'aggregateRating'
  | 'ratingValue'
  | 'reviewCount'
  | 'description'
  | 'image'
  | 'sku'
  | 'offers';

type SimulationView = 'merchant' | 'technical';

interface SimulationSectionProps {
  isActive: boolean;
  registerScrollArea: (node: HTMLDivElement | null) => void;
  viewportHeight: number;
}

interface StepDefinition {
  eyebrow: string;
  title: string;
  body: string;
}

const sourceUrl =
  'https://example.com/products/linen-travel-bag';

const fieldSequence: FieldKey[] = [
  'aggregateRating',
  'ratingValue',
  'reviewCount',
  'description',
  'image',
  'sku',
  'offers',
];

const steps: StepDefinition[] = [
  {
    eyebrow: 'Step 01',
    title: 'Start with the source URL',
    body:
      'Start with a product URL. This walkthrough uses illustrative product data to explain the checks.',
  },
  {
    eyebrow: 'Step 02',
    title: 'Check the product data',
    body:
      'Check which product fields are available before reviewing their JSON-LD representation.',
  },
  {
    eyebrow: 'Step 03',
    title: 'Confirm the visible product layer',
    body:
      'The preview card mirrors how a storefront or search result might interpret the page.',
  },
  {
    eyebrow: 'Step 04',
    title: 'Check the review summary',
    body:
      'Compare the visible review score and count with the values supplied in structured data.',
  },
  {
    eyebrow: 'Step 05',
    title: 'Expose the structured layer',
    body:
      'The JSON-LD block appears only after the storefront view is established.',
  },
  {
    eyebrow: 'Step 06',
    title: 'Frame the rating object first',
    body:
      'The aggregate rating field creates the container that the visible score belongs to.',
  },
  {
    eyebrow: 'Step 07',
    title: 'Separate the score value',
    body:
      'ratingValue records the aggregate score; reviewCount records the number of reviews.',
  },
  {
    eyebrow: 'Step 08',
    title: 'Attach review volume',
    body:
      'The review count should match the reviews represented by the aggregate rating.',
  },
  {
    eyebrow: 'Step 09',
    title: 'Mirror the product description',
    body:
      'Descriptive copy should align cleanly between the interface and the schema.',
  },
  {
    eyebrow: 'Step 10',
    title: 'Carry the primary image forward',
    body:
      'The visual asset is treated as structured data, not just decoration.',
  },
  {
    eyebrow: 'Step 11',
    title: 'Keep internal merchandising context',
    body:
      'SKU may be quiet in the interface, but it matters in the data layer.',
  },
  {
    eyebrow: 'Step 12',
    title: 'Tie price to availability',
    body:
      'The offers object describes price, currency and availability.',
  },
  {
    eyebrow: 'Step 13',
    title: 'Show the relationship clearly',
    body:
      'Trace each visible product value to its corresponding JSON-LD field.',
  },
];

export function SimulationSection({
  isActive,
  registerScrollArea,
  viewportHeight,
}: SimulationSectionProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const previewRefs = useRef<Partial<Record<FieldKey, HTMLDivElement | null>>>(
    {},
  );
  const codeRefs = useRef<Partial<Record<FieldKey, HTMLDivElement | null>>>(
    {},
  );
  const [activeStep, setActiveStep] = useState(0);
  const [typedLength, setTypedLength] = useState(0);
  const [simulationView, setSimulationView] =
    useState<SimulationView>('merchant');
  const [paths, setPaths] = useState<Partial<Record<FieldKey, string>>>({});
  const [boardSize, setBoardSize] = useState({ width: 1, height: 1 });
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const deferredStep = useDeferredValue(activeStep);
  const prefersReducedMotion = useReducedMotion();
  const segmentHeight = Math.max(Math.round(viewportHeight * 0.72), 360);
  const renderedStep = deferredStep;
  const isTechnicalView = simulationView === 'technical';

  const showPreview = renderedStep >= 2;
  const showStars = renderedStep >= 3;
  const showCode = renderedStep >= 4;
  const showAllConnections = renderedStep >= 12;
  const highlightedField =
    renderedStep >= 5 && renderedStep <= 11
      ? fieldSequence[renderedStep - 5]
      : null;

  const visibleConnectionFields = showAllConnections
    ? fieldSequence
    : highlightedField
      ? [highlightedField]
      : [];

  const activeCopy = steps[renderedStep] ?? steps[0];

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
        steps.length - 1,
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
  }, [segmentHeight, isMobileLayout]);

  useEffect(() => {
    if (isActive) {
      return;
    }

    setActiveStep(0);
    setTypedLength(0);
    setSimulationView('merchant');
    setPaths({});
    setBoardSize({ width: 1, height: 1 });

    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive && !isMobileLayout) {
      return;
    }

    if (activeStep > 0 || isMobileLayout || prefersReducedMotion) {
      setTypedLength(sourceUrl.length);
      return;
    }

    if (typedLength >= sourceUrl.length) {
      return;
    }

    const timeout = window.setTimeout(
      () => {
        setTypedLength((current) => current + 1);
      },
      typedLength === 0 ? 320 : 38,
    );

    return () => {
      window.clearTimeout(timeout);
    };
  }, [activeStep, isActive, isMobileLayout, typedLength, prefersReducedMotion]);

  useEffect(() => {
    const board = boardRef.current;

    if (!board || !showCode || isMobileLayout || !isTechnicalView) {
      setPaths({});
      return;
    }

    const updatePaths = () => {
      const nextPaths: Partial<Record<FieldKey, string>> = {};
      const boardRect = board.getBoundingClientRect();
      setBoardSize({
        width: Math.max(boardRect.width, 1),
        height: Math.max(boardRect.height, 1),
      });

      fieldSequence.forEach((field) => {
        const from = previewRefs.current[field];
        const to = codeRefs.current[field];

        if (!from || !to) {
          return;
        }

        const fromRect = from.getBoundingClientRect();
        const toRect = to.getBoundingClientRect();
        const horizontalFlow =
          Math.abs(toRect.left - fromRect.right) >
          Math.abs(toRect.top - fromRect.bottom);

        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        if (horizontalFlow) {
          startX = fromRect.right - boardRect.left - 10;
          startY = fromRect.top + fromRect.height / 2 - boardRect.top;
          endX = toRect.left - boardRect.left + 10;
          endY = toRect.top + toRect.height / 2 - boardRect.top;

          const controlX = startX + (endX - startX) * 0.54;

          nextPaths[field] = `M ${startX} ${startY} C ${controlX} ${startY}, ${controlX} ${endY}, ${endX} ${endY}`;
          return;
        }

        startX = fromRect.left + fromRect.width / 2 - boardRect.left;
        startY = fromRect.bottom - boardRect.top - 10;
        endX = toRect.left + toRect.width / 2 - boardRect.left;
        endY = toRect.top - boardRect.top + 10;

        const controlY = startY + (endY - startY) * 0.54;

        nextPaths[field] = `M ${startX} ${startY} C ${startX} ${controlY}, ${endX} ${controlY}, ${endX} ${endY}`;
      });

      setPaths(nextPaths);
    };

    const frame = window.requestAnimationFrame(updatePaths);
    const resizeObserver = new ResizeObserver(updatePaths);
    resizeObserver.observe(board);
    window.addEventListener('resize', updatePaths);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener('resize', updatePaths);
    };
  }, [deferredStep, isMobileLayout, isTechnicalView, showCode, viewportHeight]);

  return (
    <section
      aria-labelledby="simulation-title"
      className="section section--simulation"
      style={{ height: viewportHeight }}
    >
      <div
        className="section__scroll section__scroll--simulation"
        ref={(node) => {
          scrollRef.current = node;
          registerScrollArea(node);
        }}
      >
        <div className="simulation-story">
          <div className="simulation-shell">
            <div className="simulation-copy">
              <div className="simulation-merchant">
                <p className="simulation-merchant__eyebrow">The Problem</p>
                <h2 className="simulation-merchant__headline">
                  How does product information become structured data?
                </h2>
                <p className="simulation-merchant__subhead">
                  Structured data is the layer that helps search engines read
                  the product details customers already care about: reviews,
                  pricing, availability, imagery, and the offer behind the page.
                </p>
              </div>

              <div
                aria-label="Structured data view"
                className="simulation-view-toggle"
                role="tablist"
              >
                {(['merchant', 'technical'] as const).map((view) => (
                  <button
                    id={`view-${view}`}
                    aria-controls="simulation-view-panel"
                    tabIndex={simulationView === view ? 0 : -1}
                    onKeyDown={(event) => {
                      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
                      event.preventDefault();
                      const next = event.key === 'Home' ? 'merchant' : event.key === 'End' ? 'technical' : view === 'merchant' ? 'technical' : 'merchant';
                      setSimulationView(next);
                      document.getElementById(`view-${next}`)?.focus();
                    }}
                    aria-selected={simulationView === view}
                    className={`simulation-view-toggle__button${
                      simulationView === view ? ' is-active' : ''
                    }`}
                    key={view}
                    onClick={() => setSimulationView(view)}
                    role="tab"
                    type="button"
                  >
                    {view === 'merchant' ? 'Merchant View' : 'Technical View'}
                  </button>
                ))}
              </div>

              <div className="simulation-copy__meta">
                <span className="section-label">Structured Data Simulation</span>
                <span className="simulation-copy__progress">
                  {(renderedStep + 1).toString().padStart(2, '0')} /{' '}
                  {steps.length.toString().padStart(2, '0')}
                </span>
              </div>

              <StudyControls step={activeStep} total={steps.length} onStep={next => { setActiveStep(next); if (!isMobileLayout && scrollRef.current) scrollRef.current.scrollTop = next * segmentHeight; }} />
              <div className="simulation-copy__panel">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCopy.eyebrow}
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -18 }}
                    transition={{
                      duration: prefersReducedMotion ? 0.16 : 0.42,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <p className="simulation-copy__eyebrow">
                      {activeCopy.eyebrow}
                    </p>
                    <h2 id="simulation-title" className="simulation-copy__title">
                      {activeCopy.title}
                    </h2>
                    <p className="simulation-copy__body">{activeCopy.body}</p>
                  </motion.div>
                </AnimatePresence>

                <div className="simulation-copy__guide">
                  <span className="simulation-copy__guide-track">
                    <span
                      className="simulation-copy__guide-fill"
                      style={{
                        transform: `scaleY(${(renderedStep + 1) / steps.length})`,
                      }}
                    />
                  </span>
                  <p>Use Previous / Next, or scroll through the desktop walkthrough.</p>
                </div>
              </div>
            </div>

            <div className="simulation-board" id="simulation-view-panel" role="tabpanel" aria-labelledby={`view-${simulationView}`}>
              <AnimatePresence mode="wait">
                {simulationView === 'merchant' ? (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="simulation-view-panel"
                    exit={{ opacity: 0, y: -12 }}
                    initial={{ opacity: 0, y: 12 }}
                    key="merchant-view"
                    transition={{
                      duration: prefersReducedMotion ? 0.16 : 0.34,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <MerchantResultPreview />
                    <p className="lab-caveat">Illustration only. No URL is fetched or validated. Valid structured data does not guarantee rich results. <a href="https://developers.google.com/search/docs/appearance/structured-data/product-snippet" target="_blank" rel="noreferrer">Google’s product snippet guidance ↗</a></p>
                  </motion.div>
                ) : (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="simulation-view-panel"
                    exit={{ opacity: 0, y: -12 }}
                    initial={{ opacity: 0, y: 12 }}
                    key="technical-view"
                    transition={{
                      duration: prefersReducedMotion ? 0.16 : 0.34,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <div className="simulation-board__header">
                      <p className="simulation-board__eyebrow">
                        Product Schema Walkthrough
                      </p>
                      <span className="simulation-board__status">
                        {renderedStep < 1
                          ? 'Illustrative source'
                          : renderedStep < 2
                            ? 'Example sequence'
                            : 'Illustrative schema preview'}
                      </span>
                    </div>

                    <div className="simulation-input">
                      <span className="simulation-input__label">Product URL</span>
                      <div className="simulation-input__field" aria-label="Illustrative product URL">
                        <span>{sourceUrl.slice(0, typedLength)}</span>
                        <span
                          className={`simulation-input__cursor${
                            typedLength >= sourceUrl.length ? ' is-idle' : ''
                          }`}
                        />
                      </div>
                    </div>

                    <AnimatePresence>
                      {renderedStep >= 1 && (
                        <motion.div
                          className="simulation-scan"
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -12 }}
                          transition={{ duration: 0.36 }}
                        >
                          <div className="simulation-scan__header">
                            <span>Loading the illustrative product example</span>
                            <span>{renderedStep < 2 ? 'Example sequence' : 'Example loaded'}</span>
                          </div>
                          <div className="simulation-scan__track">
                            <motion.span
                              className="simulation-scan__fill"
                              animate={{
                                scaleX: renderedStep < 2 ? [0.16, 0.72, 0.4] : 1,
                                opacity: 1,
                              }}
                              transition={{
                                duration: renderedStep < 2 ? 1.8 : 0.5,
                                repeat: 0,
                                ease: 'easeInOut',
                              }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="simulation-board__viewport">
                      <div className="simulation-board__canvas" ref={boardRef}>
                  <div className="simulation-board__content">
                    <motion.article
                      className={`preview-card${showPreview ? ' is-visible' : ''}`}
                      initial={false}
                      animate={{
                        opacity: showPreview ? 1 : 0.32,
                        y: showPreview ? 0 : 24,
                      }}
                      transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div
                        className={`preview-card__media${
                          highlightedField === 'image' || showAllConnections
                            ? ' is-linked'
                            : ''
                        }`}
                        ref={(node) => {
                          previewRefs.current.image = node;
                        }}
                      >
                        <div className="preview-card__image" />
                      </div>

                      <div className="preview-card__content">
                        <div className="preview-card__heading">
                          <p className="preview-card__eyebrow">
                            Search-ready product surface
                          </p>
                          <h3>Linen Travel Bag</h3>
                        </div>

                        <div className="preview-card__rating-row">
                          <div
                            className={`preview-card__stars${
                              highlightedField === 'aggregateRating' ||
                              showAllConnections
                                ? ' is-linked'
                                : ''
                            }`}
                            ref={(node) => {
                              previewRefs.current.aggregateRating = node;
                            }}
                          >
                            {[0, 1, 2, 3, 4].map((index) => (
                              <motion.span
                                key={index}
                                className="preview-card__star"
                                initial={false}
                                animate={{
                                  opacity: showStars ? 1 : 0.18,
                                  scale: showStars ? 1 : 0.88,
                                }}
                                transition={{
                                  duration: 0.34,
                                  delay: showStars ? index * 0.08 : 0,
                                }}
                              >
                                ★
                              </motion.span>
                            ))}
                          </div>

                          <div
                            className={`preview-card__metric${
                              highlightedField === 'ratingValue' ||
                              showAllConnections
                                ? ' is-linked'
                                : ''
                            }`}
                            ref={(node) => {
                              previewRefs.current.ratingValue = node;
                            }}
                          >
                            4.9
                          </div>

                          <div
                            className={`preview-card__meta-tag${
                              highlightedField === 'reviewCount' ||
                              showAllConnections
                                ? ' is-linked'
                                : ''
                            }`}
                            ref={(node) => {
                              previewRefs.current.reviewCount = node;
                            }}
                          >
                            128 reviews
                          </div>
                        </div>

                        <p
                          className={`preview-card__description${
                            highlightedField === 'description' ||
                            showAllConnections
                              ? ' is-linked'
                              : ''
                          }`}
                          ref={(node) => {
                            previewRefs.current.description = node;
                          }}
                        >
                          Lightweight weekender in textured linen with a structured
                          base, internal organization, and a clean neutral finish.
                        </p>

                        <div className="preview-card__footer">
                          <div
                            className={`preview-card__sku${
                              highlightedField === 'sku' || showAllConnections
                                ? ' is-linked'
                                : ''
                            }`}
                            ref={(node) => {
                              previewRefs.current.sku = node;
                            }}
                          >
                            SKU AT-LTB-021
                          </div>
                          <div
                            className={`preview-card__offer${
                              highlightedField === 'offers' || showAllConnections
                                ? ' is-linked'
                                : ''
                            }`}
                            ref={(node) => {
                              previewRefs.current.offers = node;
                            }}
                          >
                            $248.00 · In stock
                          </div>
                        </div>
                      </div>
                    </motion.article>

                    <motion.div
                      className={`schema-card${showCode ? ' is-visible' : ''}`}
                      initial={false}
                      animate={{
                        opacity: showCode ? 1 : 0,
                        y: showCode ? 0 : 28,
                      }}
                      transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="schema-card__header">
                        <span>Product JSON-LD</span>
                        <span>machine-readable</span>
                      </div>

                      <div className="schema-card__code">
                    <CodeLine>{'{'}</CodeLine>
                    <CodeLine indent={1}>
                      <span className="code-key">&quot;@context&quot;</span>
                      <span className="code-punctuation">: </span>
                      <span className="code-value">
                        &quot;https://schema.org&quot;
                      </span>
                      <span className="code-punctuation">,</span>
                    </CodeLine>
                    <CodeLine indent={1}>
                      <span className="code-key">&quot;@type&quot;</span>
                      <span className="code-punctuation">: </span>
                      <span className="code-value">&quot;Product&quot;</span>
                      <span className="code-punctuation">,</span>
                    </CodeLine>
                    <CodeLine indent={1}>
                      <span className="code-key">&quot;name&quot;</span>
                      <span className="code-punctuation">: </span>
                      <span className="code-value">&quot;Linen Travel Bag&quot;</span>
                      <span className="code-punctuation">,</span>
                    </CodeLine>
                    <CodeLine
                      indent={1}
                      fieldKey="image"
                      isActive={
                        highlightedField === 'image' || showAllConnections
                      }
                      registerLine={(node) => {
                        codeRefs.current.image = node;
                      }}
                    >
                      <span className="code-key">&quot;image&quot;</span>
                      <span className="code-punctuation">: </span>
                      <span className="code-value">
                        [&quot;https://example.com/cdn/linen-travel-bag.jpg&quot;]
                      </span>
                      <span className="code-punctuation">,</span>
                    </CodeLine>
                    <CodeLine
                      indent={1}
                      fieldKey="description"
                      isActive={
                        highlightedField === 'description' ||
                        showAllConnections
                      }
                      registerLine={(node) => {
                        codeRefs.current.description = node;
                      }}
                    >
                      <span className="code-key">&quot;description&quot;</span>
                      <span className="code-punctuation">: </span>
                      <span className="code-value">
                        &quot;Lightweight weekender with a structured base.&quot;
                      </span>
                      <span className="code-punctuation">,</span>
                    </CodeLine>
                    <CodeLine
                      indent={1}
                      fieldKey="sku"
                      isActive={highlightedField === 'sku' || showAllConnections}
                      registerLine={(node) => {
                        codeRefs.current.sku = node;
                      }}
                    >
                      <span className="code-key">&quot;sku&quot;</span>
                      <span className="code-punctuation">: </span>
                      <span className="code-value">&quot;AT-LTB-021&quot;</span>
                      <span className="code-punctuation">,</span>
                    </CodeLine>
                    <CodeLine
                      indent={1}
                      fieldKey="aggregateRating"
                      isActive={
                        highlightedField === 'aggregateRating' ||
                        showAllConnections
                      }
                      registerLine={(node) => {
                        codeRefs.current.aggregateRating = node;
                      }}
                    >
                      <span className="code-key">&quot;aggregateRating&quot;</span>
                      <span className="code-punctuation">: </span>
                      <span className="code-brace">{'{'}</span>
                    </CodeLine>
                    <CodeLine indent={2}>
                      <span className="code-key">&quot;@type&quot;</span>
                      <span className="code-punctuation">: </span>
                      <span className="code-value">&quot;AggregateRating&quot;</span>
                      <span className="code-punctuation">,</span>
                    </CodeLine>
                    <CodeLine
                      indent={2}
                      fieldKey="ratingValue"
                      isActive={
                        highlightedField === 'ratingValue' ||
                        showAllConnections
                      }
                      registerLine={(node) => {
                        codeRefs.current.ratingValue = node;
                      }}
                    >
                      <span className="code-key">&quot;ratingValue&quot;</span>
                      <span className="code-punctuation">: </span>
                      <span className="code-value">&quot;4.9&quot;</span>
                      <span className="code-punctuation">,</span>
                    </CodeLine>
                    <CodeLine
                      indent={2}
                      fieldKey="reviewCount"
                      isActive={
                        highlightedField === 'reviewCount' ||
                        showAllConnections
                      }
                      registerLine={(node) => {
                        codeRefs.current.reviewCount = node;
                      }}
                    >
                      <span className="code-key">&quot;reviewCount&quot;</span>
                      <span className="code-punctuation">: </span>
                      <span className="code-value">&quot;128&quot;</span>
                    </CodeLine>
                    <CodeLine indent={1}>
                      <span className="code-brace">{'}'}</span>
                      <span className="code-punctuation">,</span>
                    </CodeLine>
                    <CodeLine
                      indent={1}
                      fieldKey="offers"
                      isActive={
                        highlightedField === 'offers' || showAllConnections
                      }
                      registerLine={(node) => {
                        codeRefs.current.offers = node;
                      }}
                    >
                      <span className="code-key">&quot;offers&quot;</span>
                      <span className="code-punctuation">: </span>
                      <span className="code-brace">{'{'}</span>
                    </CodeLine>
                    <CodeLine indent={2}>
                      <span className="code-key">&quot;@type&quot;</span>
                      <span className="code-punctuation">: </span>
                      <span className="code-value">&quot;Offer&quot;</span>
                      <span className="code-punctuation">,</span>
                    </CodeLine>
                    <CodeLine indent={2}>
                      <span className="code-key">&quot;priceCurrency&quot;</span>
                      <span className="code-punctuation">: </span>
                      <span className="code-value">&quot;USD&quot;</span>
                      <span className="code-punctuation">,</span>
                    </CodeLine>
                    <CodeLine indent={2}>
                      <span className="code-key">&quot;price&quot;</span>
                      <span className="code-punctuation">: </span>
                      <span className="code-value">&quot;248.00&quot;</span>
                      <span className="code-punctuation">,</span>
                    </CodeLine>
                    <CodeLine indent={2}>
                      <span className="code-key">&quot;availability&quot;</span>
                      <span className="code-punctuation">: </span>
                      <span className="code-value">
                        &quot;https://schema.org/InStock&quot;
                      </span>
                    </CodeLine>
                    <CodeLine indent={1}>
                      <span className="code-brace">{'}'}</span>
                    </CodeLine>
                    <CodeLine>{'}'}</CodeLine>
                      </div>
                    </motion.div>
                  </div>

                  {showCode && (
                    <svg
                      aria-hidden="true"
                      className="simulation-board__connections"
                      viewBox={`0 0 ${boardSize.width} ${boardSize.height}`}
                      preserveAspectRatio="none"
                    >
                      {visibleConnectionFields.map((field, index) => {
                        const path = paths[field];

                        if (!path) {
                          return null;
                        }

                        return (
                          <motion.path
                            key={field}
                            d={path}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{
                              duration: prefersReducedMotion ? 0.16 : 0.48,
                              delay: showAllConnections ? index * 0.08 : 0,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                          />
                        );
                      })}
                    </svg>
                  )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="simulation-story__track" style={{ paddingBottom: viewportHeight }} aria-hidden="true">
            {steps.map((step) => (
              <div
                key={step.eyebrow}
                className="simulation-story__segment"
                style={{ minHeight: segmentHeight }}
              />
            ))}
          </div>

          <div className="simulation-outcome">
            <p className="simulation-outcome__eyebrow">Outcome</p>
            <p className="simulation-outcome__text">
              The product page becomes easier for search engines to interpret,
              while the merchant gets a clearer path from storefront content to
              rich result eligibility.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

interface CodeLineProps {
  children: ReactNode;
  fieldKey?: FieldKey;
  indent?: number;
  isActive?: boolean;
  registerLine?: (node: HTMLDivElement | null) => void;
}

function MerchantResultPreview() {
  return (
    <>
      <div className="simulation-board__header">
        <p className="simulation-board__eyebrow">Merchant Search Preview</p>
        <span className="simulation-board__status">Illustrative search layouts</span>
      </div>

      <div className="merchant-results">
        <article className="merchant-result-card">
          <p className="merchant-result-card__label">Example without enhanced display</p>
          <div className="merchant-result-card__url">
            example.com/products/linen-travel-bag
          </div>
          <h3>Linen Travel Bag - Atelier Commerce</h3>
          <p>
            Lightweight weekender in textured linen with a structured base and
            internal organization.
          </p>
          <span className="merchant-result-card__empty">
            No ratings visible in search
          </span>
        </article>

        <article className="merchant-result-card merchant-result-card--after">
          <p className="merchant-result-card__label">Possible enhanced display</p>
          <div className="merchant-result-card__url">
            example.com/products/linen-travel-bag
          </div>
          <h3>Linen Travel Bag - Atelier Commerce</h3>
          <div className="merchant-result-card__rating">
            <span>★★★★★</span>
            <strong>4.9</strong>
            <span>128 reviews</span>
          </div>
          <p>
            Lightweight weekender in textured linen with price, availability,
            image, and review signals clearly understood.
          </p>
          <div className="merchant-result-card__chips">
            <span>$248.00</span>
            <span>In stock</span>
            <span>Eligibility is not validated</span>
          </div>
        </article>
      </div>
    </>
  );
}

function CodeLine({
  children,
  fieldKey,
  indent = 0,
  isActive = false,
  registerLine,
}: CodeLineProps) {
  return (
    <div
      className={`schema-card__line${isActive ? ' is-active' : ''}${
        fieldKey ? ' is-linkable' : ''
      }`}
      ref={registerLine}
      style={{ paddingLeft: `${indent * 1.35}rem` }}
    >
      {children}
    </div>
  );
}
