---
title: "feat: bytes __mul__ multi-element repeat evidence (plan 646)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN §8.15; post plan 644 bytes negative repeat
---

# bytes __mul__ multi-element repeat evidence

## Summary

§8.15 sequence-repeat parity: extend **`sequence-repeat-bool.test.ts`** so **bytes** `__mul__` repeats multi-byte sequences by int count (list/tuple already have multi-element cases in same file). Evidence-only.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `mul(bytes_ab, pyInt(3))` has length 6 and expected byte pattern |
| R2 | Validation-ladder note updated |
| R3 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime changes.
- Reflected float reject (forward covered in plan 642).

## Implementation Units

### U1. Extend `test/cpython-derived/sequence-repeat-bool.test.ts`

### U2. Docs sync

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
