---
title: "feat: sum builtin (plan 864)"
type: feat
status: completed
date: 2026-05-24
origin: plan 863 any/all landed; sum missing from protocols
---

# builtin `sum`

## Summary

pyrt has iterable builtins `any`/`all`/`min`/`max`/`sorted` (plans 859–863) but no `sum`. Add CPython-parity `sum(iterable, start=0)` that accumulates via `iter`/`next` and `add()` from numeric dispatch.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `sum(iterable)` — accumulate with `start=0` (`pyInt(0)`); return final `PyObject` |
| R2 | `sum(iterable, start)` — use provided start as initial accumulator |
| R3 | Zero args → `TypeError: sum() expected at least 1 argument, got 0` |
| R4 | 3+ args → `TypeError: sum() takes from 1 to 2 positional arguments but N were given` |
| R5 | Empty iterable returns start (default `0`) |
| R6 | Non-iterable → `TypeError` from `iter()`; incomparable add → operand `TypeError` |
| R7 | String sequence with int start fails (via `add` / CPython-style restriction if present) |
| R8 | Export from `barrel/stable.ts`; `sum-builtin.test.ts` + docs |
| R9 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- No `start` keyword-only embedder API (positional `start` only, same as other builtins).
- PEP 3118 out of scope.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
