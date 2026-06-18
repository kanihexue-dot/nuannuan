import type { EmotionPhraseOption, EmotionWeatherOption, EmpathyRevealState, PresentationStep } from "../types";

interface StepNarrativeCardProps {
  step: PresentationStep;
  recognitionWeather: EmotionWeatherOption;
  recognitionPhrase: EmotionPhraseOption;
  empathyReveal: EmpathyRevealState;
}

export function StepNarrativeCard({
  step,
  recognitionWeather,
  recognitionPhrase,
  empathyReveal
}: StepNarrativeCardProps) {
  const detailBlocks =
    step.id === "step-02"
      ? [
          { title: "天气感受", content: recognitionWeather.label },
          { title: "识别结果", content: `Mood：${recognitionPhrase.mood}\nEmotion：${recognitionPhrase.emotion}` }
        ]
      : step.id === "step-03" && empathyReveal !== "full"
        ? [
            { title: "示例回应", content: "外面的雨太大了，进来烤烤火吧。" },
            { title: "回应节奏", content: "手机内先出现第一段承接，再补出陪伴式落点。" }
          ]
        : step.detailBlocks;

  return (
    <aside className="narrative-card">
      <p className="narrative-card__eyebrow">Step Notes</p>

      <div className="narrative-card__header">
        <span className="narrative-card__step">{step.indexLabel}</span>
        <div>
          <p className="narrative-card__title">{step.title}</p>
          <p className="narrative-card__summary">{step.summary}</p>
        </div>
      </div>

      <div className="narrative-card__chips">
        {step.sceneKeywords.map((keyword) => (
          <span key={keyword} className="narrative-card__chip">
            {keyword}
          </span>
        ))}
      </div>

      <ul className="narrative-card__list">
        {step.narrative.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div className="narrative-card__details">
        {detailBlocks.map((block) => (
          <section key={block.title} className="narrative-card__detail-block">
            <p className="narrative-card__detail-title">{block.title}</p>
            <p className="narrative-card__detail-body">
              {block.content.split("\n").map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
          </section>
        ))}
      </div>
      <p className="narrative-card__support-note">右侧只同步解释当前手机状态，主要演示动作请在左侧手机屏幕内完成。</p>
    </aside>
  );
}
