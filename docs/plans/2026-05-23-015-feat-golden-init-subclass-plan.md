---
title: "feat: golden __init_subclass__ hook invocation"
type: feat
status: completed
date: 2026-05-23
origin: docs/knowledgebase/LIVING-PLAN.md
---

# Golden __init_subclass__ hook invocation

## Summary

Add `init_subclass_called` golden key proving base `__init_subclass__` runs when a subclass is created, mirroring existing Vitest coverage in `test/class/system.test.ts` with cross-Python JSON evidence.

---

## Problem Frame

LIVING-PLAN next step is Tier B golden cherry-picks. Descriptor precedence pair is complete on `main` (~17 keys/version). Class lifecycle hooks (`__init_subclass__`) are implemented and unit-tested but not in the golden harness.

---

## Requirements

- R1. Add `init_subclass_called` to `scripts/golden/cases.py` and `scripts/golden/pyrt-cases.ts` with sync comment
- R2. Update expected JSON fixtures (`expected.json`, `3.10`, `3.12`, `3.14`) and regenerate `key-sets.json`
- R3. Update LIVING-PLAN delta and tier-b mining guide (descriptor rows done; init_subclass landed)
- R4. No runtime changes unless golden fails

---

## Scope Boundaries

- Single boolean golden key only
- No `__set_name__` golden in this slice
- No bulk Tier B port

---

## Key Technical Decisions

- **Key name `init_subclass_called`**: Boolean `true` when subclass creation invokes base hook — stable across 3.9–3.14
- **Side-effect log pattern**: Same as Python list append / TS string[] push used in unit tests

---

## Implementation Units

- U1. **Golden harness cases + fixtures** — `cases.py`, `pyrt-cases.ts`, expected JSON, `npm run golden:keys`
- U2. **Docs** — LIVING-PLAN delta, tier-b guide near-term list update

---

## Test Scenarios

| Key | Expected |
|-----|----------|
| init_subclass_called | `true` after `class Child(Base): pass` |

- T1. `npm run golden:keys` passes
- T2. `npm run golden` ~18 checks/version
- T3. `npm test` including key-parity

---

## Sources & References

- `test/class/system.test.ts` `__init_subclass__ is called on bases`
- `docs/knowledgebase/50-execution/tier-b-lib-test-reference.md` item 2
- `src/runtime/class/class.ts` `Hook.initSubclass` MRO lookup
