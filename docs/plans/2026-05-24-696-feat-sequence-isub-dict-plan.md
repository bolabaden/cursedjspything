---
title: "feat: list isub dict reject + KB count sync (plan 696)"
type: feat
status: completed
date: 2026-05-24
origin: plan 695 merge; sequence-sub completeness
---

# list `-=` dict reject + Vitest count sync

## Summary

Add **`isub(list, dict)`** `PyTypeError` evidence in **`sequence-sub.test.ts`** (container rhs like `operator-inplace-cross-type` `iadd`). Sync KB Vitest counts to **1176 / 163** and record plan 695 merge (PR #363).

---

## Problem Frame

Plan 695 completed scalar list `-=` rejects. **`list += dict`** is rejected in `operator-inplace-cross-type.test.ts` but **`list -= dict`** is not named in §8.6 `sequence-sub` evidence. `repo-signals.md` / `runtime-overview.md` still cite **1170** tests.

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `isub(list, dict)` raises `PyTypeError` with `-=` message; list unchanged |
| R2 | §8.6 COMPATIBILITY + validation-ladder mention list↔dict `-=` |
| R3 | `repo-signals.md` and `runtime-overview.md` → 1176 / 163 |
| R4 | LIVING-PLAN: plan 695 merge PR #363; plan 696 delta |
| R5 | `npm run check && npm test && npm run golden:keys` green |

---

## Scope Boundaries

- Tests + docs only

---

## Implementation Units

- U1. `test/cpython-derived/sequence-sub.test.ts`
- U2. `docs/COMPATIBILITY_AND_GAPS.md`, `validation-ladder.md`
- U3. `docs/knowledgebase/90-meta/repo-signals.md`, `runtime-overview.md`, `LIVING-PLAN.md`

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
