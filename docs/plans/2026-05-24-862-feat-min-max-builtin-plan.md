---
title: "feat: min/max builtins (plan 862)"
type: feat
status: completed
date: 2026-05-24
origin: sorted builtin landed; min/max missing from protocols
---

# builtin `min` / `max`

## Summary

pyrt has `sorted` (plan 859) but no `min`/`max` builtins. Add CPython-parity helpers: compare multiple `PyObject` arguments via `lt`/`gt`, or accept one iterable (via `iter`/`next`); empty iterable raises `ValueError`.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `min(*args)` — one iterable or 2+ values; return smallest via `lt` |
| R2 | `max(*args)` — same shape; return largest via `gt` |
| R3 | Zero args → `TypeError`; empty iterable → `ValueError` |
| R4 | Incomparable values propagate rich-compare `TypeError` |
| R5 | Export from `barrel/stable.ts`; `min-max-builtin.test.ts` + docs |
| R6 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- `key=` and `default=` deferred.
- PEP 3118 out of scope.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
