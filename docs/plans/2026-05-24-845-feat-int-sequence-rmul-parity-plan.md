---
title: "feat: restore int * sequence mul CPython parity (plan 845)"
type: feat
status: completed
date: 2026-05-24
origin: CPython 3.14 sq_repeat fallback; plans 705/707/709 regression
---

# int * str/bytes/list/tuple `mul` CPython parity

## Summary

Plans 705/707/709 added `__rmul__` guards that reject plain **`int`** repeat counts on **str**, **bytes**, **list**, and **tuple**, causing **`int * sequence`** to raise **`TypeError`**. CPython 3.9–3.14 allows these via reflected **`__rmul__`** / **`sq_repeat`** (`PyNumber_Multiply` in `abstract.c`). Restore parity by removing the incorrect **`intType`** reject guards, update Vitest matrices, and sync §8.15 docs.

## Problem Frame

- `python3 -c "print(1*'ab', 1*b'ab', 1*[1], 1*(1,))"` succeeds on CPython 3.14.
- pyrt rejects `mul(pyInt(1), pyStr('a'))` etc. after plan 705/707/709.
- `bool * sequence` still works because `boolType !== intType`; int path is broken.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `str`/`bytes`/`list`/`tuple` `__rmul__` accept int and bool repeat counts (same as `__mul__`) |
| R2 | `mul(int, str|bytes|list|tuple)` repeats; forward `mul(sequence, int)` unchanged |
| R3 | Update `operator-int-str-remaining-binary`, `operator-bytes-scalar-cross-type`, `sequence-mul-cross-type` |
| R4 | §8.15 COMPATIBILITY + validation-ladder + LIVING-PLAN 3-delta |
| R5 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- Runtime: `str.ts`, `bytes.ts`, `list.ts`, `tuple.ts` only
- No broad `PyNumber_Multiply` / `sq_repeat` dispatcher refactor in this slice
- Close superseded docs-only handoff PR #512 when substantive PR opens

## Implementation Units

- U1. Remove `intType` guards from `repeat*Rmul` (or alias `__rmul__` to `__mul__` handler)
- U2. Vitest: flip reject tests to success + bidirectional parity smoke
- U3. Docs sync

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
