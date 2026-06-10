---
title: "feat: sorted builtin (plan 859)"
type: feat
status: completed
date: 2026-05-24
origin: plan 858 deferred builtin sorted()
---

# builtin `sorted`

## Summary

pyrt has `list.sort` (plan 858) but no builtin `sorted`. Add `sorted(iterable, reverse=False)` that materializes any iterable via `iter`/`next`, sorts with shared `lt`/`gt` logic, returns a new `pyList` without mutating the source.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `sorted(iterable)` — collect `PyObject` items; sort ascending; return new `pyList` |
| R2 | `reverse` optional — same parsing as `list.sort` |
| R3 | Source list/tuple unchanged after `sorted` |
| R4 | Non-iterable → `TypeError` from `iter()`; incomparable → rich-compare `TypeError` |
| R5 | Export from `barrel/stable.ts`; `sorted-builtin.test.ts` + docs |
| R6 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- `key=` deferred.
- PEP 3118 out of scope.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
