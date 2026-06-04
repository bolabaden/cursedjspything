---
title: "feat: center(0) on empty str/bytes (plan 532)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 530
---

# str/bytes.center width zero on empty input

## Summary

CPython returns empty output for `"".center(0)` and `b"".center(0)` (with or without fill). Extend derived tests and validation-ladder; fix runtime only if tests fail.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `"".center(0)` and `"".center(0, "x")` → `""` |
| R2 | `b"".center(0)` and `b"".center(0, b"x")` → `b""` |
| R3 | validation-ladder notes plan 532 on center rows |
| R4 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime unless tests fail; PEP 3118; non-empty center width cases (already covered).

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/str-center.test.ts`, `test/cpython-derived/bytes-center.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```

## Test scenarios (U1)

- `center("", pyInt(0))` → `""`
- `center("", pyInt(0), pyStr("x"))` → `""`
- `center(new Uint8Array(0), pyInt(0))` → empty bytes
- `center(new Uint8Array(0), pyInt(0), fill byte)` → empty bytes
