---
title: "feat: golden descriptor data-precedence case"
type: feat
status: completed
date: 2026-05-23
origin: docs/knowledgebase/LIVING-PLAN.md
---

# Golden descriptor data-precedence case

## Summary

Add one golden case proving data descriptors win over instance `__dict__` entries, mirroring `test/core/object-model.test.ts` and Tier B `test_descr.py` guidance.

---

## Problem Frame

LIVING-PLAN next item is a descriptor precedence golden row. Key-parity guard makes adding a symmetric case safe; Vitest already covers this in unit tests but not cross-Python JSON golden.

---

## Requirements

- R1. Add `descriptor_data_wins` to `cases.py` and `pyrt-cases.ts`
- R2. Update expected fixtures and `key-sets.json`
- R3. Update LIVING-PLAN delta
- R4. Merge PR #11 (Tier B doc) if CI green before branching

---

## Scope Boundaries

- Single case (data descriptor only; non-data case stays Vitest-only)
- No runtime changes unless golden fails

---

## Implementation Units

- U1. `scripts/golden/cases.py` — `DataDesc` / `Owner` pattern via `__dict__`
- U2. `scripts/golden/pyrt-cases.ts` — `getAttr` after instance dict shadow
- U3. Expected JSON + key snapshot
- U4. LIVING-PLAN

---

## Test Scenarios

| Key | CPython | pyrt |
|-----|---------|------|
| descriptor_data_wins | `o.__dict__['attr']='x'; o.attr` → descriptor | `getAttr` after `obj.dict.set` |

- T3. `npm run golden` (~16 keys)
- T4. `npm test` key-parity snapshot passes

---

## Sources & References

- `test/core/object-model.test.ts` descriptor protocol
- `docs/knowledgebase/50-execution/tier-b-lib-test-reference.md`
