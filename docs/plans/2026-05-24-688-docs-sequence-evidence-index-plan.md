---
title: "docs: §8.6 sequence evidence index (plan 688)"
type: feat
status: active
date: 2026-05-24
origin: LIVING-PLAN §8.6; post plan 686 sequence-iadd int
---

# §8.6 sequence evidence index

## Summary

Document **canonical §8.6** list/tuple Vitest evidence files and mark **`operator-list-tuple-cross-type.test.ts`** as legacy duplicate coverage (§8.15). Evidence-only docs + file header; no test deletion.

---

## Problem Frame

Plans 634–686 colocated list/tuple operator evidence into `sequence-*` files, but readers must parse a long §8.6 paragraph and the validation-ladder still implies `operator-list-tuple-cross-type` is co-primary.

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | COMPATIBILITY §8.6 includes a concise canonical `sequence-*` evidence index |
| R2 | validation-ladder `operator-list-tuple-cross-type` row notes §8.6 duplicates |
| R3 | `operator-list-tuple-cross-type.test.ts` header points to canonical `sequence-*` paths |
| R4 | `npm run check && npm test && npm run golden:keys` green (no test count change) |

---

## Scope Boundaries

### Outside scope

- Deleting duplicate tests from `operator-list-tuple-cross-type.test.ts`.
- Runtime changes.

---

## Implementation Units

### U1. Docs — `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/50-execution/validation-ladder.md`

### U2. Test header — `test/cpython-derived/operator-list-tuple-cross-type.test.ts`

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
