import { motion } from 'framer-motion';

interface HomeSectionProps {
  registerScrollArea: (node: HTMLDivElement | null) => void;
  viewportHeight: number;
}

export function HomeSection({
  registerScrollArea,
  viewportHeight,
}: HomeSectionProps) {
  return (
    <section
      aria-labelledby="home-title"
      className="section section--home"
      style={{ height: viewportHeight }}
    >
      <div className="section__scroll" ref={registerScrollArea}>
        <div className="home-layout">
          <motion.div
            className="home-copy"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="section-label">SHOPIFY TECHNICAL PORTFOLIO</p>
            <h1 id="home-title" className="home-copy__title">
              Shopify storefront debugging, theme customization, and technical
              problem-solving.
            </h1>
            <p className="home-copy__body">
              I help identify and fix the issues that make Shopify stores
              unstable - from layout regressions and broken frontend behavior to
              structured data gaps, accessibility problems, and app conflicts.
            </p>
          </motion.div>

          <motion.div
            className="home-card"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.84,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <h3 className="home-card__title">What these studies cover</h3>
            <div className="home-card__row">
              <span>Storefront debugging</span>
              <span>
                Frontend issues, dynamic rendering, broken UI states, and
                interaction bugs.
              </span>
            </div>
            <div className="home-card__row">
              <span>SEO &amp; structured data</span>
              <span>
                Product schema, search visibility, metadata, and
                machine-readable storefront data.
              </span>
            </div>
            <div className="home-card__row">
              <span>Theme customization</span>
              <span>
                Liquid, CSS, JavaScript, responsive layouts, and section-level
                improvements.
              </span>
            </div>
            <div className="home-card__row">
              <span>Accessibility &amp; usability</span>
              <span>
                Semantic markup, focus states, labels, keyboard behavior, and
                clearer interactions.
              </span>
            </div>
            <div className="home-card__footnote">
              Use the sidebar or scroll to explore the case studies.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
