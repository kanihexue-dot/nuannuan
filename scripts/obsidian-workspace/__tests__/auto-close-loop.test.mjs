import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { autoCloseMarkdownLoop, initializeVault } from "../vault.mjs";

describe("autoCloseMarkdownLoop", () => {
  it("ingests a markdown source and automatically closes a conservative source-to-theme loop", async () => {
    const vaultRoot = await mkdtemp(path.join(os.tmpdir(), "obsidian-autoloop-"));
    await initializeVault(vaultRoot);

    const inputPath = path.join(vaultRoot, "builder-week0.md");
    await writeFile(
      inputPath,
      `---\ntitle: Builder 自学内容 · Week 0\n---\n\n# Builder 自学内容 · Week 0\n\n- AI 产品不是“普通功能 + AI 按钮”\n- 95% 自动化不等于真正自动化\n\n## JTBD\n内容\n\n## Agent 设计原则\n内容\n`,
      "utf8",
    );

    const result = await autoCloseMarkdownLoop({
      vaultRoot,
      inputPath,
      themeLimit: 1,
      cardLimit: 1,
    });

    const sourceNote = await readFile(result.sourceNotePath, "utf8");
    const themeIndex = await readFile(path.join(vaultRoot, "90_系统/_主题总表.md"), "utf8");
    const themeName = result.approvedThemes[0];
    const cardTitle = result.approvedCards[0].split("｜")[0];
    const themeNote = await readFile(path.join(vaultRoot, "20_主题工作台", `${themeName}.md`), "utf8");
    const cardNote = await readFile(path.join(vaultRoot, "21_主题卡片", `${cardTitle}.md`), "utf8");

    expect(result.approvedThemes).toHaveLength(1);
    expect(result.approvedCards).toHaveLength(1);
    expect(sourceNote).toContain("status: 已提炼");
    expect(themeIndex).toContain(`- [[${themeName}]]`);
    expect(themeNote).toContain(`[[${cardTitle}]]`);
    expect(cardNote).not.toContain("待补充结论说明");
  });

  it("skips generic course headings and procedural bullets when auto-selecting themes and cards", async () => {
    const vaultRoot = await mkdtemp(path.join(os.tmpdir(), "obsidian-autoloop-week0-"));
    await initializeVault(vaultRoot);

    const inputPath = path.join(vaultRoot, "builder-week0-realish.md");
    await writeFile(
      inputPath,
      `---\ntitle: Builder 自学内容 · Week 0\n---\n\n# Builder 自学内容 · Week 0\n\n## 本周最低完成线\n- 三个工具都能打开并跑一个最小任务。\n\n## 学习方法\n- 每天最多 2 个必看 / 必做项；先完成它们，再看本周选读材料。\n- 让 AI 扮演作者、反方或拷问者，而不是让它替你总结。\n\n## Agent 设计原则\n- Agent = LLM + 规划 + 记忆 + 工具。\n`,
      "utf8",
    );

    const result = await autoCloseMarkdownLoop({
      vaultRoot,
      inputPath,
      themeLimit: 2,
      cardLimit: 2,
    });
    const cardTitle = result.approvedCards[0].split("｜")[0];
    const cardNote = await readFile(path.join(vaultRoot, "21_主题卡片", `${cardTitle}.md`), "utf8");
    const agentDefinitionCard = result.approvedCards.find((entry) => entry.includes("Agent = LLM + 规划 + 记忆 + 工具。"));
    const agentDefinitionTitle = agentDefinitionCard?.split("｜")[0];
    const agentDefinitionNote = agentDefinitionTitle
      ? await readFile(path.join(vaultRoot, "21_主题卡片", `${agentDefinitionTitle}.md`), "utf8")
      : "";

    expect(result.approvedThemes).toContain("Agent设计原则");
    expect(result.approvedThemes).not.toContain("本周最低完成线");
    expect(result.approvedThemes).not.toContain("学习方法");
    expect(result.approvedCards.some((entry) => entry.includes("让 AI 扮演作者"))).toBe(true);
    expect(Boolean(agentDefinitionCard)).toBe(true);
    expect(result.approvedCards.some((entry) => entry.includes("每天最多 2 个必看"))).toBe(false);
    expect(cardNote).not.toContain("这个知识点值得保留并在后续主题页中继续展开");
    expect(agentDefinitionNote).not.toContain("这个知识点值得保留并在后续主题页中继续展开");
  });

  it("skips scoring-threshold lines when auto-selecting cards from rubric-style notes", async () => {
    const vaultRoot = await mkdtemp(path.join(os.tmpdir(), "obsidian-autoloop-rubric-"));
    await initializeVault(vaultRoot);

    const inputPath = path.join(vaultRoot, "ability-rubric.md");
    await writeFile(
      inputPath,
      `# AI Builder 能力模型\n\n## 产品判断能力\n- 自评的价值是让学员"意识到自己在哪一级"，而不是评定\n- 任一维度 < L2（= 得分 < 10）\n- AI 产品不是“普通功能 + AI 按钮”\n`,
      "utf8",
    );

    const result = await autoCloseMarkdownLoop({
      vaultRoot,
      inputPath,
      themeLimit: 2,
      cardLimit: 3,
    });

    expect(result.approvedCards.some((entry) => entry.includes("自评的价值"))).toBe(true);
    expect(result.approvedCards.some((entry) => entry.includes("AI 产品不是"))).toBe(true);
    expect(result.approvedCards.some((entry) => entry.includes("任一维度 < L2"))).toBe(false);
  });

  it("ignores numbered academic section headings and keeps meaningful numbered themes", async () => {
    const vaultRoot = await mkdtemp(path.join(os.tmpdir(), "obsidian-autoloop-academic-"));
    await initializeVault(vaultRoot);

    const inputPath = path.join(vaultRoot, "research-outline.md");
    await writeFile(
      inputPath,
      `# 数据驱动研究提纲

## 一、引言
说明研究缘起

## 二、个人背景
说明申请人的经历

## 3. JTBD
围绕真实任务拆解用户需求

- AI 产品不是“普通功能 + AI 按钮”
`,
      "utf8",
    );

    const result = await autoCloseMarkdownLoop({
      vaultRoot,
      inputPath,
      themeLimit: 3,
      cardLimit: 1,
    });

    expect(result.approvedThemes).toContain("JTBD");
    expect(result.approvedThemes).not.toContain("一、引言");
    expect(result.approvedThemes).not.toContain("二、个人背景");
    expect(result.approvedThemes).not.toContain("引言");
    expect(result.approvedThemes).not.toContain("个人背景");
  });

  it("keeps product themes from PRD notes while skipping generic PRD headings", async () => {
    const vaultRoot = await mkdtemp(path.join(os.tmpdir(), "obsidian-autoloop-prd-"));
    await initializeVault(vaultRoot);

    const inputPath = path.join(vaultRoot, "nuannuan-prd.md");
    await writeFile(
      inputPath,
      `# 暖暖MVP项目PRD

## 项目背景
为有情绪压力却无人倾诉的青少年，提供一个轻心理、重陪伴的空间。

## 竞品分析
对比 Moo 日记与心岛日记。

## 产品模块
- 希望获得理解与陪伴，而不是被说教
- 不说教、不强分析、不进行心理诊断、以倾听和陪伴为主
`,
      "utf8",
    );

    const result = await autoCloseMarkdownLoop({
      vaultRoot,
      inputPath,
      themeLimit: 3,
      cardLimit: 2,
    });

    expect(result.approvedThemes).toContain("竞品分析");
    expect(result.approvedThemes).toContain("情绪陪伴设计");
    expect(result.approvedThemes).not.toContain("项目背景");
    expect(result.approvedThemes).not.toContain("产品模块");
    expect(result.approvedCards.some((entry) => entry.includes("不说教、不强分析、不进行心理诊断"))).toBe(
      true,
    );
  });

  it("keeps eval themes from course notes while skipping timeline-style headings", async () => {
    const vaultRoot = await mkdtemp(path.join(os.tmpdir(), "obsidian-autoloop-eval-"));
    await initializeVault(vaultRoot);

    const inputPath = path.join(vaultRoot, "builder-week3.md");
    await writeFile(
      inputPath,
      `# AI Builder 自学内容 · Week 3

## 本周主线 · 评测体系五层框架
说明本周的核心主线。

## 周一 · L1 产品契约
今天的任务。

## 周二 · L2 场景数据集
今天的任务。

没有 eval 的 AI 产品只是在碰运气。
`,
      "utf8",
    );

    const result = await autoCloseMarkdownLoop({
      vaultRoot,
      inputPath,
      themeLimit: 2,
      cardLimit: 1,
    });

    expect(result.approvedThemes).toContain("产品评测");
    expect(result.approvedThemes).not.toContain("本周主线 · 评测体系五层框架");
    expect(result.approvedThemes).not.toContain("周一 · L1 产品契约");
    expect(result.approvedCards[0]).toContain("没有 eval 的 AI 产品只是在碰运气。");
  });

  it("routes agent article headings into agent principles instead of question-style themes", async () => {
    const vaultRoot = await mkdtemp(path.join(os.tmpdir(), "obsidian-autoloop-agent-article-"));
    await initializeVault(vaultRoot);

    const inputPath = path.join(vaultRoot, "effective-agents.md");
    await writeFile(
      inputPath,
      `# 构建高效 Agent [译]

## 什么是 Agent？
- **工作流** 是指通过预定义的代码路径来编排 LLM 与工具的系统。
- **Agent** 则是指由 LLM 动态地指挥自己的流程和工具使用方式的系统，始终由 LLM 来掌控完成任务的方式。

## 何时（以及何时不）使用 Agent
建议开发者先直接使用 LLM API。
`,
      "utf8",
    );

    const result = await autoCloseMarkdownLoop({
      vaultRoot,
      inputPath,
      themeLimit: 3,
      cardLimit: 2,
    });

    expect(result.approvedThemes).toContain("Agent设计原则");
    expect(result.approvedThemes).not.toContain("什么是 Agent？");
    expect(result.approvedThemes).not.toContain("何时（以及何时不）使用 Agent");
    expect(result.approvedCards.some((entry) => entry.includes("工作流 是指通过预定义的代码路径"))).toBe(
      true,
    );
    expect(result.approvedCards.some((entry) => entry.includes("**工作流**"))).toBe(false);
  });

  it("builds deep memory-system review cards without drifting into generic headings or agent themes", async () => {
    const vaultRoot = await mkdtemp(path.join(os.tmpdir(), "obsidian-autoloop-memory-"));
    await initializeVault(vaultRoot);

    const inputPath = path.join(vaultRoot, "claude-memory.md");
    await writeFile(
      inputPath,
      `# Claude Code 记忆系统深度解析

## 一、为什么 AI 助手需要记忆系统？

所谓"上下文窗口"不是"模型能记住多长的内容"，而是你每次最多能发多大的文本给它。

## 二、核心公式

设计哲学：不是把所有记忆全塞进去，而是像人脑一样 规则常驻、索引常驻、详情按需加载、旧内容压缩。

## 三、完整流程：按用户使用时序讲解

为什么用 Sonnet 侧路，不让主模型自己找？
- 更快：和其他准备工作并行，不额外等待
- 更便宜：Sonnet 是便宜的小模型
- 更可靠：系统级强制执行，不依赖主模型"自觉去找"

## 四、对话进行中

关键设计：不是全部压成摘要，最近的对话原文会完整保留，确保工作现场不丢。

## 五、长期记忆的存储设计

不用数据库，不用向量存储。每条记忆就是一个 .md 文件。
`,
      "utf8",
    );

    const result = await autoCloseMarkdownLoop({
      vaultRoot,
      inputPath,
      themeLimit: 2,
      cardLimit: 3,
    });

    expect(result.approvedThemes).toContain("记忆系统设计");
    expect(result.approvedThemes).not.toContain("Agent设计原则");
    expect(result.approvedThemes).not.toContain("为什么 AI 助手需要记忆系统？");
    expect(result.approvedThemes).not.toContain("完整流程：按用户使用时序讲解");
    expect(
      result.approvedCards.some((entry) => entry.includes("记忆系统不是把所有记忆全塞进去")),
    ).toBe(true);
    expect(
      result.approvedCards.some((entry) => entry.includes("上下文压缩不是把一切都压成摘要")),
    ).toBe(true);
    expect(
      result.approvedCards.some((entry) => entry.includes("长期记忆可以先用 Markdown 文件系统落地")),
    ).toBe(true);
  });
});
