---
title: "docs: MappingProxyType gap note and golden inventory sync"
type: feat
status: completed
date: 2026-05-23
origin: docs/knowledgebase/LIVING-PLAN.md
---

# MappingProxyType gap note and golden inventory sync

## Summary

Document `types.MappingProxyType` / mappingproxy as intentional out-of-scope in COMPATIBILITY, sync README and validation-ladder golden inventory (~19 keys, Tier B class-lifecycle cases), and close the tier-b near-term mappingproxy item.

---

## Problem Frame

LIVING-PLAN next step after class-lifecycle golden trio: COMPATIBILITY gap notes (mappingproxy doc-only). Tier B guide item 4 still lists mappingproxy as pending documentation. README golden case list is stale (missing contains, int/float, descriptor, init_subclass, set_name keys).

---

## Requirements

- R1. Merge PR #15 (`set_name_called`) to `main`
- R2. Add `COMPATIBILITY_AND_GAPS.md` §8.16 for MappingProxyType / readonly dict views
- R3. Cross-reference in §10.6 and Appendix C.9
- R4. Update §12 verification golden inventory (~19 keys/version)
- R5. Sync `README.md` and `validation-ladder.md` golden descriptions; fix L5 CI matrix note
- R6. Mark tier-b mappingproxy item done in `tier-b-lib-test-reference.md`
- R7. Update LIVING-PLAN delta

---

## Scope Boundaries

- Documentation only — no runtime, golden harness, or test changes
- No MappingProxyType shim implementation

---

## Implementation Units

- U1. COMPATIBILITY §8.16 + cross-refs + §12 inventory
- U2. README, validation-ladder, tier-b guide, LIVING-PLAN

---

## Test Scenarios

- T1. Doc links and section anchors resolve
- T2. `npm run check` (unchanged code; optional sanity)

---

## Sources & References

- `docs/knowledgebase/50-execution/tier-b-lib-test-reference.md`
- CPython `Lib/test/test_descr.py` / `test_types.py` mappingproxy references
