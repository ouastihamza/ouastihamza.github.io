import { WalkthroughPreview } from '../components/WalkthroughPreview';
import { StudyControls } from '../components/StudyControls';
import { StudyStep, type StudyStepCopy } from '../components/StudyStep';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'framer-motion';
import {
  type ReactNode,
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

// What each step points at in the preview. Technical steps 6–12 highlight through the linked JSON-LD field instead.
type MerchantFocus = 'url' | 'title' | 'card' | 'rating' | 'description' | 'image' | 'note' | 'offer';
type TechnicalFocus = 'url' | 'title' | 'card' | 'rating' | 'schema' | null;

interface StepDefinition {
  merchant: StudyStepCopy & { focus: MerchantFocus };
  technical: StudyStepCopy & { focus: TechnicalFocus };
}

const steps: StepDefinition[] = [
  {
    merchant: { focus: 'url', title: 'Check the product URL', look: 'Look at the URL shown in each search result.', why: 'It should be the page shoppers land on, so the result and the page describe the same product.' },
    technical: { focus: 'url', title: 'Check the product URL', look: 'Look at the URL being inspected. This walkthrough uses illustrative product data.', why: 'Search engines read markup from the rendered page at this URL, so check the live page, not only the theme files.' },
  },
  {
    merchant: { focus: 'title', title: 'Check the product name', look: 'Look at the product title in both results.', why: 'A clear, specific name helps shoppers recognise the product before they click.' },
    technical: { focus: 'title', title: 'Check the product name', look: 'Look at the product title on the page. Every value marked up later must also be visible here.', why: 'Markup should describe content shoppers can see on the page.' },
  },
  {
    merchant: { focus: 'card', title: 'Check the visible product', look: 'Look at the possible enhanced result: title, rating, description and price together.', why: 'These are the details shoppers compare before choosing a result.' },
    technical: { focus: 'card', title: 'Check the visible product', look: 'Look at the product card. This is the content the markup has to describe.', why: 'Markup that does not match the page can be ignored by search engines.' },
  },
  {
    merchant: { focus: 'rating', title: 'Check the review summary', look: 'Look at the star rating and the review count.', why: 'Ratings in search can draw attention to a result, but they are never guaranteed to appear.' },
    technical: { focus: 'rating', title: 'Check the review summary', look: 'Look at the score and review count shown on the page.', why: 'These visible values are what the rating markup will describe.' },
  },
  {
    merchant: { focus: 'card', title: 'See where the details come from', look: 'Look at the enhanced result. Its extra details come from structured data shoppers never see.', why: 'Themes and review apps often add this markup automatically. Your part is keeping the visible details accurate.' },
    technical: { focus: 'schema', title: 'Inspect the JSON-LD', look: 'Look at the top of the JSON-LD block. "@type": "Product" says it describes this product, in a format search engines read.', why: 'Shopify themes often generate it with the structured_data Liquid filter, and apps may add more.' },
  },
  {
    merchant: { focus: 'rating', title: 'Find the rating summary', look: 'Look at the stars. They depend on a rating summary in the markup.', why: 'Without one, search engines have no rating to show, even if reviews appear on your page.' },
    technical: { focus: null, title: 'Find the rating summary', look: 'Look at aggregateRating. It groups the score and the review count.', why: 'If two apps each output a rating block, search engines can receive conflicting values.' },
  },
  {
    merchant: { focus: 'rating', title: 'Check the rating value', look: 'Look at 4.9. It should match the average on your product page.', why: 'A different score in search than on the page undermines shopper trust.' },
    technical: { focus: null, title: 'Check the rating value', look: 'Look at ratingValue. It holds the average score, 4.9.', why: 'Use the same scale as the page, and add bestRating if the scale is not out of 5.' },
  },
  {
    merchant: { focus: 'rating', title: 'Check the review count', look: 'Look at “128 reviews”. It should match the count on your page.', why: 'Matching numbers keep the search result and the page consistent.' },
    technical: { focus: null, title: 'Check the review count', look: 'Look at reviewCount. It counts the reviews behind the average.', why: 'Count the same reviews the average is calculated from.' },
  },
  {
    merchant: { focus: 'description', title: 'Compare descriptions', look: 'Look at the description in the enhanced result.', why: 'Search engines may write their own snippet, but an accurate description gives them the right material.' },
    technical: { focus: null, title: 'Compare descriptions', look: 'Look at description. It should summarise the same text as the page.', why: 'Keep it plain text. HTML copied from the product description shows up as stray characters.' },
  },
  {
    merchant: { focus: 'image', title: 'Check the product image', look: 'Look at the product thumbnail in the enhanced result.', why: 'A clear main image helps the product stand out where search shows images.' },
    technical: { focus: null, title: 'Check the product image', look: 'Look at image. It points to the product’s main image URL.', why: 'Use a full URL that search engines can fetch. Blocked or broken image URLs cannot be used.' },
  },
  {
    merchant: { focus: 'note', title: 'Check the product code', look: 'The SKU is not shown to shoppers. Look at the note above the results.', why: 'It ties the listing to the exact item, which matters when a product has variants.' },
    technical: { focus: null, title: 'Match the SKU', look: 'Look at sku. It identifies the exact item.', why: 'With variants, make sure the SKU and price describe the same variant.' },
  },
  {
    merchant: { focus: 'offer', title: 'Check price and stock', look: 'Look at the price and stock status.', why: 'If search shows an outdated price or stock status, shoppers may click and leave.' },
    technical: { focus: null, title: 'Check the offer', look: 'Look at offers: price, priceCurrency and availability.', why: 'These values change often. Markup that is cached or hard-coded can fall out of date.' },
  },
  {
    merchant: { focus: 'card', title: 'Review the full result', look: 'Look at the whole enhanced result. Every detail should match your product page.', why: 'Valid markup makes rich results possible, not guaranteed.' },
    technical: { focus: null, title: 'Compare page and markup', look: 'Look at every linked field. Each visible value should trace to one JSON-LD field.', why: 'Test the live page with Google’s Rich Results Test after theme or app changes.' },
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
  const prefersReducedMotion = useReducedMotion();
  const renderedStep = activeStep;
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

  const stepCopy = (steps[renderedStep] ?? steps[0])[simulationView];
  const technicalFocus = isTechnicalView ? steps[renderedStep].technical.focus : null;
  // Each view is its own walkthrough, so switching restarts at step 1.
  const selectView = (view: SimulationView) => {
    if (view === simulationView) return;
    setSimulationView(view);
    setActiveStep(0);
  };
  const focus = (target: TechnicalFocus) => (technicalFocus === target ? ' is-focus' : '');

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
  }, [activeStep, isMobileLayout, isTechnicalView, showCode, viewportHeight]);

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
                <h2 id="simulation-title" className="simulation-merchant__headline">
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
                      selectView(next);
                      document.getElementById(`view-${next}`)?.focus();
                    }}
                    aria-selected={simulationView === view}
                    className={`simulation-view-toggle__button${
                      simulationView === view ? ' is-active' : ''
                    }`}
                    key={view}
                    onClick={() => selectView(view)}
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

              <StudyStep prefix="simulation" step={renderedStep} total={steps.length} copy={stepCopy} />
              <StudyControls step={activeStep} total={steps.length} onStep={setActiveStep} />
            </div>

            <WalkthroughPreview step={activeStep} total={steps.length} onStep={setActiveStep}>
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
                    <MerchantResultPreview step={renderedStep} focus={steps[renderedStep].merchant.focus} />
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
                      <div className={`simulation-input__field${focus('url')}`} aria-label="Illustrative product URL">
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
                      className={`preview-card${showPreview ? ' is-visible' : ''}${focus('card')}`}
                      initial={false}
                      animate={{
                        opacity: showPreview ? 1 : 0.85,
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
                        <div className={`preview-card__heading${focus('title')}`}>
                          <p className="preview-card__eyebrow">
                            Search-ready product surface
                          </p>
                          <h3>Linen Travel Bag</h3>
                        </div>

                        <div className={`preview-card__rating-row${focus('rating')}`}>
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
                                  opacity: showStars ? 1 : 0.8,
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
                        opacity: showCode ? 1 : 0.8,
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
                    <CodeLine indent={1} isActive={technicalFocus === 'schema'}>
                      <span className="code-key">&quot;@context&quot;</span>
                      <span className="code-punctuation">: </span>
                      <span className="code-value">
                        &quot;https://schema.org&quot;
                      </span>
                      <span className="code-punctuation">,</span>
                    </CodeLine>
                    <CodeLine indent={1} isActive={technicalFocus === 'schema'}>
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
            </WalkthroughPreview>
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

function MerchantResultPreview({ step, focus }: { step: number; focus: MerchantFocus }) {
  const details = [
    ['Product URL', 'example.com/products/linen-travel-bag'],
    ['Product name', 'Linen Travel Bag · Atelier Commerce'],
    ['Visible product', 'Title, rating, description and price shown together.'],
    ['Review summary', '4.9 out of 5 · 128 reviews'],
    ['Structured data', 'Not visible to shoppers. Switch to Technical View to inspect the JSON-LD.'],
    ['Rating summary', 'Stars need a rating summary in the markup.'],
    ['Rating value', '4.9 out of 5'],
    ['Review count', '128 reviews'],
    ['Description', 'Should describe the same product as the page.'],
    ['Product image', 'Main product image, shown as a thumbnail.'],
    ['Product code (SKU)', 'AT-LTB-021 · not shown in search results'],
    ['Offer', 'USD 248.00 · In stock'],
    ['Full result', 'Every detail should match the product page.'],
  ];
  const [label, value] = details[step];
  const on = (target: MerchantFocus) => (focus === target ? ' is-focus' : '');
  return (
    <>
      <div className="simulation-board__header">
        <p className="simulation-board__eyebrow">Merchant Search Preview</p>
        <span className="simulation-board__status">Illustrative search layouts</span>
      </div>

      <div className={`merchant-focus${on('note')}`}><strong>{label}</strong><span>{value}</span></div>
      <div className="merchant-results">
        <article className="merchant-result-card">
          <p className="merchant-result-card__label">Example without enhanced display</p>
          <div className={`merchant-result-card__url${on('url')}`}>
            example.com/products/linen-travel-bag
          </div>
          <h3 className={on('title').trim() || undefined}>Linen Travel Bag - Atelier Commerce</h3>
          <p>
            Lightweight weekender in textured linen with a structured base and
            internal organization.
          </p>
          <span className="merchant-result-card__empty">
            No ratings visible in search
          </span>
        </article>

        <article className={`merchant-result-card merchant-result-card--after${on('card')}`}>
          <p className="merchant-result-card__label">Possible enhanced display</p>
          <div className={`merchant-result-card__url${on('url')}`}>
            example.com/products/linen-travel-bag
          </div>
          <div className="merchant-result-card__heading">
            <h3 className={on('title').trim() || undefined}>Linen Travel Bag - Atelier Commerce</h3>
            <div className={`merchant-result-card__thumb${on('image')}`} aria-hidden="true" />
          </div>
          <div className={`merchant-result-card__rating${on('rating')}`}>
            <span>★★★★★</span>
            <strong>4.9</strong>
            <span>128 reviews</span>
          </div>
          <p className={on('description').trim() || undefined}>
            Lightweight weekender in textured linen with a structured base and
            internal organization.
          </p>
          <div className="merchant-result-card__chips">
            <div className={`merchant-result-card__offer${on('offer')}`}>
              <span>$248.00</span>
              <span>In stock</span>
            </div>
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
