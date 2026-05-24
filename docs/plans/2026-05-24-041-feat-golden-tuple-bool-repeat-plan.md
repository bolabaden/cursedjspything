---
title: "feat: golden keys for tuple bool repetition"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md
---

# Golden keys: tuple bool repetition

## Summary

Add `tuple_bool_mul` and `tuple_bool_rmul` golden cases so tuple repetition bool parity (plans 036–037) has cross-runtime proof matching list (`seq_bool_*`) and str (`str_bool_*`) keys from plans 038–039.

---

## Problem Frame

Golden harness covers list and str bool repetition but not `(1,) * True` / `True * (1,)`. Runtime already implements tuple `__mul__`/`__rmul__` via `sequenceRepeatCount`; only golden evidence is missing.

---

## Requirements

- R1. Add keys to `scripts/golden/cases.py` and `scripts/golden/pyrt-cases.ts` with sync comments
- R2. Update `scripts/golden/expected/*.json`, `expected.json`, run `npm run golden:keys`
- R3. Docs: key count 27→29 in README, COMPATIBILITY, parity-gaps, validation-ladder, compatibility-summary, tier-b reference
- R4. `npm run check`, `npm test`, `npm run golden`
- R5. LIVING-PLAN delta; feature branch + PR from `main`

---

## Scope Boundaries

- Golden + docs only; no runtime changes
- Two keys (forward + reflected length checks)

---

## Implementation Units

- U1. Golden builders (`len((1,) * True)`, `len(True * (1,))`)
- U2. Expected snapshots + KB sync
- U3. Branch `feat/golden-tuple-bool-repeat`, PR

---

## Test Scenarios

- T1. CPython and pyrt both report `tuple_bool_mul: 1`, `tuple_bool_rmul: 1`
- T2. `test/golden/key-parity.test.ts` passes at 29 keys/profile

---

## Risks / assumptions

- Assumes tuple bool repeat already matches CPython (verified locally in plan 037)
- Key set grows; CI golden jobs compare all keys per version

## Feasibility review (2026-05-24)

**Verdict: GO WITH CHANGES** — runtime + Vitest already cover tuple bool repeat; golden-only slice mirrors plans 038–039. Amendments applied: `pyTuple` import, explicit expected JSON paths (no `3.9.json`), named `tuple_bool_*` in doc inventories.

---

## Sources & References

- Plans 036–039 golden pattern
- `sequence-repeat-bool.test.ts` Vitest coverage
