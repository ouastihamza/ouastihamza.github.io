interface SidebarProps { activeSection: string }
export function Sidebar({ activeSection }: SidebarProps) {
  return <header className="publication-header">
    <a className="publication-brand" href="#home" aria-label="Shopify Commerce Engineering home"><span className="brand-mark" aria-hidden="true">ce↗</span><span>Shopify Commerce<br /><strong>Engineering</strong></span></a>
    <nav aria-label="Publication navigation">
      {[['guides', 'Guides'], ['intelligence', 'Intelligence'], ['labs', 'Labs'], ['how-i-work', 'Approach']].map(([id, label]) => <a key={id} href={`#${id}`} aria-current={activeSection === id ? 'page' : undefined}>{label}</a>)}
    </nav>
    <a className="publication-portfolio" href="/#shopify-technical-studies">Hamza Ouasti ↗</a>
  </header>;
}
