import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
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
      "utf8",
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
      title: "Lenny Podcast Max Schoening",
    });

    const inboxNote = await readFile(result.inboxPath, "utf8");
    const sourceNote = await readFile(result.sourceNotePath, "utf8");

    expect(inboxNote).toContain("https://www.youtube.com/watch?v=example123");
    expect(sourceNote).toContain("source_kind: youtube");
    expect(sourceNote).toContain("## 候选主题");
    expect(sourceNote).toContain("## 候选卡片");
  });
});
