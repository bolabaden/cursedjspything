---
title: "feat: str.splitlines keepends line breaks (plan 508)"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 506
---

# str.splitlines keepends on Unicode/NEL breaks

## Summary

Plan 490/494 added split evidence without `keepends` for vt/ff/NEL/U+2028/U+2029. Add `keepends=True` parity (like lone `\r` in plan 500). Update validation-ladder.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `splitlines("a\\x0bb", True)` → `["a\\x0b", "b"]` |
| R2 | NEL, U+2028, U+2029 keepends match CPython |
| R3 | validation-ladder updated |
| R4 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- bytes.splitlines; runtime; PEP 3118.

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/str-splitlines.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
