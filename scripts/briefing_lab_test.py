#!/usr/bin/env python3
"""Harvey table rows must not duplicate an effort the data object already has.

The chart object says "Claude Sonnet 5.5 (max)". The HTML table says
"Claude Sonnet 5.5 (Max, Default Fallback)". Those are one setting. If both
are kept, apply prefers the table copy: its decimal is the rounded percent,
which is higher than the unrounded object when the value rounds up, and the
note then loses the pre-gate figure.

Run: python3 scripts/briefing_lab_test.py
"""
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from briefing import _lab_setting_key, parse_aa_lab


FIXTURE = """
<p>See all 3 models</p>
<table>
<tr><td>1</td><td>Anthropic</td><td>Claude Sonnet 5.5 (Max, Default Fallback)</td><td>2.8%</td><td>90.0%</td><td>1.03</td></tr>
<tr><td>2</td><td>Anthropic</td><td>Claude Haiku 5.5 (Xhigh)</td><td>2.8%</td><td>88.0%</td><td>1.61</td></tr>
<tr><td>3</td><td>Anthropic</td><td>Claude Haiku 5.5 (Max)</td><td>0.6%</td><td>87.7%</td><td>1.61</td></tr>
<tr><td>4</td><td>Anthropic</td><td>Claude Fable 5.2 (Max, Default Fallback)</td><td>7.2%</td><td>91.0%</td><td>0.75</td></tr>
<tr><td>5</td><td>Anthropic</td><td>Claude Fable 5.2 (Medium, Default Fallback)</td><td>6.4%</td><td>90.0%</td><td>0.56</td></tr>
</table>
<script type="application/json">
{"slug":"claude-sonnet-5-5","name":"Claude Sonnet 5.5 (Max)","shortName":"Claude Sonnet 5.5 (max)","harveyLab":0.027777777777777776,"harveyLabBreakdown":{"hallucinationsPerTask":1.027,"ungatedAverageAllPass":0.117}}
{"slug":"claude-haiku-5-5","name":"Claude Haiku 5.5 (Max)","shortName":"Claude Haiku 5.5 (max)","harveyLab":0.005555555555555555,"harveyLabBreakdown":{"hallucinationsPerTask":1.6134453781512605,"ungatedAverageAllPass":0.04444444444444444}}
{"slug":"claude-fable-5-2","name":"Claude Fable 5.2 (Max)","shortName":"Claude Fable 5.2 (max)","harveyLab":0.07222222222222222,"harveyLabBreakdown":{"hallucinationsPerTask":0.75,"ungatedAverageAllPass":0.10833333333333334}}
</script>
"""


def _best(rows, name):
    mine = [r for r in rows if r["name"] == name]
    return max(mine, key=lambda r: (r["score"], r["scoreDecimal"]))


class LabSettingKeyTest(unittest.TestCase):
    def test_fallback_suffix_is_the_same_effort(self):
        a = _lab_setting_key("Claude Sonnet 5.5 (max)")
        b = _lab_setting_key("Claude Sonnet 5.5 (Max, Default Fallback)")
        self.assertEqual(a, b)
        self.assertEqual(a, ("claude sonnet 5.5", "max"))

    def test_a_different_effort_stays_different(self):
        self.assertNotEqual(
            _lab_setting_key("Claude Haiku 5.5 (max)"),
            _lab_setting_key("Claude Haiku 5.5 (Xhigh)"),
        )


class ParseAaLabTest(unittest.TestCase):
    def setUp(self):
        self.rows = parse_aa_lab(FIXTURE)

    def test_sonnet_max_is_not_ingested_twice(self):
        sonnet = [r for r in self.rows if r["name"] == "Claude Sonnet 5.5"]
        self.assertEqual(len(sonnet), 1)
        note = sonnet[0]["note"]
        self.assertTrue(note.startswith("variant: max;"))
        self.assertNotIn("with fallback", note)
        self.assertIn("before the hallucination gate", note)
        # The kept row is the unrounded object, not the table's 2.8.
        self.assertLess(sonnet[0]["scoreDecimal"], 2.8)

    def test_haiku_xhigh_is_added_and_wins(self):
        haiku = [r for r in self.rows if r["name"] == "Claude Haiku 5.5"]
        efforts = {r["fullName"] for r in haiku}
        self.assertIn("Claude Haiku 5.5 (Xhigh)", efforts)
        self.assertEqual(
            sum(1 for name in efforts if name.casefold() == "claude haiku 5.5 (max)"),
            1,
        )
        best = _best(self.rows, "Claude Haiku 5.5")
        self.assertEqual(best["fullName"], "Claude Haiku 5.5 (Xhigh)")
        self.assertEqual(best["score"], 2.8)
        self.assertNotIn("before the hallucination gate", best["note"])

    def test_lower_missing_effort_does_not_beat_the_object(self):
        fable = [r for r in self.rows if r["name"] == "Claude Fable 5.2"]
        self.assertEqual(len(fable), 2)
        best = _best(self.rows, "Claude Fable 5.2")
        self.assertEqual(best["fullName"], "Claude Fable 5.2 (max)")
        self.assertIn("before the hallucination gate", best["note"])
        self.assertNotIn("with fallback", best["note"])


if __name__ == "__main__":
    unittest.main()
