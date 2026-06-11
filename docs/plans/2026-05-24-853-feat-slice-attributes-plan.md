---
title: "feat: slice start/stop/step attributes (plan 853)"
type: feat
status: completed
date: 2026-05-24
origin: slice stores bounds in native val but exposes no start/stop/step attributes
---

# `slice.start` / `slice.stop` / `slice.step` attributes

## Summary

CPython `slice` objects expose read-only `start`, `stop`, and `step` attributes (`None` when omitted). pyrt only supports repr and `indices`. Add attribute accessors returning `pyNone`, `pyInt`, or stored `PyObject` bounds; Vitest + docs.

## Problem Frame

- `getAttr(pySlice(1, 2, 3), "start")` fails or is missing today.
- Bounds stored as `SliceBound` since plan 851 must round-trip on read.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `sliceBoundAttr` helper: `null` → `pyNone`; JS `number` → `pyInt`; `PyObject` unchanged |
| R2 | Register `start`, `stop`, `step` on `sliceType` |
| R3 | `test/cpython-derived/slice-attributes.test.ts` — numeric, `None`, `pyInt` bounds |
| R4 | §8.15 docs, validation-ladder, LIVING-PLAN |
| R5 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- Assignment guard (`AttributeError` on set) deferred unless trivial.
- PEP 3118 out of scope.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
