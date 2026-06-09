# Week Badge Timeline Design

## Context

The dual-track showcase timeline currently shows four capability nodes per track, but the course progression is not obvious enough at a glance. The user wants the timeline to make the learning sequence clearer without adding another heavy layer of UI.

## Goal

Add a minimal week label to each timeline node so viewers can immediately read the sequence as `Week 1` through `Week 4`.

The displayed week labels are presentation labels only. Internally, the source files remain mapped to the original course filenames:

- UI `Week 1` maps to source `Week0`
- UI `Week 2` maps to source `Week1`
- UI `Week 3` maps to source `Week3`
- UI `Week 4` maps to source `Week4`

## Design

Each milestone node gets one small `Week` badge near the existing node index. The badge should be visually lighter than the node title and should not introduce a new row, axis, legend, hover state, or source explanation.

Example node hierarchy:

1. Small metadata row: `Week 1` and existing node index
2. Main title: `LLM / Agent 基础`
3. One-line description

Apply the same `Week 1-4` sequence to both tracks. This keeps the visual rhythm aligned while preserving the dual-track comparison.

## Non-Goals

- Do not add a separate top week axis.
- Do not show original source filenames on the timeline.
- Do not explain the `Week0 / Week1 / Week3 / Week4` mapping in the visible timeline.
- Do not change the detail workspace content model.
- Do not rename source files or Obsidian notes.

## Data Rule

The UI layer may use display labels `Week 1-4`. The map/source layer keeps the original source references. If implementation adds metadata, it should be named clearly as display metadata, for example `displayWeek`, so it is not confused with source provenance.

## Acceptance Criteria

- Each of the eight timeline nodes shows a small `Week 1`, `Week 2`, `Week 3`, or `Week 4` label.
- The timeline remains visually lightweight and no new axis or legend is added.
- Existing node titles, descriptions, click behavior, and detail workspace stay unchanged.
- Generated data and tests continue to pass after implementation.

