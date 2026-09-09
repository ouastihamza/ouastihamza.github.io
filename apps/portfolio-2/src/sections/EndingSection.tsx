import { motion } from 'framer-motion';

interface EndingSectionProps {
  registerScrollArea: (node: HTMLDivElement | null) => void;
  viewportHeight: number;
}

export function EndingSection({
  registerScrollArea,
  viewportHeight,
}: EndingSectionProps) {
  return (
    <section
      aria-labelledby="ending-title"
      className="section section--ending"
      style={{ height: viewportHeight }}
    >
      <div className="section__scroll" ref={registerScrollArea}>
        <div className="ending-layout">
          <motion.div
            className="ending-panel"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="section-label">Contact</p>
            <h2 id="ending-title" className="ending-panel__title">
              Discuss a technical role.
            </h2>
            <p className="ending-panel__body">
              Hamza Ouasti · Paris / Villejuif, France
            </p>
            <p><a href="mailto:ouastihamza27@gmail.com">ouastihamza27@gmail.com</a></p>
            <p><a href="https://linkedin.com/in/ouastihamza" target="_blank" rel="noreferrer">LinkedIn ↗</a> · <a href="https://github.com/ouastihamza" target="_blank" rel="noreferrer">GitHub ↗</a></p>
          </motion.div>

          <footer className="ending-footer">
            <span>Shopify Technical Studies</span>
            <span>Hamza Ouasti</span>
            <span>Technical support & development</span>
          </footer>
        </div>
      </div>
    </section>
  );
}
