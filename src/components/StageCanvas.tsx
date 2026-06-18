import type { EmotionPhraseOption, EmotionWeatherOption, EmpathyRevealState, PresentationStep } from "../types";

interface StageCanvasProps {
  step: PresentationStep;
  weatherOptions: EmotionWeatherOption[];
  phraseOptions: EmotionPhraseOption[];
  selectedWeatherId: string | null;
  selectedPhraseId: string | null;
  customPhraseInput: string;
  onWeatherSelect: (optionId: string) => void;
  onPhraseSelect: (optionId: string) => void;
  onCustomPhraseChange: (value: string) => void;
  recognitionWeather: EmotionWeatherOption;
  recognitionPhrase: EmotionPhraseOption;
  empathyReveal: EmpathyRevealState;
  canGoBack: boolean;
  onBack: () => void;
  onPrimaryAction: () => void;
  primaryActionLabel: string;
  isPrimaryActionDisabled?: boolean;
}

const empathyLines = [
  "外面的雨太大了，进来烤烤火吧。",
  "烦心事都丢给火堆，我先陪你待一会。",
  "你不用马上变好，先把呼吸放慢一点。"
];

export function StageCanvas({
  step,
  weatherOptions,
  phraseOptions,
  selectedWeatherId,
  selectedPhraseId,
  customPhraseInput,
  onWeatherSelect,
  onPhraseSelect,
  onCustomPhraseChange,
  recognitionWeather,
  recognitionPhrase,
  empathyReveal,
  canGoBack,
  onBack,
  onPrimaryAction,
  primaryActionLabel,
  isPrimaryActionDisabled = false
}: StageCanvasProps) {
  const ctaHint =
    step.id === "step-01"
      ? isPrimaryActionDisabled
        ? "先选一个天气，再选或写一句最接近的话。"
        : "可以了，我们只把这句话温柔地翻译一下。"
      : step.id === "step-02"
        ? "识别只是过渡，下一步会先把人接住。"
        : step.id === "step-03" && empathyReveal !== "full"
          ? "回应会一段一段出现，不急着给建议。"
          : "这一屏已经完成，可以继续往后看。";

  return (
    <section className="stage-canvas" data-mood={step.visualMood} data-testid="stage-canvas">
      <div className="phone-frame" aria-label="手机内交互演示">
        <div className="phone-frame__speaker" aria-hidden="true" />
        <div className="phone-screen">
          <div className="phone-screen__status">
            <span>9:41</span>
            <span>小情绪房间</span>
          </div>

          <header className="phone-screen__header">
            <div>
              <span className="phone-screen__step">{step.indexLabel}</span>
              <h2>{step.title}</h2>
            </div>
            <span className="phone-screen__weather">{recognitionWeather.label}</span>
          </header>

          <div className="phone-screen__scene">
            <img
              key={step.id}
              className="stage-canvas__image"
              src={step.imageSrc}
              alt={`${step.title} 场景演示图`}
            />
          </div>

          {step.id === "step-01" && (
            <div className="phone-sheet phone-sheet--entry" aria-label="低门槛情绪选择">
              <div className="stage-canvas__choice-group">
                <p className="stage-canvas__choice-title">先选一个天气</p>
                <div className="stage-canvas__choice-row">
                  {weatherOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className="stage-canvas__choice-button"
                      data-selected={option.id === selectedWeatherId}
                      aria-pressed={option.id === selectedWeatherId}
                      onClick={() => onWeatherSelect(option.id)}
                    >
                      <span className="stage-canvas__selected-mark" aria-hidden="true">
                        ✓
                      </span>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="stage-canvas__choice-group">
                <p className="stage-canvas__choice-title">再点一句接近的话</p>
                <div className="stage-canvas__phrase-list">
                  {phraseOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className="stage-canvas__phrase-button"
                      data-selected={option.id === selectedPhraseId}
                      aria-pressed={option.id === selectedPhraseId}
                      onClick={() => onPhraseSelect(option.id)}
                    >
                      <span className="stage-canvas__selected-mark" aria-hidden="true">
                        ✓
                      </span>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="stage-canvas__custom-phrase">
                <span>也可以自己写一句</span>
                <textarea
                  value={customPhraseInput}
                  onChange={(event) => onCustomPhraseChange(event.target.value)}
                  placeholder="比如：今天脑子很乱，不想回消息"
                  rows={2}
                />
              </label>
            </div>
          )}

          {step.id === "step-02" && (
            <div className="phone-sheet phone-sheet--recognition" aria-label="识别过渡卡片">
              <div className="recognition-status">
                <span className="recognition-status__pulse" aria-hidden="true" />
                <span>识别中</span>
              </div>
              <h3>正在把模糊感受翻译成可被接住的情绪</h3>
              <div className="recognition-scan" aria-hidden="true" />
              <dl>
                <div>
                  <dt>天气感受</dt>
                  <dd>{recognitionWeather.label}</dd>
                </div>
                <div>
                  <dt>刚刚那句话</dt>
                  <dd>{recognitionPhrase.label}</dd>
                </div>
                <div>
                  <dt>细粒度情绪</dt>
                  <dd>
                    <span>Mood：{recognitionPhrase.mood}</span>
                    <span>Emotion：{recognitionPhrase.emotion}</span>
                  </dd>
                </div>
              </dl>
            </div>
          )}

          {step.id === "step-03" && (
            <div className="phone-sheet phone-sheet--empathy" aria-label="AI 共情回应">
              <div className="empathy-header">
                <span className="empathy-header__avatar" aria-hidden="true">
                  暖
                </span>
                <div>
                  <p>暖暖先接住你</p>
                  <span>不分析，不说教，先陪你把这一刻放稳。</span>
                </div>
              </div>
              <div className="stage-canvas__empathy-bubbles">
                <p>{empathyLines[0]}</p>
                {(empathyReveal === "second" || empathyReveal === "full") && <p>{empathyLines[1]}</p>}
                {empathyReveal === "full" && <p>{empathyLines[2]}</p>}
              </div>
            </div>
          )}

          <footer className="phone-actions" aria-label="手机内演示操作">
            <p className="phone-actions__hint" data-ready={!isPrimaryActionDisabled}>
              {ctaHint}
            </p>
            <button
              type="button"
              className="phone-actions__button phone-actions__button--secondary"
              onClick={onBack}
              disabled={!canGoBack}
            >
              上一步
            </button>
            <button
              type="button"
              className="phone-actions__button phone-actions__button--primary"
              onClick={onPrimaryAction}
              disabled={isPrimaryActionDisabled}
            >
              {primaryActionLabel}
            </button>
          </footer>
        </div>
      </div>
    </section>
  );
}
