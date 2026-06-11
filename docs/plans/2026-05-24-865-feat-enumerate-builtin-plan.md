---
title: "feat: enumerate builtin (plan 865)"
type: feat
status: completed
date: 2026-05-24
origin: plan 864 sum landed; enumerate missing from protocols
---

# builtin `enumerate`

## Summary

pyrt has iterable builtins through `sum` (plans 859–864) but no `enumerate`. Add CPython-parity `enumerate(iterable, start=0)` returning an iterator that yields `(index, value)` tuples via `iter`/`next` on the source iterable.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `enumerate(iterable)` — iterator yielding `pyTuple([pyInt(i), item])` with `i` from 0 |
| R2 | `enumerate(iterable, start)` — `start` parsed via `pyIndexAsInteger` (int/bool/`__index__`) |
| R3 | Zero args → `TypeError: enumerate() expected at least 1 argument, got 0` |
| R4 | 3+ args → `TypeError: enumerate() takes from 1 to 2 positional arguments but N were given` |
| R5 | Non-iterable → `TypeError` from `iter()`; bad `start` → cannot be interpreted as an integer |
| R6 | Iterator `__iter__` returns self; exhausted raises `PyStopIteration` |
| R7 | New `enumerate-iterator.ts`; export `enumerate` from `barrel/stable.ts` |
| R8 | `enumerate-builtin.test.ts` + docs |
| R9 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- No keyword-only `start` in embedder API (positional only).
- PEP 3118 out of scope.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
