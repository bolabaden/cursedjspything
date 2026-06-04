---
title: "feat: bytes __mul__ float repeat TypeError evidence (plan 642)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN §8.15; post plan 640 bytes bool repeat
---

# bytes __mul__ float repeat TypeError evidence

## Summary

Complete §8.15 sequence-repeat matrix: extend **`sequence-repeat-nonint.test.ts`** so **bytes** `__mul__` rejects **float** repeat counts like list/tuple/str (plan 054). Evidence-only.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `mul(bytes, float)` raises `PyTypeError` with bytes/float operand types |
| R2 | Docs §8.15 and validation-ladder updated |
| R3 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime changes.
- str bool repeat (covered in `operator-str-scalar.test.ts`).

## Implementation Units

### U1. Extend `test/cpython-derived/sequence-repeat-nonint.test.ts`

### U2. Docs sync

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
