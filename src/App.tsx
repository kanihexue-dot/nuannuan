import { useMemo, useState } from "react";
import { StageCanvas } from "./components/StageCanvas";
import { defaultStepId, emotionPhraseOptions, emotionWeatherOptions, presentationSteps } from "./data/steps";
import type { EmpathyRevealState, StepId } from "./types";

export default function App() {
  const [activeStepId, setActiveStepId] = useState<StepId>(defaultStepId);
  const [selectedWeatherId, setSelectedWeatherId] = useState<string | null>(null);
  const [selectedPhraseId, setSelectedPhraseId] = useState<string | null>(null);
  const [customPhraseInput, setCustomPhraseInput] = useState("");
  const [empathyReveal, setEmpathyReveal] = useState<EmpathyRevealState>("full");

  const activeIndex = useMemo(
    () => presentationSteps.findIndex((step) => step.id === activeStepId),
    [activeStepId]
  );

  const activeStep = useMemo(
    () => presentationSteps.find((step) => step.id === activeStepId) ?? presentationSteps[0],
    [activeStepId]
  );

  const selectedWeather = useMemo(
    () => emotionWeatherOptions.find((option) => option.id === selectedWeatherId) ?? null,
    [selectedWeatherId]
  );

  const selectedPhrase = useMemo(
    () => emotionPhraseOptions.find((option) => option.id === selectedPhraseId) ?? null,
    [selectedPhraseId]
  );

  const trimmedCustomPhrase = customPhraseInput.trim();
  const recognitionWeather = selectedWeather ?? emotionWeatherOptions[0];
  const recognitionPhrase =
    selectedPhrase ??
    (trimmedCustomPhrase
      ? {
          id: "custom",
          label: trimmedCustomPhrase,
          mood: "混乱 / 低耗能",
          emotion: "疲惫 / 回避 / 想被安静接住"
        }
      : emotionPhraseOptions[0]);
  const hasMeaningfulPhrase = selectedPhrase !== null || trimmedCustomPhrase.length >= 4;
  const canEnterRecognition = selectedWeather !== null && hasMeaningfulPhrase;

  const primaryActionLabel = useMemo(() => {
    if (activeStep.id === "step-01") return "进入识别过渡";
    if (activeStep.id === "step-02") return "继续进入回应";
    if (activeStep.id === "step-03") {
      if (empathyReveal === "first") return "继续显示下半句";
      if (empathyReveal === "second") return "显示完整落点";
      return "看场景变暖";
    }
    if (activeStep.id === "step-04") return "封存这一刻";

    return "回到开头";
  }, [activeStep.id, empathyReveal]);

  const setPresentationStep = (stepId: StepId, nextReveal: EmpathyRevealState = "full") => {
    setActiveStepId(stepId);
    if (stepId === "step-03") {
      setEmpathyReveal(nextReveal);
    }
  };

  const handleWeatherSelect = (optionId: string) => {
    setSelectedWeatherId(optionId);
  };

  const handlePhraseSelect = (optionId: string) => {
    setSelectedPhraseId(optionId);
    setCustomPhraseInput("");
  };

  const handleCustomPhraseChange = (value: string) => {
    setCustomPhraseInput(value);
    setSelectedPhraseId(null);
  };

  const handleBack = () => {
    if (activeIndex <= 0) {
      return;
    }

    setPresentationStep(presentationSteps[activeIndex - 1].id);
  };

  const handlePrimaryAction = () => {
    if (activeStep.id === "step-01" && !canEnterRecognition) {
      return;
    }

    if (activeStep.id === "step-02") {
      setPresentationStep("step-03", "first");
      return;
    }

    if (activeStep.id === "step-03" && empathyReveal === "first") {
      setEmpathyReveal("second");
      return;
    }

    if (activeStep.id === "step-03" && empathyReveal === "second") {
      setEmpathyReveal("full");
      return;
    }

    if (activeIndex === presentationSteps.length - 1) {
      setActiveStepId(presentationSteps[0].id);
      setSelectedWeatherId(null);
      setSelectedPhraseId(null);
      setCustomPhraseInput("");
      setEmpathyReveal("full");
      return;
    }

    setPresentationStep(presentationSteps[activeIndex + 1].id);
  };

  return (
    <main className="product-app-shell" aria-label="小情绪房间用户端模拟">
      <StageCanvas
        step={activeStep}
        weatherOptions={emotionWeatherOptions}
        phraseOptions={emotionPhraseOptions}
        selectedWeatherId={selectedWeatherId}
        selectedPhraseId={selectedPhraseId}
        customPhraseInput={customPhraseInput}
        onWeatherSelect={handleWeatherSelect}
        onPhraseSelect={handlePhraseSelect}
        onCustomPhraseChange={handleCustomPhraseChange}
        recognitionWeather={recognitionWeather}
        recognitionPhrase={recognitionPhrase}
        empathyReveal={empathyReveal}
        canGoBack={activeIndex > 0}
        onBack={handleBack}
        onPrimaryAction={handlePrimaryAction}
        primaryActionLabel={primaryActionLabel}
        isPrimaryActionDisabled={activeStep.id === "step-01" && !canEnterRecognition}
      />
    </main>
  );
}
