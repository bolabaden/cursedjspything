---
title: "feat: golden keys for str bool repetition"
type: feat
status: completed
date: 2026-05-24
origin: docs/plans/2026-05-24-038-feat-golden-seq-bool-repeat-plan.md
---

# Golden keys: str bool repetition

## Summary

Add `str_bool_mul` and `str_bool_rmul` golden cases so str repetition bool parity (plan 035) has cross-runtime proof alongside list keys from plan 038.

---

## Problem Frame

Golden harness covers list `seq_bool_*` but not `"ab" * True` / `True * "ab"`.

---

## Requirements

- R1. Keys in `cases.py` and `pyrt-cases.ts` (sync comments)
- R2. Update expected JSON + `key-sets.json` (25→27 keys/profile)
- R3. Docs: README, COMPATIBILITY, parity-gaps, validation-ladder, compatibility-summary
- R4. `npm run golden`, `npm test`, `npm run check`
- R5. LIVING-PLAN delta

---

## Scope Boundaries

- Golden + docs only; no runtime changes

---

## Implementation Units

- U1. Golden builders + expected snapshots
- U2. KB sync

---

## Test Scenarios

- T1. CPython and pyrt both yield `"ab"` for mul/rmul keys
- T2. Key parity test passes at 27 keys/profile

---

## Sources & References

- Plan 035 str `__mul__` bool
- Plan 038 golden pattern
