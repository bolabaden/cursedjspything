---
title: "Operator consolidation audit"
type: audit
date: 2026-05-24
status: completed
origin: LIVING-PLAN next item — operator consolidation / §8.15 evidence dedupe
---

# Operator consolidation audit

## Summary

Conduct a **read-only audit** of all `test/cpython-derived/operator-*.test.ts` files and related sequence operator evidence. Produce an overlap matrix, documentation citation gaps, and a prioritized backlog of follow-up merge or doc-only slices. This slice inventories and recommends; it does not move, merge, or delete tests.

## Problem frame

pyrt operator parity evidence grew through vertical slices (plans 384–919). COMPATIBILITY §8.15 lists a consolidated operator layout, but complex/scalar-complex coverage is fragmented across many files and cited mainly in §8.17 prose. Prior consolidation (plan 690) superseded `operator-list-tuple-cross-type.test.ts` with `sequence-*` files — a pattern to extend, but only after an explicit inventory.

**Who it's for:** Contributors and coding agents planning the next operator slice without re-scanning 35+ files manually.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | Inventory every `test/cpython-derived/operator-*.test.ts` file (35 files) with a one-line purpose summary |
| R2 | Include related sequence operator evidence files cited in COMPATIBILITY §8.6 / §8.15 (`sequence-add`, `sequence-eq-cross-type`, `sequence-mul-cross-type`, `sequence-sub`, `sequence-ordering-cross-type`, `sequence-iadd`, `sequence-imul`) in the inventory |
| R3 | Doc parity report: diff inventory against COMPATIBILITY §8.15 evidence bullets, §8.17 operator prose, and `docs/knowledgebase/50-execution/validation-ladder.md` — list missing, stale, or duplicate citations |
| R4 | Overlap matrix: for each `(left operand family, right operand family, operator)` tuple exercised in tests, record canonical file(s); flag tuples appearing in 2+ files with severity (exact duplicate vs complementary) |
| R5 | Recommended merge groups as **proposals only** (e.g. complex cluster, bytes cluster, scalar cross-type cluster), each with risk notes and estimated test-count impact |
| R6 | Prioritized backlog of follow-up implementation slices (separate plans), ordered by fragmentation pain and doc drift severity |
| R7 | Optional appendix: high-level mapping to CPython `Lib/test/test_operator.py` / rich-compare spirit where a clear section exists |
| R8 | No runtime changes, no test file moves, no assertion deletions in this audit slice |
| R9 | Verification for audit artifacts only: inventory completeness check (file count matches glob); overlap matrix reviewed by second pass grep/sample |

## Success criteria

- A reader can answer “which file owns bool↔complex `==`?” without searching the repo.
- Every operator test file appears exactly once in the inventory.
- At least one recommended follow-up slice is actionable enough for `/ce-plan` without re-auditing.
- Doc parity gaps are listed with repo-relative paths to fix.

## Scope boundaries

### In scope

- All `test/cpython-derived/operator-*.test.ts`
- Sequence operator evidence listed in R2
- COMPATIBILITY §8.15, §8.17 operator citations
- validation-ladder operator rows
- helpers referenced by operator tests (e.g. `test/cpython-derived/helpers/cross-type-ordering.ts`)

### Deferred to follow-up work

- Executing file merges or deleting overlapping assertions
- Runtime operator implementation changes
- Bigint int `==` / arithmetic beyond ratio storage
- PEP 3118
- Automated CI gate on overlap (future enhancement)

### Outside this product's identity

- Rewriting CPython `Lib/test` wholesale
- Collapsing non-operator cpython-derived tests (dict, str API, builtins)

## Key decisions

| Decision | Rationale |
|----------|-----------|
| Audit-only slice | Reduces risk of silent coverage loss during merges; plan 690 showed merges need explicit supersession notes |
| Full operator inventory (not complex-only) | User chose all `operator-*.test.ts`; complex cluster is likely highest pain but not the only doc drift |
| Hybrid approach (doc parity + overlap matrix) | Doc fixes are low-cost wins; overlap matrix drives merge proposals |
| Proposals not execution | Merge conflicts and assertion dedupe need per-cluster plans with test runs |

## Approaches considered

| Approach | Verdict |
|----------|---------|
| A — Doc ↔ filesystem parity | **Include** (R3) |
| B — Assertion overlap matrix | **Include** (R4–R5) |
| C — CPython test_operator alignment | **Optional** (R7) |

## Open questions

| ID | Question | Default if unresolved |
|----|----------|----------------------|
| Q1 | Should overlap severity distinguish “same assertion text” vs “same tuple different aspect”? | Yes — two tiers: duplicate assertion vs shared tuple |
| Q2 | Where should the audit report live? | `docs/knowledgebase/50-execution/operator-evidence-audit.md` (new) unless planning prefers `docs/plans/` appendix |

## Non-goals

- Changing test behavior or runtime semantics
- Reducing total test count as a goal (clarity and canonical homes are the goal)
- Consolidating `test/operators.test.ts` or `test/dispatch/operators.test.ts` (unit-level dispatch tests stay separate)
