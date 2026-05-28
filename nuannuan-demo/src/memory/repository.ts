import { canEnterNormalGarden, isThreeRoundConversationComplete, type HiddenMemoryProfile, type MemoryGarden, type MemoryItem, type MemorySeed, type MemorySeedCandidate, type RiskRecord, type SafetyGuideLog, type ThreeRoundConversation } from './types';

const STORAGE_KEYS = {
  memories: 'nuannuan.memories',
  hiddenProfile: 'nuannuan.hiddenProfile',
  riskRecords: 'nuannuan.riskRecords',
  safetyGuideLogs: 'nuannuan.safetyGuideLogs',
} as const;

function readJson<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T) : fallback;
}

function writeJson<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function sortByNewest<T extends { createdAt: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function plantMemorySeed(seeds: MemorySeed[], id: string): MemorySeed[] {
  return seeds.map((seed) => (seed.id === id ? { ...seed, gardenStatus: 'planted' } : seed));
}

export function markSeedNotSaved(seeds: MemorySeed[], id: string): MemorySeed[] {
  return seeds.map((seed) => (seed.id === id ? { ...seed, gardenStatus: 'not_saved' } : seed));
}

export function createSeedCandidateFromConversation(
  conversation: ThreeRoundConversation,
  seed: MemorySeed,
): MemorySeedCandidate | null {
  if (!isThreeRoundConversationComplete(conversation)) {
    return null;
  }

  return {
    ...seed,
    id: `candidate_${seed.id}`,
    conversationId: conversation.id,
    candidateStatus: 'candidate',
    gardenStatus: 'pending',
  };
}

export function plantSeedCandidate(candidate: MemorySeedCandidate): MemorySeedCandidate {
  return {
    ...candidate,
    candidateStatus: 'planted',
    gardenStatus: 'planted',
  };
}

export function markSeedCandidateNotSaved(candidate: MemorySeedCandidate): MemorySeedCandidate {
  return {
    ...candidate,
    candidateStatus: 'not_saved',
    gardenStatus: 'not_saved',
  };
}

export function buildMemoryGarden(seeds: MemorySeed[]): MemoryGarden {
  const gardenSeeds = sortByNewest(seeds.filter(canEnterNormalGarden));
  const topicStats = gardenSeeds.reduce<MemoryGarden['topicStats']>((stats, seed) => {
    seed.topicTags.forEach((tag) => {
      stats[tag] = (stats[tag] ?? 0) + 1;
    });
    return stats;
  }, {});

  return {
    seeds: gardenSeeds,
    recentSeed: gardenSeeds[0],
    topicStats,
  };
}

export interface MemoryRepository {
  listMemories(): MemoryItem[];
  saveMemory(memory: MemoryItem): void;
  hideMemory(id: string): void;
  setAllowMention(id: string, allowMention: boolean): void;
  deleteMemory(id: string): void;
  getHiddenProfile(): HiddenMemoryProfile | null;
  saveHiddenProfile(profile: HiddenMemoryProfile): void;
  listRiskRecords(): RiskRecord[];
  saveRiskRecord(record: RiskRecord): void;
  listSafetyGuideLogs(): SafetyGuideLog[];
  saveSafetyGuideLog(log: SafetyGuideLog): void;
  reset(): void;
}

export function createMemoryRepository(): MemoryRepository {
  return {
    listMemories() {
      return sortByNewest(readJson<MemoryItem[]>(STORAGE_KEYS.memories, []));
    },
    saveMemory(memory) {
      const existing = this.listMemories().filter((item) => item.id !== memory.id);
      writeJson(STORAGE_KEYS.memories, sortByNewest([memory, ...existing]));
    },
    hideMemory(id) {
      writeJson(
        STORAGE_KEYS.memories,
        this.listMemories().map((item) => (item.id === id ? { ...item, isHidden: true } : item)),
      );
    },
    setAllowMention(id, allowMention) {
      writeJson(
        STORAGE_KEYS.memories,
        this.listMemories().map((item) => (item.id === id ? { ...item, allowMention } : item)),
      );
    },
    deleteMemory(id) {
      writeJson(
        STORAGE_KEYS.memories,
        this.listMemories().filter((item) => item.id !== id),
      );
    },
    getHiddenProfile() {
      return readJson<HiddenMemoryProfile | null>(STORAGE_KEYS.hiddenProfile, null);
    },
    saveHiddenProfile(profile) {
      writeJson(STORAGE_KEYS.hiddenProfile, profile);
    },
    listRiskRecords() {
      return sortByNewest(readJson<RiskRecord[]>(STORAGE_KEYS.riskRecords, []));
    },
    saveRiskRecord(record) {
      writeJson(STORAGE_KEYS.riskRecords, sortByNewest([record, ...this.listRiskRecords()]));
    },
    listSafetyGuideLogs() {
      return [...readJson<SafetyGuideLog[]>(STORAGE_KEYS.safetyGuideLogs, [])].sort((a, b) =>
        b.shownAt.localeCompare(a.shownAt),
      );
    },
    saveSafetyGuideLog(log) {
      writeJson(
        STORAGE_KEYS.safetyGuideLogs,
        [...this.listSafetyGuideLogs(), log].sort((a, b) => b.shownAt.localeCompare(a.shownAt)),
      );
    },
    reset() {
      Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    },
  };
}
