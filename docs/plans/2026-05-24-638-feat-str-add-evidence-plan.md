---
title: "feat: str __add__ concatenation evidence (plan 638)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN §8.15; post plan 636 sequence iadd
---

# str __add__ concatenation evidence

## Summary

§8.15 follow-up: evidence that **`str.__add__`** concatenates two str operands (new object, no cross-type coercion). Cross-type str+int rejects remain in `operator-str-scalar.test.ts`. Evidence-only.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `add(str_a, str_b)` returns new str with combined text |
| R2 | Result is not the same object as either operand |
| R3 | Empty str concatenation behaves like CPython |
| R4 | Docs §8.15 and validation-ladder updated |
| R5 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- str+int/bool/float TypeError (existing operator tests).
- str `__iadd__` (not implemented in pyrt).
- Runtime changes unless tests expose a bug.

## Implementation Units

### U1. `test/cpython-derived/str-add.test.ts` (new)

### U2. Docs sync

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
