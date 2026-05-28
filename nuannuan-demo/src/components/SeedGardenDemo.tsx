import { useMemo, useState } from 'react'
import { buildMemoryGarden, markSeedCandidateNotSaved, plantSeedCandidate } from '../memory/repository'
import type { MemoryGarden, MemorySeed, MemorySeedCandidate, ThreeRoundConversation } from '../memory/types'
import { PhoneFrame } from './PhoneFrame'

interface SeedGardenDemoProps {
  conversation: ThreeRoundConversation
  initialSeeds: MemorySeed[]
  seedCandidate: MemorySeedCandidate
}

type DemoStep = 'conversation' | 'result' | 'entry' | 'garden'

const moodLabels: Record<string, string> = {
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

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'long',
    day: 'numeric',
  }).format(new Date(value))
}

function labelTags(tags: string[], labels: Record<string, string>): string[] {
  return tags.map((tag) => labels[tag] ?? tag)
}

function MoodTagPills({ tags }: { tags: string[] }) {
  return (
    <div className="seed-pill-row" aria-label="心情标签">
      {labelTags(tags, moodLabels).map((label) => (
        <span key={label}>{label}</span>
      ))}
    </div>
  )
}

function SeedActionBar({ onPlant, onSkip }: { onPlant(): void; onSkip(): void }) {
  return (
    <div className="seed-actions">
      <button type="button" onClick={onPlant}>
        带去记忆花园
      </button>
      <button type="button" className="button-ghost" onClick={onSkip}>
        先不保存
      </button>
    </div>
  )
}

function ThreeRoundConversationPreview({
  conversation,
  onComplete,
}: {
  conversation: ThreeRoundConversation
  onComplete(): void
}) {
  return (
    <section className="mobile-panel conversation-preview" aria-labelledby="conversation-preview-title">
      <p className="mobile-eyebrow">三轮后沉淀</p>
      <h1 id="conversation-preview-title">三轮对话</h1>
      <p className="seed-helper">这颗小种子不是一句话自动生成的。暖暖先陪你完成三轮对话，再整理成候选小种子。</p>
      <div className="conversation-turns" aria-label="固定三轮对话">
        {conversation.turns.map((turn) => (
          <article key={turn.id} className="conversation-turn">
            <span>第 {turn.roundIndex} 轮</span>
            <p className="bubble bubble-user">{turn.userText}</p>
            <p className="bubble bubble-ai">{turn.aiResponse}</p>
          </article>
        ))}
      </div>
      <button type="button" className="wide-button" onClick={onComplete}>
        整理成心情小种子
      </button>
    </section>
  )
}

function MoodSeedResult({
  seed,
  onPlant,
  onSkip,
}: {
  seed: MemorySeedCandidate
  onPlant(): void
  onSkip(): void
}) {
  return (
    <section className="mobile-panel seed-result" aria-labelledby="seed-result-title">
      <p className="mobile-eyebrow">三轮对话后</p>
      <h1 id="seed-result-title">心情小种子</h1>
      <p className="seed-helper">暖暖把这三轮对话整理成了一颗心情小种子。它现在还只是候选，等你决定要不要带去记忆花园。</p>
      <article className={`seed-hero seed-hero--${seed.seedColor}`}>
        <div className="seed-orb" aria-hidden="true" />
        <div>
          <span>刚生成</span>
          <h2>{seed.title}</h2>
          <p>{seed.summary}</p>
        </div>
      </article>
      <MoodTagPills tags={seed.moodTags} />
      <p className="seed-helper">你可以把它带去记忆花园，也可以先不保存。决定权一直在你这里。</p>
      <SeedActionBar onPlant={onPlant} onSkip={onSkip} />
    </section>
  )
}

function MemoryGardenEntryCard({
  garden,
  currentSeed,
  status,
  onEnterGarden,
}: {
  garden: MemoryGarden
  currentSeed: MemorySeed
  status: MemorySeed['gardenStatus']
  onEnterGarden(): void
}) {
  const plantedCurrentSeed = status === 'planted'

  return (
    <section className="mobile-panel garden-entry" aria-labelledby="garden-entry-title">
      <p className="mobile-eyebrow">我的页面</p>
      <h1 id="garden-entry-title">记忆花园</h1>
      <article className="garden-entry-card">
        <span>{plantedCurrentSeed ? '刚刚种下' : '这次没有放入花园'}</span>
        <h2>{plantedCurrentSeed ? currentSeed.title : '这颗心情小种子没有保存'}</h2>
        <p>
          {plantedCurrentSeed
            ? '它已经和其他小种子待在一起。进入花园后，第一眼会先看到不同颜色的小种子。'
            : '暖暖只留下这个选择结果，不会把这段内容放进普通记忆花园。'}
        </p>
      </article>
      <div className="garden-stats" aria-label="记忆花园概览">
        <article>
          <span>小种子</span>
          <strong>{garden.seeds.length} 颗</strong>
        </article>
        <article>
          <span>最近一颗</span>
          <strong>{garden.recentSeed?.title ?? '等待种下'}</strong>
        </article>
      </div>
      <button type="button" className="wide-button" onClick={onEnterGarden}>
        进入记忆花园
      </button>
    </section>
  )
}

function SeedCard({ seed, onSelect }: { seed: MemorySeed; onSelect(seed: MemorySeed): void }) {
  return (
    <button
      type="button"
      className={`seed-card seed-card--${seed.seedColor}`}
      onClick={() => onSelect(seed)}
      aria-label={`查看${seed.title}心情小种子`}
    >
      <span className="seed-card__orb" aria-hidden="true" />
      <span className="seed-card__date">{formatDate(seed.createdAt)}</span>
      <strong>{seed.title}</strong>
      <small>{labelTags(seed.moodTags, moodLabels).join(' / ')}</small>
    </button>
  )
}

function SeedDetailPanel({ seed }: { seed: MemorySeed }) {
  return (
    <article className="seed-detail-panel" aria-label="小种子详情">
      <p className="mobile-eyebrow">小种子详情</p>
      <h2>{seed.title} · 小种子详情</h2>
      <p>{seed.summary}</p>
      <dl>
        <div>
          <dt>心情标签</dt>
          <dd>{labelTags(seed.moodTags, moodLabels).join(' / ')}</dd>
        </div>
        <div>
          <dt>暖暖回应</dt>
          <dd>{seed.aiResponse}</dd>
        </div>
        <div>
          <dt>你留下的话</dt>
          <dd>{seed.originalSnippet}</dd>
        </div>
        <div>
          <dt>关联主题</dt>
          <dd>{labelTags(seed.topicTags, topicLabels).join(' / ')}</dd>
        </div>
      </dl>
    </article>
  )
}

function SeedGardenView({
  garden,
  selectedSeed,
  onSelectSeed,
  onBack,
}: {
  garden: MemoryGarden
  selectedSeed?: MemorySeed
  onSelectSeed(seed: MemorySeed): void
  onBack(): void
}) {
  return (
    <section className="mobile-panel seed-garden" aria-labelledby="seed-garden-title">
      <button type="button" className="back-button" onClick={onBack}>
        回到我的页面
      </button>
      <p className="mobile-eyebrow">第一层是小种子</p>
      <h1 id="seed-garden-title">记忆花园</h1>
      <p className="seed-helper">不同颜色代表那天心情留下的温度。主题只在点开后作为细节出现。</p>
      <section className="seed-grid" aria-label="记忆花园第一层">
        {garden.seeds.map((seed) => (
          <SeedCard key={seed.id} seed={seed} onSelect={onSelectSeed} />
        ))}
      </section>
      {selectedSeed ? <SeedDetailPanel seed={selectedSeed} /> : null}
    </section>
  )
}

export function SeedGardenDemo({ conversation, initialSeeds, seedCandidate }: SeedGardenDemoProps) {
  const [step, setStep] = useState<DemoStep>('conversation')
  const [seeds, setSeeds] = useState(initialSeeds)
  const [currentCandidate, setCurrentCandidate] = useState(seedCandidate)
  const [selectedSeedId, setSelectedSeedId] = useState<string>()
  const garden = useMemo(() => buildMemoryGarden(seeds), [seeds])
  const currentSeed = seeds.find((seed) => seed.id === seedCandidate.id.replace(/^candidate_/, '')) ?? currentCandidate
  const selectedSeed = garden.seeds.find((seed) => seed.id === selectedSeedId)

  function plantCurrentSeed() {
    const plantedSeed = plantSeedCandidate(currentCandidate)
    setCurrentCandidate(plantedSeed)
    setSeeds((items) => items.map((item) => (item.id === currentSeed.id ? plantedSeed : item)))
    setSelectedSeedId(undefined)
    setStep('entry')
  }

  function skipCurrentSeed() {
    const notSavedSeed = markSeedCandidateNotSaved(currentCandidate)
    setCurrentCandidate(notSavedSeed)
    setSeeds((items) => items.map((item) => (item.id === currentSeed.id ? notSavedSeed : item)))
    setSelectedSeedId(undefined)
    setStep('entry')
  }

  return (
    <main className="demo-stage">
      <header className="demo-copy">
        <p className="eyebrow">Nuannuan Mood Seed Demo</p>
        <h1>心情小种子记忆花园</h1>
        <p>固定三轮对话后，暖暖才把这段心情整理成候选小种子；用户确认后，它才会进入记忆花园。</p>
      </header>

      <PhoneFrame label="心情小种子记忆花园 Demo">
        <header className="app-topbar">
          <div>
            <span>暖暖</span>
            <strong>{step === 'conversation' ? 'Three Rounds' : step === 'result' ? 'Mood Seed' : 'Memory Garden'}</strong>
          </div>
          <span className="app-status">09:41</span>
        </header>
        <main className="app-screen">
          {step === 'conversation' ? (
            <ThreeRoundConversationPreview conversation={conversation} onComplete={() => setStep('result')} />
          ) : null}

          {step === 'result' ? (
            <MoodSeedResult seed={currentCandidate} onPlant={plantCurrentSeed} onSkip={skipCurrentSeed} />
          ) : null}

          {step === 'entry' ? (
            <MemoryGardenEntryCard
              garden={garden}
              currentSeed={currentSeed}
              status={currentSeed.gardenStatus}
              onEnterGarden={() => setStep('garden')}
            />
          ) : null}

          {step === 'garden' ? (
            <SeedGardenView
              garden={garden}
              selectedSeed={selectedSeed}
              onSelectSeed={(seed) => setSelectedSeedId(seed.id)}
              onBack={() => setStep('entry')}
            />
          ) : null}

          <aside className="safety-tile" aria-label="安全边界说明">
            <strong>高风险内容不会进入普通记忆花园</strong>
            <span>这类内容只连接安全支持路径，不展示原文、标签或细节。</span>
          </aside>
        </main>
      </PhoneFrame>
    </main>
  )
}
