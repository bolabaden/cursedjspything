---
title: "feat: rename index to indexProtocol (plan 893)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN after bool builtin (892); complete numeric conversion stable naming
---

# `indexProtocol` stable export rename

## Summary

Rename stable barrel export `index` → `indexProtocol`, mirroring `intProtocol`, `floatProtocol`, `boolProtocol`, and `complexProtocol`. Internal `index()` in `numeric.ts` unchanged. Fix COMPATIBILITY §4.4 stale `bool` → `boolProtocol`.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | Export `index as indexProtocol` from `src/barrel/stable.ts` |
| R2 | Remove public `index` from stable operators export |
| R3 | Migrate in-repo imports/docs to `indexProtocol` |
| R4 | Update `operator-numeric-conversion-evidence.test.ts` labels |
| R5 | Fix COMPATIBILITY §4.4 truth export; §4 conversions list |
| R6 | Update validation-ladder, LIVING-PLAN |
| R7 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- No `index()` builtin (CPython has no such constructor).
- PEP 3118 / `complex()` builtin out of scope.

## Implementation Units

### U1. Barrel rename

**Files:** `src/barrel/stable.ts`

### U2. Tests and docs

**Files:** `test/cpython-derived/operator-numeric-conversion-evidence.test.ts`, `test/dispatch/operators.test.ts`, `examples/python-vs-js.ts`, `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/50-execution/validation-ladder.md`, `docs/knowledgebase/LIVING-PLAN.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
