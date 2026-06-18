import { access, mkdtemp, readFile, utimes, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";
import { fileExists } from "../helpers.mjs";
import { initializeVault, refreshSystemViews } from "../vault.mjs";

const execFileAsync = promisify(execFile);

describe("initializeVault", () => {
  it("creates the vault directories and system notes", async () => {
    const vaultRoot = await mkdtemp(path.join(os.tmpdir(), "obsidian-vault-"));

    const result = await initializeVault(vaultRoot);

    expect(result.vaultRoot).toBe(vaultRoot);
    expect(result.createdDirectories).toContain("00_收件箱/md");
    expect(result.createdDirectories).toContain("11_复盘笔记");
    expect(result.createdDirectories).toContain("21_主题卡片");

    const indexNote = await readFile(path.join(vaultRoot, "90_系统/_index.md"), "utf8");
    const logNote = await readFile(path.join(vaultRoot, "90_系统/_log.md"), "utf8");
    const rulesNote = await readFile(path.join(vaultRoot, "90_系统/_收件规则.md"), "utf8");
    const startNote = await readFile(path.join(vaultRoot, "00_从这里开始.md"), "utf8");
    const dashboardNote = await readFile(path.join(vaultRoot, "90_系统/知识库看板.md"), "utf8");
    const canvasNote = JSON.parse(
      await readFile(path.join(vaultRoot, "90_系统/主题地图.canvas"), "utf8"),
    );

    expect(startNote).toContain("[[主题地图]]");
    expect(indexNote).toContain("[[_主题总表]]");
    expect(dashboardNote).toContain("# 知识库看板");
    expect(logNote).toContain("# 操作日志");
    expect(rulesNote).toContain("Markdown 进入 `00_收件箱/md`");
    expect(canvasNote.nodes.length).toBeGreaterThan(0);
    expect(canvasNote.edges.length).toBeGreaterThan(0);
    expect(new Set(canvasNote.nodes.map((node) => node.id)).size).toBe(canvasNote.nodes.length);
    expect(new Set(canvasNote.edges.map((edge) => edge.id)).size).toBe(canvasNote.edges.length);
  });

  it("accepts --vault-root when initializing from the CLI", async () => {
    const cwd = await mkdtemp(path.join(os.tmpdir(), "obsidian-init-cli-cwd-"));
    const vaultRoot = await mkdtemp(path.join(os.tmpdir(), "obsidian-init-cli-vault-"));
    const scriptPath = path.join(process.cwd(), "scripts/obsidian-workspace/init-vault.mjs");

    await execFileAsync(process.execPath, [scriptPath, "--vault-root", vaultRoot], { cwd });

    const dashboardNote = await readFile(path.join(vaultRoot, "90_系统/知识库看板.md"), "utf8");
    let accidentalDirectoryExists = true;
    try {
      await access(path.join(cwd, "--vault-root"));
    } catch {
      accidentalDirectoryExists = false;
    }

    expect(dashboardNote).toContain("# 知识库看板");
    expect(accidentalDirectoryExists).toBe(false);
  });

  it("removes macOS sidecar artifacts when refreshing system views", async () => {
    const vaultRoot = await mkdtemp(path.join(os.tmpdir(), "obsidian-vault-cleanup-"));
    await initializeVault(vaultRoot);

    const junkPath = path.join(vaultRoot, "90_系统", "._知识库看板.md");
    await writeFile(junkPath, "junk", "utf8");
    expect(await fileExists(junkPath)).toBe(true);

    await refreshSystemViews(vaultRoot);

    expect(await fileExists(junkPath)).toBe(false);
  });

  it("shows recently updated source notes first on the dashboard", async () => {
    const vaultRoot = await mkdtemp(path.join(os.tmpdir(), "obsidian-vault-recent-"));
    await initializeVault(vaultRoot);

    const olderPath = path.join(vaultRoot, "10_来源笔记/md/来源 - 较早来源.md");
    const newerPath = path.join(vaultRoot, "10_来源笔记/md/来源 - 较新来源.md");
    await writeFile(olderPath, "# 来源 - 较早来源\n", "utf8");
    await writeFile(newerPath, "# 来源 - 较新来源\n", "utf8");

    const olderTime = new Date("2026-06-01T10:00:00.000Z");
    const newerTime = new Date("2026-06-01T12:00:00.000Z");
    await utimes(olderPath, olderTime, olderTime);
    await utimes(newerPath, newerTime, newerTime);

    await refreshSystemViews(vaultRoot);

    const dashboardNote = await readFile(path.join(vaultRoot, "90_系统/知识库看板.md"), "utf8");
    expect(dashboardNote.indexOf("[[来源 - 较新来源]]")).toBeLessThan(
      dashboardNote.indexOf("[[来源 - 较早来源]]"),
    );
  });
});
