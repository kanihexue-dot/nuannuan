import importlib.util
import unittest
from pathlib import Path


MODULE_PATH = Path(__file__).resolve().parents[1] / "scripts" / "generate_showcase_data.py"
SPEC = importlib.util.spec_from_file_location("generate_showcase_data", MODULE_PATH)
generate_showcase_data = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(generate_showcase_data)


class ShowcaseDataParserTest(unittest.TestCase):
    def test_generated_data_includes_canonical_obsidian_layers(self):
        data = generate_showcase_data.parse_showcase_map(
            """# AI Builder Showcase Map

## LLM / Agent 基础

id: foundation-builder
track: AI Builder 工程能力线
node: 01

### Learning input
- [[AI Builder Week 0]] :: 课程材料的 Source Note。

### Project output
- Agent 组件图 :: 项目过程产物。

### Knowledge assets
- [[LLM 不是确定性函数]] :: 可复用判断。

### Transferable capability
- Skill 设计起点 :: 可迁移方法。
"""
        )

        self.assertEqual(data["sections"]["learn"]["sourceLayer"], "10_Sources")
        self.assertEqual(data["sections"]["output"]["sourceLayer"], "20_Projects")
        self.assertEqual(data["sections"]["asset"]["sourceLayer"], "40_Insights / 50_Playbooks")
        self.assertEqual(data["sections"]["transfer"]["sourceLayer"], "50_Playbooks")

    def test_parser_keeps_item_details_separate_from_labels(self):
        data = generate_showcase_data.parse_showcase_map(
            """## LLM / Agent 基础

id: foundation-builder

### Knowledge assets
- [[LLM 不是确定性函数]] :: AI 产品必须围绕概率输出设计验证。
"""
        )

        node = data["nodes"]["foundation-builder"]
        self.assertEqual(node["evidence"]["asset"], ["[[LLM 不是确定性函数]]"])
        self.assertEqual(
            node["evidenceDetail"]["asset"]["[[LLM 不是确定性函数]]"],
            "AI 产品必须围绕概率输出设计验证。",
        )

    def test_parser_extracts_project_output_type_metadata(self):
        data = generate_showcase_data.parse_showcase_map(
            """## 评测体系

id: evaluation-builder
track: AI Builder 工程能力线
node: 03

### Project output
- 第一次 Eval Run :: type=proof :: 跑通评测流程，获得可以比较和复盘的结果。
"""
        )

        node = data["nodes"]["evaluation-builder"]
        self.assertEqual(node["evidence"]["output"], ["第一次 Eval Run"])
        self.assertEqual(
            node["evidenceDetail"]["output"]["第一次 Eval Run"],
            "跑通评测流程，获得可以比较和复盘的结果。",
        )
        self.assertEqual(
            node["evidenceMeta"]["output"]["第一次 Eval Run"]["type"],
            "proof",
        )

    def test_parser_supports_builder_and_product_nodes(self):
        data = generate_showcase_data.parse_showcase_map(
            """## LLM / Agent 基础

id: foundation-builder
track: AI Builder 工程能力线
node: 01

### Learning input
- Karpathy LLM OS :: 输入说明。

### Project output
- Agent 组件图 :: 产出说明。

### Knowledge assets
- [[Agent 不是单次问答]] :: 资产说明。

### Transferable capability
- Agent 复杂度判断 :: 迁移说明。

## AI 产品基础判断

id: foundation-product
track: AI 产品经理能力线
node: 01

### Learning input
- LLM 非确定性 :: 输入说明。

### Project output
- AI 产品判断原则 :: 产出说明。

### Knowledge assets
- [[LLM 不是确定性函数]] :: 资产说明。

### Transferable capability
- 自动化等级选择 :: 迁移说明。
"""
        )

        self.assertEqual(
            set(data["nodes"].keys()),
            {"foundation-builder", "foundation-product"},
        )
        self.assertEqual(
            data["nodes"]["foundation-product"]["track"],
            "AI 产品经理能力线",
        )

    def test_generated_data_groups_nodes_by_track(self):
        data = generate_showcase_data.parse_showcase_map(
            """## LLM / Agent 基础

id: foundation-builder
track: AI Builder 工程能力线
node: 01

### Learning input
- Karpathy LLM OS :: 输入说明。

### Project output
- Agent 组件图 :: 产出说明。

### Knowledge assets
- [[Agent 不是单次问答]] :: 资产说明。

### Transferable capability
- Agent 复杂度判断 :: 迁移说明。

## AI 产品基础判断

id: foundation-product
track: AI 产品经理能力线
node: 01

### Learning input
- LLM 非确定性 :: 输入说明。

### Project output
- AI 产品判断原则 :: 产出说明。

### Knowledge assets
- [[LLM 不是确定性函数]] :: 资产说明。

### Transferable capability
- 自动化等级选择 :: 迁移说明。
"""
        )

        self.assertEqual(
            data["tracks"],
            [
                {"title": "AI Builder 工程能力线", "nodeIds": ["foundation-builder"]},
                {"title": "AI 产品经理能力线", "nodeIds": ["foundation-product"]},
            ],
        )

    def test_current_showcase_map_matches_approved_milestone_order(self):
        map_path = Path(__file__).resolve().parents[1] / "knowledge-vault" / "90_AI_Drafts" / "AI Builder Showcase Map.draft.md"
        data = generate_showcase_data.parse_showcase_map(map_path.read_text(encoding="utf-8"))

        self.assertEqual(
            data["tracks"],
            [
                {
                    "title": "AI Builder 工程能力线",
                    "nodeIds": [
                        "foundation-builder",
                        "assistant-prototype-builder",
                        "evaluation-builder",
                        "stability-builder",
                    ],
                },
                {
                    "title": "AI 产品经理能力线",
                    "nodeIds": [
                        "foundation-product",
                        "competitive-product",
                        "spec-product",
                        "evals-product",
                    ],
                },
            ],
        )
        self.assertEqual(data["nodes"]["foundation-product"]["title"], "AI 产品基础判断")
        self.assertIn("Tiny Core", data["nodes"]["foundation-product"]["evidence"]["learn"])
        self.assertNotIn("LLM 非确定性", data["nodes"]["foundation-product"]["evidence"]["learn"])

    def test_current_showcase_map_covers_all_project_output_types(self):
        map_path = Path(__file__).resolve().parents[1] / "knowledge-vault" / "90_AI_Drafts" / "AI Builder Showcase Map.draft.md"
        data = generate_showcase_data.parse_showcase_map(map_path.read_text(encoding="utf-8"))

        found_types = set()
        for node in data["nodes"].values():
            for label in node["evidence"]["output"]:
                found_types.add(node["evidenceMeta"]["output"][label]["type"])

        self.assertEqual(
            found_types,
            {"artifact", "process", "doc", "system", "proof", "decision"},
        )


class ShowcaseMapValidatorTest(unittest.TestCase):
    def test_validator_warns_when_required_sections_are_missing(self):
        warnings = generate_showcase_data.validate_showcase_map(
            """## LLM / Agent 基础

id: foundation-builder
track: AI Builder 工程能力线
node: 01

### Learning input
- Karpathy LLM OS :: 输入说明。
"""
        )

        self.assertIn(
            "LLM / Agent 基础 is missing required section: Project output",
            warnings,
        )
        self.assertIn(
            "LLM / Agent 基础 is missing required section: Knowledge assets",
            warnings,
        )
        self.assertIn(
            "LLM / Agent 基础 is missing required section: Transferable capability",
            warnings,
        )

    def test_validator_warns_when_item_detail_is_missing(self):
        warnings = generate_showcase_data.validate_showcase_map(
            """## AI 产品基础判断

id: foundation-product
track: AI 产品经理能力线
node: 01

### Learning input
- LLM 非确定性

### Project output
- AI 产品判断原则 :: 产出说明。

### Knowledge assets
- [[LLM 不是确定性函数]] :: 资产说明。

### Transferable capability
- 自动化等级选择 :: 方法说明。
"""
        )

        self.assertIn(
            "AI 产品基础判断 / Learning input item is missing detail: LLM 非确定性",
            warnings,
        )

    def test_validator_accepts_complete_product_node(self):
        warnings = generate_showcase_data.validate_showcase_map(
            """## AI 产品基础判断

id: foundation-product
track: AI 产品经理能力线
node: 01

### Learning input
- LLM 非确定性 :: 输入说明。

### Project output
- AI 产品判断原则 :: type=decision :: 产出说明。

### Knowledge assets
- [[LLM 不是确定性函数]] :: 资产说明。

### Transferable capability
- 自动化等级选择 :: 迁移说明。
"""
        )

        self.assertEqual(warnings, [])

    def test_validator_warns_when_project_output_type_is_missing(self):
        warnings = generate_showcase_data.validate_showcase_map(
            """## 评测体系

id: evaluation-builder
track: AI Builder 工程能力线
node: 03

### Learning input
- AI Builder Week 3 V1.0 :: 输入说明。

### Project output
- 第一次 Eval Run :: 跑通评测流程。

### Knowledge assets
- [[AI 产品评测必须围绕产品承诺]] :: 资产说明。

### Transferable capability
- Eval Set 设计 :: 迁移说明。
"""
        )

        self.assertIn(
            "评测体系 / Project output item is missing output type: 第一次 Eval Run",
            warnings,
        )

    def test_validator_warns_when_project_output_type_is_unknown(self):
        warnings = generate_showcase_data.validate_showcase_map(
            """## 评测体系

id: evaluation-builder
track: AI Builder 工程能力线
node: 03

### Learning input
- AI Builder Week 3 V1.0 :: 输入说明。

### Project output
- 第一次 Eval Run :: type=result :: 跑通评测流程。

### Knowledge assets
- [[AI 产品评测必须围绕产品承诺]] :: 资产说明。

### Transferable capability
- Eval Set 设计 :: 迁移说明。
"""
        )

        self.assertIn(
            "评测体系 / Project output item has unknown output type: 第一次 Eval Run -> result",
            warnings,
        )


if __name__ == "__main__":
    unittest.main()
