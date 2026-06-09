# AI Builder Showcase Map Loop

This folder contains the HTML preview layer for the Obsidian-to-showcase loop.

The source of truth is the Obsidian Showcase Map draft:

`knowledge-vault/90_AI_Drafts/AI Builder Showcase Map.draft.md`

Generate browser-readable data:

```bash
python3 scripts/generate_showcase_data.py
```

Preview locally from the repository root:

```bash
python3 -m http.server 8001
```

Then open:

`http://127.0.0.1:8001/docs/superpowers/showcase/ai-builder-showcase-preview.html`

## Canonical Layer Mapping

| Showcase section | Primary Obsidian layer | Supplemental layer |
| --- | --- | --- |
| Learning input | `10_Sources` | `15_Learning_Captures` |
| Project output | `20_Projects` | none |
| Knowledge assets | `40_Insights / 50_Playbooks` | `60_Maps` |
| Transferable capability | `50_Playbooks` | `40_Insights` |

`00_Inbox` is intentionally excluded from the showcase. Inbox material should be digested into source notes, project notes, insights, playbooks, or maps before it becomes presentation-facing evidence.

## Node Template

Each capability node should keep the same shape:

```md
## Capability Node Title

id: stable-detail-id
track: AI Builder 工程能力线
node: 01

### Learning input
- [[Source Note Title]] :: One sentence explaining why this input matters.
- Plain external concept :: One sentence explaining the concept's role.

### Project output
- Output artifact :: One sentence explaining what was produced or proven.

### Knowledge assets
- [[Insight Note Title]] :: One sentence explaining the reusable judgment.
- [[Playbook Note Title]] :: One sentence explaining the reusable method.

### Transferable capability
- Capability label :: One sentence explaining where this transfers next.
```

Rules:

- Every node needs `id`, `track`, and `node`.
- Every node should include all four sections.
- Every bullet should use `label :: detail`.
- Wikilinks are rendered as clean labels in HTML and can open Obsidian through `obsidian://open`.
- Plain labels remain display-only evidence.

## Validation

The generator prints warnings but still writes data. Warnings are intended to keep drafts moving while making missing structure visible.

Examples:

- Missing `id`, `track`, or `node`.
- Missing one of the four required sections.
- Bullet item missing a `:: detail`.
- Unknown section title.
