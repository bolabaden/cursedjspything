---
title: "feat: canonical str↔bytes ordering evidence (plan 458)"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 456
---

# Canonical str↔bytes ordering evidence

## Summary

Move str↔bytes `lt`/`le`/`gt`/`ge` TypeError coverage from `operator-bytes-remaining-cross-type.test.ts` into `operator-str-bytes-cross-type.test.ts` via `registerCrossTypeOrderingRejects`; sync §8.15 and validation-ladder prose.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `operator-str-bytes-cross-type.test.ts` registers str↔bytes ordering via helper |
| R2 | `operator-bytes-remaining-cross-type.test.ts` drops bytes↔str ordering registration (binary ops stay) |
| R3 | COMPATIBILITY §8.15 cites str-bytes for eq/ne + ordering; bytes-remaining for bytes↔scalar binary |
| R4 | `validation-ladder.md` row for `operator-str-bytes-cross-type.test.ts` mentions ordering |
| R5 | Test count unchanged; `npm run check`, `npm test`, `npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime; new binary ops; PEP 3118; bootstrap `Error` paths.

## Implementation Units

### U1. Test consolidation

**Files:** `test/cpython-derived/operator-str-bytes-cross-type.test.ts`, `test/cpython-derived/operator-bytes-remaining-cross-type.test.ts`

### U2. Docs sync

**Files:** `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
