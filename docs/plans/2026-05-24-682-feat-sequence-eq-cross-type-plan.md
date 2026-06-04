---
title: "feat: list/tuple cross-type eq evidence (plan 682)"
type: feat
status: active
date: 2026-05-24
origin: LIVING-PLAN §8.6; post plan 680 sequence mul/sub
---

# list/tuple cross-type equality evidence

## Summary

Add **`sequence-eq-cross-type.test.ts`** with CPython-derived **list↔tuple**, **list↔bytes**, and **tuple↔bytes** `eq`/`ne` no-coercion evidence. Today these live only in `operator-list-tuple-cross-type.test.ts`. Evidence-only.

---

## Problem Frame

§8.6 documents list/tuple containment and equality paths. Same-type element `__eq__` is in `list-eq.test.ts` / `tuple-eq-hash-eq.test.ts`, but cross-type sequence equality is not named in a `sequence-*` evidence file.

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `eq(list, tuple)` and `ne` are false/true when elements match; no cross-type coercion |
| R2 | `eq`/`ne` for list↔bytes and tuple↔bytes pairs are false/true without coercion |
| R3 | §8.6 COMPATIBILITY and validation-ladder updated for plan 682 |
| R4 | `npm run check && npm test && npm run golden:keys` green |

---

## Scope Boundaries

### Outside scope

- Runtime changes unless tests expose a bug.
- Cross-type ordering (`lt`/`le`/…); stays in `operator-list-tuple-cross-type.test.ts` for now.
- Removing duplicate tests from `operator-list-tuple-cross-type.test.ts`.

---

## Implementation Units

### U1. Vitest — `test/cpython-derived/sequence-eq-cross-type.test.ts` (new)

### U2. Docs sync

**Files:** `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/50-execution/validation-ladder.md`

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
