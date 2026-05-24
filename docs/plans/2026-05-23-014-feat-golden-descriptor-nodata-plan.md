---
title: "feat: golden non-data descriptor instance-dict precedence"
type: feat
status: completed
date: 2026-05-23
origin: docs/knowledgebase/LIVING-PLAN.md
---

# Golden non-data descriptor instance-dict precedence

## Summary

Add `descriptor_nodata_loses` golden case: non-data descriptor (`__get__` only) loses to instance dict entry, pairing with `descriptor_data_wins`.

---

## Problem Frame

LIVING-PLAN lists optional `descriptor_nodata_loses` as next golden row. Completes descriptor precedence pair from `test/core/object-model.test.ts` with cross-Python JSON evidence.

---

## Requirements

- R1. Merge PR #12 (`descriptor_data_wins`) to `main`
- R2. Add `descriptor_nodata_loses` to `cases.py` and `pyrt-cases.ts`
- R3. Update expected fixtures and key snapshot (~17 keys)
- R4. Update LIVING-PLAN and tier-b guide mention if useful

---

## Scope Boundaries

- Single complementary case only
- No runtime changes unless golden fails

---

## Implementation Units

- U1. Golden harness cases + fixtures
- U2. LIVING-PLAN delta

---

## Test Scenarios

| Key | Expected |
|-----|----------|
| descriptor_nodata_loses | `"instance-value"` after shadowing non-data desc |

- T3. `npm run golden` ~17 checks
- T4. `npm test` key-parity passes

---

## Sources & References

- `test/core/object-model.test.ts` non-data descriptor test
- `scripts/golden/cases.py` `DataDesc`/`DescOwner` pattern from PR #12
