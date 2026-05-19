---
status: completed
date: 2026-05-18
origin: STRATEGY.md
---

# Tier-1 parity evidence (golden + examples)

## Summary

Extend the CPython golden harness and the `examples/python-vs-js.ts` walkthrough so Tier-1 dispatch gaps (reflected rich compare, slice subscripts) are proven against installed CPython, not only unit tests. Sync compatibility docs to match runtime behavior.

---

## Problem Frame

pyrt’s strategy commits to honest, test-backed CPython data-model parity. Several Tier-1 items are fixed in code but thinly evidenced in golden (~9 checks). Python-first embedders need version-gated proof that `NotImplemented` fallback and slice `__getitem__` match CPython.

---

## Requirements

- R1. Golden harness includes at least one check where the left operand’s forward rich-compare returns `NotImplemented` and the right operand’s reflected op resolves the comparison (CPython `1 < Rev()` pattern).
- R2. Golden harness continues to validate slice `__getitem__` on lists (`slice_list` case) after any harness changes.
- R3. `examples/python-vs-js.ts` demonstrates slice subscript via `getItem` + `pySlice`, aligned with list/tuple `__getitem__` behavior.
- R4. `docs/COMPATIBILITY_AND_GAPS.md` and `docs/knowledgebase/40-operational-risk/parity-gaps-priorities.md` reflect golden coverage for reflected compare (no stale “not golden-tested” claims for what we now test).

---

## Scope Boundaries

- Full `type.__call__` / metaclass pipeline (Tier-1 items 4/9) — out of scope.
- Arbitrary-precision `int`, VM, `import`, `asyncio` — out of scope per STRATEGY.md.
- Rewriting the entire golden matrix to dozens of cases — out of scope; add targeted cases only.

---

## Context & Research

### Relevant Code and Patterns

- `scripts/golden/cases.py` — CPython reference JSON emitter
- `scripts/golden/run.ts` — pyrt mirror + compare
- `src/runtime/dispatch/operators/compare.ts` — `richCompare` / `NotImplemented` chain
- `examples/python-vs-js.ts` — pedagogical parity examples

### Institutional Learnings

- `lookupSpecial` on types must use the type’s own MRO (class `__new__` fix) — do not regress when touching golden class setup.

---

## Key Technical Decisions

- **Golden case `rich_lt_reflected`:** Use a minimal `Rev` class with `__gt__` returning `True`; compare `1 < Rev()` in Python and `lt(pyInt(1), revInst)` in pyrt — matches CPython’s forward-then-reflected ordering when `int.__lt__` returns `NotImplemented`.
- **Examples:** Add a dedicated slice section after container protocols rather than only integer `getItem`.

---

## Implementation Units

- U1. **Golden: reflected rich compare**

**Goal:** R1

**Requirements:** R1, R2

**Dependencies:** None

**Files:**
- Modify: `scripts/golden/cases.py`
- Modify: `scripts/golden/run.ts`
- Test: `npm run golden` (regenerates or validates `scripts/golden/expected/*.json`)

**Approach:**
- Add `Rev` class and `rich_lt_reflected` key to `cases.py`.
- Mirror in `buildPyrtCases` with `lt(pyInt(1), revInst)`.

**Test scenarios:**
- Happy path: `rich_lt_reflected` is `true` for every Python version in CI matrix.
- Integration: `npm run golden` passes locally and in CI.

**Verification:** Golden OK for all discovered Python versions.

---

- U2. **Examples: slice subscript**

**Goal:** R3

**Requirements:** R3

**Dependencies:** None

**Files:**
- Modify: `examples/python-vs-js.ts`

**Approach:**
- Import `pySlice` if not already; add section showing `getItem(pyList(...), pySlice(1, 3, null))`.

**Test scenarios:**
- Happy path: `npx tsx examples/python-vs-js.ts` completes without error.

**Verification:** Example script runs cleanly.

---

- U3. **Documentation sync**

**Goal:** R4

**Requirements:** R4

**Dependencies:** U1

**Files:**
- Modify: `docs/COMPATIBILITY_AND_GAPS.md`
- Modify: `docs/knowledgebase/40-operational-risk/parity-gaps-priorities.md`

**Approach:**
- Note golden coverage for reflected rich compare; keep Tier-1 table honest about remaining gaps.

**Verification:** Docs cite golden case name; no claim of full ordering parity.

---

## System-Wide Impact

- **API surface parity:** Public `lt`/`eq` behavior unchanged; only test harness and docs.
- **Unchanged invariants:** `getAttr` vs `lookupSpecial` split unchanged.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Expected JSON drift across Python versions | New case is version-agnostic boolean |
| Regenerating all `expected/*.json` in CI | `ensureExpected` writes missing files only; existing files must match after manual regen if needed |

---

## Sources & References

- **Origin document:** STRATEGY.md
- Related: `docs/knowledgebase/40-operational-risk/parity-gaps-priorities.md`
