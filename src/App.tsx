import { useMemo, useState } from "react";
import { FlowOverview } from "./components/FlowOverview";
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
      <header className="hero-shell">
        <p className="hero-kicker">Warm Room Demo</p>
        <h1>小情绪房间</h1>
        <p className="hero-subtitle">低摩擦情绪安置演示页</p>
      </header>

      <FlowOverview
        steps={presentationSteps}
        activeStepId={activeStep.id}
        onStepChange={setActiveStepId}
      />

      <footer className="closing-shell">前台体验始终低压力，后台独立守住安全红线。</footer>
    </main>
  );
}
