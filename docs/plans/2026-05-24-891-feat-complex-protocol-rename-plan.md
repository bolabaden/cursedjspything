---
title: "feat: rename toComplex to complexProtocol (plan 891)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN after int/float protocol renames (885/889); complete numeric conversion stable naming
---

# `complexProtocol` stable export rename

## Summary

Rename stable barrel export `toComplex` → `complexProtocol`, mirroring `intProtocol` and `floatProtocol`. Internal `toComplex` in `numeric.ts` stays; no `complex()` builtin (no `complex` type in pyrt).

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | Export `toComplex as complexProtocol` from `src/barrel/stable.ts` |
| R2 | Remove public `toComplex` from stable barrel |
| R3 | Migrate in-repo imports/docs from `toComplex` to `complexProtocol` |
| R4 | Update `operator-numeric-conversion-evidence.test.ts` describe/it labels |
| R5 | Update `docs/COMPATIBILITY_AND_GAPS.md`, validation-ladder, `LIVING-PLAN.md` |
| R6 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- No `complex()` builtin constructor.
- PEP 3118 out of scope.
- No `complex` PyType addition.

## Implementation Units

### U1. Barrel rename

**Files:** `src/barrel/stable.ts`

### U2. Tests and docs

**Files:** `test/cpython-derived/operator-numeric-conversion-evidence.test.ts`, `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/50-execution/validation-ladder.md`, `docs/knowledgebase/LIVING-PLAN.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
