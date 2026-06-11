---
title: "feat: range __eq__ and unhashable (plan 877)"
type: feat
status: completed
date: 2026-05-24
origin: plan 876 deferred range equality / hashing
---

# `range` equality

## Summary

Close the plan 875/876 partial: add `range.__eq__` comparing `(start, stop, step)` tuples, and document unhashable `range` via tests (default `hash()` path).

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `range(a)==range(b)` when start/stop/step match (including equivalent constructors like `range(5)` vs `range(0,5)`) |
| R2 | `range` unequal when any bound differs |
| R3 | `range` vs non-`range` → `NotImplemented` from `__eq__`; `eq()` yields `false` |
| R4 | `hash(range(...))` → `TypeError: unhashable type: 'range'` |
| R5 | Extend `range-builtin.test.ts`; update docs |
| R6 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- Cross-type ordering / `range` hashing implementation deferred (remain unhashable).
- PEP 3118 out of scope.

## Implementation Units

### U1. `range.__eq__`

**Files:** `src/runtime/builtins/range.ts`

**Approach:** `Slot.eq` compares `_fields` when `other.type === rangeType`; else `NotImplemented`.

**Test scenarios:** equivalent ranges true; different stop false; `eq(range, list)` false.

### U2. Tests and docs

**Files:** `test/cpython-derived/range-builtin.test.ts`, compatibility + living-plan + validation-ladder

**Test scenarios:** hash unhashable message; `ne` delegation via `eq`.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
