import { useMemo, useState } from 'react'
import { buildMemoryGarden, markSeedCandidateNotSaved, plantSeedCandidate } from '../memory/repository'
import type { MemoryGarden, MemorySeed, MemorySeedCandidate } from '../memory/types'
import { PhoneFrame } from './PhoneFrame'

interface SeedGardenDemoProps {
  initialSeeds: MemorySeed[]
  seedCandidate: MemorySeedCandidate
}

type DemoStep = 'result' | 'success' | 'myPage' | 'entry' | 'garden'

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

function MoodSeedResult({
  seed,
  onBack,
  onPlant,
  onSkip,
}: {
  seed: MemorySeedCandidate
  onBack(): void
  onPlant(): void
  onSkip(): void
}) {
  return (
    <section className="mobile-panel seed-result reference-seed-result" aria-labelledby="seed-result-title">
      <img
        className="reference-seed-result__image"
        src="/reference-assets/seed-result-reference-211.png"
        alt=""
        aria-hidden="true"
      />
      <div className="sr-only">
        <h1 id="seed-result-title">今天的心情，变成了一颗小种子</h1>
        <p>暖暖帮你把刚刚的感受，轻轻收成了一颗小种子。它还没有种下，可以带它去记忆花园。</p>
        <p>
          {seed.title}：{seed.summary}
        </p>
        <p>心情标签：{labelTags(seed.moodTags, moodLabels).join('、')}、不想说话</p>
      </div>
      <button type="button" className="reference-top-left-hit" onClick={onBack}>
        <span className="sr-only">返回种子结果页</span>
      </button>
      <button type="button" className="reference-primary-hit" onClick={onPlant}>
        <span className="sr-only">带去记忆花园</span>
      </button>
      <button type="button" className="reference-secondary-hit" onClick={onSkip}>
        <span className="sr-only">先不保存</span>
      </button>
      <article className="reference-garden-entry" aria-label="记忆花园入口预览">
        <span className="sr-only">记忆花园，这里长着你慢慢放下过的小心情。</span>
      </article>
    </section>
  )
}

function SeedPlantSuccess({
  onBack,
  onContinue,
  onReturnHome,
}: {
  onBack(): void
  onContinue(): void
  onReturnHome(): void
}) {
  return (
    <section className="mobile-panel seed-success reference-seed-result" aria-labelledby="seed-success-title">
      <img
        className="reference-seed-result__image"
        src="/reference-assets/seed-success-reference-212.png"
        alt=""
        aria-hidden="true"
      />
      <div className="seed-success-action-layer" aria-hidden="true">
        <video className="seed-success-action-video" autoPlay muted playsInline preload="auto">
          <source src="/reference-assets/seed-planting-action-overlay-212.m4v" type="video/mp4" />
        </video>
      </div>
      <div className="sr-only">
        <h1 id="seed-success-title">已经带到小花园啦。</h1>
        <p>这颗小种子已经被轻轻放入记忆小花园里休息。</p>
        <p>已同步到「我的」里的记忆小花园。</p>
      </div>
      <button type="button" className="reference-top-left-hit" onClick={onBack}>
        <span className="sr-only">返回种子结果页</span>
      </button>
      <button type="button" className="reference-success-primary-hit" onClick={onContinue}>
        <span className="sr-only">去我的页面看看</span>
      </button>
      <button type="button" className="reference-success-secondary-hit" onClick={onReturnHome}>
        <span className="sr-only">回到首页</span>
      </button>
      <article className="reference-success-garden-entry" aria-label="记忆花园入口预览">
        <span className="sr-only">记忆花园，这里长着你慢慢放下过的小心情。</span>
      </article>
    </section>
  )
}

function MyPageFirstScreen({
  actionStatus,
  onEnterGarden,
  onOpenTools,
  onOpenSettings,
}: {
  actionStatus?: string
  onEnterGarden(): void
  onOpenTools(): void
  onOpenSettings(): void
}) {
  return (
    <section className="mobile-panel my-page-first reference-seed-result" aria-labelledby="my-page-title">
      <img
        className="reference-seed-result__image"
        src="/reference-assets/my-page-reference-213.png"
        alt=""
        aria-hidden="true"
      />
      <div className="sr-only">
        <h1 id="my-page-title">我的页面</h1>
        <p>暖暖，陪伴你的第23天。</p>
        <p>12 封存小记，8 治愈场景，36 陪伴时刻。</p>
        <p>记忆小花园，这里长着你慢慢放下过的小心情。已种下 12 颗，最近一颗：有点累的小黄种子。</p>
        <p>快捷入口包含消息中心、助眠设置、收藏夹和心情日记。底部导航当前停留在我的。</p>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {actionStatus}
      </p>
      <button type="button" className="reference-my-page-tools-hit" onClick={onOpenTools}>
        <span className="sr-only">打开页面工具</span>
      </button>
      <button type="button" className="reference-my-page-settings-hit" onClick={onOpenSettings}>
        <span className="sr-only">打开设置</span>
      </button>
      <article className="reference-my-page-card-hit" aria-label="记忆小花园入口预览">
        <span className="sr-only">记忆小花园，这里长着你慢慢放下过的小心情。</span>
      </article>
      <button type="button" className="reference-my-page-primary-hit" onClick={onEnterGarden}>
        <span className="sr-only">进去看看</span>
      </button>
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

function SeedDetailPanel({
  seed,
  onClose,
  onBack,
}: {
  seed: MemorySeed
  onClose(): void
  onBack(): void
}) {
  return (
    <article className="seed-detail-panel reference-seed-detail-panel" aria-label="小种子详情">
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
      <div className="reference-seed-detail-actions">
        <button type="button" className="button-ghost" onClick={onClose}>
          关闭详情
        </button>
        <button type="button" onClick={onBack}>
          回到我的页面
        </button>
      </div>
    </article>
  )
}

function SeedGardenView({
  garden,
  selectedSeed,
  onSelectSeed,
  onClearSeed,
  onBack,
}: {
  garden: MemoryGarden
  selectedSeed?: MemorySeed
  onSelectSeed(seed: MemorySeed): void
  onClearSeed(): void
  onBack(): void
}) {
  const visibleSeeds = garden.seeds.slice(0, 4)

  return (
    <section className="mobile-panel seed-garden reference-seed-result reference-memory-garden" aria-labelledby="seed-garden-title">
      <img
        className="reference-seed-result__image"
        src="/reference-assets/memory-garden-reference-214.png"
        alt=""
        aria-hidden="true"
      />
      <div className="sr-only">
        <h1 id="seed-garden-title">记忆小花园</h1>
        <p>每一颗小种子，都是你慢慢放下过的一天。花园第一层保持小种子列表，主题只在点开小种子后出现。</p>
        <div>
          {garden.seeds.map((seed) => (
            <article key={seed.id}>
              <h2>{seed.title}</h2>
              <p>{formatDate(seed.createdAt)}</p>
              <p>{seed.summary}</p>
            </article>
          ))}
        </div>
      </div>
      <button type="button" className="reference-top-left-hit reference-garden-back-hit" onClick={onBack}>
        <span className="sr-only">返回我的页面</span>
      </button>
      <section aria-label="记忆花园第一层">
        {visibleSeeds.map((seed, index) => (
          <button
            key={seed.id}
            type="button"
            className={`reference-garden-seed-hit reference-garden-seed-hit--${index + 1}`}
            onClick={() => onSelectSeed(seed)}
            aria-label={`查看${seed.title}心情小种子`}
          >
            <span className="sr-only">
              {seed.title}，{formatDate(seed.createdAt)}，{seed.summary}
            </span>
          </button>
        ))}
      </section>
      {selectedSeed ? <SeedDetailPanel seed={selectedSeed} onClose={onClearSeed} onBack={onBack} /> : null}
    </section>
  )
}

export function SeedGardenDemo({ initialSeeds, seedCandidate }: SeedGardenDemoProps) {
  const [step, setStep] = useState<DemoStep>('result')
  const [seeds, setSeeds] = useState(initialSeeds)
  const [currentCandidate, setCurrentCandidate] = useState(seedCandidate)
  const [selectedSeedId, setSelectedSeedId] = useState<string>()
  const [myPageActionStatus, setMyPageActionStatus] = useState<string>()
  const garden = useMemo(() => buildMemoryGarden(seeds), [seeds])
  const currentSeed = seeds.find((seed) => seed.id === seedCandidate.id.replace(/^candidate_/, '')) ?? currentCandidate
  const selectedSeed = garden.seeds.find((seed) => seed.id === selectedSeedId)

  function plantCurrentSeed() {
    const plantedSeed = plantSeedCandidate(currentCandidate)
    setCurrentCandidate(plantedSeed)
    setSeeds((items) => items.map((item) => (item.id === currentSeed.id ? plantedSeed : item)))
    setSelectedSeedId(undefined)
    setStep('success')
  }

  function skipCurrentSeed() {
    const notSavedSeed = markSeedCandidateNotSaved(currentCandidate)
    setCurrentCandidate(notSavedSeed)
    setSeeds((items) => items.map((item) => (item.id === currentSeed.id ? notSavedSeed : item)))
    setSelectedSeedId(undefined)
    setStep('entry')
  }

  function returnToResult() {
    setSelectedSeedId(undefined)
    setStep('result')
  }

  function returnToMyPage() {
    setSelectedSeedId(undefined)
    setMyPageActionStatus(undefined)
    setStep('myPage')
  }

  function handleTopbarBack() {
    if (step === 'garden') {
      returnToMyPage()
      return
    }

    returnToResult()
  }

  return (
    <main className="demo-stage">
      <header className="demo-copy">
        <p className="eyebrow">Nuannuan Mood Seed Demo</p>
        <h1>心情小种子记忆花园</h1>
        <p>第一眼先看到今天生成的小种子；用户确认后，它才会进入记忆花园。</p>
      </header>

      <PhoneFrame className={`phone-shell--${step}`} label="心情小种子记忆花园 Demo">
        {step !== 'result' && step !== 'success' && step !== 'myPage' && step !== 'garden' ? (
          <header className={`app-topbar app-topbar--${step}`}>
            <button type="button" className="topbar-back" onClick={handleTopbarBack} aria-label="返回">
              <span aria-hidden="true">‹</span>
            </button>
            <span className="diary-pill" aria-label="心情日记">
              <span aria-hidden="true">♡</span>
              心情日记
            </span>
          </header>
        ) : null}
        <main className={`app-screen app-screen--${step}`}>
          {step === 'result' ? (
            <MoodSeedResult
              seed={currentCandidate}
              onBack={returnToResult}
              onPlant={plantCurrentSeed}
              onSkip={skipCurrentSeed}
            />
          ) : null}

          {step === 'success' ? (
            <SeedPlantSuccess onBack={returnToResult} onContinue={returnToMyPage} onReturnHome={returnToResult} />
          ) : null}

          {step === 'myPage' ? (
            <MyPageFirstScreen
              actionStatus={myPageActionStatus}
              onEnterGarden={() => setStep('garden')}
              onOpenTools={() => setMyPageActionStatus('页面工具已打开，当前演示保持在我的页面。')}
              onOpenSettings={() => setMyPageActionStatus('设置已打开，当前演示保持在我的页面。')}
            />
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
              onClearSeed={() => setSelectedSeedId(undefined)}
              onBack={returnToMyPage}
            />
          ) : null}

          {step !== 'result' && step !== 'success' && step !== 'myPage' && step !== 'garden' ? (
            <aside className="safety-tile" aria-label="安全边界说明">
              <strong>高风险内容不会进入普通记忆花园</strong>
              <span>这类内容只连接安全支持路径，不展示原文、标签或细节。</span>
            </aside>
          ) : null}
        </main>
      </PhoneFrame>
    </main>
  )
}
