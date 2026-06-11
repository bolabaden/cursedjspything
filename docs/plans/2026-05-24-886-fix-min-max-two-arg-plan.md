---
title: "fix: min/max two-arg comparand parsing (plan 886)"
type: fix
status: completed
date: 2026-05-24
origin: docs/brainstorms/2026-05-24-min-max-two-arg-requirements.md
---

# `min` / `max` two-arg comparand parsing

## Summary

Fix `parseMinMaxArgs` so `min(a, b)` and `max(a, b)` compare two orderable values when both arguments support mutual ordering. Preserve plan 867 positional default for empty sequences paired with a non-comparand second value.

## Problem Frame

With exactly two positional arguments and no `key`, the parser unconditionally treats the second argument as `default` and the first as an iterable. Scalar pairs such as `min(pyInt(1), pyInt(2))` then call `materializeIterable` on an `int` and fail with `TypeError: 'int' object is not iterable`. CPython treats two orderable positionals as comparands (`min(1, 2)` → `1`). Tests cover three-or-more comparands and iterable-plus-default but not the two-scalar form (see origin R1–R2).

## Requirements

| ID | Requirement | Source |
|----|-------------|--------|
| R1 | `min(a, b)` / `max(a, b)` return the extremum when `a` and `b` are mutually orderable | origin R1 |
| R2 | Two positionals enter iterable-plus-default only when the pair is not mutually orderable as comparands | origin R2, K1 |
| R3 | Plan 867 behavior unchanged: empty list/tuple + trailing default returns default; nonempty iterable + trailing default returns iterable extremum | origin R3, K2 |
| R4 | Three-or-more comparands, trailing `key`, and `key`+`default` forms unchanged | origin R4 |
| R5 | Add two-arg int and two-arg string tests | origin R5 |
| R6 | `npm run check && npm test` pass | origin R6 |

## Key Technical Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| KTD1 | Gate the two-arg `default` pop behind a mutual-orderability probe using existing `lt`/`gt` rich-compare (same semantics as `comparePyObjectsForOrder` without `key`) | Reuses established ordering rules; avoids a container-type allowlist (see origin K1) |
| KTD2 | When the probe succeeds, leave both positionals in place for multi-comparand selection | Matches CPython two-arg comparand form |
| KTD3 | When the probe raises `PyTypeError` for unsupported ordering, keep current behavior: pop second as `default`, first as iterable | Preserves `min(pyList([]), pyInt(99))` and `min(pyList([1, 2]), pyInt(99))` (origin K2) |
| KTD4 | No `COMPATIBILITY_AND_GAPS.md` edit in this slice unless implementer spots an existing min/max bullet worth one-line clarification | Origin defers broader doc rewrite |

## Scope Boundaries

**In scope**

- `parseMinMaxArgs` disambiguation for exactly two positionals after `key` stripping
- Regression tests in `test/cpython-derived/min-max-builtin.test.ts`

**Deferred to follow-up work**

- Keyword `default=` / `key=` parity with CPython
- Aligning `min(nonempty_sequence, int_default)` with CPython (`TypeError` there; embedder extension here)

**Out of scope**

- Comparison protocol, `sorted`, exports, or other builtins

## Implementation Units

### U1. Orderability-gated two-arg parsing

**Goal:** Fix scalar two-arg calls without breaking plan 867 default semantics.

**Requirements:** R1, R2, R3, R4

**Files:**

- `src/runtime/dispatch/protocols.ts`

**Approach:**

Add a small local helper (e.g. `areMutuallyOrderable(a, b)`) that attempts `lt(a, b)` or `gt(a, b)` inside a try/catch and returns true when rich-compare succeeds (boolean result, including both-false equality). Return false on `PyTypeError` from unsupported ordering.

Replace the unconditional block at lines 246–251: only pop the second positional as `default` when `positional.length === 2`, `keyFn` and `defaultVal` are null, the last arg is a non-callable `PyObject`, **and** the first and last are **not** mutually orderable.

Leave all earlier `key`/`default` trailing parsing and the `iterableForm` / multi-comparand branches unchanged.

**Patterns to follow:**

- Existing `parseMinMaxArgs` structure from plans 862/867
- `comparePyObjectsForOrder` in `src/runtime/builtins/list.ts` for ordering semantics (import `lt`/`gt` from compare module if not already present in `protocols.ts`)

**Test scenarios:**

- Happy: `min(pyInt(1), pyInt(2))` → `1`; `max(pyInt(1), pyInt(2))` → `2`
- Happy: `min(pyStr("b"), pyStr("a"))` → `"a"`; `max(pyStr("b"), pyStr("a"))` → `"c"`
- Regression: `min(pyList([]), pyInt(99))` → `99`; `min(pyList([pyInt(1), pyInt(2)]), pyInt(99))` → `1`
- Regression: `min(pyInt(3), pyInt(1), pyInt(2))` unchanged; `min(items, key)` and `min(pyList([]), key, default)` unchanged
- Error: `min(pyInt(1), pyStr("a"))` still raises `PyTypeError` (incomparable comparands, not iterable confusion)

**Verification:** Two-arg scalar calls no longer raise `'int' object is not iterable`; plan 867 cases still pass.

### U2. Regression tests

**Goal:** Lock comparand behavior and guard against reintroduction of the bug.

**Requirements:** R5, R6

**Dependencies:** U1

**Files:**

- `test/cpython-derived/min-max-builtin.test.ts`

**Approach:**

Add one `it` block (or extend the existing multi-positional test) covering:

- `min(pyInt(1), pyInt(2))` and `max(pyInt(1), pyInt(2))`
- `min(pyStr("b"), pyStr("a"))` and `max(pyStr("b"), pyStr("a"))`

Do not remove or weaken existing plan 867 default tests.

**Execution note:** Add failing tests first (two-arg int case reproduces the bug), then implement U1.

**Test scenarios:**

- `min(pyInt(1), pyInt(2))` → `1`
- `max(pyInt(1), pyInt(2))` → `2`
- `min(pyStr("b"), pyStr("a"))` → `"a"`
- `max(pyStr("b"), pyStr("a"))` → `"c"`
- Full file suite green; full `npm test` green

**Verification:** New cases fail before U1 and pass after U1.

## Verification

```bash
npm run check && npm test
```

## Sources & References

- `docs/brainstorms/2026-05-24-min-max-two-arg-requirements.md` (origin)
- `docs/plans/2026-05-24-862-feat-min-max-builtin-plan.md`
- `docs/plans/2026-05-24-867-feat-min-max-key-default-plan.md`
- `src/runtime/dispatch/protocols.ts` — `parseMinMaxArgs`, `min`, `max`
- `test/cpython-derived/min-max-builtin.test.ts`
