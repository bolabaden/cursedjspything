---
title: "feat: golden __set_name__ descriptor hook"
type: feat
status: completed
date: 2026-05-23
origin: docs/knowledgebase/LIVING-PLAN.md
---

# Golden __set_name__ descriptor hook

## Summary

Add `set_name_called` golden key proving descriptor `__set_name__` runs when a class body assigns a descriptor, mirroring `test/class/system.test.ts` with cross-Python JSON evidence.

---

## Problem Frame

LIVING-PLAN lists `__set_name__` as the next Tier B golden cherry-pick after `init_subclass_called`. Class lifecycle hooks are unit-tested but `__set_name__` lacks golden harness coverage.

---

## Requirements

- R1. Merge PR #14 (`init_subclass_called`) to `main`
- R2. Add `set_name_called` to `scripts/golden/cases.py` and `scripts/golden/pyrt-cases.ts` with sync comment
- R3. Update expected JSON fixtures and regenerate `key-sets.json` (~19 keys/version)
- R4. Update LIVING-PLAN delta and tier-b guide
- R5. No runtime changes unless golden fails

---

## Scope Boundaries

- Single boolean golden key
- No mappingproxy or property edge cases in this slice

---

## Key Technical Decisions

- **Key `set_name_called`**: Boolean `true` when `__set_name__` records `(owner.__name__, attr_name)` as `("SetNameOwner", "my_desc")`
- **Inline class definition in `main()`** (Python) to avoid import-time side effects, matching `init_subclass_called` pattern

---

## Implementation Units

- U1. Golden harness cases + fixtures
- U2. LIVING-PLAN and tier-b doc delta

---

## Test Scenarios

| Key | Expected |
|-----|----------|
| set_name_called | `true` |

- T1. `npm run golden:keys`
- T2. `npm run golden` ~19 checks/version
- T3. `npm test` key-parity

---

## Sources & References

- `test/class/system.test.ts` `__set_name__ is called on descriptors`
- `src/runtime/class/class.ts` `runSetName`
