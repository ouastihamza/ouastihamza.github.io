interface Props { step: number; total: number; onStep: (step: number) => void }
export function StudyControls({ step, total, onStep }: Props) {
  return <div className="study-controls" aria-label="Walkthrough steps"><button type="button" disabled={step === 0} onClick={() => onStep(step - 1)}>← Previous</button><output>Step {step + 1} of {total}</output><button type="button" disabled={step === total - 1} onClick={() => onStep(step + 1)}>Next →</button></div>;
}
