# First Open Page 01 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the root presentation page with a dedicated first-open interaction page that only supports the initial weather-plus-tag emotional check-in.

**Architecture:** Keep the existing annotation route and five-step presentation components intact. Build a new first-open page component plus a small scene data module, switch `App` to render that page at the root route, and add focused CSS for the new interaction. Update tests to describe the new root behavior and verify the selection flow.

**Tech Stack:** React 18, TypeScript, Vite, CSS, Vitest, Testing Library

---

## File Structure

- `docs/superpowers/plans/2026-05-24-first-open-page-01.md`
  - Implementation plan for the first-open page change.
- `src/App.tsx`
  - Root route entry; should render the dedicated first-open page instead of the five-step presentation shell.
- `src/pages/FirstOpenPage.tsx`
  - New first-open scene page with weather selection, tag selection, and continue button state.
- `src/data/firstOpenScene.ts`
  - Typed weather and tag content for the first-open page.
- `src/styles/first-open.css`
  - Page-specific layout and interaction styles for the first-open scene.
- `src/main.tsx`
  - Import the new first-open stylesheet.
- `src/App.test.tsx`
  - Initial render test for the first-open page.
- `src/App.mood.test.tsx`
  - Interaction test for switching weather and resetting tag choices.
- `src/App.stage.test.tsx`
  - Interaction test for enabling the continue button after valid selection.
- `src/AppRouter.test.tsx`
  - Route test asserting the root route now serves the first-open page.

### Task 1: Rewrite root-page tests to the new first-open interaction

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/App.mood.test.tsx`
- Modify: `src/App.stage.test.tsx`
- Modify: `src/AppRouter.test.tsx`

- [ ] **Step 1: Replace the smoke test with first-open expectations**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the first-open check-in page with weather options and a disabled continue button", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "小情绪房间" })).toBeInTheDocument();
    expect(screen.getByText("不用先解释，先选一个最像你的天气。")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "大暴雨" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "起大雾" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "阴天乌云" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "大雪深夜" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "继续" })).toBeDisabled();
  });
});
```

- [ ] **Step 2: Replace the mood-switching test with weather-switching behavior**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("first-open weather switching", () => {
  it("shows tags for the selected weather and resets the chosen tag when weather changes", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "大暴雨" }));

    await user.click(screen.getByRole("button", { name: "烦死了" }));
    expect(screen.getByRole("button", { name: "烦死了" })).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "起大雾" }));

    expect(screen.getByRole("button", { name: "好焦虑" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "烦死了" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "继续" })).toBeDisabled();
  });
});
```

- [ ] **Step 3: Replace the stage test with selection-completion behavior**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("first-open completion", () => {
  it("enables the continue button after one weather and one tag are chosen", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "阴天乌云" }));
    await user.click(screen.getByRole("button", { name: "心累" }));

    expect(screen.getByRole("button", { name: "继续" })).toBeEnabled();
    expect(screen.getByText("已选择：阴天乌云 / 心累")).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Update the route test for the new root behavior**

```tsx
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import AppRouter from "./AppRouter";

afterEach(() => {
  window.location.hash = "";
});

describe("AppRouter", () => {
  it("serves the first-open page at the root route", () => {
    window.location.hash = "";

    render(<AppRouter />);

    expect(screen.getByText("不用先解释，先选一个最像你的天气。")).toBeInTheDocument();
  });

  it("renders the cloned annotation PRD page on the dedicated route", () => {
    window.location.hash = "#/annotation-prd";

    render(<AppRouter />);

    expect(screen.getByRole("heading", { name: "标注 PRD 克隆页" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 5: Run the targeted tests and verify they fail**

Run: `rtk npm run test -- --run src/App.test.tsx src/App.mood.test.tsx src/App.stage.test.tsx src/AppRouter.test.tsx`
Expected: FAIL because the current root page still renders the five-step presentation shell.

### Task 2: Implement the dedicated first-open page

**Files:**
- Create: `src/data/firstOpenScene.ts`
- Create: `src/pages/FirstOpenPage.tsx`
- Create: `src/styles/first-open.css`
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`

- [ ] **Step 1: Create typed scene data for weather and tag options**

```ts
export interface FirstOpenWeatherOption {
  id: "storm" | "fog" | "cloud" | "snow";
  label: string;
  hint: string;
  tags: string[];
}

export const firstOpenWeatherOptions: FirstOpenWeatherOption[] = [
  {
    id: "storm",
    label: "大暴雨",
    hint: "像是一下子压过来的烦和乱。",
    tags: ["烦死了", "真的会谢", "心态崩了", "太难了"]
  },
  {
    id: "fog",
    label: "起大雾",
    hint: "像是看不清、提不起劲、也不想被催。",
    tags: ["好焦虑", "尽力了", "没动力", "让我呆一会"]
  },
  {
    id: "cloud",
    label: "阴天乌云",
    hint: "像是胸口闷着一层话，说出来也嫌累。",
    tags: ["无语", "心累", "不想说话", "别管我"]
  },
  {
    id: "snow",
    label: "大雪深夜",
    hint: "像是整个人慢下来，只想躲进安静里。",
    tags: ["彻底累了", "一片空白", "难受", "想躲起来"]
  }
];
```

- [ ] **Step 2: Implement the first-open page component**

```tsx
import { useMemo, useState } from "react";
import { firstOpenWeatherOptions } from "../data/firstOpenScene";

export function FirstOpenPage() {
  const [selectedWeatherId, setSelectedWeatherId] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const selectedWeather = useMemo(
    () => firstOpenWeatherOptions.find((option) => option.id === selectedWeatherId) ?? null,
    [selectedWeatherId]
  );

  const visibleTags = selectedWeather?.tags ?? [];
  const canContinue = Boolean(selectedWeather && selectedTag);

  const handleWeatherSelect = (weatherId: string) => {
    setSelectedWeatherId(weatherId);
    setSelectedTag(null);
  };

  return (
    <main className="app-shell first-open-shell">
      <section className="first-open-hero">
        <div>
          <p className="hero-kicker">First Open Check-in</p>
          <h1>小情绪房间</h1>
          <p className="hero-subtitle">不用先解释，先选一个最像你的天气。</p>
        </div>
        <p className="first-open-hero__support">
          再点一个最像你现在会说出口的词，我们就能从这里开始。
        </p>
      </section>

      <section className="first-open-layout">
        <section className="first-open-stage">
          <img className="first-open-stage__image" src="/emotion-scenes/1.png" alt="首开情绪汇报场景图" />
          <div className="first-open-stage__overlay">
            <span className="first-open-stage__badge">首开场景</span>
            <p className="first-open-stage__line">你来就好，先不用把话一次说完整。</p>
            <p className="first-open-stage__hint">
              {selectedWeather ? `现在像是 ${selectedWeather.label}：${selectedWeather.hint}` : "先选一个天气，我们从最接近你的感觉开始。"}
            </p>
          </div>
        </section>

        <aside className="first-open-card">
          <div className="first-open-card__section">
            <p className="first-open-card__eyebrow">Step 01</p>
            <h2>先用天气碰一下现在的自己</h2>
            <p className="first-open-card__copy">
              先选 1 个天气，再选 1 个词。这里不是问卷，也不用想得很完整。
            </p>
          </div>

          <div className="first-open-card__section">
            <p className="first-open-card__label">天气</p>
            <div className="first-open-card__weather-grid">
              {firstOpenWeatherOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className="first-open-card__choice"
                  data-active={option.id === selectedWeatherId}
                  aria-pressed={option.id === selectedWeatherId}
                  onClick={() => handleWeatherSelect(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="first-open-card__section">
            <p className="first-open-card__label">现在最像哪一句</p>
            {selectedWeather ? (
              <div className="first-open-card__tag-grid">
                {visibleTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="first-open-card__choice first-open-card__choice--tag"
                    data-active={tag === selectedTag}
                    aria-pressed={tag === selectedTag}
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            ) : (
              <p className="first-open-card__placeholder">先选一个天气，再看最贴近你的词。</p>
            )}
          </div>

          <div className="first-open-card__footer">
            <p className="first-open-card__selection">
              {selectedWeather && selectedTag ? `已选择：${selectedWeather.label} / ${selectedTag}` : "完成 1 个天气和 1 个词之后，就可以继续。"}
            </p>
            <button type="button" className="first-open-card__continue" disabled={!canContinue}>
              继续
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}
```

- [ ] **Step 3: Add the first-open stylesheet**

Add styles for `.first-open-shell`, `.first-open-layout`, `.first-open-stage`, `.first-open-card`, the weather grid, the tag grid, active states, disabled button states, and a responsive single-column layout below `1100px`.

- [ ] **Step 4: Switch the root app to the new page and load its styles**

```tsx
import { FirstOpenPage } from "./pages/FirstOpenPage";

export default function App() {
  return <FirstOpenPage />;
}
```

```tsx
import "./styles/first-open.css";
```

- [ ] **Step 5: Run the targeted tests and verify they pass**

Run: `rtk npm run test -- --run src/App.test.tsx src/App.mood.test.tsx src/App.stage.test.tsx src/AppRouter.test.tsx`
Expected: PASS

### Task 3: Verify the page in the browser and confirm the focused scope

**Files:**
- Verify: `http://127.0.0.1:5173/`

- [ ] **Step 1: Run the full test suite**

Run: `rtk npm run test -- --run`
Expected: PASS

- [ ] **Step 2: Open the local page and confirm the new first-open flow**

Check that:

- The root page no longer shows the five-step overview.
- The page shows one large scene image and one control card.
- The continue button is disabled before selection.
- Selecting a weather swaps in four matching tags.
- Selecting one tag enables the continue button.

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx src/main.tsx src/data/firstOpenScene.ts src/pages/FirstOpenPage.tsx src/styles/first-open.css src/App.test.tsx src/App.mood.test.tsx src/App.stage.test.tsx src/AppRouter.test.tsx docs/superpowers/plans/2026-05-24-first-open-page-01.md
git commit -m "feat: focus root flow on first open check-in"
```
