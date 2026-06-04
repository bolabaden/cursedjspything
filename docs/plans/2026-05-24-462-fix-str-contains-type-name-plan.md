---
title: "fix: str __contains__ TypeError names rhs type (plan 462)"
type: fix
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 460
---

# str __contains__ TypeError type name

## Summary

`str.__contains__` currently always says `not int` for non-str operands; use the rhs typename (e.g. `bytes`) and add str↔bytes `contains` Vitest in the canonical str-bytes operator file.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `str` `Slot.contains` raises `PyTypeError` with `'not <typename>'` from `item.type.name` |
| R2 | `operator-str-bytes-cross-type.test.ts` covers `contains(str, bytes)` message |
| R3 | `operator-str-scalar.test.ts` still passes with `not int` for int rhs |
| R4 | §8.17 prose mentions bytes rhs; `npm run check`, `npm test`, `npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- `bytes.__contains__` (already typed); PEP 3118; golden expansion.

## Implementation Units

### U1. Runtime fix

**Files:** `src/runtime/builtins/str.ts`

### U2. Tests + docs

**Files:** `test/cpython-derived/operator-str-bytes-cross-type.test.ts`, `docs/COMPATIBILITY_AND_GAPS.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
