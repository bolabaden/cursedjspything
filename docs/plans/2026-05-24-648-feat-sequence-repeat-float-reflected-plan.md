---
title: "feat: sequence repeat float reflected-order TypeError (plan 648)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN §8.15; post plan 642 forward-only float reject
---

# sequence repeat float reflected-order TypeError

## Summary

Plan 054 evidenced **seq * float** rejects. Extend **`sequence-repeat-nonint.test.ts`** with **float * seq** (reflected operand order) for list, tuple, str, and bytes — both-order `TypeError` parity. Evidence-only.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `mul(pyFloat(2), seq)` raises `PyTypeError` for list, tuple, str, bytes |
| R2 | Error messages name float and sequence types in reflected order |
| R3 | Validation-ladder updated |
| R4 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime changes.
- Duplicating forward-order tests (already present).

## Implementation Units

### U1. Extend `test/cpython-derived/sequence-repeat-nonint.test.ts`

### U2. Docs sync

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
