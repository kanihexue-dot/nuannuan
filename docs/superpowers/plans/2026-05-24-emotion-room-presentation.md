# Emotion Room Presentation Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a horizontal, presentation-first interactive page for “小情绪房间 V0.5” that preserves the existing app’s friendly visual language while demonstrating the five-step emotional support flow on a large screen.

**Architecture:** Start from an empty repository and create a single-page React + TypeScript demo app with config-driven step content. Keep all five steps in one typed data source, drive the overview rail and the stage canvas from shared state, and keep styling tokenized so the page can stay visually aligned with the existing app while adding a more immersive emotional-space stage.

**Tech Stack:** Vite, React 18, TypeScript, CSS variables, Vitest, Testing Library

---

## File Structure

- `package.json`
  - App scripts and dependencies for Vite, React, TypeScript, and Vitest.
- `tsconfig.json`
  - TypeScript settings for browser code.
- `tsconfig.node.json`
  - TypeScript settings for Vite config files.
- `vite.config.ts`
  - Vite app config plus Vitest runtime config.
- `vitest.setup.ts`
  - Testing Library DOM matchers.
- `index.html`
  - Vite entry HTML.
- `src/main.tsx`
  - React bootstrap entry.
- `src/App.tsx`
  - Top-level page composition and active-step state.
- `src/types.ts`
  - Shared step, mood, and safety-level types.
- `src/data/steps.ts`
  - Single source of truth for five-step presentation content.
- `src/components/PresentationHero.tsx`
  - Header copy plus empty note frame.
- `src/components/FlowOverview.tsx`
  - Five-step overview bar with active-step selection.
- `src/components/StageCanvas.tsx`
  - Main immersive stage for current step.
- `src/components/StepNarrativeCard.tsx`
  - Right-side step explanation card.
- `src/components/SafetyRail.tsx`
  - L0-L3 safety rail panel.
- `src/components/ClosingStatement.tsx`
  - Bottom summary strip.
- `src/styles/tokens.css`
  - App-aligned color, radius, shadow, and spacing tokens.
- `src/styles/base.css`
  - Global layout, typography, and shell styles.
- `src/styles/presentation.css`
  - Component-level layout, mood, and animation styles.
- `src/App.test.tsx`
  - Smoke test for initial render.
- `src/components/__tests__/FlowOverview.test.tsx`
  - Step overview interaction test.
- `src/App.stage.test.tsx`
  - Integration test for stage layout + side rail.
- `src/App.mood.test.tsx`
  - Integration test for mood switching and keyword chips.

## Assumptions

- The repository remains a standalone presentation demo rather than being mounted into an existing production app codebase.
- `npm` is available locally and acceptable for bootstrapping.
- The first implementation pass uses CSS and inline scene shapes instead of waiting for final illustration assets.

### Task 1: Bootstrap the React/Vite shell and prove the page can render

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `vitest.setup.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles/tokens.css`
- Create: `src/styles/base.css`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Create the app/tooling files**

```json
// package.json
{
  "name": "emotion-room-presentation",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "test": "vitest",
    "test:run": "vitest run"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.2.0",
    "@testing-library/user-event": "^14.6.1",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.4.1",
    "jsdom": "^25.0.1",
    "typescript": "^5.7.3",
    "vite": "^6.0.7",
    "vitest": "^2.1.8"
  }
}
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

```json
// tsconfig.node.json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    globals: true,
    css: true
  }
});
```

```ts
// vitest.setup.ts
import "@testing-library/jest-dom/vitest";
```

```html
<!-- index.html -->
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>小情绪房间 V0.5</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`
Expected: npm installs React, Vite, TypeScript, and Vitest packages with no missing-peer errors.

- [ ] **Step 3: Write the failing smoke test**

```tsx
// src/App.test.tsx
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders the presentation shell heading, step buttons, and closing statement", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "小情绪房间" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "01 极速破冰" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "02 隐性感知识别" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "03 极致共情回应" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "04 视觉治愈与转化" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "05 留白沉淀与隐私封存" })).toBeInTheDocument();
    expect(
      screen.getByText("前台体验始终低压力，后台独立守住安全红线。")
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Run the smoke test to verify it fails**

Run: `npm run test -- --run src/App.test.tsx`
Expected: FAIL because `src/App.tsx` does not yet render the required heading, buttons, and closing statement.

- [ ] **Step 5: Create the minimal renderable app shell**

```tsx
// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/tokens.css";
import "./styles/base.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

```tsx
// src/App.tsx
const labels = [
  "01 极速破冰",
  "02 隐性感知识别",
  "03 极致共情回应",
  "04 视觉治愈与转化",
  "05 留白沉淀与隐私封存"
];

export default function App() {
  return (
    <main className="app-shell">
      <header className="hero-shell">
        <p className="hero-kicker">Warm Room Demo</p>
        <h1>小情绪房间</h1>
        <p className="hero-subtitle">低摩擦情绪安置演示页</p>
      </header>

      <nav aria-label="五步流程" className="step-shell">
        {labels.map((label) => (
          <button key={label} className="step-button" type="button">
            {label}
          </button>
        ))}
      </nav>

      <footer className="closing-shell">前台体验始终低压力，后台独立守住安全红线。</footer>
    </main>
  );
}
```

```css
/* src/styles/tokens.css */
:root {
  --page-bg: linear-gradient(180deg, #f5f2fb 0%, #edf2fb 48%, #edf3ff 100%);
  --surface: rgba(255, 255, 255, 0.92);
  --surface-strong: #ffffff;
  --ink-strong: #2c2f5c;
  --ink-mid: #7b79a6;
  --brand: #5a52ea;
  --brand-strong: #453ec8;
  --border-soft: #ebe7fb;
  --radius-xl: 32px;
  --radius-lg: 24px;
  --radius-md: 18px;
  --shadow-soft: 0 18px 38px rgba(114, 104, 204, 0.1);
  --shell-width: 1440px;
}
```

```css
/* src/styles/base.css */
* {
  box-sizing: border-box;
}

html,
body,
#root {
  min-height: 100%;
}

body {
  margin: 0;
  font-family: "PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif;
  background: var(--page-bg);
  color: var(--ink-strong);
}

.app-shell {
  max-width: var(--shell-width);
  margin: 0 auto;
  min-height: 100vh;
  padding: 40px;
}

.hero-shell {
  margin-bottom: 24px;
}

.hero-kicker {
  margin: 0 0 8px;
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--brand-strong);
}

.hero-shell h1 {
  margin: 0;
  font-size: 48px;
  line-height: 1.08;
}

.hero-subtitle {
  margin: 12px 0 0;
  font-size: 18px;
  color: var(--ink-mid);
}

.step-shell {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.step-button,
.closing-shell {
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);
  background: var(--surface);
  box-shadow: var(--shadow-soft);
}

.step-button {
  min-height: 88px;
  font: inherit;
  color: var(--ink-strong);
}

.closing-shell {
  padding: 18px 24px;
  text-align: center;
  color: var(--brand-strong);
}
```

- [ ] **Step 6: Run the smoke test to verify it passes**

Run: `npm run test -- --run src/App.test.tsx`
Expected: PASS with 1 test passed.

- [ ] **Step 7: Commit the bootstrap shell**

```bash
git add package.json tsconfig.json tsconfig.node.json vite.config.ts vitest.setup.ts index.html src/main.tsx src/App.tsx src/styles/tokens.css src/styles/base.css src/App.test.tsx
git commit -m "feat: bootstrap emotion room presentation shell"
```

### Task 2: Add typed step data and the clickable five-step overview

**Files:**
- Create: `src/types.ts`
- Create: `src/data/steps.ts`
- Create: `src/components/FlowOverview.tsx`
- Create: `src/components/__tests__/FlowOverview.test.tsx`
- Modify: `src/App.tsx`
- Test: `src/components/__tests__/FlowOverview.test.tsx`

- [ ] **Step 1: Write the failing step-overview interaction test**

```tsx
// src/components/__tests__/FlowOverview.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FlowOverview } from "../FlowOverview";
import { presentationSteps } from "../../data/steps";

describe("FlowOverview", () => {
  it("renders five steps and reports the selected step", async () => {
    const user = userEvent.setup();
    const onStepChange = vi.fn();

    render(
      <FlowOverview
        steps={presentationSteps}
        activeStepId="step-03"
        onStepChange={onStepChange}
      />
    );

    expect(screen.getAllByRole("button")).toHaveLength(5);
    expect(screen.getByRole("button", { name: "03 极致共情回应" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    await user.click(screen.getByRole("button", { name: "05 留白沉淀与隐私封存" }));

    expect(onStepChange).toHaveBeenCalledWith("step-05");
  });
});
```

- [ ] **Step 2: Run the component test to verify it fails**

Run: `npm run test -- --run src/components/__tests__/FlowOverview.test.tsx`
Expected: FAIL because `FlowOverview`, `presentationSteps`, and the typed step ids do not exist yet.

- [ ] **Step 3: Create the step model, source data, and overview component**

```ts
// src/types.ts
export type StepId = "step-01" | "step-02" | "step-03" | "step-04" | "step-05";
export type SafetyLevel = "L0" | "L1" | "L2" | "L3";
export type VisualMood = "entry" | "mapping" | "compassion" | "warmth" | "quiet";

export interface PresentationStep {
  id: StepId;
  indexLabel: string;
  shortLabel: string;
  title: string;
  summary: string;
  sampleInput: string;
  sampleResponse: string;
  sceneKeywords: string[];
  narrative: string[];
  safetyLevel: SafetyLevel;
  visualMood: VisualMood;
}
```

```ts
// src/data/steps.ts
import type { PresentationStep, StepId } from "../types";

export const defaultStepId: StepId = "step-03";

export const presentationSteps: PresentationStep[] = [
  {
    id: "step-01",
    indexLabel: "01",
    shortLabel: "极速破冰",
    title: "极速破冰",
    summary: "不用先打很多字，先用低门槛动作碰一下自己的情绪。",
    sampleInput: "我现在有点闷。",
    sampleResponse: "先不用想清楚怎么说，我们只先找到你现在最接近的感受。",
    sceneKeywords: ["滑杆", "天气贴片", "轻触入口"],
    narrative: ["用户不必组织语言。", "交互像先伸手碰一下情绪。"],
    safetyLevel: "L0",
    visualMood: "entry"
  },
  {
    id: "step-02",
    indexLabel: "02",
    shortLabel: "隐性感知识别",
    title: "隐性感知识别",
    summary: "把模糊感受翻译成更细的情绪层次。",
    sampleInput: "像下雨天，闷闷的。",
    sampleResponse: "这不只是难过，也可能带着委屈、压抑和一点防备。",
    sceneKeywords: ["情绪命名", "细粒度", "从雾到词"],
    narrative: ["系统不只看开心或难过。", "重点是把情绪命名清楚。"],
    safetyLevel: "L1",
    visualMood: "mapping"
  },
  {
    id: "step-03",
    indexLabel: "03",
    shortLabel: "极致共情回应",
    title: "极致共情回应",
    summary: "先被理解，再往后走。",
    sampleInput: "我现在说不太清楚，但就是很难受。",
    sampleResponse: "天呐，你像是被困在暴雨里一样吧。先不用解释，我先在这里陪你一会。",
    sceneKeywords: ["被理解", "朋友语气", "先接住"],
    narrative: ["不分析，不说教。", "这是全页最强的承接时刻。"],
    safetyLevel: "L1",
    visualMood: "compassion"
  },
  {
    id: "step-04",
    indexLabel: "04",
    shortLabel: "视觉治愈与转化",
    title: "视觉治愈与转化",
    summary: "通过空间和光把情绪慢慢带离高压。",
    sampleInput: "我现在好像没有刚刚那么紧了。",
    sampleResponse: "我们不着急解决问题，先让这个房间陪你把情绪降下来。",
    sceneKeywords: ["雨夜窗边", "台灯暖光", "逐渐转暖"],
    narrative: ["不靠说理完成变化。", "靠视觉环境陪着情绪降温。"],
    safetyLevel: "L0",
    visualMood: "warmth"
  },
  {
    id: "step-05",
    indexLabel: "05",
    shortLabel: "留白沉淀与隐私封存",
    title: "留白沉淀与隐私封存",
    summary: "把这段情绪安全地放下，而不是突然断掉。",
    sampleInput: "我想先到这里。",
    sampleResponse: "好的，这段小情绪会被安静地放好，你什么时候回来都可以。",
    sceneKeywords: ["留白卡片", "柔和收束", "隐私保护"],
    narrative: ["结束不是中断。", "最后的感受是被安全地放下。"],
    safetyLevel: "L0",
    visualMood: "quiet"
  }
];
```

```tsx
// src/components/FlowOverview.tsx
import type { PresentationStep, StepId } from "../types";

interface FlowOverviewProps {
  steps: PresentationStep[];
  activeStepId: StepId;
  onStepChange: (stepId: StepId) => void;
}

export function FlowOverview({ steps, activeStepId, onStepChange }: FlowOverviewProps) {
  return (
    <nav aria-label="五步流程" className="flow-overview">
      {steps.map((step) => (
        <button
          key={step.id}
          type="button"
          className="flow-overview__button"
          data-active={step.id === activeStepId}
          aria-pressed={step.id === activeStepId}
          onClick={() => onStepChange(step.id)}
        >
          <span className="flow-overview__index">{step.indexLabel}</span>
          <span className="flow-overview__label">{step.indexLabel} {step.title}</span>
        </button>
      ))}
    </nav>
  );
}
```

```tsx
// src/App.tsx
import { useMemo, useState } from "react";
import { FlowOverview } from "./components/FlowOverview";
import { defaultStepId, presentationSteps } from "./data/steps";
import type { StepId } from "./types";

export default function App() {
  const [activeStepId, setActiveStepId] = useState<StepId>(defaultStepId);

  const activeStep = useMemo(
    () => presentationSteps.find((step) => step.id === activeStepId) ?? presentationSteps[0],
    [activeStepId]
  );

  return (
    <main className="app-shell">
      <header className="hero-shell">
        <p className="hero-kicker">Warm Room Demo</p>
        <h1>小情绪房间</h1>
        <p className="hero-subtitle">低摩擦情绪安置演示页</p>
      </header>

      <FlowOverview
        steps={presentationSteps}
        activeStepId={activeStep.id}
        onStepChange={setActiveStepId}
      />

      <footer className="closing-shell">前台体验始终低压力，后台独立守住安全红线。</footer>
    </main>
  );
}
```

- [ ] **Step 4: Run the overview test to verify it passes**

Run: `npm run test -- --run src/components/__tests__/FlowOverview.test.tsx`
Expected: PASS with the click handler receiving `step-05`.

- [ ] **Step 5: Commit the typed flow overview**

```bash
git add src/types.ts src/data/steps.ts src/components/FlowOverview.tsx src/components/__tests__/FlowOverview.test.tsx src/App.tsx
git commit -m "feat: add typed step overview navigation"
```

### Task 3: Build the presentation layout, right rail, and blank note frame

**Files:**
- Create: `src/components/PresentationHero.tsx`
- Create: `src/components/StageCanvas.tsx`
- Create: `src/components/StepNarrativeCard.tsx`
- Create: `src/components/SafetyRail.tsx`
- Create: `src/components/ClosingStatement.tsx`
- Create: `src/styles/presentation.css`
- Create: `src/App.stage.test.tsx`
- Modify: `src/main.tsx`
- Modify: `src/App.tsx`
- Test: `src/App.stage.test.tsx`

- [ ] **Step 1: Write the failing integration test for the page layout**

```tsx
// src/App.stage.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("presentation layout", () => {
  it("shows the blank note frame, safety rail, and current stage content", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByLabelText("汇报提示框")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "极致共情回应" })).toBeInTheDocument();
    expect(screen.getByText("L0 温和陪伴")).toBeInTheDocument();
    expect(screen.getByText("L3 紧急分流")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "04 视觉治愈与转化" }));

    expect(screen.getByRole("heading", { name: "视觉治愈与转化" })).toBeInTheDocument();
    expect(screen.getByText("通过空间和光把情绪慢慢带离高压。")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the integration test to verify it fails**

Run: `npm run test -- --run src/App.stage.test.tsx`
Expected: FAIL because the hero note frame, stage canvas, and safety rail components do not exist yet.

- [ ] **Step 3: Implement the shell components and compose the page**

```tsx
// src/components/PresentationHero.tsx
interface PresentationHeroProps {
  title: string;
  subtitle: string;
}

export function PresentationHero({ title, subtitle }: PresentationHeroProps) {
  return (
    <header className="presentation-hero">
      <div>
        <p className="presentation-hero__kicker">Warm Room Demo</p>
        <h1>{title}</h1>
        <p className="presentation-hero__subtitle">{subtitle}</p>
      </div>
      <div aria-label="汇报提示框" className="presentation-hero__note-frame" />
    </header>
  );
}
```

```tsx
// src/components/StageCanvas.tsx
import type { PresentationStep } from "../types";

interface StageCanvasProps {
  step: PresentationStep;
}

export function StageCanvas({ step }: StageCanvasProps) {
  return (
    <section className="stage-canvas" data-mood={step.visualMood}>
      <div className="stage-canvas__header">
        <div>
          <p className="stage-canvas__eyebrow">Current Stage</p>
          <h2>{step.title}</h2>
        </div>
        <span className="stage-canvas__pill">当前步骤</span>
      </div>

      <div className="stage-canvas__body">
        <div className="stage-canvas__scene" aria-hidden="true" />
        <div className="stage-canvas__copy">
          <p className="stage-canvas__summary">{step.summary}</p>
          <div className="stage-canvas__example">
            <strong>示例输入</strong>
            <p>{step.sampleInput}</p>
          </div>
          <div className="stage-canvas__example">
            <strong>示例回应</strong>
            <p>{step.sampleResponse}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
```

```tsx
// src/components/StepNarrativeCard.tsx
import type { PresentationStep } from "../types";

interface StepNarrativeCardProps {
  step: PresentationStep;
}

export function StepNarrativeCard({ step }: StepNarrativeCardProps) {
  return (
    <section className="narrative-card">
      <p className="narrative-card__eyebrow">当前步骤重点</p>
      <ul>
        {step.narrative.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
```

```tsx
// src/components/SafetyRail.tsx
import type { SafetyLevel } from "../types";

const levels: Array<{ id: SafetyLevel; label: string }> = [
  { id: "L0", label: "L0 温和陪伴" },
  { id: "L1", label: "L1 加强安抚" },
  { id: "L2", label: "L2 风险提示" },
  { id: "L3", label: "L3 紧急分流" }
];

interface SafetyRailProps {
  activeLevel: SafetyLevel;
}

export function SafetyRail({ activeLevel }: SafetyRailProps) {
  return (
    <aside className="safety-rail">
      <p className="safety-rail__eyebrow">Safety Rail</p>
      <ul>
        {levels.map((level) => (
          <li key={level.id} data-active={level.id === activeLevel}>
            {level.label}
          </li>
        ))}
      </ul>
    </aside>
  );
}
```

```tsx
// src/components/ClosingStatement.tsx
export function ClosingStatement() {
  return <footer className="closing-shell">前台体验始终低压力，后台独立守住安全红线。</footer>;
}
```

```css
/* src/styles/presentation.css */
.presentation-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 248px;
  gap: 24px;
  align-items: start;
  margin-bottom: 20px;
}

.presentation-hero__kicker,
.stage-canvas__eyebrow,
.narrative-card__eyebrow,
.safety-rail__eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.presentation-hero__subtitle {
  max-width: 680px;
  line-height: 1.7;
  color: var(--ink-mid);
}

.presentation-hero__note-frame {
  min-height: 118px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-soft);
  background: linear-gradient(180deg, #ffffff 0%, #f7f5ff 100%);
  box-shadow: var(--shadow-soft);
}

.flow-overview {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 18px;
}

.flow-overview__button {
  min-height: 92px;
  padding: 14px;
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);
  background: linear-gradient(180deg, #ffffff 0%, #f3f1fd 100%);
  color: var(--ink-strong);
  text-align: left;
  box-shadow: var(--shadow-soft);
}

.flow-overview__button[data-active="true"] {
  background: linear-gradient(180deg, #7365f2 0%, #5a52ea 100%);
  color: #ffffff;
}

.flow-overview__index,
.flow-overview__label {
  display: block;
}

.flow-overview__label {
  margin-top: 18px;
  font-weight: 700;
}

.presentation-grid {
  display: grid;
  grid-template-columns: 1.22fr 0.88fr;
  gap: 16px;
  align-items: stretch;
}

.stage-canvas {
  padding: 24px;
  border-radius: var(--radius-xl);
  color: #ffffff;
  background: linear-gradient(160deg, #7063ef 0%, #4347b8 52%, #242e73 100%);
  box-shadow: 0 28px 56px rgba(73, 76, 166, 0.26);
}

.stage-canvas__header,
.stage-canvas__body {
  display: grid;
  gap: 16px;
}

.stage-canvas__header {
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  margin-bottom: 20px;
}

.stage-canvas__pill {
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
}

.stage-canvas__body {
  grid-template-columns: 1.08fr 0.92fr;
}

.stage-canvas__scene {
  min-height: 220px;
  border-radius: 26px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.04));
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stage-canvas__copy,
.narrative-card,
.safety-rail {
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.92);
  color: var(--ink-strong);
  box-shadow: var(--shadow-soft);
}

.stage-canvas__copy {
  padding: 16px;
}

.stage-canvas__summary {
  margin-top: 0;
  color: var(--brand-strong);
  font-weight: 700;
}

.stage-canvas__example strong {
  display: block;
  margin-bottom: 6px;
  color: var(--ink-mid);
}

.sidebar-rail {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 16px;
}

.narrative-card,
.safety-rail {
  padding: 18px;
}

.safety-rail ul,
.narrative-card ul {
  margin: 0;
  padding-left: 20px;
}

.safety-rail li {
  margin-bottom: 10px;
}

.safety-rail li[data-active="true"] {
  color: var(--brand-strong);
  font-weight: 700;
}
```

```tsx
// src/App.tsx
import { useMemo, useState } from "react";
import { ClosingStatement } from "./components/ClosingStatement";
import { FlowOverview } from "./components/FlowOverview";
import { PresentationHero } from "./components/PresentationHero";
import { SafetyRail } from "./components/SafetyRail";
import { StageCanvas } from "./components/StageCanvas";
import { StepNarrativeCard } from "./components/StepNarrativeCard";
import { defaultStepId, presentationSteps } from "./data/steps";
import type { StepId } from "./types";

export default function App() {
  const [activeStepId, setActiveStepId] = useState<StepId>(defaultStepId);

  const activeStep = useMemo(
    () => presentationSteps.find((step) => step.id === activeStepId) ?? presentationSteps[0],
    [activeStepId]
  );

  return (
    <main className="app-shell">
      <PresentationHero
        title="小情绪房间"
        subtitle="保留原 App 的亲和感，再把列表分发感转成情绪接触的空间舞台。"
      />

      <FlowOverview
        steps={presentationSteps}
        activeStepId={activeStep.id}
        onStepChange={setActiveStepId}
      />

      <section className="presentation-grid">
        <StageCanvas step={activeStep} />
        <div className="sidebar-rail">
          <StepNarrativeCard step={activeStep} />
          <SafetyRail activeLevel={activeStep.safetyLevel} />
        </div>
      </section>

      <ClosingStatement />
    </main>
  );
}
```

```tsx
// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/presentation.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 4: Run the integration test to verify it passes**

Run: `npm run test -- --run src/App.stage.test.tsx`
Expected: PASS with the current stage updating when step `04` is clicked.

- [ ] **Step 5: Commit the main presentation layout**

```bash
git add src/components/PresentationHero.tsx src/components/StageCanvas.tsx src/components/StepNarrativeCard.tsx src/components/SafetyRail.tsx src/components/ClosingStatement.tsx src/styles/presentation.css src/App.stage.test.tsx src/main.tsx src/App.tsx
git commit -m "feat: add presentation stage layout and safety rail"
```

### Task 4: Add mood-aware stage details, keyword chips, and responsive polish

**Files:**
- Create: `src/App.mood.test.tsx`
- Modify: `src/components/StageCanvas.tsx`
- Modify: `src/styles/presentation.css`
- Modify: `src/styles/base.css`
- Test: `src/App.mood.test.tsx`

- [ ] **Step 1: Write the failing mood-switching test**

```tsx
// src/App.mood.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("stage mood switching", () => {
  it("switches the mood data attribute and keyword chips with the active step", async () => {
    const user = userEvent.setup();
    render(<App />);

    const stage = screen.getByTestId("stage-canvas");
    expect(stage).toHaveAttribute("data-mood", "compassion");
    expect(screen.getByText("被理解")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "04 视觉治愈与转化" }));

    expect(stage).toHaveAttribute("data-mood", "warmth");
    expect(screen.getByText("台灯暖光")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the mood test to verify it fails**

Run: `npm run test -- --run src/App.mood.test.tsx`
Expected: FAIL because `StageCanvas` does not yet expose a test id, mood-aware scene class, or scene keyword chips.

- [ ] **Step 3: Implement mood-specific visuals, keyword chips, and responsive rules**

```tsx
// src/components/StageCanvas.tsx
import type { PresentationStep } from "../types";

interface StageCanvasProps {
  step: PresentationStep;
}

export function StageCanvas({ step }: StageCanvasProps) {
  return (
    <section className="stage-canvas" data-mood={step.visualMood} data-testid="stage-canvas">
      <div className="stage-canvas__header">
        <div>
          <p className="stage-canvas__eyebrow">Current Stage</p>
          <h2>{step.title}</h2>
        </div>
        <span className="stage-canvas__pill">当前步骤</span>
      </div>

      <div className="stage-canvas__body">
        <div className="stage-canvas__scene" aria-hidden="true">
          <div className="stage-canvas__scene-glow" />
          <div className="stage-canvas__scene-figure" />
        </div>

        <div className="stage-canvas__copy">
          <p className="stage-canvas__summary">{step.summary}</p>

          <div className="stage-canvas__keywords">
            {step.sceneKeywords.map((keyword) => (
              <span key={keyword} className="stage-canvas__chip">
                {keyword}
              </span>
            ))}
          </div>

          <div className="stage-canvas__example">
            <strong>示例输入</strong>
            <p>{step.sampleInput}</p>
          </div>
          <div className="stage-canvas__example">
            <strong>示例回应</strong>
            <p>{step.sampleResponse}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
```

```css
/* src/styles/presentation.css additions */
.stage-canvas {
  transition: background 220ms ease, box-shadow 220ms ease, transform 220ms ease;
}

.stage-canvas[data-mood="entry"] {
  background: linear-gradient(160deg, #8479f6 0%, #645de0 48%, #373e92 100%);
}

.stage-canvas[data-mood="mapping"] {
  background: linear-gradient(160deg, #6f79ef 0%, #5566d2 48%, #2f448f 100%);
}

.stage-canvas[data-mood="compassion"] {
  background: linear-gradient(160deg, #7063ef 0%, #4347b8 52%, #242e73 100%);
}

.stage-canvas[data-mood="warmth"] {
  background: linear-gradient(160deg, #7d76f0 0%, #5664ce 42%, #3c4b8d 100%);
}

.stage-canvas[data-mood="quiet"] {
  background: linear-gradient(160deg, #6e69d4 0%, #5057b1 48%, #2c346d 100%);
}

.stage-canvas__scene {
  position: relative;
  overflow: hidden;
}

.stage-canvas__scene-glow {
  position: absolute;
  right: 10%;
  bottom: 16%;
  width: 24%;
  aspect-ratio: 1;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(255, 213, 161, 0.95) 0%, rgba(255, 213, 161, 0) 70%);
  filter: blur(8px);
}

.stage-canvas__scene-figure {
  position: absolute;
  left: 22%;
  bottom: 20%;
  width: 16%;
  height: 28%;
  border-radius: 48% 48% 32% 32%;
  background: rgba(142, 164, 255, 0.88);
}

.stage-canvas__keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.stage-canvas__chip {
  padding: 7px 11px;
  border-radius: 999px;
  background: #f2efff;
  color: var(--brand-strong);
  font-size: 12px;
}

@media (max-width: 1280px) {
  .app-shell {
    padding: 24px;
  }

  .presentation-hero,
  .presentation-grid,
  .stage-canvas__body {
    grid-template-columns: 1fr;
  }

  .flow-overview {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (prefers-reduced-motion: reduce) {
  .stage-canvas {
    transition: none;
  }
}
```

```css
/* src/styles/base.css additions */
.closing-shell {
  margin-top: 18px;
}
```

- [ ] **Step 4: Run the mood test, smoke test, and build**

Run: `npm run test -- --run src/App.test.tsx src/components/__tests__/FlowOverview.test.tsx src/App.stage.test.tsx src/App.mood.test.tsx && npm run build`
Expected: all Vitest suites PASS and Vite build completes with a generated `dist/` bundle.

- [ ] **Step 5: Commit the mood polish**

```bash
git add src/App.mood.test.tsx src/components/StageCanvas.tsx src/styles/presentation.css src/styles/base.css
git commit -m "feat: add mood-aware stage polish"
```

### Task 5: Final browser QA against the spec and handoff notes

**Files:**
- Modify: `docs/superpowers/specs/2026-05-24-emotion-room-presentation-design.md` (only if implementation reality exposes a spec mismatch)
- Modify: `docs/superpowers/plans/2026-05-24-emotion-room-presentation.md` (check off completed steps during execution)
- Test: local browser at `http://localhost:5173`

- [ ] **Step 1: Start the local dev server**

Run: `npm run dev -- --host 127.0.0.1`
Expected: Vite prints a local URL such as `http://127.0.0.1:5173/`.

- [ ] **Step 2: Manually verify the presentation flow in browser**

Check these exact behaviors:

- Default landing step is `03 极致共情回应`
- The empty note frame stays blank and visible in the hero
- Clicking each step updates the main stage title, summary, keywords, and sample response
- The page still reads clearly at large-screen width
- The overall look feels like the original app’s color family, but with a stronger immersive stage

Expected: All five checks succeed without layout collapse or unreadable text.

- [ ] **Step 3: If implementation diverges from the approved spec, update the spec immediately**

```md
## Change Log

- Set the default landing step to `03 极致共情回应` so the presentation opens on the emotional peak.
- Keep the note frame blank by default; do not introduce helper copy in the shipped layout.
```

Only do this step if reality diverges from the approved spec; otherwise skip it and leave the spec untouched.

- [ ] **Step 4: Commit the verified implementation**

```bash
git add .
git commit -m "feat: deliver emotion room presentation demo"
```
