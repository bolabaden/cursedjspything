---
title: "docs: operator consolidation evidence audit (plan 920)"
type: docs
status: completed
date: 2026-05-24
origin: docs/brainstorms/2026-05-24-operator-consolidation-audit-requirements.md
---

# Operator consolidation evidence audit

## Summary

Produce a **read-only audit** of all `operator-*.test.ts` and related sequence operator evidence: file inventory, documentation parity gaps, overlap matrix, and prioritized merge proposals. Deliverable is a knowledgebase report; no test moves or runtime changes in this slice.

## Problem Frame

Operator parity evidence grew through vertical slices (plans 384–919). `docs/COMPATIBILITY_AND_GAPS.md` §8.15 lists a consolidated operator layout, but complex/scalar-complex coverage is fragmented across many files and cited mainly in §8.17 prose. Plan 690 showed that dedupe requires explicit supersession notes — merges need an inventory first.

Contributors and agents need a single canonical map answering questions like “which file owns bool↔complex `==`?” without re-scanning 35+ files.

## Requirements

| ID | Requirement | Origin |
|----|-------------|--------|
| R1 | Inventory every `test/cpython-derived/operator-*.test.ts` file (35 files) with a one-line purpose summary | brainstorm R1 |
| R2 | Include sequence operator evidence (`sequence-add`, `sequence-eq-cross-type`, `sequence-mul-cross-type`, `sequence-sub`, `sequence-ordering-cross-type`, `sequence-iadd`, `sequence-imul`) and note shared helpers | brainstorm R2 |
| R3 | Doc parity report: diff inventory against §8.15 evidence bullets, §8.17 operator prose, and `validation-ladder.md` | brainstorm R3 |
| R4 | Overlap matrix: `(left family, right family, operator)` → canonical file(s); flag 2+ file tuples with two-tier severity | brainstorm R4, Q1 |
| R5 | Recommended merge groups as **proposals only** with risk notes and estimated test-count impact | brainstorm R5 |
| R6 | Prioritized backlog of follow-up implementation slices (separate plans) | brainstorm R6 |
| R7 | Optional appendix: high-level mapping to CPython `Lib/test/test_operator.py` where sections align | brainstorm R7 |
| R8 | No runtime changes, no test file moves, no assertion deletions | brainstorm R8 |
| R9 | Verification: inventory completeness (glob count); overlap matrix second-pass grep/sample review | brainstorm R9 |

## Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| Audit artifact at `docs/knowledgebase/50-execution/operator-evidence-audit.md` | brainstorm Q2 default; keeps execution knowledge co-located with `validation-ladder.md` (see origin) |
| Two-tier overlap severity | **Duplicate assertion** (same or near-identical case text) vs **shared tuple** (same operand families and operator, different aspect) — brainstorm Q1 default |
| Hybrid methodology: doc parity + overlap matrix | Plan 450 fixed §8.15 citations; plan 396/690 fixed test dedupe — this slice connects filesystem → docs → tuple ownership without executing merges |
| Complex cluster flagged as highest-pain group | ~10 `operator-complex-*` / `operator-scalar-complex-*` files cited in validation-ladder/§8.17 but absent from §8.15 bullet list — repo research finding |
| Proposals reference plan 690 supersession pattern | Canonical home → future delete plan → doc sync; audit only names candidates |

## Scope Boundaries

### In scope

- All 35 `test/cpython-derived/operator-*.test.ts` files
- Seven sequence operator evidence files from R2
- `test/cpython-derived/helpers/cross-type-ordering.ts` and other helpers imported by operator tests
- `docs/COMPATIBILITY_AND_GAPS.md` §8.15, §8.17
- `docs/knowledgebase/50-execution/validation-ladder.md`
- `docs/knowledgebase/LIVING-PLAN.md` delta when audit lands

### Deferred for later

- Executing file merges or deleting overlapping assertions
- Runtime operator implementation changes
- Bigint int `==` / arithmetic beyond ratio storage
- PEP 3118
- Automated CI gate on overlap

### Outside this product's identity

- Rewriting CPython `Lib/test` wholesale
- Collapsing non-operator cpython-derived tests (dict, str API, builtins)
- Consolidating `test/operators.test.ts` or `test/dispatch/operators.test.ts`

### Deferred to Follow-Up Work

- Per-cluster dedupe plans spawned from backlog (complex, bytes, scalar cross-type clusters)
- §8.15 bullet-list expansion to include complex cluster files (may be doc-only follow-up)
- Inverse doc drift fixes (files in §8.15 but missing from validation-ladder, e.g. `operator-int-shift`, `operator-pow-mod`, `operator-int-bitwise-float`)

## System-Wide Impact

- **Contributors / agents:** Primary consumers; audit becomes the lookup table for next operator slices.
- **CI / runtime:** No change; test count and behavior unchanged.
- **Documentation:** New knowledgebase artifact; LIVING-PLAN updated to mark audit landed and list top backlog items.

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Overlap matrix incomplete on manual skim | Second-pass `rg` on `describe`/`it` patterns and operand imports per cluster; sample-read flagged duplicates |
| Doc parity false positives from prose vs bullet lists | Separate “§8.15 bullet missing” from “§8.17 prose cites” columns |
| Backlog items too vague for `/ce-plan` | Each backlog row must name canonical file, candidate merge target, and evidence plan ID pattern (e.g. plan 690) |
| Open PRs (#586, #587) add new evidence | Audit notes “as of branch/date”; re-run doc parity row for `operator-complex-eq-pow` after merge if needed |

**Dependencies:** None blocking; optional read of `vendor/cpython/Lib/test/test_operator.py` for R7 appendix only.

---

## Implementation Units

### U1. File inventory

**Goal:** Enumerate every operator and sequence evidence file with a one-line purpose.

**Requirements:** R1, R2

**Dependencies:** None

**Files:** `docs/knowledgebase/50-execution/operator-evidence-audit.md` (create, § Inventory)

**Approach:** Glob `test/cpython-derived/operator-*.test.ts` (expect 35). Add seven `sequence-*.test.ts` rows with §8.6 cross-reference. Note `helpers/cross-type-ordering.ts` consumers (six operator files per repo research). For each file: primary operand families, operators exercised, plan IDs from file header comments if present.

**Patterns to follow:** Plan 688 sequence index; plan 450 §8.15 file list shape.

**Test scenarios:**

- Test expectation: none — documentation artifact; completeness verified in U6.

**Verification:** Inventory row count equals glob count (35 operator + 7 sequence); each path appears exactly once.

### U2. Documentation parity report

**Goal:** List missing, stale, or duplicate citations between filesystem and docs.

**Requirements:** R3

**Dependencies:** U1

**Files:** `docs/knowledgebase/50-execution/operator-evidence-audit.md` (§ Doc parity); read-only sources: `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/50-execution/validation-ladder.md`

**Approach:** Build three columns per inventory row: **§8.15 bullet**, **§8.17 prose**, **validation-ladder row**. Flag: (a) file exists, not cited anywhere; (b) cited path wrong or stale; (c) cited but file deleted; (d) duplicate citations. Prioritize complex cluster gap (validation-ladder cites files absent from §8.15 bullets) and inverse drift (§8.15 lists `operator-int-shift` etc. without ladder rows).

**Patterns to follow:** Plan 450 stale-prefix fix pattern; plan 919 validation-ladder row format.

**Test scenarios:**

- Test expectation: none — doc diff artifact.

**Verification:** Every gap row includes repo-relative path to fix and recommended doc surface.

### U3. Overlap matrix

**Goal:** Map `(left family, right family, operator)` tuples to canonical file(s) and flag multi-file coverage.

**Requirements:** R4

**Dependencies:** U1

**Files:** `docs/knowledgebase/50-execution/operator-evidence-audit.md` (§ Overlap matrix)

**Approach:** Cluster by operand families (complex, scalar-complex, bytes, str, int, bool, float, container, sequence). For each cluster, extract exercised operators from `describe`/`it` titles and assertion patterns. Assign **severity**: `duplicate-assertion` when same case appears twice; `shared-tuple` when families+operator match but cases differ (e.g. eq vs pow). Mark proposed canonical owner per tuple (prefer consolidated `*-remaining-*` or newest plan-backed file).

**Technical design:** Directional grouping — scan order: complex → bytes → str/scalar → int/float/bool → unary/format/misc.

**Patterns to follow:** Plan 396 one-way audit (operand order pairs); plan 690 supersession (sequence-* over operator-list-tuple).

**Test scenarios:**

- Test expectation: none — matrix artifact; R9 sample review in U6.

**Verification:** High-pain tuples (bool↔complex `==`, complex `**`, bytes cross-type eq) have explicit canonical file rows.

### U4. Merge proposals and prioritized backlog

**Goal:** Actionable follow-up slices without executing merges.

**Requirements:** R5, R6

**Dependencies:** U2, U3

**Files:** `docs/knowledgebase/50-execution/operator-evidence-audit.md` (§ Merge proposals, § Backlog)

**Approach:** Propose merge groups: **complex cluster** (~10 files), **bytes cluster**, **scalar cross-type** (str/int/bool/float remaining), **inplace cross-type**, **format/unary/misc**. Per group: canonical target file, files to fold in, risk (coverage loss, golden keys, assertion order), estimated case count delta, prerequisite plans. Backlog ordered by fragmentation pain × doc drift severity; top item should be plannable without re-audit (e.g. “complex eq/pow canonical home” or “§8.15 bullet sync for complex files”).

**Patterns to follow:** Plans 404–428 dedupe series; plan 690 delete-and-supersede checklist.

**Test scenarios:**

- Test expectation: none — planning artifact.

**Verification:** At least three backlog rows with enough detail for `/ce-plan` (scope, files, non-goals, verification ladder).

### U5. Optional CPython mapping appendix

**Goal:** High-level alignment to CPython operator test spirit where obvious.

**Requirements:** R7

**Dependencies:** U1

**Files:** `docs/knowledgebase/50-execution/operator-evidence-audit.md` (§ Appendix: CPython mapping); optional read: `vendor/cpython/Lib/test/test_operator.py`

**Approach:** Section-level mapping only (not line-by-line port). Note pyrt gaps: no wholesale `test_operator.py` port, sequence evidence split to `sequence-*`. Skip if vendor tree absent — record `[OPEN]` in report.

**Test scenarios:**

- Test expectation: none — optional appendix.

**Verification:** Appendix present or explicitly deferred with reason in report.

### U6. Publish audit and sync living plan

**Goal:** Land the report and record audit completion in project tracking docs.

**Requirements:** R8, R9

**Dependencies:** U1–U5 (U5 optional)

**Files:** `docs/knowledgebase/50-execution/operator-evidence-audit.md`, `docs/knowledgebase/LIVING-PLAN.md`, `docs/plans/2026-05-24-920-docs-operator-consolidation-audit-plan.md` (status)

**Approach:** Finalize report with executive summary (top 3 gaps, top 3 backlog items). Run completeness check: `operator-*.test.ts` glob count vs inventory. Second-pass: `rg` sample on 3+ flagged duplicate-assertion pairs from U3. Update LIVING-PLAN with landed/partial/next deltas; link audit from validation-ladder intro or operator section if a single cross-link helps discovery.

**Patterns to follow:** LIVING-PLAN 3-delta convention; validation-ladder plan citation rows.

**Test scenarios:**

- Happy path: Glob returns 35 operator files; inventory lists 35 — counts match.
- Integration: Sample `rg` on a known overlap (e.g. complex scalar bool eq in `operator-complex-eq-pow` vs `operator-complex-scalar`) confirms matrix severity tier.
- Test expectation: none for Vitest — no test files modified.

**Verification:** `npm run check` passes; audit file readable standalone; LIVING-PLAN references plan 920 and audit path; plan status → `completed` when merged.

## Verification

```bash
npm run check
```

No `npm test` requirement for this slice (R8). Optional sanity: full test suite unchanged if any local edits touch only markdown.

**Acceptance checks:**

- Reader can answer “which file owns bool↔complex `==`?” from the audit alone.
- Every operator test file appears exactly once in inventory.
- Doc parity section lists fix paths for §8.15 / §8.17 / validation-ladder gaps.
- Backlog top item is actionable for a follow-up `/ce-plan`.

## Sources & Research

- **Origin:** `docs/brainstorms/2026-05-24-operator-consolidation-audit-requirements.md`
- **Precedents:** plans 450 (§8.15 sync), 396 (one-way audit), 690 (sequence supersession), 404–428 (dedupe series)
- **Repo research:** 35 operator files; complex cluster doc drift; `cross-type-ordering.ts` shared by six files; inverse §8.15 ↔ validation-ladder drift on `operator-int-shift`, `operator-pow-mod`, `operator-int-bitwise-float`
- **External research:** Not required — local patterns sufficient
