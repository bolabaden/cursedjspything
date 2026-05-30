---
title: "feat: int↔str bidirectional binary TypeError evidence (plan 384)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 383; STRATEGY.md Evidence & documentation track
deepened: 2026-05-24
---

# int↔str bidirectional binary TypeError evidence

## Summary

Complete §8.15 parity in `operator-int-str-remaining-binary.test.ts`: prove **`sub`**, **`truediv`**, **`floordiv`**, and **`mod`** reject int↔str in **both** operand orders (matching `divmod`/`pow` and `operator-str-int-remaining-binary.test.ts` sub). Tests and docs only.

## Problem Frame

Plan 073 added int-forward-only cases for sub/div/mod. `operator-str-int-remaining-binary.test.ts` already tests str↔int sub both orders and ordering. The int-centric file is asymmetric — dispatch drift on reflected paths would not be caught.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `sub`, `truediv`, `floordiv`, `mod` — TypeError for `(int, str)` and `(str, int)` with correct type names in messages |
| R2 | Keep existing `divmod`/`pow` both-order tests unchanged |
| R3 | §8.15 / validation-ladder cite bidirectional int↔str binary evidence; LIVING-PLAN 3-delta |
| R4 | `npm run check`, `npm test`, `npm run golden:keys` green |

## Key Technical Decisions

1. **Extend only** `operator-int-str-remaining-binary.test.ts` — avoid duplicating str-forward coverage already in `operator-str-int-remaining-binary.test.ts` beyond parity symmetry.
2. **Optional follow-up:** str-int file truediv/floordiv/mod both orders (deferred; not required for R1).
3. No runtime changes; no golden key changes expected.

## Scope Boundaries

### In scope

- Vitest bidirectional cases, COMPATIBILITY §8.15 sentence, validation-ladder row, LIVING-PLAN

### Deferred

- str-int file truediv/floordiv/mod reverse operands
- `mul` (int * str valid via str `__rmul__`)

### Outside scope

- Runtime slot changes

---

## Implementation Units

### U1. Bidirectional int↔str binary rejects

**Files:** `test/cpython-derived/operator-int-str-remaining-binary.test.ts`  

**Test scenarios:**
- T1. `sub(int,str)` and `sub(str,int)` — operand messages
- T2–T4. `truediv`, `floordiv`, `mod` both orders

**Verification:** File tests pass; pattern matches str-int sub both-order test.

### U2. Documentation

**Files:** `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/50-execution/validation-ladder.md`, `docs/knowledgebase/LIVING-PLAN.md`  

**Verification:** Full validation ladder.

---

## Risks & Dependencies

- Low risk: characterization only.
- Aligns with STRATEGY **Evidence & documentation** — shrink undocumented §8.15 gaps.

## Sources

- `docs/plans/2026-05-24-073-feat-int-str-remaining-binary-plan.md`
- `test/cpython-derived/operator-str-int-remaining-binary.test.ts`
