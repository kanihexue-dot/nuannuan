export type StepId = "step-01" | "step-02" | "step-03" | "step-04" | "step-05";

export type SafetyLevel = "L0" | "L1" | "L2" | "L3";

export type VisualMood = "entry" | "mapping" | "compassion" | "warmth" | "quiet";

export interface PresentationStep {
  id: StepId;
  indexLabel: string;
  shortLabel: string;
  title: string;
  summary: string;
  sampleInput: string;
  sampleResponse: string;
  sceneKeywords: string[];
  narrative: string[];
  safetyLevel: SafetyLevel;
  visualMood: VisualMood;
}
