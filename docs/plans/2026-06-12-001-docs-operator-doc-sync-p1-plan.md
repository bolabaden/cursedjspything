---
title: "docs: operator doc sync P1 (plan 921)"
type: docs
status: completed
date: 2026-06-12
origin: docs/knowledgebase/50-execution/operator-evidence-audit.md
---

# Operator documentation sync (P1)

## Summary

Doc-only slice closing P1 backlog from plan 920 audit: add ten complex/scalar-complex operator evidence files to §8.15 bullet list and add validation-ladder rows for three inverse-drift files (`operator-int-shift`, `operator-pow-mod`, `operator-int-bitwise-float`). No test or runtime changes.

## Problem Frame

Plan 920 identified doc drift between filesystem evidence, `COMPATIBILITY_AND_GAPS.md` §8.15 bullets, and `validation-ladder.md`. Complex cluster files are cited in §8.17 prose and the ladder but missing from §8.15 bullets; three int operator files appear in §8.15 but lack ladder rows.

## Requirements

| ID | Requirement | Origin |
|----|-------------|--------|
| R1 | Add all ten complex/scalar-complex operator test files to §8.15 operator cross-type bullet list (alphabetical) | audit P1 |
| R2 | Add validation-ladder rows for `operator-int-shift`, `operator-pow-mod`, `operator-int-bitwise-float` | audit P1 |
| R3 | Update LIVING-PLAN with plan 921 landed delta | convention |
| R4 | No test moves, no runtime changes | audit R8 |

## Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| Alphabetical insert into existing §8.15 bullet line | Matches plan 450 / existing list shape |
| Ladder rows follow plan 919 one-line format | Consistency with adjacent operator rows |
| Optional §8.17 cite for int-bitwise-float deferred | Audit marked optional; ladder row sufficient for P1 |

## Scope Boundaries

### In scope

- `docs/COMPATIBILITY_AND_GAPS.md` §8.15 bullet list
- `docs/knowledgebase/50-execution/validation-ladder.md`
- `docs/knowledgebase/LIVING-PLAN.md`

### Deferred to Follow-Up Work

- P2 §8.17 cross-link canonical homes
- P3 complex pow dedupe merges

---

## Implementation Units

### U1. §8.15 complex bullet sync

**Goal:** Ten complex/scalar-complex files appear in §8.15 operator cross-type bullet list.

**Requirements:** R1

**Files:** `docs/COMPATIBILITY_AND_GAPS.md`

**Approach:** Insert `operator-complex-*` and `operator-scalar-complex-*` paths alphabetically into the bullet on line ~416.

**Test scenarios:** Test expectation: none — documentation only.

**Verification:** All ten audit-listed files present exactly once in §8.15 bullets.

### U2. Validation-ladder inverse drift rows

**Goal:** Three int operator files have ladder rows matching their evidence purpose.

**Requirements:** R2

**Files:** `docs/knowledgebase/50-execution/validation-ladder.md`

**Approach:** Add rows near existing operator/int evidence block with one-line descriptions from test file headers.

**Test scenarios:** Test expectation: none — documentation only.

**Verification:** Each of the three paths appears exactly once in validation-ladder operator table.

### U3. Living plan and plan status

**Goal:** Record P1 doc sync landed; note next backlog item.

**Requirements:** R3

**Files:** `docs/knowledgebase/LIVING-PLAN.md`, this plan file (status)

**Verification:** LIVING-PLAN top delta references plan 921; P1 marked landed.

## Verification

```bash
npm run check
```
