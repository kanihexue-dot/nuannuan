import { buildMemoryGarden, createSeedCandidateFromConversation, markSeedCandidateNotSaved, markSeedNotSaved, plantMemorySeed, plantSeedCandidate } from './repository';
import type { MemorySeed, ThreeRoundConversation } from './types';

const seed: MemorySeed = {
  id: 'seed_1',
  title: '刚刚这颗小种子',
  createdAt: '2026-05-27T08:00:00.000Z',
  summary: '最近你有点在意和朋友之间的距离感。',
  seedColor: 'yellow',
  moodTags: ['anxious'],
  topicTags: ['friendship'],
  originalSnippet: '朋友回消息变慢时，我会担心是不是自己做错了什么。',
  aiResponse: '这份担心很真实，我们可以先把它放在这里，不急着评判自己。',
  place: '聊天结束后',
  gardenStatus: 'pending',
  riskLevel: 'normal',
};

it('plants a pending seed without changing other seeds', () => {
  const otherSeed: MemorySeed = { ...seed, id: 'seed_2', gardenStatus: 'not_saved' };

  expect(plantMemorySeed([seed, otherSeed], seed.id)).toEqual([
    { ...seed, gardenStatus: 'planted' },
    otherSeed,
  ]);
});

it('marks a seed as not saved', () => {
  expect(markSeedNotSaved([seed], seed.id)).toEqual([{ ...seed, gardenStatus: 'not_saved' }]);
});

it('builds a memory garden from planted normal seeds only', () => {
  const plantedSeed: MemorySeed = { ...seed, gardenStatus: 'planted' };
  const olderPlantedSeed: MemorySeed = {
    ...seed,
    id: 'seed_older',
    createdAt: '2026-05-26T08:00:00.000Z',
    gardenStatus: 'planted',
    seedColor: 'blue',
  };
  const highRiskSeed: MemorySeed = {
    ...seed,
    id: 'seed_high',
    gardenStatus: 'planted',
    riskLevel: 'high',
    summary: '这段内容需要安全支持，不进入普通花园。',
  };

  expect(buildMemoryGarden([olderPlantedSeed, seed, highRiskSeed, plantedSeed])).toEqual({
    seeds: [plantedSeed, olderPlantedSeed],
    recentSeed: plantedSeed,
    topicStats: { friendship: 2 },
  });
});

const threeRoundConversation: ThreeRoundConversation = {
  id: 'conversation_1',
  status: 'ready_for_seed',
  startedAt: '2026-05-28T09:30:00.000Z',
  completedAt: '2026-05-28T09:41:00.000Z',
  turns: [
    {
      id: 'turn_1',
      roundIndex: 1,
      userText: '朋友回消息变慢时，我会担心是不是自己做错了什么。',
      aiResponse: '你很在意这段关系，所以慢一点回应会让你先怀疑自己。',
      createdAt: '2026-05-28T09:31:00.000Z',
    },
    {
      id: 'turn_2',
      roundIndex: 2,
      userText: '我也知道她可能只是忙，但还是会一直想。',
      aiResponse: '一边理解她可能忙，一边还是忍不住担心，这两种感受可以同时存在。',
      createdAt: '2026-05-28T09:35:00.000Z',
    },
    {
      id: 'turn_3',
      roundIndex: 3,
      userText: '我想先不要急着问她，可能先把自己安顿好。',
      aiResponse: '这次更像是一颗小心翼翼的小种子，带着不安，也带着你想靠近朋友的愿望。',
      createdAt: '2026-05-28T09:40:00.000Z',
    },
  ],
};

it('creates a seed candidate only after three conversation rounds', () => {
  const candidate = createSeedCandidateFromConversation(threeRoundConversation, seed);

  expect(candidate).toMatchObject({
    id: 'candidate_seed_1',
    conversationId: 'conversation_1',
    candidateStatus: 'candidate',
    gardenStatus: 'pending',
    title: seed.title,
  });
});

it('does not create a seed candidate before the third round is complete', () => {
  const incompleteConversation: ThreeRoundConversation = {
    ...threeRoundConversation,
    status: 'collecting',
    completedAt: undefined,
    turns: threeRoundConversation.turns.slice(0, 2),
  };

  expect(createSeedCandidateFromConversation(incompleteConversation, seed)).toBeNull();
});

it('plants or skips a seed candidate before it reaches the garden', () => {
  const candidate = createSeedCandidateFromConversation(threeRoundConversation, seed);

  expect(candidate).not.toBeNull();
  expect(plantSeedCandidate(candidate!)).toMatchObject({
    candidateStatus: 'planted',
    gardenStatus: 'planted',
  });
  expect(markSeedCandidateNotSaved(candidate!)).toMatchObject({
    candidateStatus: 'not_saved',
    gardenStatus: 'not_saved',
  });
});
