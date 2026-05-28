import type { MemoryItem } from '../memory/types'

interface MemoryDetailProps {
  memory: MemoryItem
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function MemoryDetail({ memory }: MemoryDetailProps) {
  return (
    <section className="detail-panel" aria-label="小记详情">
      <p className="eyebrow">小记详情</p>
      <h2>这一段已被温柔整理</h2>
      <p>这条小记已用摘要形式保存，完整原文不会出现在这里。</p>
      <dl className="detail-list">
        <div>
          <dt>来源</dt>
          <dd>{memory.sourceType === 'chat' ? '聊天' : '记录'}</dd>
        </div>
        <div>
          <dt>保存时间</dt>
          <dd>{formatDate(memory.createdAt)}</dd>
        </div>
        <div>
          <dt>提起方式</dt>
          <dd>{memory.allowMention ? '允许在合适语境里轻轻提起' : '暂时只陪伴，不主动提起'}</dd>
        </div>
      </dl>
    </section>
  )
}
