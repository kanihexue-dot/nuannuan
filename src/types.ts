export type StepId = "step-01" | "step-02" | "step-03" | "step-04" | "step-05";

export type VisualMood = "entry" | "mapping" | "compassion" | "warmth" | "quiet";

export type EmpathyRevealState = "first" | "second" | "full";

export interface DetailBlock {
  title: string;
  content: string;
}

export interface EmotionWeatherOption {
  id: string;
  label: string;
  description: string;
}

export interface EmotionPhraseOption {
  id: string;
  label: string;
  mood: string;
  emotion: string;
}

export interface PresentationStep {
  id: StepId;
  indexLabel: string;
  shortLabel: string;
  title: string;
  summary: string;
  imageSrc: string;
  sceneKeywords: string[];
  narrative: string[];
  detailBlocks: DetailBlock[];
  visualMood: VisualMood;
}
