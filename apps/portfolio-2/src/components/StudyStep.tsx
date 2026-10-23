export interface StudyStepCopy { title: string; look: string; why: string }

/** Active step explanation. The live region persists; only its content is keyed, so announcements still fire. */
export function StudyStep({ prefix, titleId, step, total, copy }: {
  prefix: 'simulation' | 'debugging' | 'stable'; titleId?: string; step: number; total: number; copy: StudyStepCopy;
}) {
  return <div className={`${prefix}-copy__panel`}>
    <div aria-live="polite" aria-atomic="true">
      <div className="study-step" key={`${step}-${copy.title}`}>
        <p className={`${prefix}-copy__eyebrow`}>Step {String(step + 1).padStart(2, '0')} of {String(total).padStart(2, '0')}</p>
        <h3 id={titleId} className={`${prefix}-copy__title`}>{copy.title}</h3>
        <p className={`${prefix}-copy__body`}>{copy.look}</p>
        <p className="study-step__why"><strong>Why this matters</strong> {copy.why}</p>
      </div>
    </div>
  </div>;
}
