---
title: "feat: Golden evidence for both-sides NotImplemented rich compare"
type: feat
status: completed
date: 2026-05-23
origin: docs/knowledgebase/LIVING-PLAN.md
---

# Golden evidence for both-sides NotImplemented rich compare

## Summary

Add a golden case and unit test proving that when forward and reflected rich-compare both return `NotImplemented`, pyrt raises `TypeError` like CPython. Extend `examples/python-vs-js.ts` with the same pattern and sync compatibility docs.

---

## Problem Frame

Tier-1 gap #5: golden covers reflected compare (`rich_lt_reflected`) but not ordering when **both** operands return `NotImplemented`. LIVING-PLAN lists this as the next evidence slice.

---

## Requirements

- R1. Golden case `rich_lt_both_not_impl_raises` on both `cases.py` and `buildPyrtCases`
- R2. Value is boolean `true` when `TypeError` is raised for `Incomparable() < Incomparable()`
- R3. Unit test in `test/dispatch/operators.test.ts` for the same behavior
- R4. New section in `examples/python-vs-js.ts` demonstrating rich-compare failure path
- R5. Update `COMPATIBILITY_AND_GAPS.md` §8.8 and `parity-gaps-priorities.md` to reflect golden coverage

---

## Scope Boundaries

- No changes to `richCompare` algorithm unless tests fail
- No hash/bool strictness work (separate slice)

---

## Key Technical Decisions

- **Fixture:** `Incomparable` with `__lt__` and `__gt__` returning `NotImplemented` (mirrors CPython test patterns)
- **Golden encoding:** emit `rich_lt_both_not_impl_raises: true` via try/except on both sides — JSON-safe boolean

---

## Implementation Units

- U1. **Golden fixtures (Python + pyrt)**

**Files:** `scripts/golden/cases.py`, `scripts/golden/run.ts`

**Test scenarios:**
- Covers AE: CPython and pyrt both report `true` for the raises case
- `lt(incomparable, incomparable)` throws `PyTypeError` in unit layer

**Verification:** `npm run golden` passes

- U2. **Unit test**

**Files:** `test/dispatch/operators.test.ts`

**Verification:** `npm test` passes

- U3. **Examples + docs**

**Files:** `examples/python-vs-js.ts`, `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/40-operational-risk/parity-gaps-priorities.md`, `docs/knowledgebase/LIVING-PLAN.md`

**Verification:** `npm run examples` runs (manual); docs claim golden-tested

---

## Sources & References

- `src/runtime/dispatch/operators/compare.ts` — `richCompare` TypeError path
- `docs/plans/2026-05-18-tier1-parity-golden-plan.md` — prior golden patterns
