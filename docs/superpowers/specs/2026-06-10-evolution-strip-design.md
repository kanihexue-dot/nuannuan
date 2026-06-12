# 成果概览 · 四格进化条设计

status: approved
date: 2026-06-10

## 目标

将 Hero 区「成果概览」中的圆环 `mini-orbit` 替换为横向 **四格进化条**（地铁线路图），并与双轨时间线里程碑联动。

## 已定决策

| 项 | 决定 |
|----|------|
| 站 1 标题 | 能力基础 |
| 站 4 标题 | 测评 |
| 站 2 / 站 3 标题 | 先占位（阶段二 / 阶段三） |
| 卡片主内容 | 综合阐述 = 当前阶段两个节点名（工程在上、产品在下） |
| 血条规则 | 只亮当前站（不累计、无双轨细条） |
| 节点顺序 | 工程线在上，产品线在下 |

## 四站映射

| 站 | 站名 | 工程节点 | 产品节点 |
|----|------|----------|----------|
| 1 | 能力基础 | foundation-builder · LLM / Agent 基础 | foundation-product · AI 产品基础判断 |
| 2 | 阶段二（占位） | assistant-prototype-builder · Skill 与助理原型 | competitive-product · 竞品分析 |
| 3 | 阶段三（占位） | evaluation-builder · 评测体系 | spec-product · Product Spec |
| 4 | 测评 | stability-builder · 稳定性工程 | evals-product · Product Evals |

## 交互

- 点击进化条某一站：该站高亮，血条只亮对应 1/4 段，滚动至 `#journey`。
- 点击站内工程/产品节点名：打开对应 `data-detail` 详情（复用 `openDetailWorkspace`）。
- 点击时间线里程碑：进化条同步跳到对应站。

## 实现范围

- 文件：`docs/superpowers/showcase/ai-builder-narrative-showcase.html`
- 替换：`mini-orbit` 相关 HTML/CSS
- 新增：进化条 markup、样式、联动脚本
- 不改动：双轨时间线结构、节点详情三层证据目录

## 响应式

- 宽屏：四卡横排 + 顶部轨道
- 窄屏：轨道保持，卡片横向滚动
