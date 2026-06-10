import re
from pathlib import Path
import unittest


HTML_PATH = Path("docs/superpowers/showcase/ai-builder-narrative-showcase.html")


class WeekFlowTimelineTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html = HTML_PATH.read_text(encoding="utf-8")

    def milestone_markup(self, detail_id):
        pattern = (
            rf'<button class="milestone-node"[^>]*data-detail="{re.escape(detail_id)}"[^>]*>'
            rf'(?P<body>.*?)</button>'
        )
        match = re.search(pattern, self.html, re.S)
        self.assertIsNotNone(match, f"Missing milestone node for {detail_id}")
        return match.group("body")

    def assert_display_week(self, detail_id, display_week, source_week):
        body = self.milestone_markup(detail_id)
        week_match = re.search(
            rf'<span\b(?=[^>]*class="milestone-week")'
            rf'(?=[^>]*data-display-week="{re.escape(display_week)}")'
            rf'(?=[^>]*data-source-week="{re.escape(source_week)}")'
            rf'[^>]*>\s*{re.escape(display_week)}\s*</span>',
            body,
        )
        self.assertIsNotNone(
            week_match,
            f"Missing milestone week badge for {detail_id}: {display_week} / {source_week}",
        )

    def test_each_milestone_uses_expected_display_week(self):
        expected = {
            "foundation-builder": ("Week 1", "Week0"),
            "assistant-prototype-builder": ("Week 1", "Week1"),
            "evaluation-builder": ("Week 4", "Week3"),
            "stability-builder": ("Week 4", "Week4"),
            "foundation-product": ("Week 2", "Week1"),
            "competitive-product": ("Week 2", "Week1"),
            "spec-product": ("Week 3", "Week3"),
            "evals-product": ("Week 3", "Week3"),
        }
        for detail_id, (display_week, source_week) in expected.items():
            with self.subTest(detail_id=detail_id):
                self.assert_display_week(detail_id, display_week, source_week)

    def test_shared_week_flow_strip_is_removed(self):
        self.assertNotIn('class="week-flow-strip"', self.html)
        self.assertNotIn('class="week-flow-inner"', self.html)
        self.assertNotIn('class="week-flow-step"', self.html)

    def test_timeline_no_longer_uses_numeric_badges_for_milestones(self):
        for detail_id in (
            "foundation-builder",
            "assistant-prototype-builder",
            "evaluation-builder",
            "stability-builder",
            "foundation-product",
            "competitive-product",
            "spec-product",
            "evals-product",
        ):
            with self.subTest(detail_id=detail_id):
                body = self.milestone_markup(detail_id)
                self.assertNotIn('class="milestone-index"', body)

    def test_week5_delivery_closure_is_not_rendered_in_showcase(self):
        self.assertNotIn('id="delivery-closure"', self.html)
        self.assertNotIn("V2.0 收口：讲清楚，业务方才敢用", self.html)
        self.assertNotIn("交付收口层", self.html)

    def test_project_output_panel_uses_visual_markup_without_reflection(self):
        self.assertIn("output-visual-stage", self.html)
        self.assertIn("projectOutputMarkup(stage)", self.html)
        self.assertIn("architecture-fallback", self.html)
        self.assertIn("evaluationArchitectureFallbackSvg", self.html)
        self.assertIn('visual === "eval-architecture"', self.html)
        self.assertIn("research-board", self.html)
        self.assertIn("researchBoardMarkup(stage)", self.html)
        self.assertIn("dashboardMarkup(stage)", self.html)
        self.assertIn("dashboard-fallback", self.html)
        self.assertIn("demoMarkup(stage)", self.html)
        self.assertIn("demo-fallback", self.html)
        self.assertIn("langfuseMarkup(stage)", self.html)
        self.assertIn("langfuse-fallback", self.html)
        self.assertNotIn("outputGalleryMarkup(stage, item.items", self.html)
        flow_detail = re.search(
            r"function flowDetailMarkup\(stage, section = \"output\"\) \{"
            r"(?P<body>.*?)\n    \}",
            self.html,
            re.S,
        )
        self.assertIsNotNone(flow_detail)
        body = flow_detail.group("body")
        self.assertIn('section === "asset"', body)
        self.assertNotIn("${reflectionMarkup(stage)}<div class=\"flow-panel-title\">", body)

    def test_asset_panel_only_shows_reflection(self):
        flow_detail = re.search(
            r"function flowDetailMarkup\(stage, section = \"output\"\) \{"
            r"(?P<body>.*?)\n    \}",
            self.html,
            re.S,
        )
        self.assertIsNotNone(flow_detail)
        body = flow_detail.group("body")
        asset_branch = re.search(
            r'if \(section === "asset"\) \{(?P<branch>.*?)\n      \}',
            body,
            re.S,
        )
        self.assertIsNotNone(asset_branch)
        branch = asset_branch.group("branch")
        self.assertIn("flow-panel-reflection", branch)
        self.assertIn("沉淀感悟", self.html)
        self.assertNotIn("evidence-chips", branch)

    def test_learn_panel_uses_judgment_mapping_chips(self):
        flow_section = re.search(
            r"function flowSection\(stage, section\) \{"
            r"(?P<body>.*?)\n    \}",
            self.html,
            re.S,
        )
        self.assertIsNotNone(flow_section)
        body = flow_section.group("body")
        self.assertIn("判断映射", body)
        self.assertIn("evidence.asset", body)
        self.assertIn("evidence.transfer", body)
        self.assertNotIn("evidence.learn", body)
        self.assertIn('["learn", "01", "学习输入", "判断映射"]', self.html)
        self.assertIn('["asset", "03", "知识资产", "复盘思考"]', self.html)

        mapped_chip = re.search(
            r"function mappedChipDetail\(stage, section, label\) \{"
            r"(?P<body>.*?)\n    \}",
            self.html,
            re.S,
        )
        self.assertIsNotNone(mapped_chip)
        self.assertIn('section === "learn"', mapped_chip.group("body"))

    def test_hero_uses_evolution_strip_instead_of_orbit(self):
        self.assertIn("evolution-strip", self.html)
        self.assertIn("evolution-bar-segment", self.html)
        self.assertIn("setEvolutionStation", self.html)
        self.assertIn("能力基础", self.html)
        self.assertIn("data-open-detail=\"foundation-builder\"", self.html)
        self.assertNotIn("mini-orbit", self.html)

    def test_evidence_directory_uses_three_merged_steps(self):
        flow_match = re.search(
            r"function flowStepsMarkup\(activeSection = \"output\"\) \{"
            r"(?P<body>.*?)\n    \}",
            self.html,
            re.S,
        )
        self.assertIsNotNone(flow_match, "Missing flowStepsMarkup definition")
        flow_body = flow_match.group("body")
        self.assertEqual(flow_body.count('["learn"'), 1)
        self.assertEqual(flow_body.count('["output"'), 1)
        self.assertEqual(flow_body.count('["asset"'), 1)
        self.assertNotIn('["insight"', flow_body)
        self.assertNotIn('["method"', flow_body)
        self.assertIn('["asset", "03", "知识资产", "复盘思考"]', flow_body)
        self.assertNotIn("可迁移能力", flow_body)


if __name__ == "__main__":
    unittest.main()
