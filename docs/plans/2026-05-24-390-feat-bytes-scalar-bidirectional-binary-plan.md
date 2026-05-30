---
title: "feat: bytes↔scalar bidirectional binary TypeError evidence (plan 390)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 389; follows plan 388
deepened: 2026-05-24
---

# bytes↔scalar bidirectional binary TypeError evidence

## Summary

Close §8.15 gaps in `operator-bytes-remaining-cross-type.test.ts`: assert **`add`**, **`truediv`**, **`floordiv`**, and **`mod`** reject bytes↔int/float/str in **both** operand orders where only bytes-lhs is tested today; add **bytes↔str** `sub` both orders. Tests and docs only.

## Problem Frame

Plans 384–388 symmetricized int/str/float scalar pairs. **bytes↔scalar** still has one-way truediv/floordiv/mod for int and float, one-way add for str/float reverse, and no bytes↔str `sub` coverage.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `add`: str+bytes and float+bytes TypeError (reverse of existing bytes+str/float) |
| R2 | `sub`: bytes+str and str+bytes TypeError |
| R3 | `truediv`/`floordiv`/`mod`: int+bytes and float+bytes TypeError (reverse of bytes+int/float) |
| R4 | validation-ladder + §8.15 + LIVING-PLAN 3-delta |
| R5 | `npm run check`, `npm test`, `npm run golden:keys` green |

## Key Technical Decisions

1. Single file `operator-bytes-remaining-cross-type.test.ts` — ordering already bidirectional.
2. Group tests by scalar type (int/float/str) following existing describe structure.

## Scope Boundaries

### In scope

- Vitest + docs sync

### Outside scope

- Runtime changes; PEP 3118; bytes↔bytes (other files)

---

## Implementation Units

### U1. Bidirectional bytes↔scalar binary ops

**Files:** `test/cpython-derived/operator-bytes-remaining-cross-type.test.ts`

**Test scenarios:** R1–R3 with CPython operand-type messages.

### U2. Documentation

**Files:** `docs/knowledgebase/50-execution/validation-ladder.md`, `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/LIVING-PLAN.md`
