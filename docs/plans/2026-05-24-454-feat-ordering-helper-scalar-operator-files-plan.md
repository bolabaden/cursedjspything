---
title: "feat: extend ordering helper to scalar operator tests (plan 454)"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 452
---

# Extend cross-type ordering helper to scalar operator files

## Summary

Reuse `registerCrossTypeOrderingRejects` in the three remaining operator test files that still duplicate `lt`/`le`/`gt`/`ge` loops.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `operator-int-str-remaining-binary.test.ts` int↔str ordering uses helper |
| R2 | `operator-float-str-remaining-binary.test.ts` float↔str ordering uses helper |
| R3 | `operator-bytes-remaining-cross-type.test.ts` bytes↔int/str/float/bool ordering uses helper (four pair registrations) |
| R4 | Test count unchanged; `npm run check`, `npm test`, `npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Helper API changes; runtime; COMPATIBILITY prose unless evidence paths shift; PEP 3118.

## Implementation Units

### U1. Refactor int/str and float/str ordering blocks

**Files:** `test/cpython-derived/operator-int-str-remaining-binary.test.ts`, `test/cpython-derived/operator-float-str-remaining-binary.test.ts`

### U2. Refactor bytes/scalar ordering describe

**Files:** `test/cpython-derived/operator-bytes-remaining-cross-type.test.ts`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
