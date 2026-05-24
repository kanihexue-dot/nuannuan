import type { PresentationStep, StepId } from "../types";

interface FlowOverviewProps {
  steps: PresentationStep[];
  activeStepId: StepId;
  onStepChange: (stepId: StepId) => void;
}

export function FlowOverview({ steps, activeStepId, onStepChange }: FlowOverviewProps) {
  return (
    <nav aria-label="五步流程" className="flow-overview">
      {steps.map((step) => (
        <button
          key={step.id}
          type="button"
          className="flow-overview__button"
          data-active={step.id === activeStepId}
          aria-pressed={step.id === activeStepId}
          onClick={() => onStepChange(step.id)}
        >
          <span aria-hidden="true" className="flow-overview__index">
            {step.indexLabel}
          </span>
          <span className="flow-overview__label">
            {step.indexLabel} {step.title}
          </span>
        </button>
      ))}
    </nav>
  );
}
