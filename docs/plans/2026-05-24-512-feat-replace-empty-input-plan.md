---
title: "feat: replace on empty str/bytes (plan 512)"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 510
---

# str/bytes.replace on empty input

## Summary

CPython `"".replace("", "|")` inserts one replacement; `count=0` is a no-op. Add evidence for empty `str` and `bytes`. Update validation-ladder.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `"".replace("", "|")` → `"|"` |
| R2 | `"".replace("", "|", 0)` → `""` |
| R3 | `b"".replace(b"", b"|")` → `b"|"`; `count=0` unchanged |
| R4 | validation-ladder updated |
| R5 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime; PEP 3118.

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/str-replace.test.ts`, `test/cpython-derived/bytes-replace.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
