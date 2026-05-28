import { shouldShowMemory, type MemoryItem, type RiskRecord, type SafetyGuideLog } from '../memory/types'
import { MemoryCard } from './MemoryCard'
import { MemoryDetail } from './MemoryDetail'
import { PrivacyVaultNotice } from './PrivacyVaultNotice'
import { SafetyGuidePanel } from './SafetyGuidePanel'

interface MyPageProps {
  memories: MemoryItem[]
  riskRecords: RiskRecord[]
  safetyGuideLogs: SafetyGuideLog[]
  onHideMemory(id: string): void
  onDeleteMemory(id: string): void
  onToggleAllowMention(id: string, allowMention: boolean): void
}

const emotionLabels: Record<string, string> = {
  anxious: '焦虑',
  sad: '难过',
  tired: '疲惫',
  calm: '平静',
  relieved: '松了一口气',
  overwhelmed: '压力很满',
}

const topicLabels: Record<string, string> = {
  friendship: '朋友关系',
  study_pressure: '学习压力',
  family: '家庭沟通',
  sleep: '睡眠',
  self_care: '照顾自己',
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values))
}

function labelTags(tags: string[], labels: Record<string, string>): string {
  return tags.map((tag) => labels[tag] ?? tag).join(' / ')
}

export function MyPage({
  memories,
  riskRecords,
  safetyGuideLogs,
  onHideMemory,
  onDeleteMemory,
  onToggleAllowMention,
}: MyPageProps) {
  const visibleMemories = memories.filter(shouldShowMemory)
  const hiddenCount = memories.filter((memory) => memory.isHidden).length
  const highRiskCount = riskRecords.filter((record) => record.riskLevel === 'high').length
  const recentEmotions = unique(visibleMemories.flatMap((memory) => memory.emotionTags)).slice(0, 4)
  const commonTopics = unique(visibleMemories.flatMap((memory) => memory.topicTags)).slice(0, 4)
  const emotionTrail = visibleMemories
    .map((memory) => emotionLabels[memory.emotionTags[0]] ?? memory.emotionTags[0])
    .join(' → ')

  return (
    <section className="my-page" aria-label="我的安全小屋">
      <header className="hero-card">
        <div>
          <p className="eyebrow">我的页面</p>
          <h1>我的安全小屋</h1>
          <p>
            这里不是心理档案，只是把最近被承接过的心情轻轻收好。
            你可以隐藏、删除，也可以决定暖暖下次能不能温和提起。
          </p>
        </div>
        <div className="nest-illustration" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </header>

      {highRiskCount > 0 ? <SafetyGuidePanel /> : null}

      <section className="summary-grid" aria-label="安全小屋概览">
        <article>
          <p className="eyebrow">这几天</p>
          <h2>最近情绪</h2>
          <p>{recentEmotions.length > 0 ? labelTags(recentEmotions, emotionLabels) : '还没有形成情绪记录'}</p>
        </article>
        <article>
          <p className="eyebrow">反复出现</p>
          <h2>常见烦恼</h2>
          <p>{commonTopics.length > 0 ? labelTags(commonTopics, topicLabels) : '还没有形成主题记录'}</p>
        </article>
        <article>
          <p className="eyebrow">轻量趋势</p>
          <h2>情绪轨迹</h2>
          <p>{emotionTrail || '等待更多记录后生成'}</p>
        </article>
      </section>

      <section className="notes-section">
        <div className="section-heading">
          <p className="eyebrow">陪伴式回看</p>
          <h2>生成小记</h2>
        </div>

        <div className="memory-list">
          {visibleMemories.map((memory) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              onHideMemory={onHideMemory}
              onDeleteMemory={onDeleteMemory}
              onToggleAllowMention={onToggleAllowMention}
            />
          ))}
        </div>

        {visibleMemories.length === 0 ? (
          <p className="empty-state">还没有可以展示的小记。等你愿意记录时，暖暖会轻轻接住。</p>
        ) : (
          <MemoryDetail memory={visibleMemories[0]} />
        )}
      </section>

      <div id="vault">
        <PrivacyVaultNotice hiddenCount={hiddenCount} protectedRiskCount={safetyGuideLogs.length} />
      </div>
    </section>
  )
}
