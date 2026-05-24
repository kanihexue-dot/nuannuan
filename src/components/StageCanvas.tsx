import type { PresentationStep } from "../types";

interface StageCanvasProps {
  step: PresentationStep;
}

export function StageCanvas({ step }: StageCanvasProps) {
  return (
    <section className="stage-canvas" data-mood={step.visualMood} data-testid="stage-canvas">
      <div className="stage-canvas__header">
        <div>
          <p className="stage-canvas__eyebrow">Current Stage</p>
          <h2>{step.title}</h2>
        </div>
        <span className="stage-canvas__pill">当前步骤</span>
      </div>

      <div className="stage-canvas__body">
        <div className="stage-canvas__scene" aria-hidden="true">
          <div className="stage-canvas__scene-glow" />
          <div className="stage-canvas__scene-figure" />
        </div>

        <div className="stage-canvas__copy">
          <p className="stage-canvas__summary">{step.summary}</p>

          <div className="stage-canvas__keywords">
            {step.sceneKeywords.map((keyword) => (
              <span key={keyword} className="stage-canvas__chip">
                {keyword}
              </span>
            ))}
          </div>

          <div className="stage-canvas__example">
            <strong>示例输入</strong>
            <p>{step.sampleInput}</p>
          </div>
          <div className="stage-canvas__example">
            <strong>示例回应</strong>
            <p>{step.sampleResponse}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
