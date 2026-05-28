import type { HiddenMemoryProfile, MemoryItem, RiskRecord, SafetyGuideLog } from '../memory/types'
import { MobileClosedLoop } from './MobileClosedLoop'

interface ClosedLoopDemoProps {
  memories: MemoryItem[]
  hiddenProfile: HiddenMemoryProfile
  riskRecords: RiskRecord[]
  safetyGuideLogs: SafetyGuideLog[]
  onHideMemory(id: string): void
  onDeleteMemory(id: string): void
  onToggleAllowMention(id: string, allowMention: boolean): void
}

export function ClosedLoopDemo({
  memories,
  hiddenProfile,
  riskRecords,
  safetyGuideLogs,
  onHideMemory,
  onDeleteMemory,
  onToggleAllowMention,
}: ClosedLoopDemoProps) {
  return (
    <main className="demo-stage">
      <header className="demo-copy">
        <p className="eyebrow">Nuannuan Memory Core Demo</p>
        <h1>手机里的最后闭环</h1>
        <p>所有关键动作都在手机屏幕内完成：确认保存、进入安全小屋、管理小记、预览下次聊天。</p>
      </header>

      <MobileClosedLoop
        memories={memories}
        hiddenProfile={hiddenProfile}
        riskRecords={riskRecords}
        safetyGuideLogs={safetyGuideLogs}
        onHideMemory={onHideMemory}
        onDeleteMemory={onDeleteMemory}
        onToggleAllowMention={onToggleAllowMention}
      />
    </main>
  )
}
