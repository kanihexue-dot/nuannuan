import { buildCompanionContext } from './contextBuilder';
import type { HiddenMemoryProfile, MemoryItem, RiskRecord } from './types';

const profile: HiddenMemoryProfile = {
  preferredTone: 'gentle',
  interactionStyle: 'empathy_first',
  avoidPatterns: ['preachy', 'strong_analysis', 'diagnosis_language'],
  updatedAt: '2026-05-27T08:00:00.000Z',
};

const visibleMemory: MemoryItem = {
  id: 'mem_visible',
  createdAt: '2026-05-27T08:00:00.000Z',
  sourceType: 'chat',
  summary: '最近你有点在意和朋友之间的距离感。',
  emotionTags: ['anxious'],
  topicTags: ['friendship'],
  riskLevel: 'low',
  allowMention: true,
  isHidden: false,
};

it('includes only mentionable visible memories', () => {
  const context = buildCompanionContext({
    memories: [
      visibleMemory,
      { ...visibleMemory, id: 'mem_hidden', isHidden: true },
      { ...visibleMemory, id: 'mem_not_allowed', allowMention: false },
      { ...visibleMemory, id: 'mem_deleted', deletedAt: '2026-05-27T09:00:00.000Z' },
      { ...visibleMemory, id: 'mem_high', riskLevel: 'high' },
    ],
    hiddenProfile: profile,
    riskRecords: [],
  });

  expect(context.mentionableMemorySummaries).toEqual(['最近你有点在意和朋友之间的距离感。']);
});

it('limits mentionable memories to the three newest items', () => {
  const context = buildCompanionContext({
    memories: [
      { ...visibleMemory, id: 'old', createdAt: '2026-05-24T08:00:00.000Z', summary: '旧的小记' },
      { ...visibleMemory, id: 'first', createdAt: '2026-05-27T08:00:00.000Z', summary: '第一条' },
      { ...visibleMemory, id: 'second', createdAt: '2026-05-26T08:00:00.000Z', summary: '第二条' },
      { ...visibleMemory, id: 'third', createdAt: '2026-05-25T08:00:00.000Z', summary: '第三条' },
    ],
    hiddenProfile: profile,
    riskRecords: [],
  });

  expect(context.mentionableMemorySummaries).toEqual(['第一条', '第二条', '第三条']);
});

it('does not expose high risk details and adds safety instruction', () => {
  const highRisk: RiskRecord = {
    id: 'risk_high',
    createdAt: '2026-05-27T08:00:00.000Z',
    riskLevel: 'high',
    riskTags: ['self_harm_signal'],
    actionTaken: 'safety_guide',
  };

  const context = buildCompanionContext({
    memories: [visibleMemory],
    hiddenProfile: profile,
    riskRecords: [highRisk],
  });

  expect(context.safetyMode).toBe(true);
  expect(context.systemGuidance).toContain('不要复述或暗示高风险细节');
  expect(context.systemGuidance).not.toContain('self_harm_signal');
});

it('uses default gentle guidance when no hidden profile exists', () => {
  const context = buildCompanionContext({
    memories: [],
    hiddenProfile: null,
    riskRecords: [],
  });

  expect(context.toneInstruction).toContain('温和');
  expect(context.styleAvoidance).toContain('diagnosis_language');
});
