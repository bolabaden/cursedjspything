---
title: "feat: int * list/tuple mul reject + plan 708 merge (plan 709)"
type: feat
status: completed
date: 2026-05-24
origin: plans 705/707; merge PR #376
---

# int * list/tuple `mul` reject + ops handoff

## Summary

Squash-merge PR #376 (plan 708). Mirror plans 705/707: **`int * list`** and **`int * tuple`** raise **`TypeError`** via separate **`__rmul__`**; **`list * int`** / **`tuple * int`** unchanged.

---

## Problem Frame

`str` and `bytes` reject `int` on `__rmul__`. `list` and `tuple` still accept `int` via shared `repeatList`/`repeatTuple` on both `__mul__` and `__rmul__`.

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | Merge PR #376 when green |
| R2 | `list.ts` / `tuple.ts`: `repeatListRmul` / `repeatTupleRmul` reject `intType` |
| R3 | Vitest in `sequence-mul-cross-type.test.ts` or `sequence-repeat-bool.test.ts` |
| R4 | §8.6/§8.15 docs + LIVING-PLAN (708 merge + 709) |
| R5 | `npm run check && npm test && npm run golden:keys` |

---

## Implementation Units

- U0. Merge PR #376
- U1. `src/runtime/builtins/list.ts`, `tuple.ts`
- U2. `test/cpython-derived/sequence-mul-cross-type.test.ts`
- U3. Docs

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
