import type { PresentationStep } from "../types";

interface StepNarrativeCardProps {
  step: PresentationStep;
}

export function StepNarrativeCard({ step }: StepNarrativeCardProps) {
  return (
    <section className="narrative-card">
      <p className="narrative-card__eyebrow">当前步骤重点</p>
      <ul>
        {step.narrative.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
