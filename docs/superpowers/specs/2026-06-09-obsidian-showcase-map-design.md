# Obsidian Showcase Map Design

## Context

The Obsidian vault is the formal knowledge system. It already uses separate folders for sources, insights, playbooks, maps, projects, and drafts.

The HTML showcase is a presentation layer. It should display selected knowledge assets as a polished learning journey, but it should not force every Obsidian note to follow the same visual template.

## Goal

Create a minimal one-way loop from Obsidian to the HTML showcase:

1. Knowledge is captured and refined in Obsidian.
2. A dedicated showcase map selects and groups relevant notes.
3. The HTML page reads or is regenerated from that map.
4. The showcase can link back to Obsidian notes.

The design must preserve the current vault architecture.

## Non-Goals

- Do not let the HTML page write back to Obsidian.
- Do not require all source notes, insights, or playbooks to share one rigid template.
- Do not move or rename existing formal vault folders.
- Do not build a real-time sync service in the first version.
- Do not make the showcase page the source of truth.

## Core Principle

The knowledge structure and the presentation structure are allowed to differ.

Obsidian remains the source of truth. The HTML page is a display surface. A showcase map translates between the two.

## Proposed Minimal Loop

```text
Obsidian formal notes
10_Sources / 40_Insights / 50_Playbooks / 60_Maps
        ↓
AI Builder Showcase Map
        ↓
showcase data
        ↓
HTML showcase
        ↓
Obsidian links
```

## New Mapping Layer

Create one dedicated map note:

`knowledge-vault/60_Maps/AI Builder Showcase Map.md`

This note is not a replacement for the existing knowledge map. It is a presentation index for the HTML showcase.

Each showcased capability node should use the same mapping fields:

- Learning input
- Project output
- Knowledge assets
- Transferable capability

Each field contains links or short evidence items. The linked notes can keep their own native structure.

## Example Node Mapping

```markdown
## LLM / Agent 基础

track: AI Builder 工程能力线
node: 01

### Learning input
- [[AI Builder Week 0 课前自学]]
- Karpathy LLM OS
- Lilian Weng Agent
- Anthropic Building Effective Agents

### Project output
- Agent 组件图
- 第一个最小 Skill
- 工具跑通记录
- Builder 最低完成线

### Knowledge assets
- [[LLM 不是确定性函数]]
- [[Agent 不是单次问答]]
- [[AI Skill 设计最小检查清单]]

### Transferable capability
- Agent 复杂度判断
- Skill 设计起点
- Eval 前置原则
- 人机协同边界
```

## HTML Behavior

The HTML showcase should not read every Obsidian note directly. It should consume the showcase map or a generated data object derived from the map.

The detail workspace keeps the current layout:

- Left side: evidence directory
- Right side: expanded content

The directory labels stay fixed:

1. Learning input
2. Project output
3. Knowledge assets
4. Transferable capability

The expanded content changes per capability node based on the showcase map.

## Link Behavior

For the first working loop, links should be one-way:

- HTML chips can open Obsidian notes using Obsidian links.
- HTML does not edit or create notes.
- If a linked note is missing, the showcase should show the label as plain text rather than failing.

## First Slice

Only wire one capability node first:

`LLM / Agent 基础`

Success for the first slice means:

- The showcase map contains this node.
- The HTML detail view can display the four evidence categories from the map.
- At least one knowledge asset chip opens the corresponding Obsidian note.
- Existing source, insight, playbook, and map folders remain unchanged.

## Acceptance Criteria

- The Obsidian vault remains the source of truth.
- The HTML page does not require formal notes to be reshaped for presentation.
- The mapping layer can represent one capability node end to end.
- The same mapping format can be reused for the other timeline nodes.
- The first implementation is one-way from Obsidian to HTML.
- Clicking a linked knowledge asset can open Obsidian when a target note exists.
- Missing or informal evidence items can still display as plain text.

## Risks And Mitigations

- Risk: the showcase map becomes another messy note.
  Mitigation: keep it as an index with fixed sections and short evidence items.

- Risk: HTML and Obsidian drift apart.
  Mitigation: treat the showcase map as the only presentation-facing source and regenerate the HTML data from it.

- Risk: implementation becomes too large.
  Mitigation: only wire `LLM / Agent 基础` first, then expand after the loop is proven.
