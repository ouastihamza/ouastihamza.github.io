import { motion } from 'framer-motion';
import { profile } from '../../../../app/data/profile';

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
              {profile.name} · {profile.location}
            </p>
            <p><a href={`mailto:${profile.email}`}>{profile.email}</a></p>
            <p><a href={profile.phone.href}>{profile.phone.display}</a></p>
            <p><a href={profile.links.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a> · <a href={profile.links.github} target="_blank" rel="noreferrer">GitHub ↗</a></p>
          </motion.div>

          <footer className="ending-footer">
            <span>Shopify Technical Studies</span>
            <span>Hamza Ouasti</span>
            <span>{profile.title} · {profile.location}</span>
          </footer>
        </div>
      </div>
    </section>
  );
}
