---
title: "feat: range builtin (plan 875)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN next slice after plan 874 dict builtin
---

# builtin `range`

## Summary

pyrt lacks CPython's immutable `range` sequence. Add `range(stop)`, `range(start, stop)`, and `range(start, stop, step)` returning a `range` object that supports iteration, `len`, integer indexing, and membership — matching core CPython behavior for embedder tests.

## Problem Frame

Constructor/iterable builtins landed through `dict()` (plan 874). `range` is the next named LIVING-PLAN builtin and is required for idiomatic counting loops and sequence materialization via `iter`/`next`.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `range(stop)` — `start=0`, `step=1` |
| R2 | `range(start, stop)` — `step=1` |
| R3 | `range(start, stop, step)` — full 3-arg form |
| R4 | 0 args → `TypeError: range expected at least 1 argument, got 0` |
| R5 | 4+ args → `TypeError: range expected at most 3 arguments, got N` |
| R6 | Non-integer args → `TypeError: '<typename>' object cannot be interpreted as an integer` via `pyIndexAsInteger` |
| R7 | `step == 0` → `ValueError: range() arg 3 must not be zero` |
| R8 | `__iter__` yields `pyInt` values until exhausted; `__iter__` on iterator returns self |
| R9 | `__len__` returns correct count (including empty misaligned ranges) |
| R10 | `__getitem__` with int index; out-of-range → `PyIndexError: range object index out of range` |
| R11 | `__contains__` for int-like members consistent with iteration |
| R12 | Export `range` and `rangeType` from `barrel/stable.ts`; `range-builtin.test.ts` + docs |
| R13 | `npm run check && npm test && npm run golden:keys` |

## Key Technical Decisions

1. **`range` as builtin type** — New `range.ts` with `rangeType` storing `_start`, `_stop`, `_step` on instance dict; separate `range_iterator` type (or nested iterator class) following `enumerate-iterator.ts` pattern.
2. **Embedder positional API** — No keyword-only forms; mirror `enumerate` arg parsing style in exported `range(...args)`.
3. **Defer rich compare / reversed** — `range == range`, `reversed(range)`, and `__format__` out of this slice unless trivially free.

## Scope Boundaries

### Deferred to Follow-Up Work

- `range` equality / hashing across instances.
- `reversed(range)` builtin parity.
- Keyword-only argument forms.

### Out of scope

- PEP 3118.

## Implementation Units

### U1. Range object and iterator

**Goal:** Core `range` type with iteration and length.

**Requirements:** R1–R3, R7–R9, R11

**Files:** `src/runtime/builtins/range.ts`, `src/runtime/builtins/index.ts`

**Approach:** Parse bounds in `range(...args)`. Compute length with CPython integer division rules for positive/negative step. Iterator tracks next value and compares against `stop` per step sign.

**Test scenarios:**

- `range(5)` iterates `0..4`; `range(2,5)` → `2,3,4`; `range(0,10,2)` → evens.
- `range(5,0,-1)` → `5,4,3,2,1`; `range(5,1)` empty (no items, len 0).
- `step=0` raises `ValueError` with CPython message.
- `len(range(10))` is 10; `3 in range(10)` true; `11 in range(10)` false.

**Verification:** Iterator exhaust raises `PyStopIteration`.

### U2. Indexing and builtin export

**Goal:** `__getitem__` and public export.

**Requirements:** R4–R6, R10, R12

**Dependencies:** U1

**Files:** `src/runtime/builtins/range.ts`, `src/barrel/stable.ts`

**Approach:** Normalize index against `len`; return `pyInt(start + index * step)`. Wire `range`/`rangeType` exports like `enumerate`.

**Test scenarios:**

- `range(3)[0]` and `range(3)[-1]` via `getItem`.
- OOB index raises `PyIndexError`.
- 0/4 arg arity errors; `range(pyStr('x'))` type error.

**Verification:** Callable from package entry `src/index.js`.

### U3. Tests and documentation

**Goal:** Evidence and living-plan sync.

**Requirements:** R12, R13

**Dependencies:** U2

**Files:** `test/cpython-derived/range-builtin.test.ts`, `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/LIVING-PLAN.md`, `docs/knowledgebase/50-execution/validation-ladder.md`

**Verification:** Full validation ladder passes.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
