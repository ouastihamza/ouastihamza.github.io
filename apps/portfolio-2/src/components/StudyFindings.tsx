export type Finding = readonly ['problem' | 'note' | 'quiet', string];

/** Findings under a demo. Slots are keyed by position so step changes update text instead of replacing nodes under the pointer. */
export function StudyFindings({ items, className = '' }: { items: readonly Finding[]; className?: string }) {
  return <div className={`study-findings${className}`} aria-label="Findings">
    {items.map(([tone, text], index) => (
      <span className={`study-findings__item${tone === 'note' ? '' : ` is-${tone}`}`} key={index}>{text}</span>
    ))}
  </div>;
}
