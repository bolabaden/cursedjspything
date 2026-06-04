---
title: "feat: encode/decode on empty str/bytes (plan 550)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 548
---

# str.encode and bytes.decode on empty input

## Summary

CPython returns empty output for `"".encode()` and `b"".decode()` (default and explicit utf-8). Add derived evidence and validation-ladder notes.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `"".encode()` and `"".encode("utf-8")` → `b""` |
| R2 | `b"".decode()` and `b"".decode("utf-8")` → `""` |
| R3 | validation-ladder notes plan 550 on encode/decode rows |
| R4 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime unless tests fail; PEP 3118; error-handler edge cases on empty (already covered elsewhere).

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/str-encode.test.ts`, `test/cpython-derived/bytes-decode.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
