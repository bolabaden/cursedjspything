---
title: "feat: complex cross-type binary TypeError evidence (plan 904)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN post-903 — close complex operator arc with container/str rejects
---

# Complex cross-type binary TypeError evidence

## Summary

Lock CPython-derived evidence that `complex` rejects incompatible binary ops with `str`, `list`, and `bytes` (forward and reflected where applicable). Tests + docs only; dispatch already returns `PyTypeError`.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `add`/`sub`/`mul`/`truediv`/`pow`/`floordiv`/`mod` reject complex↔str with `PyTypeError` |
| R2 | Same ops reject complex↔list and complex↔bytes |
| R3 | Docs: COMPATIBILITY, validation-ladder, LIVING-PLAN |
| R4 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- Generic unsupported-operand messages acceptable (no CPython-specific concat/repeat wording).
- No inplace ops in this slice.
- PEP 3118 out of scope.

## Implementation Units

### U1. Tests and docs

**Files:** `test/cpython-derived/operator-complex-cross-type-binary.test.ts`, doc updates.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
