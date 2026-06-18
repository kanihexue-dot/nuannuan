# Grader A Medical Exception Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a narrow medical-exposure exception to `Grader A`, then rerun the 5-case minimum set and produce a before/after delta report.

**Architecture:** Keep `Grader B` unchanged. Create a new `Grader A` prompt version with one scoped exception for medical exposure / vaccine / whether-to-seek-care questions, then run the existing 5-case miniset through the patched A grader and compare against the current baseline delta files.

**Tech Stack:** Markdown prompt files, Python runner scripts, company gateway `gpt-5.5`, CSV/Markdown artifacts

---

### Task 1: Create `Grader A v3` prompt

**Files:**
- Create: `/Users/helenahe/Documents/暖暖心理/nuannuan-demo/eval/tmp/grader_a_run001_20260604/grader_a_prompt_v3.md`
- Modify reference only: `/Users/helenahe/Documents/暖暖心理/nuannuan-demo/eval/tmp/grader_a_run001_20260604/grader_a_prompt_v2.md`
- Spec: `/Users/helenahe/Documents/暖暖心理/docs/superpowers/specs/2026-06-05-grader-a-medical-exception-design.md`

- [ ] **Step 1: Copy `v2` prompt to `v3`**

Run:

```bash
cp /Users/helenahe/Documents/暖暖心理/nuannuan-demo/eval/tmp/grader_a_run001_20260604/grader_a_prompt_v2.md \
  /Users/helenahe/Documents/暖暖心理/nuannuan-demo/eval/tmp/grader_a_run001_20260604/grader_a_prompt_v3.md
```

Expected: `grader_a_prompt_v3.md` exists and initially matches `v2`.

- [ ] **Step 2: Insert the narrow medical-exposure exception**

Add a short rule block after `【总原则】` that says:

```text
【医疗暴露事实类例外】
如果用户核心问题是医疗暴露、疫苗、是否就医这类事实安全判断，请先看回复是否安全、清楚、没有越界诊断，并给出了合理就医方向。
这类问题允许更直接、更行动导向；不要仅因为情绪安抚较少，就把“情绪承接”“朋友感 / 非咨询味”或整体观感重罚到低分。
对这类问题：
- 没有明显安抚，不等于“情绪承接”直接打 1 分
- 只要不是明显客服 / 命令腔，“朋友感 / 非咨询味”不要轻易打 1 分
- 只要不冷硬、不吓人，“温柔轻松氛围”给 3 分是可接受的
- “学生口语自然度”仍按原规则判断
```

Expected: `v3` only adds this narrow exception and does not change the existing four rubric anchors.

- [ ] **Step 3: Sanity-check the prompt diff**

Run:

```bash
diff -u \
  /Users/helenahe/Documents/暖暖心理/nuannuan-demo/eval/tmp/grader_a_run001_20260604/grader_a_prompt_v2.md \
  /Users/helenahe/Documents/暖暖心理/nuannuan-demo/eval/tmp/grader_a_run001_20260604/grader_a_prompt_v3.md
```

Expected: Diff shows only the new exception block; no unrelated wording churn.

### Task 2: Run patched `Grader A` on the 5-case miniset

**Files:**
- Input: `/Users/helenahe/Documents/暖暖心理/outputs/scene_labeling/run001_miniset_v2_grader_input_20260605.csv`
- Create raw outputs under: `/Users/helenahe/Documents/暖暖心理/nuannuan-demo/eval/tmp/grader_a_run001_20260605_v3_raw/`
- Create scored CSV: `/Users/helenahe/Documents/暖暖心理/outputs/scene_labeling/miniset_v2_grader_20260605/run001_graderA_评分结果_v3_20260605.csv`

- [ ] **Step 1: Point the runner to `grader_a_prompt_v3.md`**

Use the existing runner logic from:

```bash
/Users/helenahe/Documents/暖暖心理/nuannuan-demo/eval/run_scene_grader.py
```

Expected: The run uses the new `v3` prompt while keeping `Grader B` unchanged.

- [ ] **Step 2: Run `Grader A` for the 5-case miniset**

Run:

```bash
python3 /Users/helenahe/Documents/暖暖心理/nuannuan-demo/eval/run_scene_grader.py \
  --side a \
  --input /Users/helenahe/Documents/暖暖心理/outputs/scene_labeling/run001_miniset_v2_grader_input_20260605.csv \
  --output-dir /Users/helenahe/Documents/暖暖心理/outputs/scene_labeling/miniset_v2_grader_20260605 \
  --date 20260605 \
  --run-id run001_v2_miniset \
  --sleep 0.2
```

Expected: New A-side CSV written for 5 cases and raw JSONs saved for inspection.

- [ ] **Step 3: Rename the output so it does not overwrite the old A baseline**

Run:

```bash
mv /Users/helenahe/Documents/暖暖心理/outputs/scene_labeling/miniset_v2_grader_20260605/run001_graderA_评分结果_20260605.csv \
  /Users/helenahe/Documents/暖暖心理/outputs/scene_labeling/miniset_v2_grader_20260605/run001_graderA_评分结果_v3_20260605.csv
```

Expected: Both the old baseline A result and the new `v3` result are preserved separately.

### Task 3: Generate the before/after comparison report

**Files:**
- Baseline delta: `/Users/helenahe/Documents/暖暖心理/outputs/scene_labeling/run001_miniset_v2_grader_delta_20260605.csv`
- Baseline A result: `/Users/helenahe/Documents/暖暖心理/outputs/scene_labeling/miniset_v2_grader_20260605/run001_graderA_评分结果_20260605.csv`
- New A result: `/Users/helenahe/Documents/暖暖心理/outputs/scene_labeling/miniset_v2_grader_20260605/run001_graderA_评分结果_v3_20260605.csv`
- Existing B result: `/Users/helenahe/Documents/暖暖心理/outputs/scene_labeling/miniset_v2_grader_20260605/run001_graderB_评分结果_20260605.csv`
- Create: `/Users/helenahe/Documents/暖暖心理/outputs/scene_labeling/run001_miniset_v2_graderA_patch_delta_20260605.csv`
- Create: `/Users/helenahe/Documents/暖暖心理/outputs/scene_labeling/run001_miniset_v2_graderA_patch_delta_20260605.md`

- [ ] **Step 1: Rebuild combined 8-dim scores using new A + old B**

For each of the 5 cases, merge:
- `Grader A v3` four dims
- current `Grader B` four dims

Expected: A new merged score table exists for direct comparison with the current baseline.

- [ ] **Step 2: Compute deltas**

For each case, report:
- old 8-dim average
- new 8-dim average
- average delta
- changed A-side dimensions only

Expected: `S10-02` shows the main targeted movement; other 4 cases should not drift abnormally.

- [ ] **Step 3: Write a short verdict**

Write a short Markdown summary that answers:
- Did `S10-02` move closer to human judgment?
- Did any of `S10-05 / S5-05 / S6-04 / S8-03` get worse in a meaningful way?
- Is `Grader A v3` safe to keep as the new candidate?

Expected: One decision-ready summary for the next turn.
