# Dual-Track Detail Workspace Design

## Context

The current showcase presents two learning tracks:

- AI Builder engineering capability line
- AI product manager capability line

The page should not become a stack of knowledge cards. Each timeline node should prove a capability through a concise, repeatable structure, while the underlying Obsidian notes remain available as supporting evidence.

## Goal

Create a timeline interaction model where clicking a capability node opens a full-width detail workspace in the timeline area.

The workspace should let the presenter explain one node with enough space, using four fixed evidence sections:

1. What I learned
2. What I completed
3. Key insight
4. Reusable method

Knowledge cards and Wikilinks should be secondary evidence, not the main visual content.

## Non-Goals

- Do not replace the dual-track timeline with a linear article.
- Do not show full knowledge-card bodies by default.
- Do not modify the formal Obsidian vault notes as part of this design.
- Do not implement Agent execution or dashboard controls in this interaction.

## Recommended Interaction

### Default State

The timeline section shows both tracks as an overview:

- AI Builder engineering line
- AI product manager line

Each line keeps four milestone nodes. This preserves the global story: the user is building both engineering execution ability and AI product judgment.

### Expanded State

When the user clicks any node, the whole timeline area changes into a full-width detail workspace.

The selected node stays conceptually anchored to the timeline, but the narrow inline dropdown is replaced by a spacious panel. This panel should cover the timeline content area, not jump to the bottom of the page.

The expanded workspace includes:

- Back action: return to dual-track timeline
- Track label: AI Builder engineering line or AI product manager line
- Node index and title
- Left-side four evidence sections
- Right-side project evidence chain visualization
- Lightweight related-source area

### Node Switching

Inside the detail workspace, show a small node switcher for the current track:

- 01
- 02
- 03
- 04

Selecting another node should switch the detail content directly. The presenter should not need to return to the timeline overview before moving through one track.

Returning to the full timeline should require an explicit back action.

## Detail Content Model

Every node uses the same four-section structure.

The detail workspace should avoid duplicating the same logic on both sides. It should present the evidence system as a directory-detail layout:

- Left side: fixed evidence directory
- Right side: selected expanded content

Every node must use the same evidence-chain template. The labels and order stay fixed; only the concrete evidence items change per node.

The evidence chain should represent how the node becomes a project outcome:

1. Learning input: course materials, external references, and basic concepts
2. Project output: visible artifacts, prototypes, diagrams, or frameworks
3. Knowledge asset: Source, Insight, Playbook, or Map notes
4. Transferable capability: methods that can be reused in the next AI product or Agent project

### What I Learned

Purpose: summarize input and understanding.

This section answers:

- What concept, pattern, or judgment did I learn?
- What changed in my understanding?
- Which boundary or misconception became clearer?

### What I Completed

Purpose: show visible output.

This section answers:

- What did I produce, organize, design, test, or build?
- What concrete artifact proves this node is not only theoretical?
- What changed in the knowledge system or project after this work?

### Key Insight

Purpose: show digestion and judgment.

This should be one strong sentence or a short paragraph. It should not be a summary of sources. It should sound like a reusable personal conclusion.

### Reusable Method

Purpose: show transferability.

This section explains how the same learning can be used in another AI product or Agent project. It can be a short checklist, decision rule, or operating method.

## Related Sources

Related notes should appear as a lightweight collapsed area at the bottom of the detail workspace.

Recommended label:

`Related sources and knowledge cards`

Content should be limited to links such as:

- Source notes
- Insight notes
- Playbooks
- Maps

The source area exists to preserve traceability. It should not compete with the four evidence sections.

## Presentation Flow

Recommended talk track:

1. Start from the dual-track overview.
2. Explain that the two lines are connected: AI Builder focuses on execution systems, while AI product management focuses on judgment and validation.
3. Click one representative node to show the detail workspace.
4. Explain that every node can be evaluated through the same four evidence sections.
5. Walk through two or three representative nodes instead of exhaustively reading every node.

## Acceptance Criteria

- The default timeline still shows both tracks clearly.
- Clicking a node opens a full-width detail workspace in the timeline area.
- The detail workspace contains the four fixed evidence sections.
- The detail workspace includes a left-side evidence directory and a right-side detail pane for input, output, asset, and transfer.
- Related knowledge cards are collapsed or visually secondary.
- The user can switch among nodes in the same track without returning to the timeline.
- The user can return to the full timeline overview with one explicit action.
- The design supports Obsidian-style knowledge traceability without visually dumping notes.

## Open Decisions

No open decisions remain for the design. Implementation can choose exact visual styling as long as it preserves the interaction and content hierarchy above.
