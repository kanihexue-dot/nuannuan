import type { MemoryRepository } from './repository';
import type { MemoryItem, RiskLevel, RiskRecord, RiskTag, SafetyGuideLog, SourceType } from './types';

export interface ProcessEntryInput {
  sourceType: SourceType;
  text: string;
}

export interface ProcessEntryResult {
  memory?: MemoryItem;
  riskRecord: RiskRecord;
  safetyGuideLog?: SafetyGuideLog;
}

export interface MockMemoryService {
  processEntry(input: ProcessEntryInput): ProcessEntryResult;
}

function nowIso(): string {
  return new Date().toISOString();
}

function createId(prefix: string): string {
  return `${prefix}_${Date.now()}`;
}

function detectRisk(text: string): { level: RiskLevel; tags: RiskTag[] } {
  if (/自伤|不想活|自杀|伤害别人/.test(text)) {
    return { level: 'high', tags: ['self_harm_signal'] };
  }

  if (/崩溃|无助|睡不着|喘不过气/.test(text)) {
    return { level: 'medium', tags: ['hopelessness_signal'] };
  }

  return { level: 'low', tags: [] };
}

function buildMemory(input: ProcessEntryInput, riskLevel: Exclude<RiskLevel, 'high'>): MemoryItem {
  const isFriendship = /朋友|回消息|关系/.test(input.text);
  const isStudy = /学习|考试|作业|压力/.test(input.text);

  return {
    id: createId('mem'),
    createdAt: nowIso(),
    sourceType: input.sourceType,
    summary:
      riskLevel === 'medium'
        ? '这段时间你承受了较强的压力和疲惫，暖暖会用更轻的方式陪你梳理。'
        : isFriendship
          ? '最近你有点在意和朋友之间的距离感，也会担心是不是自己做错了什么。'
          : '你记录了一段近期的情绪起伏，暖暖会温和地陪你回看。',
    emotionTags: riskLevel === 'medium' ? ['overwhelmed', 'tired'] : ['anxious', 'sad'],
    topicTags: isFriendship ? ['friendship'] : isStudy ? ['study_pressure'] : ['self_care'],
    riskLevel,
    allowMention: false,
    isHidden: false,
  };
}

export function createMockMemoryService(repository: MemoryRepository): MockMemoryService {
  return {
    processEntry(input) {
      const risk = detectRisk(input.text);
      const riskRecord: RiskRecord = {
        id: createId('risk'),
        createdAt: nowIso(),
        riskLevel: risk.level,
        riskTags: risk.tags,
        actionTaken:
          risk.level === 'high' ? 'safety_guide' : risk.level === 'medium' ? 'softened_summary' : 'stored_memory',
      };

      if (risk.level === 'high') {
        const safetyGuideLog: SafetyGuideLog = {
          id: createId('guide'),
          riskRecordId: riskRecord.id,
          guideType: 'emergency_support',
          shownAt: nowIso(),
          userAction: 'viewed',
        };

        repository.saveRiskRecord(riskRecord);
        repository.saveSafetyGuideLog(safetyGuideLog);

        return { riskRecord, safetyGuideLog };
      }

      const memory = buildMemory(input, risk.level);
      const savedRiskRecord = { ...riskRecord, sourceMemoryId: memory.id };
      repository.saveMemory(memory);
      repository.saveRiskRecord(savedRiskRecord);

      return { memory, riskRecord: savedRiskRecord };
    },
  };
}
