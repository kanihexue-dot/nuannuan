import { useMemo, useState } from "react";
import { ClosingStatement } from "./components/ClosingStatement";
import { FlowOverview } from "./components/FlowOverview";
import { PresentationHero } from "./components/PresentationHero";
import { SafetyRail } from "./components/SafetyRail";
import { StageCanvas } from "./components/StageCanvas";
import { StepNarrativeCard } from "./components/StepNarrativeCard";
import { defaultStepId, presentationSteps } from "./data/steps";
import type { StepId } from "./types";

export default function App() {
  const [activeStepId, setActiveStepId] = useState<StepId>(defaultStepId);

  const activeStep = useMemo(
    () => presentationSteps.find((step) => step.id === activeStepId) ?? presentationSteps[0],
    [activeStepId]
  );

  return (
    <main className="app-shell">
      <PresentationHero
        title="小情绪房间"
        subtitle="保留原 App 的亲和感，再把列表分发感转成情绪接触的空间舞台。"
      />

      <FlowOverview
        steps={presentationSteps}
        activeStepId={activeStep.id}
        onStepChange={setActiveStepId}
      />

      <section className="presentation-grid">
        <StageCanvas step={activeStep} />
        <div className="sidebar-rail">
          <StepNarrativeCard step={activeStep} />
          <SafetyRail activeLevel={activeStep.safetyLevel} />
        </div>
      </section>

      <ClosingStatement />
    </main>
  );
}
