---
title: "fix: min/max two-arg comparand parsing"
type: fix
status: active
date: 2026-05-24
origin: correctness review on main; living plan partial item
---

## Summary

`min` and `max` with exactly two positional arguments must follow CPython’s multi-comparand form when both values can be ordered against each other (for example `min(1, 2)` → `1`). Today the parser always treats the second argument as `default`, which breaks the common two-scalar case. The fix restores comparand parsing while keeping the plan 867 embedder pattern where an empty sequence plus a non-comparand second value returns that default.

## Problem

Calling `min(pyInt(1), pyInt(2))` or `max(pyInt(1), pyInt(2))` raises `TypeError: 'int' object is not iterable` because `parseMinMaxArgs` pops the second positional as `default` whenever there are two args and no `key`. Tests cover three-or-more comparands and iterable-plus-default, but not the two-scalar form.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `min(a, b)` and `max(a, b)` return the extremum when `a` and `b` are mutually orderable comparands (ints, strings, and other types that support direct ordering). |
| R2 | Two positional arguments must not enter iterable form unless the call is the embedder iterable-plus-default shape from plan 867 (empty sequence with a second value that is not a comparand partner). |
| R3 | Existing plan 867 behavior stays: `min(empty_list, default)` and `max(empty_tuple, default)` return `default`; non-empty iterable plus trailing default still returns the iterable extremum and ignores default. |
| R4 | Three-or-more positional comparands, callable `key`, and `key`+`default` trailing forms are unchanged. |
| R5 | Extend `test/cpython-derived/min-max-builtin.test.ts` with two-arg int and two-arg string comparand cases. |
| R6 | `npm run check && npm test` pass on the branch. |

## Success Criteria

- `min(pyInt(1), pyInt(2))` → `1` and `max(pyInt(1), pyInt(2))` → `2`.
- `min(pyStr("b"), pyStr("a"))` → `"a"` (two strings as comparands, not character iteration).
- All existing `min-max-builtin.test.ts` cases still pass, including empty-sequence default cases.
- No regressions in full test suite.

## Key Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| K1 | Use an orderability gate for two-arg disambiguation: when both positionals are mutually orderable, treat them as comparands; otherwise apply the existing iterable-plus-default rules. | Avoids a hard-coded type list while fixing ints and strings and preserving `min([], default)`. |
| K2 | Keep positional `min(nonempty_sequence, default)` returning the sequence extremum (plan 867 / current tests). | Intentional embedder API; CPython rejects `min([1, 2], 99)` with `TypeError`. Document as a known gap, do not “fix” in this slice. |
| K3 | Do not add keyword-only `default=` parsing in this slice. | Out of scope; plan 867 deferred keyword syntax. |

## Scope Boundaries

**In scope**

- Argument disambiguation in `parseMinMaxArgs` for exactly two positionals.
- Targeted regression tests for two-arg comparands.

**Deferred**

- Keyword `default=` / `key=` matching full CPython signature rules.
- Aligning `min(nonempty_sequence, int_default)` with CPython (would be a breaking embedder change).
- Broader `COMPATIBILITY_AND_GAPS.md` rewrite beyond a short note if planning adds one.

**Out of scope**

- Changes to comparison protocol, `sorted`, or other builtins.
- New builtin surface exports.

## Dependencies and Assumptions

- Plan 867 positional default semantics remain the compatibility baseline for embedder callers.
- `comparePyObjectsForOrder` (or equivalent ordering probe) correctly distinguishes orderable pairs from `list`/`int`-style mismatches at parse time.

## Outstanding Questions

None blocking planning; K2 documents the accepted CPython divergence.
