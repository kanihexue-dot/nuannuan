export type SourceType = 'chat' | 'record';
export type RiskLevel = 'low' | 'medium' | 'high';
export type EmotionTag = 'anxious' | 'sad' | 'tired' | 'calm' | 'relieved' | 'overwhelmed';
export type TopicTag = 'friendship' | 'study_pressure' | 'family' | 'sleep' | 'self_care';
export type RiskTag = 'self_harm_signal' | 'panic_signal' | 'hopelessness_signal' | 'harm_to_others_signal';
export type GuideType = 'emergency_support' | 'grounding_exercise' | 'trusted_contact' | 'help_resources';
export type SafetyGuideAction = 'viewed' | 'dismissed' | 'clicked_resource';
export type GardenStatus = 'pending' | 'planted' | 'not_saved';
export type SeedRiskLevel = 'normal' | 'high';
export type SeedColor = 'yellow' | 'blue' | 'orange' | 'purple' | 'pink' | 'green';
export type ConversationRoundIndex = 1 | 2 | 3;
export type ThreeRoundConversationStatus = 'collecting' | 'ready_for_seed' | 'seed_created';
export type SeedCandidateStatus = 'candidate' | 'planted' | 'not_saved';

export interface MemoryItem {
  id: string;
  createdAt: string;
  sourceType: SourceType;
  summary: string;
  emotionTags: EmotionTag[];
  topicTags: TopicTag[];
  riskLevel: RiskLevel;
  allowMention: boolean;
  isHidden: boolean;
  deletedAt?: string;
}

export interface HiddenMemoryProfile {
  preferredTone: 'gentle' | 'brief' | 'warm';
  interactionStyle: 'empathy_first' | 'fewer_suggestions' | 'short_sentences';
  avoidPatterns: Array<'preachy' | 'strong_analysis' | 'diagnosis_language'>;
  updatedAt: string;
}

export interface RiskRecord {
  id: string;
  createdAt: string;
  riskLevel: RiskLevel;
  riskTags: RiskTag[];
  sourceMemoryId?: string;
  actionTaken: 'stored_memory' | 'softened_summary' | 'safety_guide';
}

export interface SafetyGuideLog {
  id: string;
  riskRecordId: string;
  guideType: GuideType;
  shownAt: string;
  userAction: SafetyGuideAction;
}

export interface ConversationTurn {
  id: string;
  roundIndex: ConversationRoundIndex;
  userText: string;
  aiResponse: string;
  createdAt: string;
}

export interface ThreeRoundConversation {
  id: string;
  turns: ConversationTurn[];
  status: ThreeRoundConversationStatus;
  startedAt: string;
  completedAt?: string;
}

export interface MemorySeed {
  id: string;
  title: string;
  summary: string;
  createdAt: string;
  seedColor: SeedColor;
  moodTags: EmotionTag[];
  topicTags: TopicTag[];
  originalSnippet: string;
  aiResponse: string;
  place: string;
  gardenStatus: GardenStatus;
  riskLevel: SeedRiskLevel;
  thumbnailAsset?: string;
}

export interface MemorySeedCandidate extends MemorySeed {
  conversationId: string;
  candidateStatus: SeedCandidateStatus;
}

export interface MemoryGarden {
  seeds: MemorySeed[];
  recentSeed?: MemorySeed;
  topicStats: Partial<Record<TopicTag, number>>;
}

export interface GardenTopicArea {
  tag: TopicTag;
  label: string;
  count: number;
}

export function shouldShowMemory(memory: MemoryItem): boolean {
  return !memory.isHidden && !memory.deletedAt && memory.riskLevel !== 'high';
}

export function isHighRisk(memory: Pick<MemoryItem, 'riskLevel'>): boolean {
  return memory.riskLevel === 'high';
}

export function canEnterNormalGarden(seed: Pick<MemorySeed, 'gardenStatus' | 'riskLevel'>): boolean {
  return seed.gardenStatus === 'planted' && seed.riskLevel === 'normal';
}

export function isThreeRoundConversationComplete(conversation: Pick<ThreeRoundConversation, 'turns' | 'status' | 'completedAt'>): boolean {
  return conversation.turns.length === 3 && conversation.status !== 'collecting' && Boolean(conversation.completedAt);
}
