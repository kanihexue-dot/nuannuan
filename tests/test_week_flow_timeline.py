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


if __name__ == "__main__":
    unittest.main()
