#!/usr/bin/env python3
"""Generate HTML showcase data from the Obsidian Showcase Map draft."""

from __future__ import annotations

import argparse
import json
from pathlib import Path


SECTION_MAP = {
    "Learning input": "learn",
    "Project output": "output",
    "Knowledge assets": "asset",
    "Transferable capability": "transfer",
}

REQUIRED_NODE_FIELDS = ("id", "track", "node")
OUTPUT_TYPES = {"artifact", "process", "doc", "system", "proof", "decision"}

SECTION_META = {
    "learn": {
        "title": "学习输入",
        "sourceLayer": "10_Sources",
        "fallbackLayer": "15_Learning_Captures",
        "description": "已经被整理过的课程、文章、讲座和官方文档 Source Note。",
    },
    "output": {
        "title": "项目产出",
        "sourceLayer": "20_Projects",
        "fallbackLayer": None,
        "description": "实际做出来的 demo、组件图、实验记录、过程产物和执行结果。",
    },
    "asset": {
        "title": "知识资产",
        "sourceLayer": "40_Insights / 50_Playbooks",
        "fallbackLayer": "60_Maps",
        "description": "可追溯、可引用、可复用的判断、原则、检查清单和主题地图。",
    },
    "transfer": {
        "title": "可迁移能力",
        "sourceLayer": "50_Playbooks",
        "fallbackLayer": "40_Insights",
        "description": "下次做 AI 产品或 Agent 项目时可以直接复用的方法和判断。",
    },
}


def parse_showcase_map(text: str) -> dict:
    nodes: dict[str, dict] = {}
    current_node: dict | None = None
    current_section: str | None = None

    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            continue

        if line.startswith("## "):
            current_node = {
                "title": line.removeprefix("## ").strip(),
                "id": None,
                "track": None,
                "node": None,
                "evidence": {"learn": [], "output": [], "asset": [], "transfer": []},
                "evidenceDetail": {"learn": {}, "output": {}, "asset": {}, "transfer": {}},
                "evidenceMeta": {"learn": {}, "output": {}, "asset": {}, "transfer": {}},
            }
            current_section = None
            continue

        if current_node is None:
            continue

        if line.startswith("id:"):
            node_id = line.split(":", 1)[1].strip()
            current_node["id"] = node_id
            nodes[node_id] = current_node
            continue

        if line.startswith("track:"):
            current_node["track"] = line.split(":", 1)[1].strip()
            continue

        if line.startswith("node:"):
            current_node["node"] = line.split(":", 1)[1].strip()
            continue

        if line.startswith("### "):
            current_section = SECTION_MAP.get(line.removeprefix("### ").strip())
            continue

        if line.startswith("- ") and current_section:
            item = line.removeprefix("- ").strip()
            label, detail, meta = parse_item(item)
            current_node["evidence"][current_section].append(label)
            if detail:
                current_node["evidenceDetail"][current_section][label] = detail
            if meta:
                current_node["evidenceMeta"][current_section][label] = meta

    tracks: list[dict] = []
    track_index: dict[str, dict] = {}
    for node_id, node in nodes.items():
      track_title = node.get("track") or "未标注能力线"
      if track_title not in track_index:
          track_index[track_title] = {"title": track_title, "nodeIds": []}
          tracks.append(track_index[track_title])
      track_index[track_title]["nodeIds"].append(node_id)

    return {"sections": SECTION_META, "tracks": tracks, "nodes": nodes}


def parse_item(item: str) -> tuple[str, str, dict[str, str]]:
    parts = [part.strip() for part in item.split("::")]
    label = parts[0] if parts else ""
    meta: dict[str, str] = {}
    detail_parts: list[str] = []

    for part in parts[1:]:
        if part.startswith("type="):
            meta["type"] = part.removeprefix("type=").strip()
        elif part:
            detail_parts.append(part)

    return label, " :: ".join(detail_parts).strip(), meta


def validate_showcase_map(text: str) -> list[str]:
    warnings: list[str] = []
    current_title: str | None = None
    current_fields: set[str] = set()
    current_sections: set[str] = set()
    current_section_title: str | None = None

    def flush_node() -> None:
        if current_title is None:
            return
        for field in REQUIRED_NODE_FIELDS:
            if field not in current_fields:
                warnings.append(f"{current_title} is missing required field: {field}")
        for section_title in SECTION_MAP:
            if section_title not in current_sections:
                warnings.append(f"{current_title} is missing required section: {section_title}")

    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            continue

        if line.startswith("## "):
            flush_node()
            current_title = line.removeprefix("## ").strip()
            current_fields = set()
            current_sections = set()
            current_section_title = None
            continue

        if current_title is None:
            continue

        if line.startswith("id:"):
            current_fields.add("id")
            continue
        if line.startswith("track:"):
            current_fields.add("track")
            continue
        if line.startswith("node:"):
            current_fields.add("node")
            continue

        if line.startswith("### "):
            current_section_title = line.removeprefix("### ").strip()
            if current_section_title in SECTION_MAP:
                current_sections.add(current_section_title)
            else:
                warnings.append(f"{current_title} has unknown section: {current_section_title}")
            continue

        if line.startswith("- ") and current_section_title:
            item = line.removeprefix("- ").strip()
            label, detail, meta = parse_item(item)
            if not detail:
                warnings.append(
                    f"{current_title} / {current_section_title} item is missing detail: {label}"
                )
            if current_section_title == "Project output":
                output_type = meta.get("type")
                if not output_type:
                    warnings.append(
                        f"{current_title} / Project output item is missing output type: {label}"
                    )
                elif output_type not in OUTPUT_TYPES:
                    warnings.append(
                        f"{current_title} / Project output item has unknown output type: {label} -> {output_type}"
                    )

    flush_node()
    return warnings


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--map",
        default="knowledge-vault/90_AI_Drafts/AI Builder Showcase Map.draft.md",
        help="Path to the Obsidian Showcase Map markdown file.",
    )
    parser.add_argument(
        "--out",
        default="docs/superpowers/showcase/showcase-data.js",
        help="Path to the generated browser-readable JS data file.",
    )
    args = parser.parse_args()

    map_path = Path(args.map)
    out_path = Path(args.out)

    text = map_path.read_text(encoding="utf-8")
    warnings = validate_showcase_map(text)
    data = parse_showcase_map(text)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(
        "window.SHOWCASE_MAP_DATA = "
        + json.dumps(data, ensure_ascii=False, indent=2)
        + ";\n",
        encoding="utf-8",
    )
    for warning in warnings:
        print(f"Warning: {warning}")
    print(f"Wrote {out_path} from {map_path}")


if __name__ == "__main__":
    main()
