# Week Flow Timeline Design

## Context

The dual-track showcase timeline currently shows four capability nodes per track, but the course progression is not obvious enough at a glance. The user wants the timeline to make the learning sequence clearer without adding another heavy layer of UI.

## Goal

Make the learning progression clearer by combining two lightweight UI cues:

1. Replace each node's numeric badge with a display week label.
2. Add a subtle shared week flow line between the Builder and Product tracks.

The displayed week labels are presentation labels only. Internally, the source files remain mapped to the original course filenames:

- UI `Week 1` maps to source `Week0`
- UI `Week 2` maps to source `Week1`
- UI `Week 3` maps to source `Week3`
- UI `Week 4` maps to source `Week4`

## Design

Each milestone node replaces the current `01 / 02 / 03 / 04` badge with one small display week badge. The badge should be visually lighter than the node title and should not include source filenames.

Example node hierarchy:

1. Small metadata badge: `Week 1`
2. Main title: `LLM / Agent 基础`
3. One-line description

Add one shared course-flow strip between the two tracks:

`Week 1 -> Week 2 -> Week 3 -> Week 4`

The strip should be subtle: thin line, small dots or labels, and a light arrow direction. It should explain the overall course direction without becoming the main visual element.

Node week labels are configured independently. Multiple nodes may share the same display week.

## Node Mapping

| Node | UI display week | Internal source week |
|---|---:|---|
| `LLM / Agent 基础` | `Week 1` | `Week0` |
| `Skill 与助理原型` | `Week 2` | `Week1` |
| `AI 产品基础判断` | `Week 2` | `Week1` |
| `竞品分析` | `Week 2` | `Week1` |
| `评测体系` | `Week 3` | `Week3` |
| `Product Spec` | `Week 3` | `Week3` |
| `Product Evals` | `Week 3` | `Week3` |
| `稳定性工程` | `Week 4` | `Week4` |

## Non-Goals

- Do not show original source filenames on the timeline.
- Do not explain the `Week0 / Week1 / Week3 / Week4` mapping in the visible timeline.
- Do not change the detail workspace content model.
- Do not rename source files or Obsidian notes.
- Do not force the two tracks into a strict one-node-per-week grid.

## Data Rule

The UI layer may use display labels `Week 1-4`. The map/source layer keeps the original source references.

If implementation adds metadata, use separate names so display and provenance are not confused:

- `displayWeek`: `Week 1`, `Week 2`, `Week 3`, or `Week 4`
- `sourceWeek`: `Week0`, `Week1`, `Week3`, or `Week4`

## Acceptance Criteria

- Each of the eight timeline nodes shows a small `Week 1`, `Week 2`, `Week 3`, or `Week 4` label instead of the old numeric badge.
- A subtle shared week flow line appears between the Builder and Product tracks.
- The flow line shows `Week 1 -> Week 2 -> Week 3 -> Week 4`.
- The timeline remains visually lightweight and avoids large arrows, extra source explanations, or dense legends.
- Existing node titles, descriptions, click behavior, and detail workspace stay unchanged.
- Generated data and tests continue to pass after implementation.

