import type { HiddenMemoryProfile, MemoryItem, RiskRecord } from './types';

export interface CompanionContextInput {
  memories: MemoryItem[];
  hiddenProfile: HiddenMemoryProfile | null;
  riskRecords: RiskRecord[];
}

export interface CompanionContext {
  toneInstruction: string;
  mentionableMemorySummaries: string[];
  styleAvoidance: string[];
  safetyMode: boolean;
  systemGuidance: string;
}

function canMention(memory: MemoryItem): boolean {
  return !memory.isHidden && !memory.deletedAt && memory.allowMention && memory.riskLevel !== 'high';
}

export function buildCompanionContext(input: CompanionContextInput): CompanionContext {
  const mentionableMemorySummaries = input.memories
    .filter(canMention)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 3)
    .map((memory) => memory.summary);

  const safetyMode = input.riskRecords.some((record) => record.riskLevel === 'high');
  const toneInstruction = input.hiddenProfile
    ? `使用 ${input.hiddenProfile.preferredTone} 语气，互动方式为 ${input.hiddenProfile.interactionStyle}。`
    : '使用温和、简短、先共情的陪伴语气。';

  return {
    toneInstruction,
    mentionableMemorySummaries,
    styleAvoidance: input.hiddenProfile?.avoidPatterns ?? ['preachy', 'diagnosis_language'],
    safetyMode,
    systemGuidance: safetyMode
      ? '关注用户当下是否安全，提供支持性引导，不要复述或暗示高风险细节。'
      : '只在语境合适时温和提起允许的记忆，不主动翻旧账。',
  };
}
