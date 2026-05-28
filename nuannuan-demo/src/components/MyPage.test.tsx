import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MyPage } from './MyPage'
import type { MemoryItem, RiskRecord, SafetyGuideLog } from '../memory/types'

const friendshipMemory: MemoryItem = {
  id: 'mem_friendship',
  createdAt: '2026-05-27T08:00:00.000Z',
  sourceType: 'chat',
  summary: '最近你有点在意和朋友之间的距离感。',
  emotionTags: ['anxious', 'sad'],
  topicTags: ['friendship'],
  riskLevel: 'low',
  allowMention: false,
  isHidden: false,
}

const studyMemory: MemoryItem = {
  id: 'mem_study',
  createdAt: '2026-05-26T21:00:00.000Z',
  sourceType: 'record',
  summary: '这段时间学习压力比较重，暖暖会用更轻的方式陪你回看。',
  emotionTags: ['overwhelmed', 'tired'],
  topicTags: ['study_pressure'],
  riskLevel: 'medium',
  allowMention: true,
  isHidden: false,
}

function renderMyPage(overrides?: {
  memories?: MemoryItem[]
  riskRecords?: RiskRecord[]
  safetyGuideLogs?: SafetyGuideLog[]
  onHideMemory?: (id: string) => void
  onDeleteMemory?: (id: string) => void
  onToggleAllowMention?: (id: string, allowMention: boolean) => void
}) {
  return render(
    <MyPage
      memories={overrides?.memories ?? [friendshipMemory, studyMemory]}
      riskRecords={overrides?.riskRecords ?? []}
      safetyGuideLogs={overrides?.safetyGuideLogs ?? []}
      onHideMemory={overrides?.onHideMemory ?? vi.fn()}
      onDeleteMemory={overrides?.onDeleteMemory ?? vi.fn()}
      onToggleAllowMention={overrides?.onToggleAllowMention ?? vi.fn()}
    />,
  )
}

it('renders safe home sections for normal state without preferences', () => {
  renderMyPage()

  expect(screen.getByRole('heading', { name: '我的安全小屋' })).toBeInTheDocument()
  expect(screen.getByText('最近情绪')).toBeInTheDocument()
  expect(screen.getByText('常见烦恼')).toBeInTheDocument()
  expect(screen.getByText('情绪轨迹')).toBeInTheDocument()
  expect(screen.getByText('生成小记')).toBeInTheDocument()
  expect(screen.getByText('隐私封存')).toBeInTheDocument()
  expect(screen.getByText('最近你有点在意和朋友之间的距离感。')).toBeInTheDocument()
  expect(screen.queryByText(/preferredTone|interactionStyle|avoidPatterns/)).not.toBeInTheDocument()
})

it('calls memory controls for hide, delete, and allow mention toggle', async () => {
  const user = userEvent.setup()
  const onHideMemory = vi.fn()
  const onDeleteMemory = vi.fn()
  const onToggleAllowMention = vi.fn()

  renderMyPage({
    memories: [friendshipMemory],
    onHideMemory,
    onDeleteMemory,
    onToggleAllowMention,
  })

  await user.click(screen.getByRole('switch', { name: '允许暖暖下次温和提起' }))
  await user.click(screen.getByRole('button', { name: '隐藏这条小记' }))
  await user.click(screen.getByRole('button', { name: '删除这条小记' }))

  expect(onToggleAllowMention).toHaveBeenCalledWith('mem_friendship', true)
  expect(onHideMemory).toHaveBeenCalledWith('mem_friendship')
  expect(onDeleteMemory).toHaveBeenCalledWith('mem_friendship')
})

it('keeps hidden and high risk memories out of generated notes', () => {
  renderMyPage({
    memories: [
      friendshipMemory,
      { ...studyMemory, id: 'mem_hidden', summary: '这条小记已隐藏', isHidden: true },
      { ...studyMemory, id: 'mem_high', summary: '高风险原文细节', riskLevel: 'high' },
    ],
  })

  expect(screen.getByText('最近你有点在意和朋友之间的距离感。')).toBeInTheDocument()
  expect(screen.queryByText('这条小记已隐藏')).not.toBeInTheDocument()
  expect(screen.queryByText('高风险原文细节')).not.toBeInTheDocument()
})

it('renders protected safety state without risk tags or high risk details', () => {
  const highRiskRecord: RiskRecord = {
    id: 'risk_high',
    createdAt: '2026-05-27T08:00:00.000Z',
    riskLevel: 'high',
    riskTags: ['self_harm_signal'],
    actionTaken: 'safety_guide',
  }
  const guide: SafetyGuideLog = {
    id: 'guide_high',
    riskRecordId: 'risk_high',
    guideType: 'emergency_support',
    shownAt: '2026-05-27T08:00:01.000Z',
    userAction: 'viewed',
  }

  renderMyPage({
    memories: [{ ...friendshipMemory, summary: '高风险原文细节', riskLevel: 'high' }],
    riskRecords: [highRiskRecord],
    safetyGuideLogs: [guide],
  })

  expect(screen.getByText('有一段内容已进入安全保护模式')).toBeInTheDocument()
  expect(screen.queryByText('self_harm_signal')).not.toBeInTheDocument()
  expect(screen.queryByText('高风险原文细节')).not.toBeInTheDocument()
})
