import type { MemoryItem } from '../memory/types'

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

interface MemoryCardProps {
  memory: MemoryItem
  onHideMemory(id: string): void
  onDeleteMemory(id: string): void
  onToggleAllowMention(id: string, allowMention: boolean): void
}

function labelTags(tags: string[], labels: Record<string, string>): string {
  return tags.map((tag) => labels[tag] ?? tag).join(' / ')
}

export function MemoryCard({
  memory,
  onHideMemory,
  onDeleteMemory,
  onToggleAllowMention,
}: MemoryCardProps) {
  return (
    <article className="memory-card">
      <div className="memory-card__header">
        <p className="eyebrow">{memory.sourceType === 'chat' ? '聊天后的小记' : '记录后的小记'}</p>
        <span className={`risk-pill risk-pill--${memory.riskLevel}`}>
          {memory.riskLevel === 'medium' ? '轻轻收好' : '可以回看'}
        </span>
      </div>

      <p className="memory-summary">{memory.summary}</p>

      <div className="tag-row" aria-label="小记标签">
        <span>{labelTags(memory.emotionTags, emotionLabels)}</span>
        <span>{labelTags(memory.topicTags, topicLabels)}</span>
      </div>

      <label className="mention-toggle">
        <input
          type="checkbox"
          role="switch"
          checked={memory.allowMention}
          onChange={(event) => onToggleAllowMention(memory.id, event.currentTarget.checked)}
        />
        <span>允许暖暖下次温和提起</span>
      </label>

      <div className="card-actions">
        <button type="button" onClick={() => onHideMemory(memory.id)}>
          隐藏这条小记
        </button>
        <button type="button" className="button-ghost" onClick={() => onDeleteMemory(memory.id)}>
          删除这条小记
        </button>
      </div>
    </article>
  )
}
