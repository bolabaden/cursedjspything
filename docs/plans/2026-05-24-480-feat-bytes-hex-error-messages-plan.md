---
title: "feat: bytes.hex/fromhex error message evidence (plan 480)"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 478
---

# bytes.hex / fromhex error messages

## Summary

Tighten `bytes-hex-fromhex.test.ts` with CPython-style **TypeError** / **ValueError** message regexes for invalid args, separator, and hex digits. Sync validation-ladder + §8.15.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | fromhex non-str arg message regex |
| R2 | hex non-bytes sep + empty sep message regexes |
| R3 | fromhex invalid digit message regex |
| R4 | Docs sync; tests green |

## Scope Boundaries

### Outside scope

- Runtime message changes unless tests fail; PEP 3118.

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/bytes-hex-fromhex.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`, `docs/COMPATIBILITY_AND_GAPS.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
