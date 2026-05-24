---
title: "docs: cross-type parity KB refresh"
type: feat
status: completed
date: 2026-05-23
origin: docs/knowledgebase/LIVING-PLAN.md
---

# Cross-type parity KB refresh

## Summary

Refresh stale parity documentation after golden expansion (~19 keys) and COMPATIBILITY §8.15/§8.16: fix `parity-gaps-priorities.md` row #10 and verification counts, add cross-type/MappingProxyType pointers in `compatibility-summary.md`.

---

## Problem Frame

LIVING-PLAN next: COMPATIBILITY cross-type builtins doc refinement. `parity-gaps-priorities.md` still claims ~11 golden checks and 129 Vitest tests; golden harness and test suite have grown.

---

## Requirements

- R1. Update `parity-gaps-priorities.md` row #8 with §8.15 + golden key refs; row #10 to ~19 keys
- R2. Fix verification section test count (174) and golden inventory
- R3. Add MappingProxyType out-of-scope note (§8.16) in parity gaps Tier 2 or defer table
- R4. Sync `compatibility-summary.md` partial/not-supported rows (int↔float, mappingproxy, golden scale)
- R5. Update LIVING-PLAN delta

---

## Scope Boundaries

- Documentation only
- No runtime or golden harness changes

---

## Implementation Units

- U1. parity-gaps-priorities.md refresh
- U2. compatibility-summary.md + LIVING-PLAN

---

## Test Scenarios

- T1. Cross-links to COMPATIBILITY §8.15/§8.16 resolve
- T2. `npm run check` unchanged

---

## Sources & References

- `docs/COMPATIBILITY_AND_GAPS.md` §8.15, §8.16, §12
- `scripts/golden/expected/key-sets.json`
