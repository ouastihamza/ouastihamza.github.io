import type { SectionId } from '../App';

interface SidebarProps {
  activeSection: SectionId;
  onSelect: (id: SectionId) => void;
}

const items: Array<{ id: SectionId; label: string; index: string }> = [
  { id: 'home', label: 'Overview', index: '01' },
  { id: 'simulation', label: 'Rich results in Google', index: '02' },
  { id: 'storefront-debugging', label: "Storefronts that don't break", index: '03' },
  { id: 'stable-integrations', label: 'Stable integrations', index: '04' },
  { id: 'how-i-work', label: 'How I debug', index: '05' },
  { id: 'ending', label: 'Get in touch', index: '06' },
];

export function Sidebar({ activeSection, onSelect }: SidebarProps) {
  return (
    <aside className="sidebar">
      <a className="portfolio-return" href="/#shopify-technical-studies">← Back to portfolio</a>
      <div className="sidebar__brand">
        <p className="sidebar__eyebrow">Shopify Technical</p>
        <p className="sidebar__title">Technical Studies</p>
      </div>

      <nav aria-label="Section navigation" className="sidebar__nav">
        {items.map((item) => {
          const isActive = item.id === activeSection;

          return (
            <button
              key={item.id}
              className={`sidebar__link${isActive ? ' is-active' : ''}`}
              aria-current={isActive ? "step" : undefined}
              type="button"
              onClick={() => onSelect(item.id)}
            >
              <span className="sidebar__link-index">{item.index}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar__meta">
        <span className="sidebar__meta-label">Hamza Ouasti</span>
        <span className="sidebar__meta-label">Shopify</span>
      </div>
    </aside>
  );
}
