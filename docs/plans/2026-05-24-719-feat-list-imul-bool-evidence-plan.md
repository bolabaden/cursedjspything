---
title: "feat: list __imul__ bool evidence + merge PR #386 (plan 719)"
type: feat
status: completed
date: 2026-05-24
origin: plan 717; sequence-repeat-bool; open PR #386
---

# list `__imul__` bool repeat evidence + ops handoff

## Summary

Squash-merge PR #386 (plan 718). Add Vitest that **`list *= bool`** repeats in place (`True` → length 1, `False` → empty), matching CPython and `sequence-repeat-bool.test.ts` mul behavior.

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | Merge PR #386 when green |
| R2 | `sequence-imul.test.ts`: `imul(list, pyTrue)` / `pyFalse` in-place length |
| R3 | LIVING-PLAN: plan 718 merge + plan 719 |
| R4 | `npm run check && npm test && npm run golden:keys` |

---

## Scope Boundaries

- Tests only (runtime already supports bool via `sequenceRepeatCount`)

---

## Implementation Units

- U0. Merge PR #386
- U1. `test/cpython-derived/sequence-imul.test.ts`
- U2. `docs/knowledgebase/LIVING-PLAN.md`

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
