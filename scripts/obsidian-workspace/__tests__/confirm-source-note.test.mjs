import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
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
      "utf8",
    );

    const result = await confirmSourceNote({ vaultRoot, sourceNotePath });

    const themeNote = await readFile(path.join(vaultRoot, "20_主题工作台/AI产品判断.md"), "utf8");
    const cardNote = await readFile(
      path.join(vaultRoot, "21_主题卡片/tiny core 比功能堆砌更重要.md"),
      "utf8",
    );
    const updatedSource = await readFile(sourceNotePath, "utf8");
    const logNote = await readFile(path.join(vaultRoot, "90_系统/_log.md"), "utf8");
    const themeIndexNote = await readFile(path.join(vaultRoot, "90_系统/_主题总表.md"), "utf8");

    expect(result.approvedThemes).toEqual(["AI产品判断"]);
    expect(themeNote).toContain("[[来源 - Builder 自学内容]]");
    expect(themeNote).toContain("[[tiny core 比功能堆砌更重要]]");
    expect(cardNote).toContain("AI 产品早期先找不可替代核心体验");
    expect(updatedSource).toContain("status: 已提炼");
    expect(logNote).toContain("confirm | Builder 自学内容");
    expect(themeIndexNote).toContain("- [[AI产品判断]]");
  });

  it("uses the actual source note stem for wikilinks even when the displayed title has extra spaces", async () => {
    const vaultRoot = await mkdtemp(path.join(os.tmpdir(), "obsidian-confirm-safe-link-"));
    await initializeVault(vaultRoot);

    const sourceNotePath = path.join(vaultRoot, "10_来源笔记/md/来源 - 暖暖MVP项目PRD V1.md");
    await writeFile(
      sourceNotePath,
      `---\ntype: source\nsource_kind: md\nsource_path: /tmp/example.md\nsource_url:\nthemes:\n  - MVP验证\nstatus: 待确认\ncreated: 2026-06-01\nupdated: 2026-06-01\n---\n\n# 来源 - 暖暖MVP项目PRD  V1\n\n## 候选主题\n- [x] MVP验证\n\n## 候选卡片\n- [x] 希望获得理解与陪伴，而不是被说教｜产品不能滑向说教口吻\n`,
      "utf8",
    );

    await confirmSourceNote({ vaultRoot, sourceNotePath });

    const themeNote = await readFile(path.join(vaultRoot, "20_主题工作台/MVP验证.md"), "utf8");
    const cardNote = await readFile(
      path.join(vaultRoot, "21_主题卡片/希望获得理解与陪伴，而不是被说教.md"),
      "utf8",
    );

    expect(themeNote).toContain("[[来源 - 暖暖MVP项目PRD V1]]");
    expect(themeNote).not.toContain("[[来源 - 暖暖MVP项目PRD  V1]]");
    expect(cardNote).toContain("[[来源 - 暖暖MVP项目PRD V1]]");
  });

  it("creates a review note plus source-theme-context links for deep review cards", async () => {
    const vaultRoot = await mkdtemp(path.join(os.tmpdir(), "obsidian-confirm-review-card-"));
    await initializeVault(vaultRoot);

    const sourceNotePath = path.join(
      vaultRoot,
      "10_来源笔记/md/来源 - Claude Code 记忆系统深度解析.md",
    );
    await writeFile(
      sourceNotePath,
      `---\ntype: source\nsource_kind: md\nsource_path: /tmp/memory.md\nsource_url:\nthemes:\n  - 记忆系统设计\nstatus: 待确认\ncreated: 2026-06-02\nupdated: 2026-06-02\n---\n\n# 来源 - Claude Code 记忆系统深度解析\n\n## 内容摘要\n- 记忆系统不是把所有内容全塞进上下文，而是分层存储与按需加载。\n- 长期记忆、工作记忆、团队记忆对应不同时间尺度。\n\n## 候选主题\n- [x] 记忆系统设计\n\n## 候选卡片\n- [x] 记忆系统不是把所有内容都塞进上下文｜规则常驻、索引常驻、详情按需加载，旧内容压缩\n`,
      "utf8",
    );

    await confirmSourceNote({ vaultRoot, sourceNotePath });

    const reviewNote = await readFile(
      path.join(vaultRoot, "11_复盘笔记/复盘 - Claude Code 记忆系统深度解析.md"),
      "utf8",
    );
    const themeNote = await readFile(path.join(vaultRoot, "20_主题工作台/记忆系统设计.md"), "utf8");
    const contextViewNote = await readFile(
      path.join(vaultRoot, "30_项目视图/记忆系统研究.md"),
      "utf8",
    );
    const cardNote = await readFile(
      path.join(vaultRoot, "21_主题卡片/记忆系统不是把所有内容都塞进上下文.md"),
      "utf8",
    );

    expect(reviewNote).toContain("# 复盘 - Claude Code 记忆系统深度解析");
    expect(reviewNote).toContain("[[来源 - Claude Code 记忆系统深度解析]]");
    expect(reviewNote).toContain("[[记忆系统研究]]");
    expect(themeNote).toContain("[[复盘 - Claude Code 记忆系统深度解析]]");
    expect(contextViewNote).toContain("[[来源 - Claude Code 记忆系统深度解析]]");
    expect(cardNote).toContain("## 结论");
    expect(cardNote).toContain("## 为什么重要");
    expect(cardNote).toContain("## 我的理解");
    expect(cardNote).toContain("## 适用场景");
    expect(cardNote).toContain("## 反例或边界");
    expect(cardNote).toContain("## 对我当前项目的启发");
    expect(cardNote).toContain("## 下一步动作");
    expect(cardNote).toContain("[[来源 - Claude Code 记忆系统深度解析]]");
    expect(cardNote).toContain("[[记忆系统设计]]");
    expect(cardNote).toContain("[[记忆系统研究]]");
    expect(cardNote).toContain("[[复盘 - Claude Code 记忆系统深度解析]]");
  });

  it("routes AI Builder training materials into the course view when the source note mentions the training group", async () => {
    const vaultRoot = await mkdtemp(path.join(os.tmpdir(), "obsidian-confirm-builder-group-"));
    await initializeVault(vaultRoot);

    const sourceNotePath = path.join(vaultRoot, "10_来源笔记/md/来源 - 构建高效 Agent [译].md");
    await writeFile(
      sourceNotePath,
      `---\ntype: source\nsource_kind: md\nsource_path: /tmp/agent.md\nsource_url: https://baoyu.io/translations/building-effective-agents\nthemes:\n  - Agent设计原则\nstatus: 待确认\ncreated: 2026-06-02\nupdated: 2026-06-02\n---\n\n# 来源 - 构建高效 Agent [译]\n\n## 飞书消息来源\n- 群聊：AI builder培训交流群\n- 发送人：赵逸君\n\n## 内容摘要\n- Anthropic 将 Agentic 系统区分为工作流与 Agent。\n- 复杂度只有在评估证明有效时才值得引入。\n\n## 候选主题\n- [x] Agent设计原则\n\n## 候选卡片\n- [x] 先用工作流，只有步骤开放时才升级成 Agent｜工作流适合步骤明确的任务；只有当步骤数与决策路径无法预定义时，才值得升级成 Agent。\n`,
      "utf8",
    );

    const result = await confirmSourceNote({ vaultRoot, sourceNotePath });
    const courseView = await readFile(
      path.join(vaultRoot, "31_课程视图/AI Builder 自学路径.md"),
      "utf8",
    );
    const cardNote = await readFile(
      path.join(vaultRoot, "21_主题卡片/先用工作流，只有步骤开放时才升级成 Agent.md"),
      "utf8",
    );

    expect(result.contextView.name).toBe("AI Builder 自学路径");
    expect(courseView).toContain("[[来源 - 构建高效 Agent [译]]]");
    expect(cardNote).toContain("[[AI Builder 自学路径]]");
  });
});
