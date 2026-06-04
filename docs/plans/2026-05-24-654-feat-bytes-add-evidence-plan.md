---
title: "feat: bytes __add__ concatenation evidence (plan 654)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN §8.15; post plan 638 str-add parity
---

# bytes __add__ concatenation evidence

## Summary

Mirror plan 638: dedicated evidence that **`bytes.__add__`** concatenates two bytes objects (new object, empty-bytes cases). Cross-type rejects stay in `operator-bytes-remaining-cross-type.test.ts`. Evidence-only.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `add(bytes_a, bytes_b)` returns new bytes with combined data |
| R2 | Result is not the same object as either operand |
| R3 | Empty bytes concatenation cases |
| R4 | §8.15 and validation-ladder updated |
| R5 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime changes.
- Removing `operator-bytes-cross-type` add happy path (may overlap).

## Implementation Units

### U1. `test/cpython-derived/bytes-add.test.ts` (new)

### U2. Docs sync

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
