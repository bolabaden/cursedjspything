---
status: completed
date: 2026-05-19
origin: docs/knowledgebase/LIVING-PLAN.md
---

# Tier-1 semantics continuation

## Summary

Extend Tier-1 CPython parity evidence: golden case when both rich-compare paths return `NotImplemented`, list/tuple `__eq__` propagates `eq()`/`NotImplemented`, and unit tests for hash/bool strictness. Sync compatibility docs and LIVING-PLAN.

## Problem Frame

Prove and harden remaining Tier-1 behavioral parity without metaclass pipeline, VM, or import work.

## Requirements

- R1. Golden: both operands return `NotImplemented` for ordering → `TypeError` (boolean `rich_lt_both_not_impl_raises`).
- R2. Existing golden cases pass on CI matrix 3.10 / 3.12 / 3.14.
- R3. List/tuple `__eq__` use `eq()` and propagate `NotImplemented`.
- R4. Unit tests: both-NotImplemented `lt`, non-boolean `__bool__`, non-integer `__hash__`, cross-type `eq(list, int)`.
- R5. Update COMPATIBILITY_AND_GAPS.md and parity-gaps-priorities.md.
- R6. Update LIVING-PLAN.md 3-delta.

## Implementation Units

- U1. Golden: `cases.py`, `run.ts`, expected JSON
- U2. `list.ts`, `tuple.ts` `Slot.eq`
- U3. `test/dispatch/operators.test.ts`, `test/builtins/list-eq.test.ts`
- U4. Documentation sync

## Out of Scope

`core/lookup` decouple; full `type.__call__`; doc path mega-sweep.
