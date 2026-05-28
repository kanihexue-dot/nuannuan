import { buildMemoryGarden, createSeedCandidateFromConversation } from './repository'
import type {
  HiddenMemoryProfile,
  MemoryGarden,
  MemoryItem,
  MemorySeed,
  MemorySeedCandidate,
  RiskRecord,
  SafetyGuideLog,
  ThreeRoundConversation,
} from './types'

export interface DemoState {
  memories: MemoryItem[]
  conversation: ThreeRoundConversation
  seeds: MemorySeed[]
  currentSeed: MemorySeed
  currentSeedCandidate: MemorySeedCandidate
  garden: MemoryGarden
  hiddenProfile: HiddenMemoryProfile
  riskRecords: RiskRecord[]
  safetyGuideLogs: SafetyGuideLog[]
}

export function createDemoState(): DemoState {
  const hiddenProfile: HiddenMemoryProfile = {
    preferredTone: 'gentle',
    interactionStyle: 'empathy_first',
    avoidPatterns: ['preachy', 'strong_analysis', 'diagnosis_language'],
    updatedAt: '2026-05-27T08:00:00.000Z',
  }

  const memories: MemoryItem[] = [
    {
      id: 'mem_friendship_low',
      createdAt: '2026-05-27T08:00:00.000Z',
      sourceType: 'chat',
      summary: '最近你有点在意和朋友之间的距离感，尤其是对方回消息变慢时，会担心是不是自己做错了什么。',
      emotionTags: ['anxious', 'sad'],
      topicTags: ['friendship'],
      riskLevel: 'low',
      allowMention: true,
      isHidden: false,
    },
    {
      id: 'mem_study_medium',
      createdAt: '2026-05-26T21:00:00.000Z',
      sourceType: 'record',
      summary: '这段时间学习压力比较重，暖暖会用更轻的方式陪你把当下最难的部分说清楚。',
      emotionTags: ['overwhelmed', 'tired'],
      topicTags: ['study_pressure', 'sleep'],
      riskLevel: 'medium',
      allowMention: false,
      isHidden: false,
    },
    {
      id: 'mem_hidden_family',
      createdAt: '2026-05-25T21:00:00.000Z',
      sourceType: 'record',
      summary: '有一段家庭沟通相关的小记已被你隐藏。',
      emotionTags: ['sad'],
      topicTags: ['family'],
      riskLevel: 'low',
      allowMention: false,
      isHidden: true,
    },
  ]

  const conversation: ThreeRoundConversation = {
    id: 'conversation_friendship_three_round',
    status: 'ready_for_seed',
    startedAt: '2026-05-28T09:30:00.000Z',
    completedAt: '2026-05-28T09:41:00.000Z',
    turns: [
      {
        id: 'turn_friendship_1',
        roundIndex: 1,
        userText: '刚才我有点担心自己是不是打扰到别人，也不知道该怎么开口。',
        aiResponse: '你很在意这段关系，所以才会在开口前先替对方想很多。',
        createdAt: '2026-05-28T09:31:00.000Z',
      },
      {
        id: 'turn_friendship_2',
        roundIndex: 2,
        userText: '我也知道她可能只是忙，但我还是会一直想是不是我哪里没做好。',
        aiResponse: '一边理解她可能忙，一边还是忍不住担心，这两种感受可以同时存在。',
        createdAt: '2026-05-28T09:36:00.000Z',
      },
      {
        id: 'turn_friendship_3',
        roundIndex: 3,
        userText: '我想先不要急着问她，可能先让自己缓一下。',
        aiResponse: '这次更像是一颗小心翼翼的小种子，带着不安，也带着你想靠近朋友的愿望。',
        createdAt: '2026-05-28T09:40:00.000Z',
      },
    ],
  }

  const currentSeed: MemorySeed = {
    id: 'seed_current_friendship',
    title: '刚刚这颗小种子',
    createdAt: '2026-05-28T09:41:00.000Z',
    summary: '刚才你有点担心自己是不是打扰到别人，也不知道该怎么开口。',
    seedColor: 'pink',
    moodTags: ['anxious', 'sad'],
    topicTags: ['friendship', 'self_care'],
    originalSnippet: '刚才我有点担心自己是不是打扰到别人，也不知道该怎么开口。',
    aiResponse: '你已经很努力地照顾关系了。我们先把这份小心翼翼放在这里，它不用马上变成答案。',
    place: '三轮对话后',
    gardenStatus: 'pending',
    riskLevel: 'normal',
  }
  const currentSeedCandidate = createSeedCandidateFromConversation(conversation, currentSeed)

  if (!currentSeedCandidate) {
    throw new Error('Demo conversation must contain three rounds before creating a seed candidate')
  }

  const seeds: MemorySeed[] = [
    currentSeed,
    {
      id: 'seed_friendship_yellow',
      title: '想靠近朋友的一天',
      createdAt: '2026-05-27T08:00:00.000Z',
      summary: '你在意朋友回消息变慢，心里有一点不安，也有想好好连接的愿望。',
      seedColor: 'yellow',
      moodTags: ['anxious', 'sad'],
      topicTags: ['friendship'],
      originalSnippet: '朋友回消息变慢时，我会担心是不是自己做错了什么。',
      aiResponse: '这份在意说明关系对你很重要。我们可以先照顾你的不安，再决定要不要开口。',
      place: '放学路上',
      gardenStatus: 'planted',
      riskLevel: 'normal',
    },
    {
      id: 'seed_study_blue',
      title: '压力很满的夜晚',
      createdAt: '2026-05-26T21:00:00.000Z',
      summary: '学习任务堆在一起时，你觉得身体很累，需要把今天先降到可以呼吸的大小。',
      seedColor: 'blue',
      moodTags: ['overwhelmed', 'tired'],
      topicTags: ['study_pressure', 'sleep'],
      originalSnippet: '作业和复习都挤在一起，我感觉脑袋停不下来。',
      aiResponse: '今晚不用一次解决全部。先选最小的一步，让身体知道它可以慢慢下来。',
      place: '书桌前',
      gardenStatus: 'planted',
      riskLevel: 'normal',
    },
    {
      id: 'seed_self_care_orange',
      title: '给自己一点空间',
      createdAt: '2026-05-25T18:30:00.000Z',
      summary: '你发现自己其实很需要休息，也愿意试着对自己温柔一点。',
      seedColor: 'orange',
      moodTags: ['relieved', 'tired'],
      topicTags: ['self_care'],
      originalSnippet: '我好像一直在撑着，今天想早点停下来。',
      aiResponse: '能听见“想停下来”的声音很重要。它不是偷懒，是你在保护自己。',
      place: '傍晚',
      gardenStatus: 'planted',
      riskLevel: 'normal',
    },
    {
      id: 'seed_family_purple',
      title: '没说出口的话',
      createdAt: '2026-05-24T20:20:00.000Z',
      summary: '家庭沟通让你有些委屈，你希望被理解，但暂时还不知道怎么表达。',
      seedColor: 'purple',
      moodTags: ['sad'],
      topicTags: ['family'],
      originalSnippet: '我不是不想说，只是一开口就怕又吵起来。',
      aiResponse: '先不急着把话说完整。被卡住的那部分，也值得被轻轻看见。',
      place: '房间里',
      gardenStatus: 'planted',
      riskLevel: 'normal',
    },
    {
      id: 'seed_sleep_green',
      title: '慢慢安静下来',
      createdAt: '2026-05-23T22:10:00.000Z',
      summary: '睡前的心情比白天平稳一些，你想把这份安静留给明天。',
      seedColor: 'green',
      moodTags: ['calm', 'relieved'],
      topicTags: ['sleep', 'self_care'],
      originalSnippet: '现在好像没有那么紧了，想早点睡。',
      aiResponse: '这份松一点的感觉可以留在身边。今晚先让它陪你休息。',
      place: '睡前',
      gardenStatus: 'planted',
      riskLevel: 'normal',
    },
    {
      id: 'seed_protected_high',
      title: '保护区内容',
      createdAt: '2026-05-22T22:10:00.000Z',
      summary: '这段内容只进入安全支持路径，不展示在普通记忆花园。',
      seedColor: 'purple',
      moodTags: ['overwhelmed'],
      topicTags: ['self_care'],
      originalSnippet: '高风险原文不在普通花园中展示。',
      aiResponse: '暖暖会优先陪你连接现实支持和安全资源。',
      place: '安全支持模式',
      gardenStatus: 'planted',
      riskLevel: 'high',
    },
  ]

  const riskRecords: RiskRecord[] = [
    {
      id: 'risk_friendship_low',
      createdAt: '2026-05-27T08:00:01.000Z',
      riskLevel: 'low',
      riskTags: [],
      sourceMemoryId: 'mem_friendship_low',
      actionTaken: 'stored_memory',
    },
    {
      id: 'risk_study_medium',
      createdAt: '2026-05-26T21:00:01.000Z',
      riskLevel: 'medium',
      riskTags: ['hopelessness_signal'],
      sourceMemoryId: 'mem_study_medium',
      actionTaken: 'softened_summary',
    },
    {
      id: 'risk_protected_high',
      createdAt: '2026-05-25T22:00:01.000Z',
      riskLevel: 'high',
      riskTags: ['self_harm_signal'],
      actionTaken: 'safety_guide',
    },
  ]

  const safetyGuideLogs: SafetyGuideLog[] = [
    {
      id: 'guide_protected_high',
      riskRecordId: 'risk_protected_high',
      guideType: 'emergency_support',
      shownAt: '2026-05-25T22:00:02.000Z',
      userAction: 'viewed',
    },
  ]

  return {
    memories,
    conversation,
    seeds,
    currentSeed,
    currentSeedCandidate,
    garden: buildMemoryGarden(seeds),
    hiddenProfile,
    riskRecords,
    safetyGuideLogs,
  }
}
