import { motion, useReducedMotion } from 'framer-motion';

interface HowIWorkSectionProps {
  registerScrollArea: (node: HTMLDivElement | null) => void;
  viewportHeight: number;
}

export function HowIWorkSection({
  registerScrollArea,
  viewportHeight,
}: HowIWorkSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const revealTransition = {
    duration: prefersReducedMotion ? 0.16 : 0.5,
    ease: [0.22, 1, 0.36, 1],
  };

  return (
    <section
      aria-labelledby="how-i-work-title"
      className="section section--how"
      style={{ height: viewportHeight }}
    >
      <div className="section__scroll" ref={registerScrollArea}>
        <div className="how-layout">
          <motion.header
            className="how-hero"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={revealTransition}
          >
            <p className="section-label">How I debug</p>
            <h2 id="how-i-work-title" className="how-hero__title">
              Reproduce, diagnose, validate.
            </h2>
            <p className="how-hero__subhead">
              I reproduce the reported behavior, inspect the relevant code and data, then validate the fix against the original issue.
            </p>
          </motion.header>

          <div className="how-panels">
            <motion.article
              className="how-panel"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...revealTransition, delay: 0.06 }}
            >
              <p className="how-panel__eyebrow">Investigation</p>
              <h3>Scoping</h3>
              <p>
                Every storefront is different. Some issues are quick fixes,
                others need deeper investigation. I review the storefront
                first, explain what is happening technically, then choose the
                safest and most practical next step.
              </p>
            </motion.article>

            <motion.article
              className="how-panel"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...revealTransition, delay: 0.1 }}
            >
              <p className="how-panel__eyebrow">Communication</p>
              <h3>Communication</h3>
              <p>
                Clear explanations and direct technical feedback. I prefer
                small focused changes and practical solutions over unnecessary
                complexity.
              </p>
            </motion.article>
          </div>

          <motion.p
            className="how-bottom-line"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...revealTransition, delay: 0.14 }}
          >
            Document the cause, the change and the checks needed to catch a regression.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
