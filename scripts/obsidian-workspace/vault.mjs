import path from "node:path";
import { readdir, rm, stat, writeFile } from "node:fs/promises";
import { SOURCE_KIND_DIR, SYSTEM_FILE_CONTENT, VAULT_DIRS, getVaultRoot } from "./config.mjs";
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
  replaceStatus,
  safeFileStem,
  summarizeMarkdown,
  writeFileIfMissing,
  readUtf8,
} from "./helpers.mjs";

export async function initializeVault(vaultRoot = getVaultRoot()) {
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

  await refreshSystemViews(vaultRoot);

  return {
    vaultRoot,
    createdDirectories,
    createdFiles,
  };
}

export async function ingestMarkdownSource({ vaultRoot = getVaultRoot(), inputPath }) {
  const sourceText = await readUtf8(inputPath);
  const sourceTitle = extractTitle(sourceText, path.basename(inputPath, path.extname(inputPath)));
  const safeTitle = safeFileStem(sourceTitle);
  const inboxPath = path.join(vaultRoot, "00_收件箱", SOURCE_KIND_DIR.md, `${safeTitle}.md`);
  const sourceNotePath = path.join(
    vaultRoot,
    "10_来源笔记",
    SOURCE_KIND_DIR.md,
    `来源 - ${safeTitle}.md`,
  );

  await ensureDir(path.dirname(inboxPath));
  await writeFile(inboxPath, sourceText, "utf8");
  await writeFile(
    sourceNotePath,
    renderMarkdownSourceNote({ inputPath, sourceTitle, sourceText }),
    "utf8",
  );
  await refreshSystemViews(vaultRoot);

  return { sourceNotePath, inboxPath };
}

export async function ingestYouTubeSource({ vaultRoot = getVaultRoot(), url, title }) {
  const safeTitle = safeFileStem(title);
  const inboxPath = path.join(vaultRoot, "00_收件箱", SOURCE_KIND_DIR.youtube, `${safeTitle}.md`);
  const sourceNotePath = path.join(
    vaultRoot,
    "10_来源笔记",
    SOURCE_KIND_DIR.youtube,
    `来源 - ${safeTitle}.md`,
  );
  const inboxText = `# ${safeTitle}\n\n- 链接：${url}\n- 类型：YouTube\n`;

  await ensureDir(path.dirname(inboxPath));
  await writeFile(inboxPath, inboxText, "utf8");
  await writeFile(sourceNotePath, renderYouTubeSourceNote({ title: safeTitle, url }), "utf8");
  await refreshSystemViews(vaultRoot);

  return { sourceNotePath, inboxPath };
}

export async function autoCloseMarkdownLoop({
  vaultRoot = getVaultRoot(),
  inputPath,
  themeLimit = 2,
  cardLimit = 2,
}) {
  const ingestion = await ingestMarkdownSource({ vaultRoot, inputPath });
  const sourceNotePath = ingestion.sourceNotePath;
  const sourceNoteText = await readUtf8(sourceNotePath);
  const withApprovedThemes = autoApproveThemeCandidates(sourceNoteText, themeLimit);
  const withApprovedCards = autoApproveCardCandidates(withApprovedThemes, cardLimit);
  const readyToConfirm = replaceStatus(withApprovedCards, "待确认");
  await writeFile(sourceNotePath, readyToConfirm, "utf8");

  const confirmation = await confirmSourceNote({ vaultRoot, sourceNotePath });
  return {
    ...ingestion,
    ...confirmation,
  };
}

export async function autoCloseMarkdownDirectory({
  vaultRoot = getVaultRoot(),
  inputDir,
  themeLimit = 2,
  cardLimit = 2,
}) {
  const markdownFiles = [];
  const skippedFiles = [];

  await collectMarkdownFiles(inputDir, markdownFiles, skippedFiles);

  const processedFiles = [];
  for (const inputPath of markdownFiles) {
    const result = await autoCloseMarkdownLoop({
      vaultRoot,
      inputPath,
      themeLimit,
      cardLimit,
    });

    processedFiles.push({
      inputPath,
      sourceNotePath: result.sourceNotePath,
      approvedThemes: result.approvedThemes,
      approvedCards: result.approvedCards,
    });
  }

  return {
    processedFiles,
    skippedFiles,
  };
}

export async function confirmSourceNote({ vaultRoot = getVaultRoot(), sourceNotePath }) {
  const sourceNoteText = await readUtf8(sourceNotePath);
  const sourceTitle = extractTitle(sourceNoteText, path.basename(sourceNotePath, ".md")).replace(
    /^来源 - /,
    "",
  );
  const sourceNoteStem = path.basename(sourceNotePath, ".md");
  const approvedThemes = parseApprovedCheckboxes(sourceNoteText, "候选主题");
  const approvedCards = parseApprovedCheckboxes(sourceNoteText, "候选卡片");
  const contextView = resolveContextView({
    sourceTitle,
    sourceNoteStem,
    sourceNoteText,
    approvedThemes,
  });
  await upsertContextViewNote({
    vaultRoot,
    contextView,
    sourceNoteStem,
    approvedThemes,
    approvedCards,
  });
  const reviewNoteStem = await upsertReviewNote({
    vaultRoot,
    sourceTitle,
    sourceNoteStem,
    sourceNoteText,
    approvedThemes,
    approvedCards,
    contextView,
  });

  for (const theme of approvedThemes) {
    await upsertThemeNote({
      vaultRoot,
      theme,
      sourceNoteStem,
      approvedCards,
      reviewNoteStem,
    });
  }

  for (const entry of approvedCards) {
    await upsertCardNote({
      vaultRoot,
      entry,
      sourceNoteStem,
      approvedThemes,
      contextView,
      reviewNoteStem,
    });
  }

  const updatedSourceNote = replaceStatus(sourceNoteText, "已提炼");
  await writeFile(sourceNotePath, updatedSourceNote, "utf8");

  const logPath = path.join(vaultRoot, "90_系统/_log.md");
  const existingLog = await readUtf8(logPath);
  const themeIndexPath = path.join(vaultRoot, "90_系统/_主题总表.md");
  const existingThemeIndex = await readUtf8(themeIndexPath);
  const cardTitles = approvedCards.map((entry) => entry.split("｜")[0]);
  const logEntry = `\n## [${isoDateTime()}] confirm | ${sourceTitle}\n- 主题：${
    approvedThemes.join("、") || "无"
  }\n- 卡片：${cardTitles.join("、") || "无"}\n`;
  await writeFile(logPath, `${existingLog.trimEnd()}\n${logEntry}`, "utf8");

  let updatedThemeIndex = existingThemeIndex;
  for (const theme of approvedThemes) {
    updatedThemeIndex = appendUniqueBullet(updatedThemeIndex, "当前主题", `[[${theme}]]`);
  }
  await writeFile(themeIndexPath, updatedThemeIndex, "utf8");
  await refreshSystemViews(vaultRoot);

  return { approvedThemes, approvedCards, contextView, reviewNoteStem };
}

export async function refreshSystemViews(vaultRoot = getVaultRoot()) {
  await cleanupVaultArtifacts(vaultRoot);
  const themes = await listMarkdownStems(path.join(vaultRoot, "20_主题工作台"));
  const cards = await listMarkdownStems(path.join(vaultRoot, "21_主题卡片"));
  const sourceNotes = [
    ...(await listMarkdownNotes(path.join(vaultRoot, "10_来源笔记", SOURCE_KIND_DIR.md))),
    ...(await listMarkdownNotes(path.join(vaultRoot, "10_来源笔记", SOURCE_KIND_DIR.youtube))),
    ...(await listMarkdownNotes(path.join(vaultRoot, "10_来源笔记", SOURCE_KIND_DIR.pdf))),
  ];

  const latestSourceNotes = sourceNotes
    .sort((left, right) => right.mtimeMs - left.mtimeMs)
    .slice(0, 6)
    .map((entry) => entry.stem);

  await writeFile(
    path.join(vaultRoot, "90_系统", "知识库看板.md"),
    renderDashboardNote({ themes, cards, latestSourceNotes, sourceCount: sourceNotes.length }),
    "utf8",
  );
  await writeFile(path.join(vaultRoot, "00_从这里开始.md"), renderStartNote(), "utf8");
  await writeFile(
    path.join(vaultRoot, "40_输出", "当前沉淀成果.md"),
    renderOutputNote({ themes, cards, latestSourceNotes, sourceCount: sourceNotes.length }),
    "utf8",
  );
  await writeFile(
    path.join(vaultRoot, "90_系统", "主题地图.canvas"),
    JSON.stringify(buildThemeMapCanvas({ themes, latestSourceNotes }), null, 2),
    "utf8",
  );

  return {
    themeCount: themes.length,
    cardCount: cards.length,
    sourceCount: sourceNotes.length,
  };
}

function resolveContextView({ sourceTitle, sourceNoteStem, sourceNoteText, approvedThemes }) {
  const title = `${sourceTitle} ${sourceNoteStem} ${sourceNoteText}`;

  if (/暖暖/u.test(title)) {
    return {
      dir: "30_项目视图",
      name: "暖暖项目",
      kind: "project",
    };
  }

  if (/Builder/u.test(title)) {
    return {
      dir: "31_课程视图",
      name: "AI Builder 自学路径",
      kind: "course",
    };
  }

  if (/AI builder培训交流群|AI Builder培训交流群|AI Builder 自学/u.test(title)) {
    return {
      dir: "31_课程视图",
      name: "AI Builder 自学路径",
      kind: "course",
    };
  }

  if (/记忆/u.test(title) || approvedThemes.includes("记忆系统设计")) {
    return {
      dir: "30_项目视图",
      name: "记忆系统研究",
      kind: "project",
    };
  }

  return {
    dir: "30_项目视图",
    name: "待归类研究",
    kind: "project",
  };
}

async function upsertContextViewNote({
  vaultRoot,
  contextView,
  sourceNoteStem,
  approvedThemes,
  approvedCards,
}) {
  const contextPath = path.join(vaultRoot, contextView.dir, `${safeFileStem(contextView.name)}.md`);
  const sourceLink = `[[${sourceNoteStem}]]`;
  const themeLinks = approvedThemes.map((theme) => `[[${theme}]]`);
  const cardLinks = approvedCards.map((entry) => `[[${entry.split("｜")[0]}]]`);
  const baseContent = `---\ntype: ${contextView.kind}_view\nupdated: ${isoDate()}\n---\n\n# ${contextView.name}\n\n## 当前判断\n- 待从复盘笔记持续补充\n\n## 相关来源\n\n## 相关主题\n\n## 相关卡片\n\n## 下一步\n- 待补充\n`;
  const existing = (await fileExists(contextPath)) ? await readUtf8(contextPath) : baseContent;
  let next = appendUniqueBullet(existing, "相关来源", sourceLink);
  for (const themeLink of themeLinks) {
    next = appendUniqueBullet(next, "相关主题", themeLink);
  }
  for (const cardLink of cardLinks) {
    next = appendUniqueBullet(next, "相关卡片", cardLink);
  }

  await writeFile(contextPath, next, "utf8");
}

async function upsertReviewNote({
  vaultRoot,
  sourceTitle,
  sourceNoteStem,
  sourceNoteText,
  approvedThemes,
  approvedCards,
  contextView,
}) {
  const reviewNoteStem = `复盘 - ${sourceTitle}`;
  const reviewPath = path.join(vaultRoot, "11_复盘笔记", `${safeFileStem(reviewNoteStem)}.md`);
  const summaryLines = extractSectionBullets(sourceNoteText, "内容摘要").slice(0, 5);
  const cardTitles = approvedCards.map((entry) => entry.split("｜")[0]);
  const expansionSection = renderExpansionSection({ sourceTitle, approvedThemes });
  const reviewBody = `---\ntype: review\nsource: [[${sourceNoteStem}]]\nthemes:\n${
    approvedThemes.map((theme) => `  - ${theme}`).join("\n") || "  - 待分类"
  }\ncontext_view: [[${contextView.name}]]\nstatus: 初稿\ncreated: ${isoDate()}\nupdated: ${isoDate()}\n---\n\n# ${reviewNoteStem}\n\n## 这篇在讲什么\n${
    summaryLines.map((line) => `- ${line}`).join("\n") || "- 待补摘要"
  }\n\n## 我提炼出的关键判断\n${
    cardTitles.map((title) => `- [[${title}]]`).join("\n") || "- 待补判断"
  }\n\n## 为什么重要\n- ${buildReviewImportanceLine(approvedThemes, contextView.name)}\n\n## 我的理解\n- ${buildReviewUnderstandingLine(approvedThemes, sourceTitle)}\n\n## 对我当前项目的启发\n- ${buildProjectInsightLine(contextView.name, approvedThemes[0] || "待分类", sourceTitle)}\n\n## 反例或边界\n- ${buildReviewBoundaryLine(approvedThemes)}\n\n## 下一步动作\n- ${buildNextActionLine(contextView.name, approvedThemes[0] || "待分类")}\n${expansionSection}\n\n## 关联\n- 来源：[[${sourceNoteStem}]]\n- 主题：${approvedThemes.map((theme) => `[[${theme}]]`).join("、") || "[[待分类]]"}\n- 项目/课程：[[${contextView.name}]]\n`;
  await writeFile(reviewPath, reviewBody, "utf8");
  return reviewNoteStem;
}

function renderMarkdownSourceNote({ inputPath, sourceTitle, sourceText }) {
  const summaryLines = summarizeMarkdown(sourceText);
  const themes = detectThemes(sourceText);
  const cards = detectCards(sourceText);

  return `---\ntype: source\nsource_kind: md\nsource_path: ${inputPath}\nsource_url:\nthemes:\n${
    themes.map((theme) => `  - ${theme}`).join("\n") || "  - 未分类"
  }\nstatus: 待提炼\ncreated: ${isoDate()}\nupdated: ${isoDate()}\n---\n\n# 来源 - ${sourceTitle}\n\n## 内容摘要\n${
    summaryLines.map((line) => `- ${line}`).join("\n") || "- 暂无摘要"
  }\n\n## 候选主题\n${
    themes.map((theme) => `- [ ] ${theme}`).join("\n") || "- [ ] 未分类"
  }\n\n## 候选卡片\n${
    cards.map((card) => `- [ ] ${card}｜待补充结论说明`).join("\n") || "- [ ] 待人工提炼｜待补充结论说明"
  }\n`;
}

function renderYouTubeSourceNote({ title, url }) {
  return `---\ntype: source\nsource_kind: youtube\nsource_path:\nsource_url: ${url}\nthemes:\n  - 待分类\nstatus: 待提炼\ncreated: ${isoDate()}\nupdated: ${isoDate()}\n---\n\n# 来源 - ${title}\n\n## 内容摘要\n- 来自 YouTube 的待整理视频链接\n- 链接：${url}\n\n## 候选主题\n- [ ] 待观看后补主题\n\n## 候选卡片\n- [ ] 观看后补充卡片结论｜观看后补充一句结论\n`;
}

async function upsertThemeNote({
  vaultRoot,
  theme,
  sourceNoteStem,
  approvedCards,
  reviewNoteStem,
}) {
  const themePath = path.join(vaultRoot, "20_主题工作台", `${safeFileStem(theme)}.md`);
  const sourceLink = `[[${sourceNoteStem}]]`;
  const cardLinks = approvedCards.map((entry) => `[[${entry.split("｜")[0]}]]`);
  const reviewLink = `[[${reviewNoteStem}]]`;
  const baseContent =
    "---\ntype: theme\n---\n\n# " +
    `${theme}\n\n## 当前判断\n- 从来源笔记持续补充\n\n## 核心卡片\n\n## 相关来源\n\n## 相关复盘\n\n## 未解问题\n- 待补充\n\n## 可输出方向\n- 待补充\n`;

  const existing = (await fileExists(themePath)) ? await readUtf8(themePath) : baseContent;
  let next = appendUniqueBullet(existing, "相关来源", sourceLink);
  next = appendUniqueBullet(next, "相关复盘", reviewLink);
  for (const cardLink of cardLinks) {
    next = appendUniqueBullet(next, "核心卡片", cardLink);
  }

  await writeFile(themePath, next, "utf8");
}

async function upsertCardNote({
  vaultRoot,
  entry,
  sourceNoteStem,
  approvedThemes,
  contextView,
  reviewNoteStem,
}) {
  const [cardTitle, conclusion = "待补充结论说明"] = entry.split("｜");
  const cardPath = path.join(vaultRoot, "21_主题卡片", `${safeFileStem(cardTitle)}.md`);

  const primaryTheme = approvedThemes[0] || "待分类";
  const themesBlock = approvedThemes.map((theme) => `  - ${theme}`).join("\n") || "  - 待分类";
  const themeLinks = approvedThemes.map((theme) => `[[${theme}]]`).join("、") || "[[待分类]]";
  const body = `---\ntype: card\nthemes:\n${themesBlock}\nsources:\n  - [[${sourceNoteStem}]]\ncontext_views:\n  - [[${contextView.name}]]\nreview:\n  - [[${reviewNoteStem}]]\nstatus: 正式\ncreated: ${isoDate()}\nupdated: ${isoDate()}\n---\n\n# ${cardTitle}\n\n## 结论\n${conclusion}\n\n## 为什么重要\n- ${buildImportanceLine(primaryTheme, contextView.name, cardTitle)}\n\n## 我的理解\n- ${buildUnderstandingLine(primaryTheme, cardTitle)}\n\n## 适用场景\n- 主题：${themeLinks}\n- 项目/课程：[[${contextView.name}]]\n\n## 反例或边界\n- ${buildBoundaryLine(primaryTheme, cardTitle)}\n\n## 对我当前项目的启发\n- ${buildProjectInsightLine(contextView.name, primaryTheme, cardTitle)}\n\n## 下一步动作\n- ${buildNextActionLine(contextView.name, primaryTheme)}\n\n## 关联\n- 来源：[[${sourceNoteStem}]]\n- 主题：${themeLinks}\n- 项目/课程：[[${contextView.name}]]\n- 复盘：[[${reviewNoteStem}]]\n`;

  await writeFile(cardPath, body, "utf8");
}

function autoApproveThemeCandidates(text, limit) {
  return updateCandidateSection(
    text,
    "候选主题",
    limit,
    (candidate) =>
      !candidate.includes("待") &&
      !/^(本周最低完成线|学习方法|本周选读材料|今天要回答|今日交付物|Day \d+)/.test(candidate),
  );
}

function autoApproveCardCandidates(text, limit) {
  return updateCandidateSection(
    text,
    "候选卡片",
    limit,
    (candidate) => {
      const [title] = candidate.split("｜");
      return (
        !/^(每天|今天|今日|本周|完成|写 \d+ 字|三个工具)/.test(title) &&
        !/[<>]|得分|L[1-4]/.test(title) &&
        (/(不是|而不是|而是|不等于|更重要|=)/.test(title) || !candidate.includes("待人工提炼"))
      );
    },
    (candidate) => {
      const [title, conclusion = "待补充结论说明"] = candidate.split("｜");
      if (conclusion !== "待补充结论说明") {
        return `${title}｜${conclusion}`;
      }

      return `${title}｜${draftConclusionFromCardTitle(title)}`;
    },
  );
}

function updateCandidateSection(text, heading, limit, shouldApprove, transform = (candidate) => candidate) {
  const sectionPattern = new RegExp(`(## ${escapeRegExp(heading)}\\n)([\\s\\S]*?)(?=\\n## |$)`);
  const match = text.match(sectionPattern);
  if (!match) {
    return text;
  }

  let approved = 0;
  const nextBody = match[2]
    .split("\n")
    .map((line) => {
      const checkboxMatch = line.match(/^- \[ \] (.+)$/);
      if (!checkboxMatch || approved >= limit) {
        return line;
      }

      const candidate = checkboxMatch[1].trim();
      if (!shouldApprove(candidate)) {
        return line;
      }

      approved += 1;
      return `- [x] ${transform(candidate)}`;
    })
    .join("\n");

  return text.replace(sectionPattern, `${match[1]}${nextBody}`);
}

function extractSectionBullets(text, heading) {
  const sectionPattern = new RegExp(`## ${escapeRegExp(heading)}\\n([\\s\\S]*?)(?=\\n## |$)`);
  const match = text.match(sectionPattern);
  if (!match) {
    return [];
  }

  return [...match[1].matchAll(/^- (.+)$/gm)].map((entry) => entry[1].trim());
}

function renderExpansionSection({ sourceTitle, approvedThemes }) {
  if (!/记忆/u.test(sourceTitle) && !approvedThemes.includes("记忆系统设计")) {
    return "";
  }

  return `\n## 还可以往哪里发散\n- 个性化层：记住身份、偏好、目标，减少重复沟通\n- 工作流层：沉淀任务历史、错误修正与工具使用偏好\n- 团队知识层：把个人记忆长成团队共享知识\n- 评测层：把失败样本、修复经验转成长期 eval 资产\n- 商业化层：延展到 AI 陪伴、教育、办公、客服等长期关系产品\n- 安全治理层：设计记忆边界、保留期限、删除与风险分级机制`;
}

function buildReviewImportanceLine(approvedThemes, contextViewName) {
  if (approvedThemes.includes("记忆系统设计")) {
    return "这篇不是单点功能说明，而是在回答长期协作型 AI 产品怎样把上下文、偏好和项目知识稳定地留下来。";
  }

  if (contextViewName === "暖暖项目") {
    return "它会直接影响你的产品是不是只会一次性回答，还是能形成长期陪伴与持续改进。";
  }

  return "它能把零散来源转成可复用的判断，为后续主题页和项目决策提供稳定依据。";
}

function buildReviewUnderstandingLine(approvedThemes, sourceTitle) {
  if (approvedThemes.includes("记忆系统设计")) {
    return "我会把它理解成一套“分层记忆架构”，核心不是存得越多越好，而是让该常驻的信息常驻、该召回的细节按需召回。";
  }

  return `我会把《${sourceTitle}》当成一个可复用的判断样本，而不是只收藏原文。`;
}

function buildReviewBoundaryLine(approvedThemes) {
  if (approvedThemes.includes("记忆系统设计")) {
    return "记忆系统不是把所有历史都永久保留；如果没有召回边界、删除机制和风险分级，记忆会反过来拖慢系统并放大隐私风险。";
  }

  return "如果这条判断无法说明适用范围和不适用条件，它就还不够稳定，不能直接拿来指导决策。";
}

function buildImportanceLine(primaryTheme, contextViewName, cardTitle) {
  if (primaryTheme === "记忆系统设计") {
    return "它决定了系统该如何在长期协作里保留规则、索引和详情，而不是每轮都从零开始。";
  }

  if (contextViewName === "暖暖项目") {
    return "它会直接影响你的产品体验是否稳定，以及用户会不会愿意持续回来使用。";
  }

  return `这条判断会影响你在“${primaryTheme}”这个主题上的取舍，而不是一句可有可无的摘录。`;
}

function buildUnderstandingLine(primaryTheme, cardTitle) {
  if (primaryTheme === "记忆系统设计") {
    return `我会把“${cardTitle}”理解成一条架构原则，而不是实现细节；它在提醒我们先设计记忆分层，再讨论具体存储。`;
  }

  return `我会把“${cardTitle}”当成这个主题下的稳定判断，用来约束后续方案而不是只做记录。`;
}

function buildBoundaryLine(primaryTheme, cardTitle) {
  if (primaryTheme === "记忆系统设计") {
    return "如果场景不需要跨会话延续、团队共享或长期纠错，这条原则的收益会下降，甚至可能引入额外复杂度。";
  }

  return `如果“${cardTitle}”不能明确什么时候不用，那它还需要继续打磨。`;
}

function buildProjectInsightLine(contextViewName, primaryTheme, cardTitle) {
  if (contextViewName === "暖暖项目") {
    return "它提醒暖暖的记忆设计要优先服务陪伴连续性和安全边界，而不是盲目记住更多内容。";
  }

  if (contextViewName === "AI Builder 自学路径") {
    return "它可以作为课程里的方法卡，帮助你把抽象原则落到具体产品或 agent 实践里。";
  }

  if (contextViewName === "记忆系统研究") {
    return `它能直接补进记忆系统研究这条线，帮助你把“${primaryTheme}”从概念整理成产品设计原则。`;
  }

  return `它可以先挂到 [[${contextViewName}]]，等你后续明确场景后再变成更具体的动作。`;
}

function buildNextActionLine(contextViewName, primaryTheme) {
  if (contextViewName === "暖暖项目") {
    return "把这条判断翻译成产品字段、召回规则或风险边界，而不是停留在概念层。";
  }

  if (contextViewName === "AI Builder 自学路径") {
    return "把这条判断写成课程复盘或项目实践清单，验证它在真实任务里是否成立。";
  }

  if (primaryTheme === "记忆系统设计") {
    return "继续补一张架构图：哪些信息常驻、哪些按需召回、哪些绝不长期记忆。";
  }

  return "把这条判断和一个真实项目场景绑定，补齐例子、边界和下一步动作。";
}

function draftConclusionFromCardTitle(title) {
  if (title.includes("=")) {
    return title.replace(/^重点：/, "").trim();
  }

  if (title.includes("是指")) {
    return title;
  }

  if (title.includes("不是")) {
    return title.replace(/？$/, "");
  }

  if (title.includes("不等于")) {
    return title;
  }

  if (title.includes("更重要")) {
    return title;
  }

  return `这个知识点值得保留并在后续主题页中继续展开：${title.replace(/？$/, "")}`;
}

async function listMarkdownStems(dirPath) {
  const notes = await listMarkdownNotes(dirPath);
  return notes.map((entry) => entry.stem).sort((left, right) => left.localeCompare(right, "zh-Hans-CN"));
}

async function listMarkdownNotes(dirPath) {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const noteNames = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => name.endsWith(".md"))
    .filter((name) => !name.startsWith("."))
    .sort((left, right) => left.localeCompare(right, "zh-Hans-CN"));

  const notes = [];
  for (const name of noteNames) {
    const filePath = path.join(dirPath, name);
    const metadata = await stat(filePath);
    notes.push({
      stem: name.replace(/\.md$/u, ""),
      mtimeMs: metadata.mtimeMs,
    });
  }

  return notes;
}

async function cleanupVaultArtifacts(currentDir) {
  const entries = await readdir(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);

    if (entry.name.startsWith("._") || entry.name.startsWith(".__")) {
      await rm(fullPath, { recursive: true, force: true });
      continue;
    }

    if (entry.isDirectory()) {
      await cleanupVaultArtifacts(fullPath);
    }
  }
}

function renderStartNote() {
  return `# 从这里开始

- [[知识库看板]]
- [[主题地图]]
- [[_主题总表]]
- [[当前沉淀成果]]
- [[暖暖项目]]
- [[暖暖项目地图]]
- [[暖暖MVP沉淀摘要]]
- [[AI Builder 自学路径]]
`;
}

function renderDashboardNote({ themes, cards, latestSourceNotes, sourceCount }) {
  return `# 知识库看板

## 当前成果
- 主题数：${themes.length}
- 卡片数：${cards.length}
- 来源总数：${sourceCount}

## 快速入口
- [[00_从这里开始]]
- [[主题地图]]
- [[当前沉淀成果]]
- [[_主题总表]]

## 当前主题
${themes.map((theme) => `- [[${theme}]]`).join("\n") || "- 暂无"}

## 最近来源
${latestSourceNotes.map((note) => `- [[${note}]]`).join("\n") || "- 暂无"}

## 建议动作
- 把新的 Markdown 继续丢进 \`00_收件箱/md\`
- 打开 [[主题地图]] 看主题之间的关系
- 需要对外输出时，从 [[当前沉淀成果]] 往下接
`;
}

function renderOutputNote({ themes, cards, latestSourceNotes, sourceCount }) {
  return `# 当前沉淀成果

## 这一版已经有的东西
- 已经形成 ${themes.length} 个主题工作台
- 已经沉淀 ${cards.length} 张主题卡片
- 累计处理 ${sourceCount} 条来源

## 主题入口
${themes.map((theme) => `- [[${theme}]]`).join("\n") || "- 暂无"}

## 最近来源
${latestSourceNotes.map((note) => `- [[${note}]]`).join("\n") || "- 暂无"}

## 下一步
- 继续导入高价值 Markdown
- 从主题页往课程稿、方案稿、文章稿延伸
`;
}

function buildThemeMapCanvas({ themes, latestSourceNotes }) {
  const nodes = [];
  const edges = [];
  let idCounter = 1;
  const nextId = () => (idCounter++).toString(16).padStart(16, "0");

  const rootId = nextId();
  nodes.push({
    id: rootId,
    type: "text",
    x: 0,
    y: 0,
    width: 360,
    height: 180,
    color: "3",
    text: "# 知识库主题地图\n\n中心：主题沉淀工作台\n\n打开两侧节点即可进入结果页与主题页。",
  });

  const dashboardId = nextId();
  nodes.push({
    id: dashboardId,
    type: "file",
    x: -460,
    y: 0,
    width: 320,
    height: 220,
    color: "5",
    file: "90_系统/知识库看板.md",
  });
  edges.push({
    id: nextId(),
    fromNode: rootId,
    fromSide: "left",
    toNode: dashboardId,
    toSide: "right",
    toEnd: "arrow",
    label: "系统入口",
  });

  const outputId = nextId();
  nodes.push({
    id: outputId,
    type: "file",
    x: 460,
    y: 0,
    width: 320,
    height: 220,
    color: "4",
    file: "40_输出/当前沉淀成果.md",
  });
  edges.push({
    id: nextId(),
    fromNode: rootId,
    fromSide: "right",
    toNode: outputId,
    toSide: "left",
    toEnd: "arrow",
    label: "成果总览",
  });

  nodes.push({
    id: nextId(),
    type: "group",
    x: -160,
    y: 260,
    width: 980,
    height: Math.max(320, Math.ceil(themes.length / 2) * 170 + 120),
    label: "主题层",
    color: "4",
  });

  themes.forEach((theme, index) => {
    const themeId = nextId();
    nodes.push({
      id: themeId,
      type: "file",
      x: 0 + (index % 2) * 420,
      y: 320 + Math.floor(index / 2) * 170,
      width: 320,
      height: 140,
      color: "4",
      file: `20_主题工作台/${theme}.md`,
    });
    edges.push({
      id: nextId(),
      fromNode: rootId,
      fromSide: "bottom",
      toNode: themeId,
      toSide: "top",
      toEnd: "arrow",
    });
  });

  nodes.push({
    id: nextId(),
    type: "group",
    x: -1040,
    y: 260,
    width: 760,
    height: Math.max(320, latestSourceNotes.length * 150 + 80),
    label: "最近来源",
    color: "2",
  });

  latestSourceNotes.forEach((note, index) => {
    const sourceId = nextId();
    nodes.push({
      id: sourceId,
      type: "file",
      x: -980,
      y: 320 + index * 150,
      width: 620,
      height: 120,
      color: "2",
      file: resolveSourceFilePath(note),
    });
    edges.push({
      id: nextId(),
      fromNode: dashboardId,
      fromSide: "bottom",
      toNode: sourceId,
      toSide: "top",
      toEnd: "arrow",
    });
  });

  return { nodes, edges };
}

function resolveSourceFilePath(note) {
  if (note.startsWith("来源 - Lenny Podcast")) {
    return `10_来源笔记/${SOURCE_KIND_DIR.youtube}/${note}.md`;
  }

  return `10_来源笔记/${SOURCE_KIND_DIR.md}/${note}.md`;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function collectMarkdownFiles(currentDir, markdownFiles, skippedFiles) {
  const entries = await readdir(currentDir, { withFileTypes: true });
  const sortedEntries = [...entries].sort((left, right) => left.name.localeCompare(right.name, "zh-Hans-CN"));

  for (const entry of sortedEntries) {
    const fullPath = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      if (isIgnoredDirectory(entry.name)) {
        continue;
      }

      await collectMarkdownFiles(fullPath, markdownFiles, skippedFiles);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    if (!entry.name.endsWith(".md")) {
      continue;
    }

    if (
      entry.name.endsWith(".preview.md") ||
      entry.name.startsWith("._") ||
      entry.name.startsWith("_") ||
      entry.name === "SKILL.md"
    ) {
      skippedFiles.push(fullPath);
      continue;
    }

    markdownFiles.push(fullPath);
  }
}

function isIgnoredDirectory(name) {
  return [
    ".git",
    ".venv",
    "_logs",
    "node_modules",
    "dist",
    "build",
    "coverage",
  ].includes(name);
}
