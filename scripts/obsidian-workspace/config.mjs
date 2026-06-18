export const DEFAULT_VAULT_ROOT = "/Volumes/dockcase/kani‘s vibe coding world";

export const VAULT_DIRS = [
  "00_收件箱/md",
  "00_收件箱/youtube",
  "00_收件箱/pdf",
  "10_来源笔记/md",
  "10_来源笔记/youtube",
  "10_来源笔记/pdf",
  "11_复盘笔记",
  "20_主题工作台",
  "21_主题卡片",
  "30_项目视图",
  "31_课程视图",
  "40_输出",
  "90_系统",
];

export const SYSTEM_FILE_CONTENT = {
  "90_系统/_index.md":
    "# 知识库导航\n\n- [[知识库看板]]\n- [[主题地图]]\n- [[当前沉淀成果]]\n- [[_主题总表]]\n- [[_项目扫描清单]]\n- [[_收件规则]]\n- [[_log]]\n",
  "90_系统/_log.md": "# 操作日志\n",
  "90_系统/_主题总表.md": "# 主题总表\n\n## 当前主题\n",
  "90_系统/_项目扫描清单.md": "# 项目扫描清单\n\n## 启用中的项目\n\n- 暂无\n",
  "90_系统/_收件规则.md":
    "# 收件规则\n\n- Markdown 进入 `00_收件箱/md`\n- YouTube 链接进入 `00_收件箱/youtube`\n- PDF 进入 `00_收件箱/pdf`\n- `node_modules`、`.git`、`.venv`、`dist` 等目录不进入自动化流程\n",
  "90_系统/知识库看板.md": "# 知识库看板\n",
  "40_输出/当前沉淀成果.md": "# 当前沉淀成果\n",
  "00_从这里开始.md": "# 从这里开始\n",
};

export const SOURCE_KIND_DIR = {
  md: "md",
  youtube: "youtube",
  pdf: "pdf",
};

export function getVaultRoot(override) {
  return override || process.env.OBSIDIAN_VAULT_ROOT || DEFAULT_VAULT_ROOT;
}
