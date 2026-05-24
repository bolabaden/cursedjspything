---
title: "feat: builtin cross-type delegation documentation sync"
type: feat
status: completed
date: 2026-05-23
origin: docs/knowledgebase/LIVING-PLAN.md
---

# Builtin cross-type delegation documentation sync

## Summary

Sync Tier-1 gap #8 documentation with current pyrt behavior: `int`↔`float` cross-type compare and arithmetic is implemented in `int.ts`; other builtin pairs return `NotImplemented`. Evidence lives in `test/cpython-derived/operator-int-float.test.ts` (PR #6).

---

## Problem Frame

LIVING-PLAN lists "Builtin cross-type delegation docs sync" as next work. `parity-gaps-priorities.md` row #8 still reads as a blanket "return NotImplemented" without distinguishing the int/float path. `COMPATIBILITY_AND_GAPS.md` mentions cross-type gaps only in passing (§8.6). Embedders need an explicit contract.

---

## Requirements

- R1. Add `COMPATIBILITY_AND_GAPS.md` §8.15 documenting int↔float delegation, `NotImplemented` for other pairs, and CPython-derived test evidence
- R2. Refine `parity-gaps-priorities.md` Tier-1 row #8 to partial int/float vs remaining cross-type gaps
- R3. Extend `validation-ladder.md` L2 table with `test/cpython-derived/*` paths
- R4. Update `LIVING-PLAN.md` delta (landed docs sync; next = merge PRs)

---

## Scope Boundaries

- Documentation only — no runtime or test code changes
- Do not claim str/bool/list cross-type parity
- Do not merge or close open PRs in this slice

---

## Implementation Units

- U1. `docs/COMPATIBILITY_AND_GAPS.md` — new §8.15
- U2. `docs/knowledgebase/40-operational-risk/parity-gaps-priorities.md` — row #8
- U3. `docs/knowledgebase/50-execution/validation-ladder.md` — L2 table
- U4. `docs/knowledgebase/LIVING-PLAN.md` — delta

---

## Test Scenarios

Docs-only slice — verification is L4 source-vs-docs parity:

- §8.15 cites `int.ts` type guards and `operator-int-float.test.ts`
- Row #8 distinguishes int/float (partial) from other builtins (NotImplemented)
- Validation ladder lists cpython-derived test files present in repo

---

## Sources & References

- `src/runtime/builtins/int.ts` — `intType` / `floatType` guards
- `test/cpython-derived/operator-int-float.test.ts`
- `docs/knowledgebase/LIVING-PLAN.md` — gap #8 next item
