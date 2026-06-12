# Dual-Track Detail Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the branch preview HTML where each timeline node opens a full-width detail workspace with four evidence sections and lightweight source links.

**Architecture:** Keep the existing single-file HTML structure. Replace inline per-node detail expansion with one timeline-level workspace rendered by JavaScript from the existing `details` data. Preserve the dual-track overview and add a back action plus same-track node switcher.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, local Python HTTP server preview.

---

### Task 1: Replace Inline Detail With Timeline Workspace

**Files:**
- Modify: `/tmp/ai-builder-narrative-showcase.html`

- [ ] **Step 1: Add a hidden workspace container inside the timeline card**

Place the container after `.horizontal-board` in the `#journey .timeline-card` section:

```html
<div class="detail-workspace" id="detailWorkspace" hidden></div>
```

- [ ] **Step 2: Add CSS for overview/detail modes**

Add styles for:

```css
.timeline-card.detail-open .horizontal-board { display: none; }
.detail-workspace { display: block; }
.detail-workspace[hidden] { display: none; }
```

Add panel, header, switcher, four-section grid, and collapsed source-link styles.

- [ ] **Step 3: Replace inline milestone rendering JavaScript**

Remove the default call that expands the first milestone inline. Implement `openDetailWorkspace(detailId)` and `closeDetailWorkspace()` so clicking any `.milestone-node` opens the full-width workspace.

- [ ] **Step 4: Add same-track node switcher**

Use the clicked node's track to render 01-04 buttons. Clicking a switcher button should call `openDetailWorkspace(nextDetailId)`.

- [ ] **Step 5: Verify behavior**

Open `http://127.0.0.1:8765/ai-builder-narrative-showcase.html?refresh=detail-workspace`.

Expected:
- Default page shows both timeline tracks.
- Clicking a node replaces the timeline overview with full-width detail workspace.
- The workspace shows four sections: 我学了什么, 我完成了什么, 关键洞察, 可复用方法.
- Related sources are lightweight links at the bottom.
- Same-track switcher changes node content.
- Back button returns to the dual-track overview.
