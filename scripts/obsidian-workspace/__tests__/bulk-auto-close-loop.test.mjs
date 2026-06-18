import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { autoCloseMarkdownDirectory, initializeVault } from "../vault.mjs";

describe("autoCloseMarkdownDirectory", () => {
  it("recursively processes clean markdown files and skips ignored directories and preview files", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "obsidian-bulk-"));
    const vaultRoot = path.join(root, "vault");
    const inputDir = path.join(root, "input");
    await initializeVault(vaultRoot);

    await mkdir(path.join(inputDir, "course"), { recursive: true });
    await mkdir(path.join(inputDir, "nested", "more"), { recursive: true });
    await mkdir(path.join(inputDir, "node_modules", "pkg"), { recursive: true });
    await mkdir(path.join(inputDir, ".git"), { recursive: true });
    await mkdir(path.join(inputDir, "_logs"), { recursive: true });
    await mkdir(path.join(inputDir, "skills"), { recursive: true });

    await writeFile(
      path.join(inputDir, "course", "week0.md"),
      "# Builder 自学内容\n\n## Agent 设计原则\n- Agent = LLM + 规划 + 记忆 + 工具。\n",
      "utf8",
    );
    await writeFile(
      path.join(inputDir, "nested", "more", "product.md"),
      "# 产品判断\n\n- AI 产品不是“普通功能 + AI 按钮”\n",
      "utf8",
    );
    await writeFile(path.join(inputDir, "nested", "ignore.preview.md"), "# preview\n", "utf8");
    await writeFile(path.join(inputDir, "node_modules", "pkg", "bad.md"), "# should skip\n", "utf8");
    await writeFile(path.join(inputDir, ".git", "bad.md"), "# should skip\n", "utf8");
    await writeFile(path.join(inputDir, "_index.md"), "# should skip\n", "utf8");
    await writeFile(path.join(inputDir, "_logs", "run-summary.md"), "# should skip\n", "utf8");
    await writeFile(path.join(inputDir, "skills", "SKILL.md"), "# should skip\n", "utf8");

    const result = await autoCloseMarkdownDirectory({
      vaultRoot,
      inputDir,
      themeLimit: 2,
      cardLimit: 2,
    });

    expect(result.processedFiles).toHaveLength(2);
    expect(result.skippedFiles.some((entry) => entry.endsWith("ignore.preview.md"))).toBe(true);
    expect(result.skippedFiles.some((entry) => entry.endsWith("_index.md"))).toBe(true);
    expect(result.skippedFiles.some((entry) => entry.endsWith("SKILL.md"))).toBe(true);
    expect(result.skippedFiles.some((entry) => entry.includes("node_modules"))).toBe(false);
    expect(result.skippedFiles.some((entry) => entry.includes(".git"))).toBe(false);
    expect(result.skippedFiles.some((entry) => entry.includes("_logs"))).toBe(false);

    const themeIndex = await readFile(path.join(vaultRoot, "90_系统/_主题总表.md"), "utf8");
    expect(themeIndex).toContain("[[Agent设计原则]]");
    expect(themeIndex).toContain("[[AI产品判断]]");
  });
});
