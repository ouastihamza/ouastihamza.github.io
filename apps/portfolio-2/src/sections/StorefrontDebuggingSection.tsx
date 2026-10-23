import { WalkthroughPreview } from '../components/WalkthroughPreview';
import { StudyControls } from '../components/StudyControls';
import { StudyStep, type StudyStepCopy } from '../components/StudyStep';
import { motion } from 'framer-motion';
import {
  useEffect,
  useRef,
  useState,
} from 'react';

interface StorefrontDebuggingSectionProps {
  isActive: boolean;
  registerScrollArea: (node: HTMLDivElement | null) => void;
  viewportHeight: number;
}

type DebuggingFocus = 'grid' | 'filter' | 'broken' | 'findings' | 'code';

const debuggingSteps: (StudyStepCopy & { focus: DebuggingFocus })[] = [
  { focus: 'grid', title: 'Healthy storefront state', look: 'Look at the product cards and their Add buttons.', why: 'This is the baseline: scripts attached on page load, and every button responds.' },
  { focus: 'filter', title: 'A shopper filters the collection', look: 'Look at the “Filter: In stock” control.', why: 'Many themes refresh filtered results by fetching new HTML and swapping part of the page, without a full reload.' },
  { focus: 'broken', title: 'The interface disconnects', look: 'Look at the cards: two are gone and the Add buttons are inactive.', why: 'Scripts were attached to the old elements. The swapped-in markup has no behaviour attached.' },
  { focus: 'findings', title: 'Trace what changed', look: 'Look at the three findings under the grid.', why: 'The first page load was fine. The bug starts when markup is replaced.' },
  { focus: 'code', title: 'Set up behaviour again after the update', look: 'Look at initProductGrid(scope). It sets up only the cards inside the given container.', why: 'Run it on the new markup after every update, so new cards get working buttons.' },
  { focus: 'grid', title: 'Fixed state', look: 'Look at the cards after the same filter: all four respond.', why: 'Behaviour now follows the markup, however often the theme replaces it.' },
];

export function StorefrontDebuggingSection({
  isActive,
  registerScrollArea,
  viewportHeight,
}: StorefrontDebuggingSectionProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const renderedStep = activeStep;
  const stepCopy = debuggingSteps[renderedStep] ?? debuggingSteps[0];




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

              <StudyStep prefix="debugging" step={renderedStep} total={debuggingSteps.length} copy={stepCopy} />
              <StudyControls step={activeStep} total={debuggingSteps.length} onStep={setActiveStep} />
            </div>

            <WalkthroughPreview step={activeStep} total={debuggingSteps.length} onStep={setActiveStep}><DebuggingBoard step={renderedStep} focus={stepCopy.focus} /></WalkthroughPreview>
          </div>

          <details className="study-notes">
            <summary>Notes and sources</summary>
            <p>The theme editor emits <code>shopify:section:load</code>. It is not a general storefront event. For live storefront replacements, such as filtering, call initialization from your own render lifecycle after the new markup is inserted. The code sketch omits binding and cleanup details.</p>
            <p><a href="https://shopify.dev/docs/storefronts/themes/best-practices/editor/integrate-sections-and-blocks" target="_blank" rel="noreferrer">Shopify: integrate sections and blocks with the theme editor ↗</a></p>
          </details>
        </div>
      </div>
    </section>
  );
}

function DebuggingBoard({ step, focus }: { step: number; focus: DebuggingFocus }) {
  const isAction = step >= 1;
  const isBroken = step >= 2 && step < 5;
  const showDiagnosis = step >= 3 && step < 5;
  const showCode = step >= 4;
  const isFixed = step >= 5;
  const on = (target: DebuggingFocus) => (focus === target ? ' is-focus' : '');

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
          className={`debugging-control${isAction ? ' is-active' : ''}${on('filter')}`}
          animate={{ y: isAction && !isFixed ? [0, -2, 0] : 0 }}
          transition={{ duration: 0.42 }}
        >
          Filter: In stock
        </motion.span>
        <span className="debugging-control">Sort: Best sellers</span>
        <span className="debugging-control">Quick add</span>
      </div>

      <div className="debugging-board__content">
        <div className="debugging-grid-wrap">
          <div className={`debugging-grid${on('grid')}${on('broken')}`}>
            {['Linen Shirt', 'Canvas Tote', 'Travel Pouch', 'Daily Cap'].map((product, index) => {
              const removed = isBroken && index > 1;
              return (
                <article className={`debugging-product${removed ? ' is-missing' : ''}`} key={product}>
                  <div className="debugging-product__media" />
                  <div>
                    <h4>{product}</h4>
                    <p>{removed ? 'Removed by the update' : isFixed ? 'Button set up again' : 'Quick add ready'}</p>
                  </div>
                  <span className="debugging-product__button">
                    {isBroken ? 'Inactive' : 'Add'}
                  </span>
                </article>
              );
            })}
          </div>

          <div className={`study-findings${on('findings')}`} aria-label="Findings">
            {isBroken ? (
              <>
                <span className="study-findings__item is-problem">UI state mismatch</span>
                <span className="study-findings__item is-problem">Events detached</span>
                <span className="study-findings__item is-problem">Cards removed</span>
                {showDiagnosis && (
                  <>
                    <span className="study-findings__item">DOM replaced</span>
                    <span className="study-findings__item">Bindings lost</span>
                    <span className="study-findings__item">Old nodes removed</span>
                  </>
                )}
              </>
            ) : (
              <span className="study-findings__item is-quiet">{isFixed ? 'All cards respond after the update' : 'No issues detected'}</span>
            )}
          </div>
        </div>

        <div className="debugging-diagnostics">
          <div className={`debugging-code${showCode ? ' is-visible' : ''}${on('code')}`}>
            <div className="debugging-code__header">
              <span>Theme-editor example · illustrative</span>
            </div>
            <pre aria-label="Code walkthrough">
{`// Theme editor only; not a general storefront event.
document.addEventListener('shopify:section:load', (event) => {
  initProductGrid(event.target);
});

function initProductGrid(scope = document) {
  scope.querySelectorAll('[data-product-card]').forEach(bindCard);
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
