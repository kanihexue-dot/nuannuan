# Cursor Handoff: Emotion Room Interaction Demo

## Project Goal

Continue building the interactive demo for `小情绪房间 V0.5` inside this repository.

This demo is not a generic content page. It is a presentation-oriented interaction page used for business-facing walkthroughs, with these priorities:

- keep the `01-05` flow visible and easy to explain
- preserve the current app's soft, friendly purple-blue visual language
- emphasize emotional-space atmosphere rather than feature-grid density
- support live demo interaction, especially around `01 -> 03`

## Current Product Direction

The current agreed structure is:

- horizontal presentation shell
- top `01-05` overview navigation
- large left-side vertical stage card as the main visual
- right-side narrative / explanation panel
- no emphasized safety rail in the current presentation page

The current demo should feel like:

- presentation-first
- guided, not free-exploration-heavy
- emotionally supportive
- visually closer to the provided vertical scene mockups

## Key Specs To Read First

Read these documents before changing behavior or layout:

1. `/Users/helenahe/Documents/暖暖心理/docs/superpowers/specs/2026-05-24-emotion-room-presentation-design.md`
2. `/Users/helenahe/Documents/暖暖心理/docs/superpowers/plans/2026-05-24-emotion-room-presentation.md`
3. `/Users/helenahe/Documents/暖暖心理/docs/superpowers/specs/2026-05-25-emotion-room-scene-01-03-figma-flow-design.md`
4. `/Users/helenahe/Documents/暖暖心理/docs/superpowers/2026-05-25-emotion-room-scene-01-03-figma-session.md`

Optional related references:

5. `/Users/helenahe/Documents/暖暖心理/docs/superpowers/specs/2026-05-24-first-open-page-01-prd.md`
6. `/Users/helenahe/Documents/暖暖心理/docs/superpowers/specs/2026-05-24-first-open-emotion-landing-prd.md`
7. `/Users/helenahe/Documents/暖暖心理/docs/superpowers/plans/2026-05-24-first-open-page-01.md`

## Current Frontend Entry Points

These are the most important files for continuing the demo:

- `/Users/helenahe/Documents/暖暖心理/src/App.tsx`
- `/Users/helenahe/Documents/暖暖心理/src/components/StageCanvas.tsx`
- `/Users/helenahe/Documents/暖暖心理/src/components/StepNarrativeCard.tsx`
- `/Users/helenahe/Documents/暖暖心理/src/data/steps.ts`
- `/Users/helenahe/Documents/暖暖心理/src/types.ts`
- `/Users/helenahe/Documents/暖暖心理/src/styles/presentation.css`
- `/Users/helenahe/Documents/暖暖心理/src/AppRouter.tsx`

Useful supporting files:

- `/Users/helenahe/Documents/暖暖心理/src/components/FlowOverview.tsx`
- `/Users/helenahe/Documents/暖暖心理/src/components/PresentationHero.tsx`
- `/Users/helenahe/Documents/暖暖心理/src/components/ClosingStatement.tsx`

## Current Behavior

The demo already has basic interaction logic:

- the right-side primary button advances the active step
- progression is `01 -> 02 -> 03 -> 04 -> 05`
- a secondary button supports going to the previous step
- on step `05`, the primary action becomes a reset / return-to-start behavior

The page is currently driven by shared step data and stage state.

## Scene Assets

The presentation has been aligned to scene images by filename order.

Expected mapping:

- `1.png` -> step `01`
- `2.png` -> step `02`
- `3.png` -> step `03`
- `4.png` -> step `04`
- `5.png` -> step `05`

Public assets are expected under:

- `/Users/helenahe/Documents/暖暖心理/public/`

If the current implementation uses a subfolder like `emotion-scenes`, preserve that mapping pattern rather than inventing a new one.

## Figma Context

There is a Figma design file for the focused `01 -> 03` interaction flow:

- Design file: `小情绪房间 01 03 串联交互页`
- URL: `https://www.figma.com/design/vhVkKFNKCDXmZZ97MKQrH0`

Important notes:

- the Figma work focused on `01 -> 03`, not the full five-step product
- `02` is treated as a short recognition transition, not a full standalone destination
- a prior session hit Figma Starter plan MCP limits, so the session notes matter

## Most Important UX Intent

The most important interaction story is:

1. user enters through a low-friction emotional touchpoint
2. the system helps translate vague feeling into recognizable emotional state
3. the AI response feels like being gently received, not analyzed or judged

This means the interaction should prioritize:

- low-friction selection
- visible state transition
- soft emotional pacing
- readable presentation flow during live demo

## What To Improve Next

The best next implementation work is:

1. strengthen local state transitions for `step-01` to `step-03`
2. make `01` feel more interactive than a static image swap
3. make `02` feel like a real recognition bridge instead of a hard jump
4. make `03` feel like a staged empathy response with progressive reveal
5. preserve the current horizontal presentation shell while refining internal stage interactions

## Recommended Next Tasks

### Priority 1

Improve `step-01` micro-interaction:

- weather selection feedback
- phrase / mood chip selection state
- disabled-to-enabled transition for continue CTA

### Priority 2

Improve `step-02` recognition transition:

- overlay card or mapping panel
- visible input-to-emotion translation
- a smoother bridge from `01` into `03`

### Priority 3

Improve `step-03` empathy response:

- progressive AI bubble reveal
- staged text appearance
- stronger emotional landing state

### Priority 4

Refine presentation polish:

- smoother stage animation
- clearer right-panel hierarchy
- better responsive behavior for large-screen demo and narrower widths

## Things To Avoid

Do not turn this into:

- a generic content distribution page
- a long chat UI
- a dense dashboard
- a heavily game-like interaction
- a fully different visual language from the existing purple-blue app style

Also avoid reintroducing the previously removed emphasized safety rail unless explicitly requested.

## Repository State Warning

The repository is currently dirty and contains untracked files.

Be careful:

- do not blindly clean or reset the repo
- do not remove image assets or screenshot artifacts unless explicitly asked
- preserve unrelated local changes

## Suggested Cursor Prompt

Use this prompt to continue implementation:

```text
Please read:
1. docs/superpowers/specs/2026-05-24-emotion-room-presentation-design.md
2. docs/superpowers/plans/2026-05-24-emotion-room-presentation.md
3. docs/superpowers/specs/2026-05-25-emotion-room-scene-01-03-figma-flow-design.md
4. docs/superpowers/2026-05-25-emotion-room-scene-01-03-figma-session.md

Then inspect:
- src/App.tsx
- src/components/StageCanvas.tsx
- src/components/StepNarrativeCard.tsx
- src/data/steps.ts
- src/types.ts
- src/styles/presentation.css

Goal:
Continue enhancing the interaction demo without breaking the current horizontal presentation shell. Prioritize step-01 to step-03 interaction depth, especially local state selection, recognition transition, and empathy response reveal. Keep the left large stage visual, right narrative panel, and current purple-blue app-aligned style.
```
