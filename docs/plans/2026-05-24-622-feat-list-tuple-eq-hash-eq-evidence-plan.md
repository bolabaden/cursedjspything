---
title: "feat: list and tuple __eq__ element hash+eq evidence (plan 622)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN §8.6 post-620
---

# list and tuple __eq__ element hash+eq evidence

## Summary

Extend sequence equality tests so **`list.__eq__`** and **`tuple.__eq__`** are evidenced with equal-but-distinct elements at matching indices (rich `eq()` per §8.6). Evidence-only unless tests expose a bug. Docs sync §8.6 and validation-ladder.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `list.__eq__` true when paired elements are equal under rich eq, false when values differ or lengths differ |
| R2 | `tuple.__eq__` same as R1 for tuple pairs |
| R3 | `list.__contains__` matches equal-but-distinct elements |
| R4 | Docs + validation-ladder updated |
| R5 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime changes unless tests expose a bug.
- Cross-type list↔tuple equality (returns `NotImplemented` / false).

## Implementation Units

### U1. `test/builtins/list-eq.test.ts` — equal-key element cases

### U2. `test/cpython-derived/tuple-eq-hash-eq.test.ts` (new)

### U3. `test/cpython-derived/list-contains-hash-eq.test.ts` (new) or extend list tests in U1

### U4. Docs: `COMPATIBILITY_AND_GAPS.md` §8.6, `validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
