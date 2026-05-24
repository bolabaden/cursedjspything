---
title: "refactor: simplify golden cases.py builder"
type: refactor
status: completed
date: 2026-05-23
origin: docs/knowledgebase/LIVING-PLAN.md
---

# Simplify golden cases.py builder

## Summary

Mirror the plan 019 maintainability pass in `scripts/golden/cases.py` with small helpers for version gates and descriptor-owner fixtures, keeping CPython golden JSON byte-identical.

---

## Problem Frame

`pyrt-cases.ts` gained `versionGte` and `ownerWithInstanceAttr` in plan 019; `cases.py` still inlines the same patterns. Golden harness maintainability should stay symmetric across both builders.

---

## Requirements

- R1. Add `version_gte(vi, major, minor)` wrapping `sys.version_info` tuple compare
- R2. Add `owner_with_instance_attr(owner_cls, attr, value)` for descriptor precedence fixtures
- R3. Preserve identical JSON output from `cases.py` for all profile versions
- R4. Run `npm run check`, `npm test`, `npm run golden`, `npm run golden:keys`
- R5. Update LIVING-PLAN delta (cases.py refactor landed)

---

## Scope Boundaries

- `scripts/golden/cases.py` only
- No `pyrt-cases.ts` or expected JSON changes
- No new golden keys

---

## Implementation Units

- U1. Helpers + refactor `main()`
- U2. LIVING-PLAN delta

---

## Test Scenarios

- T1. `test/golden/key-parity.test.ts` passes unchanged
- T2. `npm run golden` all checks pass
- T3. `cases.py` stdout JSON byte-identical to pre-refactor for current interpreter

---

## Sources & References

- `scripts/golden/cases.py`
- `scripts/golden/pyrt-cases.ts` (plan 019 helpers)
