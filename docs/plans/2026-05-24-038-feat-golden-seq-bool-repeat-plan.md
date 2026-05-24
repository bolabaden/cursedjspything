---
title: "feat: golden keys for sequence bool repetition"
type: feat
status: active
date: 2026-05-24
origin: docs/plans/2026-05-24-037-feat-list-tuple-rmul-bool-plan.md
---

# Golden keys: sequence bool repetition

## Summary

Add `seq_bool_mul` and `seq_bool_rmul` golden cases so plans 035–037 have cross-runtime (CPython vs pyrt) proof, not only Vitest.

---

## Problem Frame

Vitest covers `[1]*True` and `True*[1]`; golden harness still has no keys for sequence×bool repetition.

---

## Requirements

- R1. Add keys to `scripts/golden/cases.py` and `scripts/golden/pyrt-cases.ts` (sync comments)
- R2. Update `scripts/golden/expected/*.json` and `expected.json` with values `1`
- R3. `npm run golden:keys`; `npm run golden`; `npm test`
- R4. Docs: key count 23→25 in README, COMPATIBILITY, parity-gaps, validation-ladder, compatibility-summary
- R5. LIVING-PLAN delta

---

## Scope Boundaries

- Two keys only (list length); no tuple-specific keys
- No runtime code changes

---

## Implementation Units

- U1. Golden case builders + expected JSON
- U2. Key snapshot + docs

---

## Test Scenarios

- T1. CPython and pyrt both report `seq_bool_mul: 1`, `seq_bool_rmul: 1`
- T2. `test/golden/key-parity.test.ts` passes with 25 keys/profile

---

## Sources & References

- Plans 035–037 `sequenceRepeatCount`
- README golden dual-builder rule
