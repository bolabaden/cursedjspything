---
title: "feat: canonical str↔float contains and ordering (plan 466)"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 464
---

# Canonical str↔float contains and ordering

## Summary

Mirror str↔bytes consolidation: move ordering helper registration to `operator-str-float.test.ts`, add `contains(str, float)` evidence, drop ordering from `operator-float-str-remaining-binary.test.ts`; sync docs.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `operator-str-float.test.ts` registers str↔float ordering via helper |
| R2 | `operator-str-float.test.ts` asserts `contains(str, float)` → `not float` |
| R3 | `operator-float-str-remaining-binary.test.ts` drops ordering describe |
| R4 | validation-ladder + COMPATIBILITY §8.15 updated |
| R5 | Test count unchanged; `npm run check`, `npm test`, `npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime; float `__contains__`; PEP 3118.

## Implementation Units

### U1. Test consolidation + docs

**Files:** `test/cpython-derived/operator-str-float.test.ts`, `test/cpython-derived/operator-float-str-remaining-binary.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`, `docs/COMPATIBILITY_AND_GAPS.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
