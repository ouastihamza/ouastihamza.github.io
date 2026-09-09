import { motion, useReducedMotion } from 'framer-motion';

interface HowIWorkSectionProps {
  registerScrollArea: (node: HTMLDivElement | null) => void;
  viewportHeight: number;
}

const engagementCards = [
  {
    title: 'Audit & diagnose',
    body:
      'For stores where something feels wrong but the cause is unclear. Includes investigation, technical findings, and prioritized recommendations.',
  },
  {
    title: 'Fix a specific issue',
    body:
      'For targeted storefront problems: broken integrations, layout regressions, app conflicts, mobile issues, structured data, or frontend bugs.',
  },
  {
    title: 'Ongoing technical support',
    body:
      'For merchants who want a technical partner to help maintain storefront stability as the store evolves.',
  },
];

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
            <p className="section-label">How I Work</p>
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
              <p className="how-panel__eyebrow">Who I work with</p>
              <h3>Who I work with</h3>
              <p>
                Shopify merchants dealing with real storefront issues: unstable
                integrations, broken layouts, inconsistent frontend behavior,
                structured data problems, or technical debt created over time.
              </p>
              <p>
                Focus on stores already operating in production, not speculative
                redesign projects.
              </p>
            </motion.article>

            <motion.section
              aria-labelledby="how-engagement-title"
              className="how-panel"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...revealTransition, delay: 0.1 }}
            >
              <p className="how-panel__eyebrow">Engagement types</p>
              <h3 id="how-engagement-title">Ways we can work together</h3>
              <div className="how-engagements">
                {engagementCards.map((card) => (
                  <article className="how-engagement" key={card.title}>
                    <h4>{card.title}</h4>
                    <p>{card.body}</p>
                  </article>
                ))}
              </div>
            </motion.section>

            <motion.article
              className="how-panel"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...revealTransition, delay: 0.14 }}
            >
              <p className="how-panel__eyebrow">Communication</p>
              <h3>Communication</h3>
              <p>
                Clear explanations, realistic timelines, and direct technical
                feedback. I prefer small focused scopes, transparent
                communication, and practical solutions over unnecessary
                complexity.
              </p>
            </motion.article>

            <motion.article
              className="how-panel"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...revealTransition, delay: 0.18 }}
            >
              <p className="how-panel__eyebrow">Investigation</p>
              <h3>Scoping</h3>
              <p>
                Every storefront is different. Some issues are quick fixes,
                others require deeper investigation. I usually review the
                storefront first, explain what is happening technically, then
                propose the safest and most practical next step.
              </p>
            </motion.article>
          </div>

          <motion.p
            className="how-bottom-line"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...revealTransition, delay: 0.22 }}
          >
            Document the cause, the change and the checks needed to catch a regression.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
