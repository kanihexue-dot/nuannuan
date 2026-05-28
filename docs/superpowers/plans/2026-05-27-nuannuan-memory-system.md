# 暖暖心理我的页面与记忆系统 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在当前空白顶层仓库中规划一个可演示的 `nuannuan-demo/` 前端 MVP，实现暖暖心理的本地记忆闭环、风险分流、AI 反哺上下文和“我的页面”。

**Architecture:** 由于当前仓库没有现成 app 代码和 `package.json`，执行时创建轻量 React + Vite + TypeScript Demo。核心逻辑拆成 `memory` domain、repository、mock service、context builder 和页面组件，所有数据仅通过 `localStorage` 在浏览器本地模拟，不接入后端、账号系统或跨设备同步。`global-briefing/` 是独立仓库且已被忽略，本计划不读取、不修改、不依赖它。

**Tech Stack:** React, Vite, TypeScript, Vitest, React Testing Library, `localStorage`

---

## 文件结构

- Create: `nuannuan-demo/package.json`，定义 Vite Demo、测试脚本和依赖。
- Create: `nuannuan-demo/index.html`，Vite HTML 入口。
- Create: `nuannuan-demo/vite.config.ts`，配置 React 和 Vitest。
- Create: `nuannuan-demo/tsconfig.json`，TypeScript 配置。
- Create: `nuannuan-demo/src/main.tsx`，React mount 入口。
- Create: `nuannuan-demo/src/App.tsx`，Demo story flow 与页面容器。
- Create: `nuannuan-demo/src/styles.css`，页面基础样式。
- Create: `nuannuan-demo/src/test/setup.ts`，测试环境初始化。
- Create: `nuannuan-demo/src/memory/types.ts`，定义 `MemoryItem`、`HiddenMemoryProfile`、`RiskRecord`、`SafetyGuideLog` 等 domain types。
- Create: `nuannuan-demo/src/memory/repository.ts`，封装 `localStorage` 读写、隐藏、删除和重置。
- Create: `nuannuan-demo/src/memory/mockMemoryService.ts`，模拟记忆生成与低/中/高风险分流。
- Create: `nuannuan-demo/src/memory/contextBuilder.ts`，构建下次聊天可使用的轻量 AI context。
- Create: `nuannuan-demo/src/memory/seedData.ts`，提供 Demo seed data 与故事流输入。
- Create: `nuannuan-demo/src/components/MyPage.tsx`，安全小屋首页，展示普通状态、高风险状态和隐私封存入口。
- Create: `nuannuan-demo/src/components/MemoryCard.tsx`，生成小记卡片、隐藏、删除和允许温和提起开关。
- Create: `nuannuan-demo/src/components/MemoryDetail.tsx`，单条小记详情。
- Create: `nuannuan-demo/src/components/PrivacyVaultNotice.tsx`，隐私封存说明与封存计数。
- Create: `nuannuan-demo/src/components/SafetyGuidePanel.tsx`，高风险安全引导面板。
- Create: `nuannuan-demo/src/memory/*.test.ts`，domain service、repository、context builder 单元测试。
- Create: `nuannuan-demo/src/components/*.test.tsx`，我的页面关键状态组件测试。

## Task 1: 初始化前端 Demo 项目骨架

**Files:**
- Create: `nuannuan-demo/package.json`
- Create: `nuannuan-demo/index.html`
- Create: `nuannuan-demo/vite.config.ts`
- Create: `nuannuan-demo/tsconfig.json`
- Create: `nuannuan-demo/src/main.tsx`
- Create: `nuannuan-demo/src/App.tsx`
- Create: `nuannuan-demo/src/styles.css`
- Create: `nuannuan-demo/src/test/setup.ts`

- [ ] **Step 1: 创建 Vite React TypeScript 项目**

Run:

```bash
npm create vite@latest nuannuan-demo -- --template react-ts
cd nuannuan-demo
npm install
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Expected: `nuannuan-demo/` 下生成 React + TypeScript 项目，并安装测试依赖。

- [ ] **Step 2: 配置测试脚本**

Update `nuannuan-demo/package.json` scripts to include:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 3: 配置 Vitest**

Create or update `nuannuan-demo/vite.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: true,
  },
});
```

Create `nuannuan-demo/src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 4: 写一个最小页面 smoke test**

Create `nuannuan-demo/src/App.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import App from './App';

it('renders the Nuannuan memory demo shell', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: '暖暖安全小屋' })).toBeInTheDocument();
});
```

- [ ] **Step 5: 实现最小 `App`**

Update `nuannuan-demo/src/App.tsx`:

```tsx
import './styles.css';

export default function App() {
  return (
    <main className="app-shell">
      <h1>暖暖安全小屋</h1>
      <p>这里会展示你的生成小记、情绪轨迹和隐私封存状态。</p>
    </main>
  );
}
```

- [ ] **Step 6: 运行基础验证**

Run:

```bash
npm test
npm run build
```

Expected: `App.test.tsx` passes；`npm run build` exits with code `0`。

- [ ] **Step 7: 建议独立提交**

```bash
git add nuannuan-demo
git commit -m "chore: scaffold nuannuan memory demo"
```

## Task 2: 定义 Memory domain types

**Files:**
- Create: `nuannuan-demo/src/memory/types.ts`
- Create: `nuannuan-demo/src/memory/types.test.ts`

- [ ] **Step 1: 写类型守卫测试**

Create `nuannuan-demo/src/memory/types.test.ts`:

```ts
import { isHighRisk, shouldShowMemory, type MemoryItem } from './types';

const baseMemory: MemoryItem = {
  id: 'mem_friendship_low',
  createdAt: '2026-05-27T08:00:00.000Z',
  sourceType: 'chat',
  summary: '最近你有点在意和朋友之间的距离感。',
  emotionTags: ['anxious', 'sad'],
  topicTags: ['friendship'],
  riskLevel: 'low',
  allowMention: false,
  isHidden: false,
};

it('shows visible low risk memories', () => {
  expect(shouldShowMemory(baseMemory)).toBe(true);
});

it('does not show hidden memories', () => {
  expect(shouldShowMemory({ ...baseMemory, isHidden: true })).toBe(false);
});

it('treats high risk as protected content', () => {
  expect(isHighRisk({ ...baseMemory, riskLevel: 'high' })).toBe(true);
});
```

- [ ] **Step 2: 定义核心类型**

Create `nuannuan-demo/src/memory/types.ts`:

```ts
export type SourceType = 'chat' | 'record';
export type RiskLevel = 'low' | 'medium' | 'high';
export type EmotionTag = 'anxious' | 'sad' | 'tired' | 'calm' | 'relieved' | 'overwhelmed';
export type TopicTag = 'friendship' | 'study_pressure' | 'family' | 'sleep' | 'self_care';
export type RiskTag = 'self_harm_signal' | 'panic_signal' | 'hopelessness_signal' | 'harm_to_others_signal';
export type GuideType = 'emergency_support' | 'grounding_exercise' | 'trusted_contact' | 'help_resources';
export type SafetyGuideAction = 'viewed' | 'dismissed' | 'clicked_resource';

export interface MemoryItem {
  id: string;
  createdAt: string;
  sourceType: SourceType;
  summary: string;
  emotionTags: EmotionTag[];
  topicTags: TopicTag[];
  riskLevel: RiskLevel;
  allowMention: boolean;
  isHidden: boolean;
  deletedAt?: string;
}

export interface HiddenMemoryProfile {
  preferredTone: 'gentle' | 'brief' | 'warm';
  interactionStyle: 'empathy_first' | 'fewer_suggestions' | 'short_sentences';
  avoidPatterns: Array<'preachy' | 'strong_analysis' | 'diagnosis_language'>;
  updatedAt: string;
}

export interface RiskRecord {
  id: string;
  createdAt: string;
  riskLevel: RiskLevel;
  riskTags: RiskTag[];
  sourceMemoryId?: string;
  actionTaken: 'stored_memory' | 'softened_summary' | 'safety_guide';
}

export interface SafetyGuideLog {
  id: string;
  riskRecordId: string;
  guideType: GuideType;
  shownAt: string;
  userAction: SafetyGuideAction;
}

export function shouldShowMemory(memory: MemoryItem): boolean {
  return !memory.isHidden && !memory.deletedAt && memory.riskLevel !== 'high';
}

export function isHighRisk(memory: Pick<MemoryItem, 'riskLevel'>): boolean {
  return memory.riskLevel === 'high';
}
```

- [ ] **Step 3: 运行类型测试**

Run:

```bash
npm test -- src/memory/types.test.ts
```

Expected: all tests pass。

- [ ] **Step 4: 建议独立提交**

```bash
git add nuannuan-demo/src/memory/types.ts nuannuan-demo/src/memory/types.test.ts
git commit -m "feat: define nuannuan memory domain types"
```

## Task 3: 实现本地存储 repository

**Files:**
- Create: `nuannuan-demo/src/memory/repository.ts`
- Create: `nuannuan-demo/src/memory/repository.test.ts`

- [ ] **Step 1: 写 repository 行为测试**

Create `nuannuan-demo/src/memory/repository.test.ts`:

```ts
import { createMemoryRepository } from './repository';
import type { HiddenMemoryProfile, MemoryItem, RiskRecord, SafetyGuideLog } from './types';

const memory: MemoryItem = {
  id: 'mem_1',
  createdAt: '2026-05-27T08:00:00.000Z',
  sourceType: 'chat',
  summary: '最近你有点在意和朋友之间的距离感。',
  emotionTags: ['anxious'],
  topicTags: ['friendship'],
  riskLevel: 'low',
  allowMention: false,
  isHidden: false,
};

const profile: HiddenMemoryProfile = {
  preferredTone: 'gentle',
  interactionStyle: 'empathy_first',
  avoidPatterns: ['preachy', 'diagnosis_language'],
  updatedAt: '2026-05-27T08:00:00.000Z',
};

const risk: RiskRecord = {
  id: 'risk_1',
  createdAt: '2026-05-27T08:01:00.000Z',
  riskLevel: 'low',
  riskTags: [],
  sourceMemoryId: 'mem_1',
  actionTaken: 'stored_memory',
};

const guide: SafetyGuideLog = {
  id: 'guide_1',
  riskRecordId: 'risk_1',
  guideType: 'help_resources',
  shownAt: '2026-05-27T08:02:00.000Z',
  userAction: 'viewed',
};

beforeEach(() => {
  localStorage.clear();
});

it('saves and lists memories newest first', () => {
  const repo = createMemoryRepository();

  repo.saveMemory(memory);

  expect(repo.listMemories()).toEqual([memory]);
});

it('hides and deletes a single memory', () => {
  const repo = createMemoryRepository();
  repo.saveMemory(memory);

  repo.hideMemory('mem_1');
  expect(repo.listMemories()[0].isHidden).toBe(true);

  repo.deleteMemory('mem_1');
  expect(repo.listMemories()).toEqual([]);
});

it('stores profile, risk records, and safety guide logs', () => {
  const repo = createMemoryRepository();

  repo.saveHiddenProfile(profile);
  repo.saveRiskRecord(risk);
  repo.saveSafetyGuideLog(guide);

  expect(repo.getHiddenProfile()).toEqual(profile);
  expect(repo.listRiskRecords()).toEqual([risk]);
  expect(repo.listSafetyGuideLogs()).toEqual([guide]);
});
```

- [ ] **Step 2: 实现 repository 接口**

Create `nuannuan-demo/src/memory/repository.ts`:

```ts
import type { HiddenMemoryProfile, MemoryItem, RiskRecord, SafetyGuideLog } from './types';

const STORAGE_KEYS = {
  memories: 'nuannuan.memories',
  hiddenProfile: 'nuannuan.hiddenProfile',
  riskRecords: 'nuannuan.riskRecords',
  safetyGuideLogs: 'nuannuan.safetyGuideLogs',
} as const;

function readJson<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T) : fallback;
}

function writeJson<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export interface MemoryRepository {
  listMemories(): MemoryItem[];
  saveMemory(memory: MemoryItem): void;
  hideMemory(id: string): void;
  setAllowMention(id: string, allowMention: boolean): void;
  deleteMemory(id: string): void;
  getHiddenProfile(): HiddenMemoryProfile | null;
  saveHiddenProfile(profile: HiddenMemoryProfile): void;
  listRiskRecords(): RiskRecord[];
  saveRiskRecord(record: RiskRecord): void;
  listSafetyGuideLogs(): SafetyGuideLog[];
  saveSafetyGuideLog(log: SafetyGuideLog): void;
  reset(): void;
}

export function createMemoryRepository(): MemoryRepository {
  return {
    listMemories() {
      return readJson<MemoryItem[]>(STORAGE_KEYS.memories, []).sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      );
    },
    saveMemory(memory) {
      const existing = this.listMemories().filter((item) => item.id !== memory.id);
      writeJson(STORAGE_KEYS.memories, [memory, ...existing]);
    },
    hideMemory(id) {
      writeJson(
        STORAGE_KEYS.memories,
        this.listMemories().map((item) => (item.id === id ? { ...item, isHidden: true } : item)),
      );
    },
    setAllowMention(id, allowMention) {
      writeJson(
        STORAGE_KEYS.memories,
        this.listMemories().map((item) => (item.id === id ? { ...item, allowMention } : item)),
      );
    },
    deleteMemory(id) {
      writeJson(
        STORAGE_KEYS.memories,
        this.listMemories().filter((item) => item.id !== id),
      );
    },
    getHiddenProfile() {
      return readJson<HiddenMemoryProfile | null>(STORAGE_KEYS.hiddenProfile, null);
    },
    saveHiddenProfile(profile) {
      writeJson(STORAGE_KEYS.hiddenProfile, profile);
    },
    listRiskRecords() {
      return readJson<RiskRecord[]>(STORAGE_KEYS.riskRecords, []).sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      );
    },
    saveRiskRecord(record) {
      writeJson(STORAGE_KEYS.riskRecords, [record, ...this.listRiskRecords()]);
    },
    listSafetyGuideLogs() {
      return readJson<SafetyGuideLog[]>(STORAGE_KEYS.safetyGuideLogs, []).sort((a, b) =>
        b.shownAt.localeCompare(a.shownAt),
      );
    },
    saveSafetyGuideLog(log) {
      writeJson(STORAGE_KEYS.safetyGuideLogs, [log, ...this.listSafetyGuideLogs()]);
    },
    reset() {
      Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    },
  };
}
```

- [ ] **Step 3: 运行 repository 测试**

Run:

```bash
npm test -- src/memory/repository.test.ts
```

Expected: all tests pass。

- [ ] **Step 4: 建议独立提交**

```bash
git add nuannuan-demo/src/memory/repository.ts nuannuan-demo/src/memory/repository.test.ts
git commit -m "feat: add local memory repository"
```

## Task 4: 实现记忆生成与风险分流 mock service

**Files:**
- Create: `nuannuan-demo/src/memory/mockMemoryService.ts`
- Create: `nuannuan-demo/src/memory/mockMemoryService.test.ts`

- [ ] **Step 1: 写低风险、中风险、高风险分流测试**

Create `nuannuan-demo/src/memory/mockMemoryService.test.ts`:

```ts
import { createMockMemoryService } from './mockMemoryService';
import { createMemoryRepository } from './repository';

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-05-27T08:00:00.000Z'));
});

afterEach(() => {
  vi.useRealTimers();
});

it('creates a visible low risk memory from friendship content', () => {
  const service = createMockMemoryService(createMemoryRepository());

  const result = service.processEntry({
    sourceType: 'chat',
    text: '最近和朋友关系有点僵，她回消息很慢，我会一直想是不是我做错了什么。',
  });

  expect(result.memory?.summary).toContain('朋友');
  expect(result.memory?.riskLevel).toBe('low');
  expect(result.riskRecord.actionTaken).toBe('stored_memory');
});

it('softens medium risk summaries and keeps them visible', () => {
  const service = createMockMemoryService(createMemoryRepository());

  const result = service.processEntry({
    sourceType: 'record',
    text: '我这几天一直睡不着，觉得很崩溃，也很无助。',
  });

  expect(result.memory?.riskLevel).toBe('medium');
  expect(result.memory?.summary).not.toContain('很崩溃');
  expect(result.riskRecord.riskTags).toContain('hopelessness_signal');
});

it('does not save high risk original details and creates safety guide log', () => {
  const repo = createMemoryRepository();
  const service = createMockMemoryService(repo);

  const result = service.processEntry({
    sourceType: 'chat',
    text: '我想自伤，不想活了。',
  });

  expect(result.memory).toBeUndefined();
  expect(result.riskRecord.riskLevel).toBe('high');
  expect(result.riskRecord.actionTaken).toBe('safety_guide');
  expect(repo.listMemories()).toEqual([]);
  expect(repo.listSafetyGuideLogs()[0].guideType).toBe('emergency_support');
});
```

- [ ] **Step 2: 实现 service 接口**

Create `nuannuan-demo/src/memory/mockMemoryService.ts`:

```ts
import type { MemoryRepository } from './repository';
import type { MemoryItem, RiskRecord, RiskTag, SafetyGuideLog, SourceType } from './types';

export interface ProcessEntryInput {
  sourceType: SourceType;
  text: string;
}

export interface ProcessEntryResult {
  memory?: MemoryItem;
  riskRecord: RiskRecord;
  safetyGuideLog?: SafetyGuideLog;
}

export interface MockMemoryService {
  processEntry(input: ProcessEntryInput): ProcessEntryResult;
}

function nowIso(): string {
  return new Date().toISOString();
}

function createId(prefix: string): string {
  return `${prefix}_${Date.now()}`;
}

function detectRisk(text: string): { level: MemoryItem['riskLevel']; tags: RiskTag[] } {
  if (/自伤|不想活|自杀|伤害别人/.test(text)) {
    return { level: 'high', tags: ['self_harm_signal'] };
  }
  if (/崩溃|无助|睡不着|喘不过气/.test(text)) {
    return { level: 'medium', tags: ['hopelessness_signal'] };
  }
  return { level: 'low', tags: [] };
}

function buildMemory(input: ProcessEntryInput, riskLevel: MemoryItem['riskLevel']): MemoryItem {
  const isFriendship = /朋友|回消息|关系/.test(input.text);
  const isStudy = /学习|考试|作业|压力/.test(input.text);

  return {
    id: createId('mem'),
    createdAt: nowIso(),
    sourceType: input.sourceType,
    summary: riskLevel === 'medium'
      ? '这段时间你承受了较强的压力和疲惫，暖暖会用更轻的方式陪你梳理。'
      : isFriendship
        ? '最近你有点在意和朋友之间的距离感，也会担心是不是自己做错了什么。'
        : '你记录了一段近期的情绪起伏，暖暖会温和地陪你回看。',
    emotionTags: riskLevel === 'medium' ? ['overwhelmed', 'tired'] : ['anxious', 'sad'],
    topicTags: isFriendship ? ['friendship'] : isStudy ? ['study_pressure'] : ['self_care'],
    riskLevel,
    allowMention: false,
    isHidden: false,
  };
}

export function createMockMemoryService(repository: MemoryRepository): MockMemoryService {
  return {
    processEntry(input) {
      const risk = detectRisk(input.text);
      const riskRecord: RiskRecord = {
        id: createId('risk'),
        createdAt: nowIso(),
        riskLevel: risk.level,
        riskTags: risk.tags,
        actionTaken: risk.level === 'high' ? 'safety_guide' : risk.level === 'medium' ? 'softened_summary' : 'stored_memory',
      };

      if (risk.level === 'high') {
        const safetyGuideLog: SafetyGuideLog = {
          id: createId('guide'),
          riskRecordId: riskRecord.id,
          guideType: 'emergency_support',
          shownAt: nowIso(),
          userAction: 'viewed',
        };
        repository.saveRiskRecord(riskRecord);
        repository.saveSafetyGuideLog(safetyGuideLog);
        return { riskRecord, safetyGuideLog };
      }

      const memory = buildMemory(input, risk.level);
      const savedRiskRecord = { ...riskRecord, sourceMemoryId: memory.id };
      repository.saveMemory(memory);
      repository.saveRiskRecord(savedRiskRecord);
      return { memory, riskRecord: savedRiskRecord };
    },
  };
}
```

- [ ] **Step 3: 运行 service 测试**

Run:

```bash
npm test -- src/memory/mockMemoryService.test.ts
```

Expected: all tests pass；高风险测试确认 `repo.listMemories()` 为空。

- [ ] **Step 4: 建议独立提交**

```bash
git add nuannuan-demo/src/memory/mockMemoryService.ts nuannuan-demo/src/memory/mockMemoryService.test.ts
git commit -m "feat: add mock memory risk routing"
```

## Task 5: 实现 AI 反哺上下文 builder

**Files:**
- Create: `nuannuan-demo/src/memory/contextBuilder.ts`
- Create: `nuannuan-demo/src/memory/contextBuilder.test.ts`

- [ ] **Step 1: 写上下文边界测试**

Create `nuannuan-demo/src/memory/contextBuilder.test.ts`:

```ts
import { buildCompanionContext } from './contextBuilder';
import type { HiddenMemoryProfile, MemoryItem, RiskRecord } from './types';

const profile: HiddenMemoryProfile = {
  preferredTone: 'gentle',
  interactionStyle: 'empathy_first',
  avoidPatterns: ['preachy', 'strong_analysis', 'diagnosis_language'],
  updatedAt: '2026-05-27T08:00:00.000Z',
};

const visibleMemory: MemoryItem = {
  id: 'mem_visible',
  createdAt: '2026-05-27T08:00:00.000Z',
  sourceType: 'chat',
  summary: '最近你有点在意和朋友之间的距离感。',
  emotionTags: ['anxious'],
  topicTags: ['friendship'],
  riskLevel: 'low',
  allowMention: true,
  isHidden: false,
};

it('includes only mentionable visible memories', () => {
  const context = buildCompanionContext({
    memories: [
      visibleMemory,
      { ...visibleMemory, id: 'mem_hidden', isHidden: true },
      { ...visibleMemory, id: 'mem_not_allowed', allowMention: false },
    ],
    hiddenProfile: profile,
    riskRecords: [],
  });

  expect(context.mentionableMemorySummaries).toEqual(['最近你有点在意和朋友之间的距离感。']);
});

it('does not expose high risk details and adds safety instruction', () => {
  const highRisk: RiskRecord = {
    id: 'risk_high',
    createdAt: '2026-05-27T08:00:00.000Z',
    riskLevel: 'high',
    riskTags: ['self_harm_signal'],
    actionTaken: 'safety_guide',
  };

  const context = buildCompanionContext({
    memories: [visibleMemory],
    hiddenProfile: profile,
    riskRecords: [highRisk],
  });

  expect(context.safetyMode).toBe(true);
  expect(context.systemGuidance).toContain('不要复述或暗示高风险细节');
});
```

- [ ] **Step 2: 实现上下文 builder**

Create `nuannuan-demo/src/memory/contextBuilder.ts`:

```ts
import type { HiddenMemoryProfile, MemoryItem, RiskRecord } from './types';

export interface CompanionContextInput {
  memories: MemoryItem[];
  hiddenProfile: HiddenMemoryProfile | null;
  riskRecords: RiskRecord[];
}

export interface CompanionContext {
  toneInstruction: string;
  mentionableMemorySummaries: string[];
  styleAvoidance: string[];
  safetyMode: boolean;
  systemGuidance: string;
}

export function buildCompanionContext(input: CompanionContextInput): CompanionContext {
  const mentionableMemorySummaries = input.memories
    .filter((memory) => !memory.isHidden && !memory.deletedAt && memory.allowMention && memory.riskLevel !== 'high')
    .slice(0, 3)
    .map((memory) => memory.summary);

  const safetyMode = input.riskRecords.some((record) => record.riskLevel === 'high');
  const toneInstruction = input.hiddenProfile
    ? `使用 ${input.hiddenProfile.preferredTone} 语气，互动方式为 ${input.hiddenProfile.interactionStyle}。`
    : '使用温和、简短、先共情的陪伴语气。';

  return {
    toneInstruction,
    mentionableMemorySummaries,
    styleAvoidance: input.hiddenProfile?.avoidPatterns ?? ['preachy', 'diagnosis_language'],
    safetyMode,
    systemGuidance: safetyMode
      ? '关注用户当下是否安全，提供支持性引导，不要复述或暗示高风险细节。'
      : '只在语境合适时温和提起允许的记忆，不主动翻旧账。',
  };
}
```

- [ ] **Step 3: 运行 context builder 测试**

Run:

```bash
npm test -- src/memory/contextBuilder.test.ts
```

Expected: all tests pass；隐藏、删除、未允许提起、高风险内容不进入 `mentionableMemorySummaries`。

- [ ] **Step 4: 建议独立提交**

```bash
git add nuannuan-demo/src/memory/contextBuilder.ts nuannuan-demo/src/memory/contextBuilder.test.ts
git commit -m "feat: build safe companion context"
```

## Task 6: 构建我的页面 UI

**Files:**
- Create: `nuannuan-demo/src/components/MyPage.tsx`
- Create: `nuannuan-demo/src/components/MemoryCard.tsx`
- Create: `nuannuan-demo/src/components/MemoryDetail.tsx`
- Create: `nuannuan-demo/src/components/PrivacyVaultNotice.tsx`
- Create: `nuannuan-demo/src/components/SafetyGuidePanel.tsx`
- Create: `nuannuan-demo/src/components/MyPage.test.tsx`
- Modify: `nuannuan-demo/src/App.tsx`
- Modify: `nuannuan-demo/src/styles.css`

- [ ] **Step 1: 写普通状态与高风险状态组件测试**

Create `nuannuan-demo/src/components/MyPage.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MyPage } from './MyPage';
import type { MemoryItem, RiskRecord, SafetyGuideLog } from '../memory/types';

const memory: MemoryItem = {
  id: 'mem_friendship',
  createdAt: '2026-05-27T08:00:00.000Z',
  sourceType: 'chat',
  summary: '最近你有点在意和朋友之间的距离感。',
  emotionTags: ['anxious', 'sad'],
  topicTags: ['friendship'],
  riskLevel: 'low',
  allowMention: false,
  isHidden: false,
};

it('renders safe home sections for normal state', () => {
  render(
    <MyPage
      memories={[memory]}
      riskRecords={[]}
      safetyGuideLogs={[]}
      onHideMemory={vi.fn()}
      onDeleteMemory={vi.fn()}
      onToggleAllowMention={vi.fn()}
    />,
  );

  expect(screen.getByRole('heading', { name: '暖暖安全小屋' })).toBeInTheDocument();
  expect(screen.getByText('最近情绪')).toBeInTheDocument();
  expect(screen.getByText('常见烦恼')).toBeInTheDocument();
  expect(screen.getByText('情绪轨迹')).toBeInTheDocument();
  expect(screen.getByText('最近你有点在意和朋友之间的距离感。')).toBeInTheDocument();
});

it('calls hide and delete handlers from a memory card', async () => {
  const user = userEvent.setup();
  const onHideMemory = vi.fn();
  const onDeleteMemory = vi.fn();

  render(
    <MyPage
      memories={[memory]}
      riskRecords={[]}
      safetyGuideLogs={[]}
      onHideMemory={onHideMemory}
      onDeleteMemory={onDeleteMemory}
      onToggleAllowMention={vi.fn()}
    />,
  );

  await user.click(screen.getByRole('button', { name: '隐藏这条小记' }));
  await user.click(screen.getByRole('button', { name: '删除这条小记' }));

  expect(onHideMemory).toHaveBeenCalledWith('mem_friendship');
  expect(onDeleteMemory).toHaveBeenCalledWith('mem_friendship');
});

it('renders protected safety state without high risk details', () => {
  const highRiskRecord: RiskRecord = {
    id: 'risk_high',
    createdAt: '2026-05-27T08:00:00.000Z',
    riskLevel: 'high',
    riskTags: ['self_harm_signal'],
    actionTaken: 'safety_guide',
  };
  const guide: SafetyGuideLog = {
    id: 'guide_high',
    riskRecordId: 'risk_high',
    guideType: 'emergency_support',
    shownAt: '2026-05-27T08:00:01.000Z',
    userAction: 'viewed',
  };

  render(
    <MyPage
      memories={[]}
      riskRecords={[highRiskRecord]}
      safetyGuideLogs={[guide]}
      onHideMemory={vi.fn()}
      onDeleteMemory={vi.fn()}
      onToggleAllowMention={vi.fn()}
    />,
  );

  expect(screen.getByText('有一段内容已进入安全保护模式')).toBeInTheDocument();
  expect(screen.queryByText('self_harm_signal')).not.toBeInTheDocument();
});
```

- [ ] **Step 2: 实现 `MemoryCard` 与详情**

Create `nuannuan-demo/src/components/MemoryCard.tsx`:

```tsx
import type { MemoryItem } from '../memory/types';

interface MemoryCardProps {
  memory: MemoryItem;
  onHideMemory(id: string): void;
  onDeleteMemory(id: string): void;
  onToggleAllowMention(id: string, allowMention: boolean): void;
}

export function MemoryCard({ memory, onHideMemory, onDeleteMemory, onToggleAllowMention }: MemoryCardProps) {
  return (
    <article className="memory-card">
      <p>{memory.summary}</p>
      <p className="tag-line">情绪：{memory.emotionTags.join(' / ')}</p>
      <p className="tag-line">主题：{memory.topicTags.join(' / ')}</p>
      <label className="mention-toggle">
        <input
          type="checkbox"
          checked={memory.allowMention}
          onChange={(event) => onToggleAllowMention(memory.id, event.currentTarget.checked)}
        />
        允许暖暖下次温和提起
      </label>
      <div className="card-actions">
        <button type="button" onClick={() => onHideMemory(memory.id)}>隐藏这条小记</button>
        <button type="button" onClick={() => onDeleteMemory(memory.id)}>删除这条小记</button>
      </div>
    </article>
  );
}
```

Create `nuannuan-demo/src/components/MemoryDetail.tsx`:

```tsx
import type { MemoryItem } from '../memory/types';

interface MemoryDetailProps {
  memory: MemoryItem;
}

export function MemoryDetail({ memory }: MemoryDetailProps) {
  return (
    <section className="detail-panel" aria-label="小记详情">
      <h3>小记详情</h3>
      <p>{memory.summary}</p>
      <p>来源：{memory.sourceType === 'chat' ? '聊天' : '记录'}</p>
      <p>保存时间：{new Date(memory.createdAt).toLocaleString()}</p>
    </section>
  );
}
```

- [ ] **Step 3: 实现隐私封存与安全引导组件**

Create `nuannuan-demo/src/components/PrivacyVaultNotice.tsx`:

```tsx
interface PrivacyVaultNoticeProps {
  hiddenCount: number;
  protectedRiskCount: number;
}

export function PrivacyVaultNotice({ hiddenCount, protectedRiskCount }: PrivacyVaultNoticeProps) {
  return (
    <section className="privacy-vault">
      <h2>隐私封存</h2>
      <p>已为你封存 {hiddenCount} 条隐藏小记和 {protectedRiskCount} 条安全保护记录。</p>
      <p>封存内容不会出现在安全小屋首页，也不会被暖暖主动提起。</p>
    </section>
  );
}
```

Create `nuannuan-demo/src/components/SafetyGuidePanel.tsx`:

```tsx
export function SafetyGuidePanel() {
  return (
    <section className="safety-guide" role="status">
      <h2>有一段内容已进入安全保护模式</h2>
      <p>暖暖不会保存或展示具体细节。请先确认自己现在是否安全，如果有现实危险，请尽快联系身边可信任的人或当地紧急服务。</p>
      <ul>
        <li>把注意力放回当下：慢慢吸气 4 秒，再呼气 6 秒。</li>
        <li>联系一个可信任的人，告诉对方你现在需要陪伴。</li>
        <li>如果你可能伤害自己或他人，请立即寻求线下紧急帮助。</li>
      </ul>
    </section>
  );
}
```

- [ ] **Step 4: 实现 `MyPage` 汇总页面**

Create `nuannuan-demo/src/components/MyPage.tsx`:

```tsx
import { shouldShowMemory, type MemoryItem, type RiskRecord, type SafetyGuideLog } from '../memory/types';
import { MemoryCard } from './MemoryCard';
import { MemoryDetail } from './MemoryDetail';
import { PrivacyVaultNotice } from './PrivacyVaultNotice';
import { SafetyGuidePanel } from './SafetyGuidePanel';

interface MyPageProps {
  memories: MemoryItem[];
  riskRecords: RiskRecord[];
  safetyGuideLogs: SafetyGuideLog[];
  onHideMemory(id: string): void;
  onDeleteMemory(id: string): void;
  onToggleAllowMention(id: string, allowMention: boolean): void;
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values));
}

export function MyPage(props: MyPageProps) {
  const visibleMemories = props.memories.filter(shouldShowMemory);
  const hiddenCount = props.memories.filter((memory) => memory.isHidden).length;
  const highRiskCount = props.riskRecords.filter((record) => record.riskLevel === 'high').length;
  const recentEmotions = unique(visibleMemories.flatMap((memory) => memory.emotionTags)).slice(0, 4);
  const commonTopics = unique(visibleMemories.flatMap((memory) => memory.topicTags)).slice(0, 4);

  return (
    <main className="my-page">
      <header className="hero-card">
        <p className="eyebrow">我的页面</p>
        <h1>暖暖安全小屋</h1>
        <p>这里不是心理档案，只是帮你温和回看最近被承接过的心情。</p>
      </header>

      {highRiskCount > 0 ? <SafetyGuidePanel /> : null}

      <section className="summary-grid">
        <article>
          <h2>最近情绪</h2>
          <p>{recentEmotions.length > 0 ? recentEmotions.join(' / ') : '还没有形成情绪记录'}</p>
        </article>
        <article>
          <h2>常见烦恼</h2>
          <p>{commonTopics.length > 0 ? commonTopics.join(' / ') : '还没有形成主题记录'}</p>
        </article>
        <article>
          <h2>情绪轨迹</h2>
          <p>{visibleMemories.map((memory) => memory.emotionTags[0]).join(' → ') || '等待更多记录后生成'}</p>
        </article>
      </section>

      <section>
        <h2>生成小记</h2>
        {visibleMemories.map((memory) => (
          <MemoryCard
            key={memory.id}
            memory={memory}
            onHideMemory={props.onHideMemory}
            onDeleteMemory={props.onDeleteMemory}
            onToggleAllowMention={props.onToggleAllowMention}
          />
        ))}
        {visibleMemories[0] ? <MemoryDetail memory={visibleMemories[0]} /> : null}
      </section>

      <PrivacyVaultNotice hiddenCount={hiddenCount} protectedRiskCount={props.safetyGuideLogs.length} />
    </main>
  );
}
```

- [ ] **Step 5: 连接 `App`**

Update `nuannuan-demo/src/App.tsx` after Task 7 seed data exists, or temporarily wire empty arrays in this task:

```tsx
import { MyPage } from './components/MyPage';
import './styles.css';

export default function App() {
  return (
    <MyPage
      memories={[]}
      riskRecords={[]}
      safetyGuideLogs={[]}
      onHideMemory={() => undefined}
      onDeleteMemory={() => undefined}
      onToggleAllowMention={() => undefined}
    />
  );
}
```

- [ ] **Step 6: 添加页面基础样式**

Update `nuannuan-demo/src/styles.css`:

```css
:root {
  color: #2f2530;
  background: #fff7f3;
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

body {
  margin: 0;
}

button {
  border: 0;
  border-radius: 999px;
  background: #f3d5cf;
  color: #4e3840;
  cursor: pointer;
  padding: 0.55rem 0.9rem;
}

.my-page,
.app-shell {
  margin: 0 auto;
  max-width: 960px;
  padding: 32px 20px 56px;
}

.hero-card,
.memory-card,
.privacy-vault,
.safety-guide,
.detail-panel,
.summary-grid article {
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid #f3d7cf;
  border-radius: 24px;
  box-shadow: 0 16px 50px rgba(139, 87, 70, 0.11);
  padding: 24px;
}

.summary-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  margin: 20px 0;
}

.memory-card,
.privacy-vault,
.safety-guide,
.detail-panel {
  margin-top: 16px;
}

.eyebrow,
.tag-line {
  color: #8a6570;
}

.card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.mention-toggle {
  display: block;
  margin-top: 12px;
}
```

- [ ] **Step 7: 运行组件测试**

Run:

```bash
npm test -- src/components/MyPage.test.tsx
```

Expected: all tests pass；高风险测试不出现具体风险标签文本。

- [ ] **Step 8: 建议独立提交**

```bash
git add nuannuan-demo/src/components nuannuan-demo/src/App.tsx nuannuan-demo/src/styles.css
git commit -m "feat: add nuannuan my page UI"
```

## Task 7: 添加 Demo seed data 与故事流

**Files:**
- Create: `nuannuan-demo/src/memory/seedData.ts`
- Create: `nuannuan-demo/src/memory/seedData.test.ts`
- Modify: `nuannuan-demo/src/App.tsx`

- [ ] **Step 1: 写 seed data 测试**

Create `nuannuan-demo/src/memory/seedData.test.ts`:

```ts
import { createDemoState } from './seedData';

it('provides normal, hidden, and protected demo states', () => {
  const state = createDemoState();

  expect(state.memories.some((memory) => memory.riskLevel === 'low')).toBe(true);
  expect(state.memories.some((memory) => memory.riskLevel === 'medium')).toBe(true);
  expect(state.memories.some((memory) => memory.isHidden)).toBe(true);
  expect(state.riskRecords.some((record) => record.riskLevel === 'high')).toBe(true);
  expect(state.safetyGuideLogs.length).toBeGreaterThan(0);
});
```

- [ ] **Step 2: 实现 Demo state**

Create `nuannuan-demo/src/memory/seedData.ts`:

```ts
import type { HiddenMemoryProfile, MemoryItem, RiskRecord, SafetyGuideLog } from './types';

export interface DemoState {
  memories: MemoryItem[];
  hiddenProfile: HiddenMemoryProfile;
  riskRecords: RiskRecord[];
  safetyGuideLogs: SafetyGuideLog[];
}

export function createDemoState(): DemoState {
  const hiddenProfile: HiddenMemoryProfile = {
    preferredTone: 'gentle',
    interactionStyle: 'empathy_first',
    avoidPatterns: ['preachy', 'strong_analysis', 'diagnosis_language'],
    updatedAt: '2026-05-27T08:00:00.000Z',
  };

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
      summary: '这段时间学习压力较重，暖暖会用更轻的方式陪你把当下最难的部分说清楚。',
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
  ];

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
  ];

  const safetyGuideLogs: SafetyGuideLog[] = [
    {
      id: 'guide_protected_high',
      riskRecordId: 'risk_protected_high',
      guideType: 'emergency_support',
      shownAt: '2026-05-25T22:00:02.000Z',
      userAction: 'viewed',
    },
  ];

  return { memories, hiddenProfile, riskRecords, safetyGuideLogs };
}
```

- [ ] **Step 3: 连接 seed data 与本地状态操作**

Update `nuannuan-demo/src/App.tsx`:

```tsx
import { useMemo, useState } from 'react';
import { MyPage } from './components/MyPage';
import { buildCompanionContext } from './memory/contextBuilder';
import { createDemoState } from './memory/seedData';
import './styles.css';

export default function App() {
  const initialState = useMemo(() => createDemoState(), []);
  const [memories, setMemories] = useState(initialState.memories);
  const companionContext = buildCompanionContext({
    memories,
    hiddenProfile: initialState.hiddenProfile,
    riskRecords: initialState.riskRecords,
  });

  return (
    <>
      <MyPage
        memories={memories}
        riskRecords={initialState.riskRecords}
        safetyGuideLogs={initialState.safetyGuideLogs}
        onHideMemory={(id) =>
          setMemories((items) => items.map((item) => (item.id === id ? { ...item, isHidden: true } : item)))
        }
        onDeleteMemory={(id) => setMemories((items) => items.filter((item) => item.id !== id))}
        onToggleAllowMention={(id, allowMention) =>
          setMemories((items) => items.map((item) => (item.id === id ? { ...item, allowMention } : item)))
        }
      />
      <aside className="context-preview" aria-label="AI 反哺上下文预览">
        <h2>AI 反哺上下文预览</h2>
        <pre>{JSON.stringify(companionContext, null, 2)}</pre>
      </aside>
    </>
  );
}
```

- [ ] **Step 4: 补充故事流手动验收文案**

Add to `nuannuan-demo/README.md`:

```md
# 暖暖心理 Demo

## 故事流

1. 普通小记：用户聊到朋友关系，小记在“生成小记”中展示，并可允许暖暖下次温和提起。
2. 中风险小记：用户表达持续疲惫和压力，页面展示克制摘要，不展示强分析。
3. 隐藏小记：用户隐藏后，小记从首页移除，并计入“隐私封存”。
4. 删除小记：用户删除后，小记从当前 Demo 状态移除，不参与 AI 反哺预览。
5. 高风险记录：页面只展示“安全保护模式”和安全引导，不展示原文、细节或风险标签。
```

- [ ] **Step 5: 运行 seed 与 app 测试**

Run:

```bash
npm test -- src/memory/seedData.test.ts src/App.test.tsx
npm run build
```

Expected: tests pass；build succeeds；`App.test.tsx` 仍能找到 `暖暖安全小屋`。

- [ ] **Step 6: 建议独立提交**

```bash
git add nuannuan-demo/src/memory/seedData.ts nuannuan-demo/src/memory/seedData.test.ts nuannuan-demo/src/App.tsx nuannuan-demo/README.md
git commit -m "feat: add nuannuan demo story flow"
```

## Task 8: 完成测试策略与手动验收

**Files:**
- Modify: `nuannuan-demo/README.md`
- Optional Modify: `nuannuan-demo/src/**/*.test.ts`

- [ ] **Step 1: 运行全部自动化测试**

Run:

```bash
cd nuannuan-demo
npm test
npm run build
```

Expected:

```text
Test Files  7 passed
Tests       all passed
```

`npm run build` exits with code `0`。

- [ ] **Step 2: 手动启动 Demo**

Run:

```bash
npm run dev
```

Expected: Vite prints a local URL such as `http://localhost:5173/`。

- [ ] **Step 3: 手动验收普通状态**

In browser:

```text
打开 http://localhost:5173/
确认页面标题为“暖暖安全小屋”
确认存在“最近情绪”“常见烦恼”“情绪轨迹”“生成小记”“隐私封存”
确认朋友关系小记展示摘要，不出现诊断式措辞
```

- [ ] **Step 4: 手动验收隐藏、删除、允许提起**

In browser:

```text
点击“隐藏这条小记”
确认该小记从生成小记区域消失，隐私封存计数增加
刷新页面后确认 Demo state 恢复为 seed 状态
点击“删除这条小记”
确认该小记从当前页面消失
勾选“允许暖暖下次温和提起”
确认 AI 反哺上下文预览包含对应 summary
```

- [ ] **Step 5: 手动验收高风险保护**

In browser:

```text
确认页面展示“有一段内容已进入安全保护模式”
确认页面不展示高风险原文、具体方法、事件细节或 riskTags 文本
确认安全引导包含当下安全确认、可信任联系人和紧急帮助建议
```

- [ ] **Step 6: 更新 README 验收说明**

Append to `nuannuan-demo/README.md`:

````md
## 验收命令

```bash
npm test
npm run build
npm run dev
```

## 手动验收要点

- 普通状态展示最近情绪、常见烦恼、情绪轨迹、生成小记和隐私封存入口。
- 隐藏小记不在首页展示，也不进入 AI 主动提起列表。
- 删除小记从当前 Demo 状态移除。
- 高风险记录只触发安全保护模式，不展示原文、细节或风险标签。
- AI 反哺上下文只包含允许温和提起的普通记忆。
````

- [ ] **Step 7: 建议独立提交**

```bash
git add nuannuan-demo/README.md nuannuan-demo/src
git commit -m "test: verify nuannuan memory demo"
```

## Task 9: 最终整体验证与收尾

**Files:**
- Modify: `nuannuan-demo/README.md` if verification notes need to be recorded

- [ ] **Step 1: 检查工作树**

Run:

```bash
git status --short
```

Expected: only intended `nuannuan-demo/` files are modified or staged；`global-briefing/` does not appear。

- [ ] **Step 2: 运行最终命令**

Run:

```bash
cd nuannuan-demo
npm test
npm run build
```

Expected: all tests pass；build succeeds。

- [ ] **Step 3: 检查高风险内容边界**

Run:

```bash
rg "自伤|不想活|自杀|伤害别人" src
```

Expected: only mock detection tests or mock detection rules contain these trigger terms；UI seed data and rendered user-facing strings do not contain high-risk original details。

- [ ] **Step 4: 检查 plan 与实现的一致性**

Run:

```bash
rg "MemoryItem|HiddenMemoryProfile|RiskRecord|SafetyGuideLog|buildCompanionContext|createMockMemoryService" src
```

Expected: core types and functions are defined once and imported by repository、service、context builder、UI tests。

- [ ] **Step 5: 建议最终提交**

```bash
git add nuannuan-demo
git commit -m "feat: complete nuannuan memory demo"
```

## 测试策略

- Unit tests: `src/memory/types.test.ts` 覆盖展示条件和高风险判断；`repository.test.ts` 覆盖本地存储、隐藏、删除、profile、risk records、safety guide logs；`mockMemoryService.test.ts` 覆盖低/中/高风险分流；`contextBuilder.test.ts` 覆盖 AI 反哺边界。
- Component tests: `src/components/MyPage.test.tsx` 覆盖普通状态、高风险状态、隐藏和删除交互。
- Build verification: `npm run build` 确认 TypeScript 与 Vite 构建通过。
- Manual acceptance: `npm run dev` 后在浏览器检查安全小屋首页、生成小记、隐私封存、高风险安全引导、AI 反哺上下文预览。

## Self-Review

### Spec Coverage

- 初始化/确认 Demo 项目骨架：Task 1 明确当前无 app 后创建 `nuannuan-demo/`。
- Memory domain types：Task 2 定义 `MemoryItem`、`HiddenMemoryProfile`、`RiskRecord`、`SafetyGuideLog`。
- 本地存储 repository/service：Task 3 封装 `localStorage`，Task 4 提供 mock service。
- 记忆生成/风险分流 mock service：Task 4 覆盖低风险、中风险、高风险路径。
- AI 反哺上下文 builder：Task 5 覆盖允许提起、隐藏、删除、高风险保护。
- 我的页面 UI：Task 6 覆盖安全小屋首页、普通状态、高风险状态、小记详情、隐藏、删除、隐私封存说明。
- Demo seed data 和故事流：Task 7 提供普通、中风险、隐藏、高风险记录和 README 故事流。
- 单元测试/组件测试/手动验收：Task 8 和测试策略列出具体命令与验收动作。
- 每个任务可独立提交：Task 1 至 Task 9 均给出建议提交命令。

### Placeholder Scan

- 未发现禁用占位词或空泛实现描述。
- 所有涉及代码的步骤都给出具体路径、接口签名或代码片段。
- 测试步骤包含具体命令和期望结果。

### Type Consistency

- `MemoryItem`、`HiddenMemoryProfile`、`RiskRecord`、`SafetyGuideLog` 字段名称在 types、repository、service、context builder、UI 和 tests 中一致。
- `riskLevel` 全程使用 `'low' | 'medium' | 'high'`。
- `allowMention`、`isHidden`、`deletedAt` 的展示和 AI 反哺语义一致：隐藏和删除不展示，不进入主动提起列表；高风险不保存为 `MemoryItem`。
- `createMockMemoryService`、`createMemoryRepository`、`buildCompanionContext` 的函数名在任务间保持一致。

## Execution Options

Plan complete and saved to `docs/superpowers/plans/2026-05-27-nuannuan-memory-system.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
