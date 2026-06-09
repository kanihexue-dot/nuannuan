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
            "assistant-prototype-builder": ("Week 2", "Week1"),
            "evaluation-builder": ("Week 3", "Week3"),
            "stability-builder": ("Week 4", "Week4"),
            "foundation-product": ("Week 2", "Week1"),
            "competitive-product": ("Week 2", "Week1"),
            "spec-product": ("Week 3", "Week3"),
            "evals-product": ("Week 3", "Week3"),
        }
        for detail_id, (display_week, source_week) in expected.items():
            with self.subTest(detail_id=detail_id):
                self.assert_display_week(detail_id, display_week, source_week)

    def test_shared_week_flow_strip_exists_between_tracks(self):
        self.assertIn('class="week-flow-strip"', self.html)
        flow_index = self.html.index('class="week-flow-strip"')
        builder_index = self.html.index('class="capability-timeline"')
        product_index = self.html.index('class="capability-timeline product"')
        self.assertGreater(flow_index, builder_index)
        self.assertLess(flow_index, product_index)

    def test_week_flow_strip_shows_week_1_to_week_4(self):
        flow_match = re.search(
            r'<div class="week-flow-strip"[^>]*>(?P<body>.*?)</div>\s*<div class="capability-timeline product"',
            self.html,
            re.S,
        )
        self.assertIsNotNone(flow_match, "Missing week flow strip before product track")
        flow_body = flow_match.group("body")
        for week in ("Week 1", "Week 2", "Week 3", "Week 4"):
            self.assertIn(week, flow_body)
        self.assertIn('aria-label="Course progression from Week 1 to Week 4"', flow_match.group(0))

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


if __name__ == "__main__":
    unittest.main()
