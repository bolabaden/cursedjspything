---
title: "feat: str↔int bidirectional truediv/floordiv/mod evidence (plan 386)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 385 next steps; follows plan 384
deepened: 2026-05-24
---

# str↔int bidirectional truediv/floordiv/mod evidence

## Summary

Mirror plan 384 in `operator-str-int-remaining-binary.test.ts`: assert **`truediv`**, **`floordiv`**, and **`mod`** reject str↔int in **both** operand orders (`sub` and ordering already bidirectional). Tests and docs only.

## Problem Frame

Plan 384 closed int-centric file asymmetry. The str-centric file still tests truediv/floordiv/mod only with str lhs — reflected dispatch paths are uncharacterized.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `truediv`, `floordiv`, `mod` — TypeError for `(str, int)` and `(int, str)` with correct operand messages |
| R2 | Leave ordering and `sub` tests unchanged |
| R3 | validation-ladder row + LIVING-PLAN 3-delta |
| R4 | `npm run check`, `npm test`, `npm run golden:keys` green |

## Key Technical Decisions

1. Extend only `operator-str-int-remaining-binary.test.ts` — int↔str binary coverage lives in `operator-int-str-remaining-binary.test.ts` (plan 384).
2. No runtime or golden key changes expected.

## Scope Boundaries

### In scope

- Vitest bidirectional cases, validation-ladder, LIVING-PLAN

### Outside scope

- Runtime changes; PEP 3118

---

## Implementation Units

### U1. Bidirectional str↔int truediv/floordiv/mod

**Files:** `test/cpython-derived/operator-str-int-remaining-binary.test.ts`  

**Verification:** Matches plan 384 test naming (`in both orders`).

### U2. Documentation

**Files:** `docs/knowledgebase/50-execution/validation-ladder.md`, `docs/knowledgebase/LIVING-PLAN.md`  

**Verification:** Full validation ladder.
