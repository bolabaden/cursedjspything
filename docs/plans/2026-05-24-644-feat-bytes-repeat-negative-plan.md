---
title: "feat: bytes __mul__ negative repeat evidence (plan 644)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN §8.15; post plan 642 bytes float reject
---

# bytes __mul__ negative int repeat evidence

## Summary

Complete §8.15 bytes repetition matrix in **`sequence-repeat-bool.test.ts`**: negative int repeat count yields empty **bytes** (list/tuple already covered in same file). Evidence-only.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `mul(bytes, pyInt(-1))` yields empty bytes (len 0) |
| R2 | Docs §8.15 and validation-ladder updated |
| R3 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- str bool/negative (in `operator-str-scalar.test.ts`).
- Runtime changes.

## Implementation Units

### U1. Extend `test/cpython-derived/sequence-repeat-bool.test.ts`

### U2. Docs sync

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
