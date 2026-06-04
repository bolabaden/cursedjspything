---
title: "feat: int * bytes mul reject + plan 706 merge (plan 707)"
type: feat
status: completed
date: 2026-05-24
origin: plan 705 str pattern; merge PR #374
---

# int * bytes `mul` reject + ops handoff

## Summary

Squash-merge PR #374 (plan 706). Mirror plan 705: **`int * bytes`** raises **`TypeError`** via separate **`bytes.__rmul__`**; **`bytes * int`** still repeats. Vitest + §8.15 docs.

---

## Problem Frame

`str.__rmul__` rejects plain `int` (plan 705). `bytes.__rmul__` still accepts `int` via `sequenceRepeatCount`, allowing **`int * bytes`** inconsistent with the str fix and CPython 3.9–3.13 `int * bytes` rejection path.

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | Merge PR #374 when green |
| R2 | `bytes.__rmul__` rejects plain `int`; `__mul__` unchanged |
| R3 | Vitest: `mul(int, bytes)` TypeError; `mul(bytes, int)` repeats |
| R4 | §8.15 COMPATIBILITY + validation-ladder; LIVING-PLAN deltas (706 merge + 707) |
| R5 | `npm run check && npm test && npm run golden:keys` |

---

## Scope Boundaries

- `bytes.ts` + tests + docs only (aside from merge)

---

## Implementation Units

- U0. Merge PR #374
- U1. `src/runtime/builtins/bytes.ts`
- U2. `test/cpython-derived/operator-bytes-scalar-cross-type.test.ts` (mul section)
- U3. Docs

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
