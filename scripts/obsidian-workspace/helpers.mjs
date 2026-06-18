import { access, mkdir, readFile, writeFile } from "node:fs/promises";
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
    [/(Agentic|增强型 LLM|augmented LLM|LangGraph|Rivet|Bedrock|直接使用 LLM API|建议开发者先直接使用 LLM API)/i, "Agent设计原则"],
    [/(eval|评测|验证策略)/i, "产品评测"],
    [/(情绪陪伴|AI陪伴|轻心理|重陪伴|Gentle Reflector|情绪表达)/i, "情绪陪伴设计"],
    [/(竞品|横向对比|拆解)/i, "竞品分析"],
    [/(MVP|业务目标|多轮对话率|停留时长|转化率|CTR)/i, "MVP验证"],
    [/(记忆系统|最近情绪|常见烦恼|用户偏好)/i, "记忆系统设计"],
    [/(Agent 设计原则|Agent设计原则|Agent = |agent搭建|skill|工具设计原则)/i, "Agent设计原则"],
    [/(tiny core|AI 产品不是|AI时代产品判断|产品判断)/i, "AI产品判断"],
    [/JTBD/i, "JTBD"],
  ];

  for (const [pattern, theme] of keywordMap) {
    if (pattern.test(body) && !themes.includes(theme)) {
      themes.push(theme);
    }
  }

  const headingThemes = [...body.matchAll(/^##\s+(.+)$/gm)]
    .map((match) => normalizeThemeCandidate(match[1].trim()))
    .filter((line) => line.length >= 2 && line.length <= 18)
    .filter((line) => !isGenericTheme(line))
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
    /让模型反思自己的错误/g,
    /没有 eval 的 AI 产品只是在碰运气。/g,
    /不说教、不强分析、不进行心理诊断、以倾听和陪伴为主/g,
    /\*\*工作流\*\* 是指通过预定义的代码路径来编排 LLM 与工具的系统。/g,
    /\*\*Agent\*\* 则是指由 LLM 动态地指挥自己的流程和工具使用方式的系统，始终由 LLM 来掌控完成任务的方式。/g,
    /建议开发者先直接使用 LLM API/g,
  ];

  for (const pattern of patterns) {
    const match = body.match(pattern);
    if (match) {
      cards.push(normalizeCardCandidate(match[0]));
    }
  }

  if (/不是把所有记忆全塞进去/u.test(body) && /规则常驻、索引常驻、详情按需加载、旧内容压缩/u.test(body)) {
    cards.push("记忆系统不是把所有记忆全塞进去");
  }

  if (/不是全部压成摘要/u.test(body) && /最近的对话原文会完整保留/u.test(body)) {
    cards.push("上下文压缩不是把一切都压成摘要");
  }

  if (/不用数据库，不用向量存储/u.test(body) && /每条记忆就是一个 \.md 文件/u.test(body)) {
    cards.push("长期记忆可以先用 Markdown 文件系统落地");
  }

  if (/为什么用 Sonnet 侧路/u.test(body) && /更快/u.test(body) && /更便宜/u.test(body) && /更可靠/u.test(body)) {
    cards.push("记忆召回应走轻量侧路，而不是让主模型临时想起来");
  }

  const bulletSentences = [...body.matchAll(/^\s*[-*]\s+(.{8,40})$/gm)]
    .map((match) => normalizeCardCandidate(match[1].trim()))
    .filter((line) => /(不是|而不是|而是|更重要|不等于|应该|=)/.test(line))
    .filter((line) => !isProceduralCard(line));

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

function normalizeThemeCandidate(value) {
  return value
    .replace(/^[0-9一二三四五六七八九十]+[、.．)\s-]*/u, "")
    .replace(/^第[0-9一二三四五六七八九十]+[章节部分]\s*/u, "")
    .trim();
}

function normalizeCardCandidate(value) {
  return value.replace(/\*\*/g, "").replace(/`/g, "").trim();
}

function isGenericTheme(value) {
  return /^(本周最低完成线|学习方法|本周选读材料|今天要回答|今日交付物|读一篇文章的 4 步法|Day \d+|引言|个人背景|研究背景|背景|研究方法|方法|文献综述|参考文献|附录|结论|赴日动机|动机|个人经历|项目背景|用户画像|需求目标|产品设计及内容板块|产品设计|产品模块|内容设计|项目配置|调研目标与概念定界|市场洞察|PRD|TODO LIST|测评集辅线任务)$/u.test(
    value,
  ) || /^(本周主线|如果时间不够|周[一二三四五六日天]|Part\s+[A-Z]|什么是 Agent|何时（以及何时不）使用 Agent|何时以及如何使用框架|构建模块、工作流与 Agent|组合与定制这些模式|总结|附录|为什么 AI 助手需要记忆系统|完整流程：按用户使用时序讲解)/u.test(value);
}

function isProceduralCard(value) {
  return (
    /^(每天|今天|今日|本周|完成|写 \d+ 字|三个工具)/.test(value) ||
    /[<>]|得分|L[1-4]/.test(value)
  );
}
