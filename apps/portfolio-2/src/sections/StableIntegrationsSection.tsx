import { WalkthroughPreview } from '../components/WalkthroughPreview';
import { StudyControls } from '../components/StudyControls';
import { StudyStep, type StudyStepCopy } from '../components/StudyStep';
import { StudyFindings } from '../components/StudyFindings';
import {
  useEffect,
  useRef,
  useState,
} from 'react';

interface StableIntegrationsSectionProps {
  isActive: boolean;
  registerScrollArea: (node: HTMLDivElement | null) => void;
  viewportHeight: number;
}

type IntegrationFocus = 'apps' | 'new-app' | 'findings' | 'reviews' | 'code' | 'product';

const integrationSteps: (StudyStepCopy & { focus: IntegrationFocus })[] = [
  { focus: 'apps', title: 'A stable baseline', look: 'Look at the five apps running on one product page.', why: 'Each app adds its own scripts and markup to the same page.' },
  { focus: 'new-app', title: 'Add one more integration', look: 'Look at the new Promo drawer app.', why: 'A new app can change shared markup, styles or events that other apps depend on.' },
  { focus: 'findings', title: 'The conflict becomes visible', look: 'Look at the three symptoms under the product.', why: 'Symptoms often appear far from their cause.' },
  { focus: 'reviews', title: 'The visible symptom gets blamed first', look: 'Look at the Reviews widget. It looks broken, so it gets blamed.', why: 'The app that looks broken is not always the cause. Turn recent changes off one at a time to find the source.' },
  { focus: 'findings', title: 'Trace the shared page', look: 'Look at the three likely causes under the product.', why: 'Shared selectors, competing event handlers and late-loading scripts are common causes.' },
  { focus: 'code', title: 'Stabilize the integration layer', look: 'Look at the guard in initStorefront.', why: 'Marking each element once stops it being set up twice when scripts run again.' },
  { focus: 'product', title: 'Replay the interaction safely', look: 'Look at the product page: the drawer opens and every widget stays in place.', why: 'Recheck the page after every app install or theme update.' },
];

export function StableIntegrationsSection({
  isActive,
  registerScrollArea,
  viewportHeight,
}: StableIntegrationsSectionProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const renderedStep = activeStep;
  const stepCopy = integrationSteps[renderedStep] ?? integrationSteps[0];




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

              <StudyStep prefix="stable" step={renderedStep} total={integrationSteps.length} copy={stepCopy} />
              <StudyControls step={activeStep} total={integrationSteps.length} onStep={setActiveStep} />
            </div>

            <WalkthroughPreview step={activeStep} total={integrationSteps.length} onStep={setActiveStep}><StableIntegrationsBoard step={renderedStep} focus={stepCopy.focus} /></WalkthroughPreview>
          </div>

          <details className="study-notes">
            <summary>Notes and sources</summary>
            <p>The guard is illustrative, not a complete integration. Production code also needs error handling, cleanup and a clear lifecycle. Set the ready marker only after binding succeeds.</p>
          </details>
        </div>
      </div>
    </section>
  );
}

function StableIntegrationsBoard({ step, focus }: { step: number; focus: IntegrationFocus }) {
  const hasNewIntegration = step >= 1;
  const hasConflict = step >= 2 && step < 6;
  const showWrongBlame = step >= 3 && step < 5;
  const showDiagnosis = step >= 4 && step < 6;
  const showCode = step >= 5;
  const isFixed = step >= 6;
  const on = (target: IntegrationFocus) => (focus === target ? ' is-focus' : '');

  return (
    <div className={`stable-board${hasConflict ? ' is-conflicted' : ''}${isFixed ? ' is-fixed' : ''}`}>
      <div className="stable-board__topbar">
        <div>
          <p className="stable-board__eyebrow">Product Page Ecosystem</p>
          <h3>Multiple apps, one storefront surface</h3>
        </div>
        <span className="stable-board__status">
          {isFixed ? 'Stable together' : hasConflict ? 'Conflict visible' : 'Stable'}
        </span>
      </div>

      <div className={`stable-integrations-row${on('apps')}`}>
        {['Reviews', 'Bundles', 'Filters', 'Sticky cart', 'Analytics'].map((label) => (
          <span className="stable-integration-pill" key={label}>{label}</span>
        ))}
        <span className={`stable-integration-pill stable-integration-pill--new${hasNewIntegration ? ' is-active' : ''}${on('new-app')}`}>
          Promo drawer
        </span>
      </div>

      <div className="stable-board__content">
        <div className="stable-storefront">
          <div className={`stable-product-shell${on('product')}`}>
            <div className="stable-product-media" />
            <div className="stable-product-detail">
              <p className="stable-product-detail__eyebrow">Linen Travel Bag</p>
              <h4>Product page</h4>
              <div className="stable-widget-row">
                <span className={`stable-widget stable-widget--reviews${showWrongBlame ? ' is-symptom' : ''}${on('reviews')}`}>
                  {hasConflict ? 'Reviews widget · missing' : 'Reviews widget'}
                </span>
                <span className="stable-widget">Bundle offer</span>
              </div>
              <span className="stable-drawer-button">
                {hasConflict ? 'Drawer detached' : 'Open cart drawer'}
              </span>
            </div>
          </div>

          <StudyFindings className={on('findings')} items={
            showWrongBlame ? [['note', 'Visible symptom'], ['problem', 'Reviews app blamed first'], ['note', 'Actual source is upstream']]
              : showDiagnosis ? [['note', 'Shared selectors'], ['note', 'Event collision'], ['note', 'Async rendering conflict']]
                : hasConflict ? [['problem', 'Duplicated promo block'], ['problem', 'Reviews disappear'], ['problem', 'Drawer no longer opens']]
                  : [['quiet', isFixed ? 'All apps work together' : 'No conflicts detected']]
          } />
        </div>

        <div className={`stable-code${showCode ? ' is-visible' : ''}${on('code')}`}>
          <div className="stable-code__header">
            <span>Integration-safe init · illustrative</span>
          </div>
          <pre aria-label="Code walkthrough">
{`function initStorefront(scope = document) {
  scope.querySelectorAll('[data-integration]').forEach((node) => {
    if (node.dataset.ready) return;
    node.dataset.ready = 'true';
    bindIntegration(node);
  });
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
