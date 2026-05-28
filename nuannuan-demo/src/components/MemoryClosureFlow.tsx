import type { ReactNode } from 'react'
import type { CompanionContext } from '../memory/contextBuilder'
import type { MemoryItem } from '../memory/types'

interface MemoryClosureFlowProps {
  primaryMemory: MemoryItem | undefined
  companionContext: CompanionContext
  children: ReactNode
}

function fallbackSummary(primaryMemory: MemoryItem | undefined): string {
  return primaryMemory?.summary ?? '今天这段心情已经被整理成一条轻量小记，等待你决定是否保存。'
}

export function MemoryClosureFlow({ primaryMemory, companionContext, children }: MemoryClosureFlowProps) {
  const mentionableSummary = companionContext.mentionableMemorySummaries[0]

  return (
    <>
      <section className="flow-card generated-note-card" aria-labelledby="generated-note-title">
        <div className="step-label">Step 2 / 生成小记</div>
        <div>
          <p className="eyebrow">收好今天的小火光</p>
          <h2 id="generated-note-title">系统把刚才的陪伴变成可回看的小记</h2>
          <p className="memory-summary">{fallbackSummary(primaryMemory)}</p>
          <div className="tag-row" aria-label="本次小记标签">
            <span>有点焦虑</span>
            <span>朋友关系</span>
            <span>低风险摘要</span>
          </div>
        </div>
      </section>

      {children}

      <section className="flow-card control-card" aria-labelledby="control-title">
        <div className="step-label">Step 4 / 用户控制权</div>
        <div>
          <p className="eyebrow">你说了算</p>
          <h2 id="control-title">隐藏、删除、或允许下次温和提起</h2>
          <div className="control-grid">
            <article>
              <strong>隐藏</strong>
              <p>从安全小屋首页移走，仍保留在隐私封存里。</p>
            </article>
            <article>
              <strong>删除</strong>
              <p>从本地 demo 状态里移除，不再进入下次反哺。</p>
            </article>
            <article>
              <strong>允许提起</strong>
              <p>只在语境合适时轻轻带到，不主动翻旧账。</p>
            </article>
          </div>
        </div>
      </section>

      <section className="flow-card next-preview-card" aria-labelledby="next-preview-title">
        <div className="step-label">Step 5 / 下次回来</div>
        <div>
          <p className="eyebrow">下次 AI 反哺预览</p>
          <h2 id="next-preview-title">同样是开场，记忆权限会改变暖暖能说多少</h2>
          <div className="preview-grid">
            <article>
              <span>默认轻量反哺</span>
              <p>“我在这里，先听你说说今天发生了什么。”</p>
            </article>
            <article>
              <span>允许提起后</span>
              <p>
                {mentionableSummary
                  ? `“如果你愿意，我们也可以轻轻回看：${mentionableSummary}”`
                  : '“你还没有允许我提起任何小记，所以这次我只从当下开始陪你。”'}
              </p>
            </article>
          </div>
        </div>
      </section>
    </>
  )
}
