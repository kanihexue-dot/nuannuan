import { canEnterNormalGarden, isThreeRoundConversationComplete, type MemorySeed, type ThreeRoundConversation } from './types';

const baseSeed: MemorySeed = {
  id: 'seed_friendship_normal',
  title: '刚刚这颗小种子',
  createdAt: '2026-05-27T08:00:00.000Z',
  summary: '最近你有点在意和朋友之间的距离感。',
  seedColor: 'yellow',
  moodTags: ['anxious', 'sad'],
  topicTags: ['friendship'],
  originalSnippet: '朋友回消息变慢时，我会担心是不是自己做错了什么。',
  aiResponse: '这份担心很真实，我们可以先把它放在这里，不急着评判自己。',
  place: '聊天结束后',
  gardenStatus: 'pending',
  riskLevel: 'normal',
};

it('lets planted normal mood seeds enter the regular memory garden', () => {
  expect(canEnterNormalGarden({ ...baseSeed, gardenStatus: 'planted' })).toBe(true);
});

it('keeps pending and not-saved seeds out of the regular memory garden', () => {
  expect(canEnterNormalGarden(baseSeed)).toBe(false);
  expect(canEnterNormalGarden({ ...baseSeed, gardenStatus: 'not_saved' })).toBe(false);
});

it('keeps high risk seeds out of the regular memory garden even when planted', () => {
  expect(canEnterNormalGarden({ ...baseSeed, gardenStatus: 'planted', riskLevel: 'high' })).toBe(false);
});

const completeConversation: ThreeRoundConversation = {
  id: 'conversation_complete',
  status: 'ready_for_seed',
  startedAt: '2026-05-28T09:30:00.000Z',
  completedAt: '2026-05-28T09:41:00.000Z',
  turns: [
    {
      id: 'turn_1',
      roundIndex: 1,
      userText: '我有点担心朋友是不是不想理我。',
      aiResponse: '这听起来像一份很小心的在意。',
      createdAt: '2026-05-28T09:31:00.000Z',
    },
    {
      id: 'turn_2',
      roundIndex: 2,
      userText: '她回得慢时，我就会一直想。',
      aiResponse: '你在等回应的时候，心里可能也在等一个确定感。',
      createdAt: '2026-05-28T09:35:00.000Z',
    },
    {
      id: 'turn_3',
      roundIndex: 3,
      userText: '我想先让自己缓一缓。',
      aiResponse: '这次心情可以先被轻轻收好。',
      createdAt: '2026-05-28T09:40:00.000Z',
    },
  ],
};

it('treats a conversation as seed-ready only after exactly three rounds', () => {
  expect(isThreeRoundConversationComplete(completeConversation)).toBe(true);
  expect(isThreeRoundConversationComplete({ ...completeConversation, turns: completeConversation.turns.slice(0, 2) })).toBe(false);
});
