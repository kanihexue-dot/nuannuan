import { useMemo, useState } from 'react'
import { buildCompanionContext } from '../memory/contextBuilder'
import { shouldShowMemory, type HiddenMemoryProfile, type MemoryItem, type RiskRecord, type SafetyGuideLog } from '../memory/types'
import { PhoneFrame } from './PhoneFrame'

interface MobileClosedLoopProps {
  memories: MemoryItem[]
  hiddenProfile: HiddenMemoryProfile
  riskRecords: RiskRecord[]
  safetyGuideLogs: SafetyGuideLog[]
  onHideMemory(id: string): void
  onDeleteMemory(id: string): void
  onToggleAllowMention(id: string, allowMention: boolean): void
}

type DemoStep = 'session' | 'generated' | 'home' | 'detail' | 'next'

const emotionLabels: Record<string, string> = {
  anxious: '有点焦虑',
  sad: '有些难过',
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

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function fallbackSummary(memory: MemoryItem | undefined): string {
  return memory?.summary ?? '今天这段心情已经被整理成一条轻量小记，等待你决定是否保存。'
}

export function MobileClosedLoop({
  memories,
  hiddenProfile,
  riskRecords,
  safetyGuideLogs,
  onHideMemory,
  onDeleteMemory,
  onToggleAllowMention,
}: MobileClosedLoopProps) {
  const [step, setStep] = useState<DemoStep>('session')
  const visibleMemories = useMemo(() => memories.filter(shouldShowMemory), [memories])
  const primaryMemory = visibleMemories[0]
  const [selectedMemoryId, setSelectedMemoryId] = useState(primaryMemory?.id)
  const selectedMemory = visibleMemories.find((memory) => memory.id === selectedMemoryId) ?? primaryMemory
  const companionContext = buildCompanionContext({ memories, hiddenProfile, riskRecords })
  const highRiskCount = riskRecords.filter((record) => record.riskLevel === 'high').length
  const recentEmotions = unique(visibleMemories.flatMap((memory) => memory.emotionTags)).slice(0, 3)
  const commonTopics = unique(visibleMemories.flatMap((memory) => memory.topicTags)).slice(0, 3)
  const emotionTrail = visibleMemories
    .map((memory) => emotionLabels[memory.emotionTags[0]] ?? memory.emotionTags[0])
    .join(' → ')
  const mentionableSummary = companionContext.mentionableMemorySummaries[0]

  function openDetail(memory: MemoryItem) {
    setSelectedMemoryId(memory.id)
    setStep('detail')
  }

  function hideSelectedMemory() {
    if (!selectedMemory) return
    onHideMemory(selectedMemory.id)
    setStep('home')
  }

  function deleteSelectedMemory() {
    if (!selectedMemory) return
    onDeleteMemory(selectedMemory.id)
    setStep('home')
  }

  return (
    <PhoneFrame>
      <header className="app-topbar">
        <div>
          <span>暖暖</span>
          <strong>{step === 'next' ? '下次聊天' : 'Memory Core'}</strong>
        </div>
        <span className="app-status">09:41</span>
      </header>

      <main className="app-screen">
        {step === 'session' ? (
          <section className="mobile-panel session-panel" aria-labelledby="session-title">
            <p className="mobile-eyebrow">聊天 / 情绪房间结束</p>
            <h1 id="session-title">要不要把今天的小火光收好？</h1>
            <div className="chat-card">
              <p>“刚才我有点担心自己是不是打扰到别人，也不知道该怎么开口。”</p>
              <span>这次对话已经结束，暖暖只会保存你确认的小记。</span>
            </div>
            <div className="mobile-actions">
              <button type="button" onClick={() => setStep('generated')}>
                收好今天
              </button>
              <button
                type="button"
                className="button-ghost"
                onClick={() => {
                  if (primaryMemory) onDeleteMemory(primaryMemory.id)
                  setStep('next')
                }}
              >
                不保存这次
              </button>
            </div>
          </section>
        ) : null}

        {step === 'generated' ? (
          <section className="mobile-panel" aria-labelledby="generated-title">
            <p className="mobile-eyebrow">收好今天的小火光</p>
            <h1 id="generated-title">生成小记</h1>
            <article className="generated-note">
              <span>刚生成</span>
              <p>{fallbackSummary(primaryMemory)}</p>
            </article>
            <div className="mini-grid" aria-label="生成小记摘要">
              <article>
                <span>最近情绪</span>
                <strong>{recentEmotions.length > 0 ? labelTags(recentEmotions, emotionLabels) : '等待记录'}</strong>
              </article>
              <article>
                <span>常见烦恼</span>
                <strong>{commonTopics.length > 0 ? labelTags(commonTopics, topicLabels) : '等待记录'}</strong>
              </article>
            </div>
            <button type="button" className="wide-button" onClick={() => setStep('home')}>
              放进我的安全小屋
            </button>
          </section>
        ) : null}

        {step === 'home' ? (
          <section className="mobile-panel" aria-labelledby="home-title">
            <p className="mobile-eyebrow">我的页面</p>
            <h1 id="home-title">我的安全小屋</h1>
            <div className="mini-grid home-stats" aria-label="安全小屋概览">
              <article>
                <span>最近情绪</span>
                <strong>{recentEmotions.length > 0 ? labelTags(recentEmotions, emotionLabels) : '还没有记录'}</strong>
              </article>
              <article>
                <span>常见烦恼</span>
                <strong>{commonTopics.length > 0 ? labelTags(commonTopics, topicLabels) : '还没有记录'}</strong>
              </article>
              <article>
                <span>情绪轨迹</span>
                <strong>{emotionTrail || '等待更多记录'}</strong>
              </article>
            </div>

            <section className="note-list" aria-label="生成小记卡片">
              <div className="mobile-section-heading">
                <span>生成小记卡片</span>
                <button type="button" className="text-button" onClick={() => setStep('next')}>
                  下次聊天
                </button>
              </div>
              {visibleMemories.length > 0 ? (
                visibleMemories.map((memory) => (
                  <article key={memory.id} className="note-card">
                    <p>{memory.summary}</p>
                    <div className="note-card-footer">
                      <span>{labelTags(memory.emotionTags, emotionLabels)}</span>
                      <button type="button" onClick={() => openDetail(memory)}>
                        查看小记详情
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <p className="empty-mobile">还没有可以展示的小记。</p>
              )}
            </section>

            <a className="vault-entry" href="#privacy-vault">
              隐私封存入口
              <span>已封存 {memories.filter((memory) => memory.isHidden).length + safetyGuideLogs.length} 条</span>
            </a>
          </section>
        ) : null}

        {step === 'detail' && selectedMemory ? (
          <section className="mobile-panel" aria-labelledby="detail-title">
            <button type="button" className="back-button" onClick={() => setStep('home')}>
              返回小屋
            </button>
            <p className="mobile-eyebrow">小记详情</p>
            <h1 id="detail-title">小记详情</h1>
            <article className="detail-card">
              <p>{selectedMemory.summary}</p>
              <dl>
                <div>
                  <dt>保存时间</dt>
                  <dd>{formatDate(selectedMemory.createdAt)}</dd>
                </div>
                <div>
                  <dt>来源</dt>
                  <dd>{selectedMemory.sourceType === 'chat' ? '聊天结束后' : '主动记录'}</dd>
                </div>
              </dl>
            </article>
            <label className="mobile-switch">
              <input
                type="checkbox"
                role="switch"
                checked={selectedMemory.allowMention}
                onChange={(event) => onToggleAllowMention(selectedMemory.id, event.currentTarget.checked)}
              />
              <span>允许暖暖下次温和提起</span>
            </label>
            <div className="mobile-actions stacked">
              <button type="button" onClick={hideSelectedMemory}>
                隐藏这条
              </button>
              <button type="button" className="button-ghost" onClick={deleteSelectedMemory}>
                删除这条
              </button>
              <button type="button" className="button-soft" onClick={() => setStep('next')}>
                下次聊天
              </button>
            </div>
          </section>
        ) : null}

        {step === 'next' ? (
          <section className="mobile-panel chat-preview" aria-labelledby="next-title">
            <button type="button" className="back-button" onClick={() => setStep('home')}>
              回到小屋
            </button>
            <p className="mobile-eyebrow">轻量反哺预览</p>
            <h1 id="next-title">下次聊天</h1>
            <div className="message-list">
              <p className="bubble bubble-ai">你来啦。我在这里，先听你说说今天发生了什么。</p>
              <p className="bubble bubble-user">今天又有点想起那件事。</p>
              <p className="bubble bubble-ai">
                {mentionableSummary
                  ? `如果你愿意，我们也可以轻轻回看：${mentionableSummary}`
                  : '我先陪你从现在说起，不急着回看以前的内容。'}
              </p>
            </div>
          </section>
        ) : null}

        {highRiskCount > 0 ? (
          <aside className="safety-tile" id="privacy-vault" aria-label="安全保护模式">
            <strong>安全保护模式</strong>
            <span>有一段内容已进入保护区，只保留支持入口，不展示原文或细节。</span>
          </aside>
        ) : null}
      </main>
    </PhoneFrame>
  )
}
