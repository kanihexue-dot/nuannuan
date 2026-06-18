# Obsidian Theme Workspace Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Initialize the external Obsidian vault, ingest Markdown and YouTube sources into a structured intake pipeline, and support a user-confirmed promotion flow into theme and card notes.

**Architecture:** Keep the implementation in small Node ESM utilities under `scripts/obsidian-workspace/` so the existing React app stays untouched. Export pure filesystem and note-rendering helpers from `vault.mjs`, cover them with Vitest against temporary directories, and expose only three CLI entry points: initialize the vault, ingest a source, and confirm approved candidates from a source note.

**Tech Stack:** Node.js ESM, existing npm scripts, existing Vitest test runner, built-in `fs/promises`, built-in `path`, built-in `url`

---

## File Structure

- `package.json`
  - Add CLI scripts for vault initialization, source ingestion, and source confirmation.
- `scripts/obsidian-workspace/config.mjs`
  - Central vault path, directory names, system file names, and supported source kinds.
- `scripts/obsidian-workspace/helpers.mjs`
  - Shared filesystem helpers, Markdown parsing helpers, candidate extraction heuristics, and section-update utilities.
- `scripts/obsidian-workspace/vault.mjs`
  - Main exported functions for `initializeVault`, `ingestMarkdownSource`, `ingestYouTubeSource`, and `confirmSourceNote`.
- `scripts/obsidian-workspace/init-vault.mjs`
  - CLI wrapper for initializing the external vault.
- `scripts/obsidian-workspace/ingest-source.mjs`
  - CLI wrapper for ingesting either a Markdown file or a YouTube URL.
- `scripts/obsidian-workspace/confirm-source-note.mjs`
  - CLI wrapper that reads approved checkboxes from a source note and creates or updates theme/card notes.
- `scripts/obsidian-workspace/__tests__/initialize-vault.test.mjs`
  - Verifies directory bootstrap and system note creation against a temporary vault.
- `scripts/obsidian-workspace/__tests__/ingest-source.test.mjs`
  - Verifies Markdown and YouTube intake behavior.
- `scripts/obsidian-workspace/__tests__/confirm-source-note.test.mjs`
  - Verifies checked candidates become durable theme and card notes plus log updates.

## Assumptions

- The external vault path `/Volumes/dockcase/kani‘s vibe coding world` remains writable.
- Phase 1 intentionally covers manual intake only; project scan automation from `_项目扫描清单.md` stays for a later phase.
- Existing Vitest configuration can run Node ESM tests that use the filesystem.
- The first pass uses deterministic heuristics for candidate themes and cards rather than any model-backed summarization.

### Task 1: Bootstrap the vault utility layer and prove vault initialization fails before it exists

**Files:**
- Modify: `package.json`
- Create: `scripts/obsidian-workspace/config.mjs`
- Create: `scripts/obsidian-workspace/helpers.mjs`
- Create: `scripts/obsidian-workspace/__tests__/initialize-vault.test.mjs`

- [ ] **Step 1: Add package scripts for the Obsidian workspace tools**

```json
{
  "name": "emotion-room-presentation",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "test": "vitest",
    "test:run": "vitest run",
    "obsidian:init": "node scripts/obsidian-workspace/init-vault.mjs",
    "obsidian:ingest": "node scripts/obsidian-workspace/ingest-source.mjs",
    "obsidian:confirm": "node scripts/obsidian-workspace/confirm-source-note.mjs"
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

- [ ] **Step 2: Create the shared configuration file**

```js
// scripts/obsidian-workspace/config.mjs
export const DEFAULT_VAULT_ROOT = "/Volumes/dockcase/kani‘s vibe coding world";

export const VAULT_DIRS = [
  "00_收件箱/md",
  "00_收件箱/youtube",
  "00_收件箱/pdf",
  "10_来源笔记/md",
  "10_来源笔记/youtube",
  "10_来源笔记/pdf",
  "20_主题工作台",
  "21_主题卡片",
  "30_项目视图",
  "31_课程视图",
  "40_输出",
  "90_系统"
];

export const SYSTEM_FILE_CONTENT = {
  "90_系统/_index.md": "# 知识库导航\n\n- [[_主题总表]]\n- [[_项目扫描清单]]\n- [[_收件规则]]\n- [[_log]]\n",
  "90_系统/_log.md": "# 操作日志\n",
  "90_系统/_主题总表.md": "# 主题总表\n\n## 当前主题\n",
  "90_系统/_项目扫描清单.md": "# 项目扫描清单\n\n## 启用中的项目\n\n- 暂无\n",
  "90_系统/_收件规则.md": "# 收件规则\n\n- Markdown 进入 `00_收件箱/md`\n- YouTube 链接进入 `00_收件箱/youtube`\n- PDF 进入 `00_收件箱/pdf`\n- `node_modules`、`.git`、`.venv`、`dist` 等目录不进入自动化流程\n"
};

export const SOURCE_KIND_DIR = {
  md: "md",
  youtube: "youtube",
  pdf: "pdf"
};

export function getVaultRoot(override) {
  return override || process.env.OBSIDIAN_VAULT_ROOT || DEFAULT_VAULT_ROOT;
}
```

- [ ] **Step 3: Create the shared helper file**

```js
// scripts/obsidian-workspace/helpers.mjs
import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";

export async function ensureDir(dirPath) {
  await mkdir(dirPath, { recursive: true });
}

export async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function writeFileIfMissing(filePath, content) {
  if (await fileExists(filePath)) {
    return false;
  }

  await ensureDir(path.dirname(filePath));
  await writeFile(filePath, content, "utf8");
  return true;
}

export function safeFileStem(value) {
  return (value || "未命名")
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

export function isoDate(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

export function isoDateTime(now = new Date()) {
  return now.toISOString().slice(0, 16).replace("T", " ");
}

export function stripFrontmatter(text) {
  return text.replace(/^---\n[\s\S]*?\n---\n?/, "");
}

export function extractTitle(text, fallback = "未命名") {
  const frontmatterTitleMatch = text.match(/^title:\s*(.+)$/m);
  if (frontmatterTitleMatch) {
    return frontmatterTitleMatch[1].trim().replace(/^["']|["']$/g, "");
  }

  const headingMatch = stripFrontmatter(text).match(/^#\s+(.+)$/m);
  if (headingMatch) {
    return headingMatch[1].trim();
  }

  return fallback;
}

export function summarizeMarkdown(text, limit = 5) {
  const body = stripFrontmatter(text);
  const listItems = [...body.matchAll(/^\s*[-*]\s+(.+)$/gm)].map((match) => match[1].trim());
  if (listItems.length > 0) {
    return listItems.slice(0, limit);
  }

  const paragraphs = body
    .split(/\n\s*\n/)
    .map((entry) => entry.trim())
    .filter((entry) => entry && !entry.startsWith("#"));

  return paragraphs.slice(0, limit).map((paragraph) => paragraph.replace(/\s+/g, " "));
}

export function detectThemes(text) {
  const body = stripFrontmatter(text);
  const themes = [];
  const keywordMap = [
    [/JTBD/i, "JTBD"],
    [/(tiny core|AI 产品|AI时代产品判断|产品判断)/i, "AI产品判断"],
    [/(Agent|skill|工具设计原则)/i, "Agent设计原则"],
    [/(竞品|横向对比|拆解)/i, "竞品分析"],
    [/(eval|评测|验证策略)/i, "产品评测"]
  ];

  for (const [pattern, theme] of keywordMap) {
    if (pattern.test(body) && !themes.includes(theme)) {
      themes.push(theme);
    }
  }

  const headingThemes = [...body.matchAll(/^##\s+(.+)$/gm)]
    .map((match) => match[1].trim())
    .filter((line) => line.length >= 2 && line.length <= 18)
    .slice(0, 3);

  for (const heading of headingThemes) {
    if (!themes.includes(heading)) {
      themes.push(heading);
    }
  }

  return themes.slice(0, 5);
}

export function detectCards(text) {
  const body = stripFrontmatter(text);
  const cards = [];
  const patterns = [
    /AI 产品不是“普通功能 \+ AI 按钮”/g,
    /tiny core 是什么？/g,
    /95% 自动化不等于真正自动化/g,
    /让模型反思自己的错误/g
  ];

  for (const pattern of patterns) {
    const match = body.match(pattern);
    if (match) {
      cards.push(match[0]);
    }
  }

  const bulletSentences = [...body.matchAll(/^\s*[-*]\s+(.{8,40})$/gm)]
    .map((match) => match[1].trim())
    .filter((line) => /(不是|更重要|不等于|应该|先)/.test(line));

  for (const line of bulletSentences) {
    if (!cards.includes(line)) {
      cards.push(line);
    }
  }

  return cards.slice(0, 5);
}

export function appendUniqueBullet(text, heading, bulletText) {
  const sectionPattern = new RegExp(`(## ${escapeRegExp(heading)}\\n)([\\s\\S]*?)(?=\\n## |$)`);
  const bulletLine = `- ${bulletText}`;

  if (sectionPattern.test(text)) {
    return text.replace(sectionPattern, (full, start, body) => {
      if (body.includes(bulletLine)) {
        return full;
      }

      const normalizedBody = body.trimEnd();
      return `${start}${normalizedBody}\n${bulletLine}\n`;
    });
  }

  return `${text.trimEnd()}\n\n## ${heading}\n${bulletLine}\n`;
}

export function parseApprovedCheckboxes(text, heading) {
  const sectionPattern = new RegExp(`## ${escapeRegExp(heading)}\\n([\\s\\S]*?)(?=\\n## |$)`);
  const match = text.match(sectionPattern);
  if (!match) {
    return [];
  }

  return [...match[1].matchAll(/^- \[x\] (.+)$/gim)].map((entry) => entry[1].trim());
}

export function replaceStatus(text, nextStatus) {
  return text.replace(/status:\s*.+$/m, `status: ${nextStatus}`);
}

export async function readUtf8(filePath) {
  return readFile(filePath, "utf8");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
```

- [ ] **Step 4: Write the failing vault-initialization test**

```js
// scripts/obsidian-workspace/__tests__/initialize-vault.test.mjs
import os from "node:os";
import path from "node:path";
import { mkdtemp, readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { initializeVault } from "../vault.mjs";

describe("initializeVault", () => {
  it("creates the vault directories and system notes", async () => {
    const vaultRoot = await mkdtemp(path.join(os.tmpdir(), "obsidian-vault-"));

    const result = await initializeVault(vaultRoot);

    expect(result.vaultRoot).toBe(vaultRoot);
    expect(result.createdDirectories).toContain("00_收件箱/md");
    expect(result.createdDirectories).toContain("21_主题卡片");

    const indexNote = await readFile(path.join(vaultRoot, "90_系统/_index.md"), "utf8");
    const logNote = await readFile(path.join(vaultRoot, "90_系统/_log.md"), "utf8");
    const rulesNote = await readFile(path.join(vaultRoot, "90_系统/_收件规则.md"), "utf8");

    expect(indexNote).toContain("[[_主题总表]]");
    expect(logNote).toContain("# 操作日志");
    expect(rulesNote).toContain("Markdown 进入 `00_收件箱/md`");
  });
});
```

- [ ] **Step 5: Run the test to verify it fails**

Run: `npm run test:run -- scripts/obsidian-workspace/__tests__/initialize-vault.test.mjs`
Expected: FAIL with an import error because `scripts/obsidian-workspace/vault.mjs` does not exist yet.

- [ ] **Step 6: Commit the scaffolding and failing test**

```bash
git add package.json scripts/obsidian-workspace/config.mjs scripts/obsidian-workspace/helpers.mjs scripts/obsidian-workspace/__tests__/initialize-vault.test.mjs
git commit -m "test: add obsidian vault bootstrap coverage"
```

### Task 2: Implement vault initialization and make the bootstrap test pass

**Files:**
- Create: `scripts/obsidian-workspace/vault.mjs`
- Create: `scripts/obsidian-workspace/init-vault.mjs`
- Test: `scripts/obsidian-workspace/__tests__/initialize-vault.test.mjs`

- [ ] **Step 1: Create the main vault module with initialization support**

```js
// scripts/obsidian-workspace/vault.mjs
import path from "node:path";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { DEFAULT_VAULT_ROOT, SYSTEM_FILE_CONTENT, VAULT_DIRS, SOURCE_KIND_DIR, getVaultRoot } from "./config.mjs";
import {
  appendUniqueBullet,
  detectCards,
  detectThemes,
  ensureDir,
  extractTitle,
  fileExists,
  isoDate,
  isoDateTime,
  parseApprovedCheckboxes,
  readUtf8,
  replaceStatus,
  safeFileStem,
  summarizeMarkdown,
  writeFileIfMissing
} from "./helpers.mjs";

export async function initializeVault(vaultRoot = DEFAULT_VAULT_ROOT) {
  const createdDirectories = [];
  const createdFiles = [];

  for (const relativeDir of VAULT_DIRS) {
    await ensureDir(path.join(vaultRoot, relativeDir));
    createdDirectories.push(relativeDir);
  }

  for (const [relativePath, content] of Object.entries(SYSTEM_FILE_CONTENT)) {
    const wasCreated = await writeFileIfMissing(path.join(vaultRoot, relativePath), content);
    if (wasCreated) {
      createdFiles.push(relativePath);
    }
  }

  return { vaultRoot, createdDirectories, createdFiles };
}

export async function ingestMarkdownSource({ vaultRoot = getVaultRoot(), inputPath }) {
  const sourceText = await readUtf8(inputPath);
  const sourceTitle = extractTitle(sourceText, path.basename(inputPath, path.extname(inputPath)));
  const safeTitle = safeFileStem(sourceTitle);
  const inboxPath = path.join(vaultRoot, "00_收件箱", SOURCE_KIND_DIR.md, `${safeTitle}.md`);
  const sourceNotePath = path.join(vaultRoot, "10_来源笔记", SOURCE_KIND_DIR.md, `来源 - ${safeTitle}.md`);

  await ensureDir(path.dirname(inboxPath));
  await writeFile(inboxPath, sourceText, "utf8");
  await writeFile(sourceNotePath, renderMarkdownSourceNote({ inputPath, sourceTitle, sourceText }), "utf8");

  return { sourceNotePath, inboxPath };
}

export async function ingestYouTubeSource({ vaultRoot = getVaultRoot(), url, title }) {
  const safeTitle = safeFileStem(title);
  const inboxPath = path.join(vaultRoot, "00_收件箱", SOURCE_KIND_DIR.youtube, `${safeTitle}.md`);
  const sourceNotePath = path.join(vaultRoot, "10_来源笔记", SOURCE_KIND_DIR.youtube, `来源 - ${safeTitle}.md`);
  const inboxText = `# ${safeTitle}\n\n- 链接：${url}\n- 类型：YouTube\n`;

  await ensureDir(path.dirname(inboxPath));
  await writeFile(inboxPath, inboxText, "utf8");
  await writeFile(sourceNotePath, renderYouTubeSourceNote({ title: safeTitle, url }), "utf8");

  return { sourceNotePath, inboxPath };
}

export async function confirmSourceNote({ vaultRoot = getVaultRoot(), sourceNotePath }) {
  const sourceNoteText = await readUtf8(sourceNotePath);
  const sourceTitle = extractTitle(sourceNoteText, path.basename(sourceNotePath, ".md")).replace(/^来源 - /, "");
  const approvedThemes = parseApprovedCheckboxes(sourceNoteText, "候选主题");
  const approvedCards = parseApprovedCheckboxes(sourceNoteText, "候选卡片");

  for (const theme of approvedThemes) {
    await upsertThemeNote({ vaultRoot, theme, sourceTitle, approvedCards });
  }

  for (const entry of approvedCards) {
    await upsertCardNote({ vaultRoot, entry, sourceTitle, approvedThemes });
  }

  const updatedSourceNote = replaceStatus(sourceNoteText, "已提炼");
  await writeFile(sourceNotePath, updatedSourceNote, "utf8");

  const logPath = path.join(vaultRoot, "90_系统/_log.md");
  const existingLog = await readUtf8(logPath);
  const logEntry = `\n## [${isoDateTime()}] confirm | ${sourceTitle}\n- 主题：${approvedThemes.join("、") || "无"}\n- 卡片：${approvedCards.map((entry) => entry.split("｜")[0]).join("、") || "无"}\n`;
  await writeFile(logPath, `${existingLog.trimEnd()}\n${logEntry}`, "utf8");

  return { approvedThemes, approvedCards };
}

function renderMarkdownSourceNote({ inputPath, sourceTitle, sourceText }) {
  const summaryLines = summarizeMarkdown(sourceText);
  const themes = detectThemes(sourceText);
  const cards = detectCards(sourceText);

  return `---\ntype: source\nsource_kind: md\nsource_path: ${inputPath}\nsource_url:\nthemes:\n${themes.map((theme) => `  - ${theme}`).join("\n") || "  - 未分类"}\nstatus: 待提炼\ncreated: ${isoDate()}\nupdated: ${isoDate()}\n---\n\n# 来源 - ${sourceTitle}\n\n## 内容摘要\n${summaryLines.map((line) => `- ${line}`).join("\n") || "- 暂无摘要"}\n\n## 候选主题\n${themes.map((theme) => `- [ ] ${theme}`).join("\n") || "- [ ] 未分类"}\n\n## 候选卡片\n${cards.map((card) => `- [ ] ${card}｜待补充结论说明`).join("\n") || "- [ ] 待人工提炼｜待补充结论说明"}\n`;
}

function renderYouTubeSourceNote({ title, url }) {
  return `---\ntype: source\nsource_kind: youtube\nsource_path:\nsource_url: ${url}\nthemes:\n  - 待分类\nstatus: 待提炼\ncreated: ${isoDate()}\nupdated: ${isoDate()}\n---\n\n# 来源 - ${title}\n\n## 内容摘要\n- 来自 YouTube 的待整理视频链接\n- 链接：${url}\n\n## 候选主题\n- [ ] 待观看后补主题\n\n## 候选卡片\n- [ ] 观看后补充卡片结论｜观看后补充一句结论\n`;
}

async function upsertThemeNote({ vaultRoot, theme, sourceTitle, approvedCards }) {
  const themePath = path.join(vaultRoot, "20_主题工作台", `${safeFileStem(theme)}.md`);
  const sourceLink = `[[来源 - ${sourceTitle}]]`;
  const cardLinks = approvedCards.map((entry) => `[[${entry.split("｜")[0]}]]`);
  const baseContent = `---\ntype: theme\n---\n\n# ${theme}\n\n## 当前判断\n- 从来源笔记持续补充\n\n## 核心卡片\n\n## 相关来源\n\n## 未解问题\n- 待补充\n\n## 可输出方向\n- 待补充\n`;

  const existing = (await fileExists(themePath)) ? await readUtf8(themePath) : baseContent;
  let next = appendUniqueBullet(existing, "相关来源", sourceLink);
  for (const cardLink of cardLinks) {
    next = appendUniqueBullet(next, "核心卡片", cardLink);
  }

  await writeFile(themePath, next, "utf8");
}

async function upsertCardNote({ vaultRoot, entry, sourceTitle, approvedThemes }) {
  const [cardTitle, conclusion = "待补充结论说明"] = entry.split("｜");
  const cardPath = path.join(vaultRoot, "21_主题卡片", `${safeFileStem(cardTitle)}.md`);
  if (await fileExists(cardPath)) {
    return;
  }

  const primaryTheme = approvedThemes[0] || "待分类";
  const body = `---\ntype: card\nthemes:\n${approvedThemes.map((theme) => `  - ${theme}`).join("\n") || "  - 待分类"}\nsources:\n  - [[来源 - ${sourceTitle}]]\nstatus: 正式\ncreated: ${isoDate()}\nupdated: ${isoDate()}\n---\n\n# ${cardTitle}\n\n## 结论\n${conclusion}\n\n## 为什么\n- 来源：[[来源 - ${sourceTitle}]]\n\n## 适用场景\n- 主题：[[${primaryTheme}]]\n\n## 反例或边界\n- 待在后续阅读中补充\n`;

  await writeFile(cardPath, body, "utf8");
}
```

- [ ] **Step 2: Create the CLI wrapper for initialization**

```js
// scripts/obsidian-workspace/init-vault.mjs
import { initializeVault } from "./vault.mjs";
import { getVaultRoot } from "./config.mjs";

const vaultRoot = getVaultRoot(process.argv[2]);
const result = await initializeVault(vaultRoot);

console.log(`Initialized vault at ${result.vaultRoot}`);
console.log(`Directories ensured: ${result.createdDirectories.length}`);
console.log(`System files created: ${result.createdFiles.length}`);
```

- [ ] **Step 3: Run the vault-initialization test again**

Run: `npm run test:run -- scripts/obsidian-workspace/__tests__/initialize-vault.test.mjs`
Expected: PASS with one passing test for the temporary vault bootstrap.

- [ ] **Step 4: Smoke-test the initializer against the real vault**

Run: `npm run obsidian:init`
Expected:

```text
Initialized vault at /Volumes/dockcase/kani‘s vibe coding world
Directories ensured: 12
System files created: 5
```

- [ ] **Step 5: Commit the initializer**

```bash
git add scripts/obsidian-workspace/vault.mjs scripts/obsidian-workspace/init-vault.mjs
git commit -m "feat: initialize obsidian theme workspace"
```

### Task 3: Ingest Markdown and YouTube sources into inbox plus source notes

**Files:**
- Modify: `scripts/obsidian-workspace/vault.mjs`
- Create: `scripts/obsidian-workspace/ingest-source.mjs`
- Create: `scripts/obsidian-workspace/__tests__/ingest-source.test.mjs`

- [ ] **Step 1: Write the failing intake tests**

```js
// scripts/obsidian-workspace/__tests__/ingest-source.test.mjs
import os from "node:os";
import path from "node:path";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { initializeVault, ingestMarkdownSource, ingestYouTubeSource } from "../vault.mjs";

describe("source ingestion", () => {
  it("copies a markdown file into the inbox and generates a source note with candidates", async () => {
    const vaultRoot = await mkdtemp(path.join(os.tmpdir(), "obsidian-ingest-"));
    await initializeVault(vaultRoot);

    const inputPath = path.join(vaultRoot, "sample-input.md");
    await writeFile(
      inputPath,
      `---\ntitle: Builder 自学内容 · Week 1\n---\n\n# Builder 自学内容 · Week 1\n\n- AI 产品不是“普通功能 + AI 按钮”\n- 95% 自动化不等于真正自动化\n\n## JTBD\n内容\n\n## Agent 设计原则\n内容\n`,
      "utf8"
    );

    const result = await ingestMarkdownSource({ vaultRoot, inputPath });

    const inboxCopy = await readFile(result.inboxPath, "utf8");
    const sourceNote = await readFile(result.sourceNotePath, "utf8");

    expect(inboxCopy).toContain("Builder 自学内容 · Week 1");
    expect(sourceNote).toContain("# 来源 - Builder 自学内容 · Week 1");
    expect(sourceNote).toContain("- [ ] JTBD");
    expect(sourceNote).toContain("- [ ] AI产品判断");
    expect(sourceNote).toContain("95% 自动化不等于真正自动化");
  });

  it("creates a youtube inbox note and source note from a URL and title", async () => {
    const vaultRoot = await mkdtemp(path.join(os.tmpdir(), "obsidian-youtube-"));
    await initializeVault(vaultRoot);

    const result = await ingestYouTubeSource({
      vaultRoot,
      url: "https://www.youtube.com/watch?v=example123",
      title: "Lenny Podcast Max Schoening"
    });

    const inboxNote = await readFile(result.inboxPath, "utf8");
    const sourceNote = await readFile(result.sourceNotePath, "utf8");

    expect(inboxNote).toContain("https://www.youtube.com/watch?v=example123");
    expect(sourceNote).toContain("source_kind: youtube");
    expect(sourceNote).toContain("## 候选主题");
    expect(sourceNote).toContain("## 候选卡片");
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail on missing CLI wrapper coverage**

Run: `npm run test:run -- scripts/obsidian-workspace/__tests__/ingest-source.test.mjs`
Expected: FAIL because `ingest-source.mjs` does not exist and `vault.mjs` does not yet expose a tested CLI path for intake.

- [ ] **Step 3: Create the source-ingestion CLI**

```js
// scripts/obsidian-workspace/ingest-source.mjs
import { getVaultRoot } from "./config.mjs";
import { ingestMarkdownSource, ingestYouTubeSource } from "./vault.mjs";

const args = process.argv.slice(2);
const params = new Map();

for (let index = 0; index < args.length; index += 2) {
  params.set(args[index], args[index + 1]);
}

const kind = params.get("--kind");
const vaultRoot = getVaultRoot(params.get("--vault-root"));

if (kind === "md") {
  const inputPath = params.get("--input");
  if (!inputPath) {
    throw new Error("Missing --input for markdown ingestion");
  }

  const result = await ingestMarkdownSource({ vaultRoot, inputPath });
  console.log(`Markdown ingested: ${result.sourceNotePath}`);
  process.exit(0);
}

if (kind === "youtube") {
  const url = params.get("--url");
  const title = params.get("--title");
  if (!url || !title) {
    throw new Error("Missing --url or --title for YouTube ingestion");
  }

  const result = await ingestYouTubeSource({ vaultRoot, url, title });
  console.log(`YouTube ingested: ${result.sourceNotePath}`);
  process.exit(0);
}

throw new Error("Unsupported --kind. Use md or youtube.");
```

- [ ] **Step 4: Re-run the intake tests**

Run: `npm run test:run -- scripts/obsidian-workspace/__tests__/ingest-source.test.mjs`
Expected: PASS with two green tests for Markdown and YouTube intake.

- [ ] **Step 5: Smoke-test both intake flows**

Run: `npm run obsidian:ingest -- --kind md --input "/Users/helenahe/Desktop/Builder 自学内容 Week1 · V0.5 想清楚与搭助理.md"`
Expected: prints a `Markdown ingested:` line pointing to `10_来源笔记/md/来源 - Builder 自学内容 Week1 · V0.5 想清楚与搭助理.md`

Run: `npm run obsidian:ingest -- --kind youtube --title "Lenny Podcast Max Schoening" --url "https://www.youtube.com/watch?v=mCO-D3pkviM"`
Expected: prints a `YouTube ingested:` line pointing to `10_来源笔记/youtube/来源 - Lenny Podcast Max Schoening.md`

- [ ] **Step 6: Commit the ingestion flow**

```bash
git add scripts/obsidian-workspace/vault.mjs scripts/obsidian-workspace/ingest-source.mjs scripts/obsidian-workspace/__tests__/ingest-source.test.mjs
git commit -m "feat: ingest markdown and youtube sources"
```

### Task 4: Confirm approved candidates into theme and card notes

**Files:**
- Modify: `scripts/obsidian-workspace/vault.mjs`
- Create: `scripts/obsidian-workspace/confirm-source-note.mjs`
- Create: `scripts/obsidian-workspace/__tests__/confirm-source-note.test.mjs`

- [ ] **Step 1: Write the failing confirmation test**

```js
// scripts/obsidian-workspace/__tests__/confirm-source-note.test.mjs
import os from "node:os";
import path from "node:path";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { confirmSourceNote, initializeVault } from "../vault.mjs";

describe("confirmSourceNote", () => {
  it("promotes approved themes and cards, updates status, and appends the log", async () => {
    const vaultRoot = await mkdtemp(path.join(os.tmpdir(), "obsidian-confirm-"));
    await initializeVault(vaultRoot);

    const sourceNotePath = path.join(vaultRoot, "10_来源笔记/md/来源 - Builder 自学内容.md");
    await writeFile(
      sourceNotePath,
      `---\ntype: source\nsource_kind: md\nsource_path: /tmp/example.md\nsource_url:\nthemes:\n  - AI产品判断\nstatus: 待确认\ncreated: 2026-06-01\nupdated: 2026-06-01\n---\n\n# 来源 - Builder 自学内容\n\n## 候选主题\n- [x] AI产品判断\n- [ ] JTBD\n\n## 候选卡片\n- [x] tiny core 比功能堆砌更重要｜AI 产品早期先找不可替代核心体验\n- [ ] 95% 自动化不等于真正自动化｜最后 5% 决定是否可交付\n`,
      "utf8"
    );

    const result = await confirmSourceNote({ vaultRoot, sourceNotePath });

    const themeNote = await readFile(path.join(vaultRoot, "20_主题工作台/AI产品判断.md"), "utf8");
    const cardNote = await readFile(path.join(vaultRoot, "21_主题卡片/tiny core 比功能堆砌更重要.md"), "utf8");
    const updatedSource = await readFile(sourceNotePath, "utf8");
    const logNote = await readFile(path.join(vaultRoot, "90_系统/_log.md"), "utf8");

    expect(result.approvedThemes).toEqual(["AI产品判断"]);
    expect(themeNote).toContain("[[来源 - Builder 自学内容]]");
    expect(themeNote).toContain("[[tiny core 比功能堆砌更重要]]");
    expect(cardNote).toContain("AI 产品早期先找不可替代核心体验");
    expect(updatedSource).toContain("status: 已提炼");
    expect(logNote).toContain("confirm | Builder 自学内容");
  });
});
```

- [ ] **Step 2: Run the confirmation test to verify it fails before the CLI exists**

Run: `npm run test:run -- scripts/obsidian-workspace/__tests__/confirm-source-note.test.mjs`
Expected: FAIL because `confirm-source-note.mjs` does not exist and the promotion path has not been verified end-to-end yet.

- [ ] **Step 3: Create the confirmation CLI wrapper**

```js
// scripts/obsidian-workspace/confirm-source-note.mjs
import { getVaultRoot } from "./config.mjs";
import { confirmSourceNote } from "./vault.mjs";

const args = process.argv.slice(2);
const params = new Map();

for (let index = 0; index < args.length; index += 2) {
  params.set(args[index], args[index + 1]);
}

const sourceNotePath = params.get("--source-note");
if (!sourceNotePath) {
  throw new Error("Missing --source-note");
}

const vaultRoot = getVaultRoot(params.get("--vault-root"));
const result = await confirmSourceNote({ vaultRoot, sourceNotePath });

console.log(`Confirmed themes: ${result.approvedThemes.join(", ") || "none"}`);
console.log(`Confirmed cards: ${result.approvedCards.map((entry) => entry.split("｜")[0]).join(", ") || "none"}`);
```

- [ ] **Step 4: Run the confirmation test again**

Run: `npm run test:run -- scripts/obsidian-workspace/__tests__/confirm-source-note.test.mjs`
Expected: PASS with one green test proving promotion, source status update, and log append behavior.

- [ ] **Step 5: Perform the first real promotion from the sample source note**

Run: `npm run obsidian:confirm -- --source-note "/Volumes/dockcase/kani‘s vibe coding world/10_来源笔记/md/来源 - Builder 自学内容 Week1 · V0.5 想清楚与搭助理.md"`
Expected:

```text
Confirmed themes: AI产品判断, JTBD, Agent设计原则
Confirmed cards: tiny core 比功能堆砌更重要, 95% 自动化不等于真正自动化
```

- [ ] **Step 6: Commit the promotion flow**

```bash
git add scripts/obsidian-workspace/vault.mjs scripts/obsidian-workspace/confirm-source-note.mjs scripts/obsidian-workspace/__tests__/confirm-source-note.test.mjs
git commit -m "feat: confirm source candidates into themes and cards"
```

### Task 5: Run the end-to-end regression suite and verify the real vault layout

**Files:**
- Modify: `scripts/obsidian-workspace/vault.mjs`
- Test: `scripts/obsidian-workspace/__tests__/initialize-vault.test.mjs`
- Test: `scripts/obsidian-workspace/__tests__/ingest-source.test.mjs`
- Test: `scripts/obsidian-workspace/__tests__/confirm-source-note.test.mjs`

- [ ] **Step 1: Run all Obsidian workspace tests together**

Run: `npm run test:run -- scripts/obsidian-workspace/__tests__`
Expected: PASS with four total passing tests covering initialization, Markdown intake, YouTube intake, and confirmation.

- [ ] **Step 2: Run the real vault commands in sequence**

Run: `npm run obsidian:init`
Expected: vault directories and system files exist without duplicate failures.

Run: `npm run obsidian:ingest -- --kind md --input "/Users/helenahe/Desktop/Builder 自学内容 Week1 · V0.5 想清楚与搭助理.md"`
Expected: a fresh source note exists under `10_来源笔记/md`.

Run: `npm run obsidian:ingest -- --kind youtube --title "Lenny Podcast Max Schoening" --url "https://www.youtube.com/watch?v=mCO-D3pkviM"`
Expected: a fresh source note exists under `10_来源笔记/youtube`.

Run: `npm run obsidian:confirm -- --source-note "/Volumes/dockcase/kani‘s vibe coding world/10_来源笔记/md/来源 - Builder 自学内容 Week1 · V0.5 想清楚与搭助理.md"`
Expected: confirmed theme and card notes appear under `20_主题工作台` and `21_主题卡片`.

- [ ] **Step 3: Inspect the resulting vault tree**

Run: `find "/Volumes/dockcase/kani‘s vibe coding world" -maxdepth 3 | sort`
Expected: visible directories for `00_收件箱`, `10_来源笔记`, `20_主题工作台`, `21_主题卡片`, `40_输出`, `90_系统`, plus the ingested sample notes.

- [ ] **Step 4: Commit any small fixes required by the end-to-end run**

```bash
git add package.json scripts/obsidian-workspace
git commit -m "test: verify obsidian workspace end-to-end flow"
```

## Post-Launch Iteration Checkpoints

After phase 1 works, optimize in this order:

1. Intake friction
   - Measure whether the user actually drops items into `00_收件箱`.
   - If not, reduce CLI arguments or add one-file shortcuts.
2. Source note quality
   - Review whether summaries and candidate themes are useful.
   - Improve heuristics only after looking at 10-20 real source notes.
3. Theme-page sprawl
   - If theme notes get too large, split more aggressively into cards.
4. Output usefulness
   - Validate whether a topic page can be turned into a real output draft in under 10 minutes.
5. Phase 2 backlog
   - Add `_项目扫描清单.md`-driven project intake.
   - Add duplicate-card detection.
   - Add batch ingest.
   - Add stronger YouTube note templates.

## Spec Coverage Check

- Vault structure and system files: covered by Tasks 1-2.
- Manual intake for `md` and YouTube: covered by Task 3.
- Candidate approval and durable theme/card notes: covered by Task 4.
- End-to-end verification with the real external vault: covered by Task 5.
- Project scanning: explicitly deferred to the phase 2 backlog, matching the spec’s staged implementation order.
