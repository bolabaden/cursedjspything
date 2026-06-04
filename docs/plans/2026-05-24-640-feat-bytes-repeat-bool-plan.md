---
title: "feat: bytes __mul__ bool repeat evidence (plan 640)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN §8.15; sequence-repeat-bool gaps
---

# bytes __mul__ bool repeat evidence

## Summary

Extend §8.15 sequence repetition coverage: **`bytes.__mul__`** / **`__rmul__`** accept bool repeat counts (0/1) like list/tuple/str (plans 035–037). Evidence-only in `sequence-repeat-bool.test.ts`.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `mul(bytes, True)` repeats once; `mul(bytes, False)` yields empty bytes |
| R2 | Reflected `mul(True, bytes)` matches forward |
| R3 | Docs §8.15 and validation-ladder updated |
| R4 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime changes (bytes already uses `sequenceRepeatCount`).
- Non-int repeat rejects (`sequence-repeat-nonint.test.ts`).

## Implementation Units

### U1. Extend `test/cpython-derived/sequence-repeat-bool.test.ts`

### U2. Docs sync

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
