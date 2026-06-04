---
title: "feat: str __mul__ bool/negative/multi repeat evidence (plan 650)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN §8.15; sequence-repeat-bool str gap
---

# str __mul__ repetition evidence in sequence-repeat-bool

## Summary

Centralize **str** repetition with list/tuple/bytes in **`sequence-repeat-bool.test.ts`**: bool (0/1), reflected bool, negative empty, multi-character int repeat. `operator-str-scalar.test.ts` keeps cross-type rejects; this file is the canonical sequence-repeat matrix. Evidence-only.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `mul(str, True/False)` and `mul(True/False, str)` match CPython |
| R2 | `mul(str, pyInt(-1))` yields empty str |
| R3 | `mul("ab", 3)` → `"ababab"` |
| R4 | Validation-ladder updated |
| R5 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Removing duplicate tests from `operator-str-scalar.test.ts`.
- Runtime changes.

## Implementation Units

### U1. Extend `test/cpython-derived/sequence-repeat-bool.test.ts`

### U2. Docs sync

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
