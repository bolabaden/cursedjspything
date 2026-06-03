---
title: "feat: bytes mul str/float bidirectional TypeError evidence (plan 394)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 393; STRATEGY.md Evidence track
deepened: 2026-05-24
---

# bytes mul str/float bidirectional TypeError evidence

## Summary

Complete §8.15 gap in `operator-bytes-cross-type.test.ts`: assert **`mul`** rejects bytes↔str and bytes↔float in **both** operand orders (reverse of existing bytes-lhs cases). Tests and docs only.

## Problem Frame

Plan 390 symmetricized bytes↔scalar add/sub/div in `operator-bytes-remaining-cross-type.test.ts`. **`operator-bytes-cross-type.test.ts`** still tests `mul` only as bytes×str/float — reflected `str*bytes` / `float*bytes` paths are uncharacterized.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `mul(bytes, str)` and `mul(str, bytes)` TypeError with correct type names |
| R2 | `mul(bytes, float)` and `mul(float, bytes)` TypeError both orders |
| R3 | validation-ladder + LIVING-PLAN 3-delta |
| R4 | `npm run check`, `npm test`, `npm run golden:keys` green |

## Key Technical Decisions

1. Extend existing describe in `operator-bytes-cross-type.test.ts` — no new file.
2. **bool↔float** numeric ops remain in `operator-bool-float.test.ts` (valid promotion); not reject matrices.

## Scope Boundaries

### Outside scope

- Runtime changes; bool↔float reject file (N/A — arithmetic legal); PEP 3118

---

## Implementation Units

### U1. Bidirectional bytes mul rejects

**Files:** `test/cpython-derived/operator-bytes-cross-type.test.ts`

### U2. Documentation

**Files:** `docs/knowledgebase/50-execution/validation-ladder.md`, `docs/knowledgebase/LIVING-PLAN.md`
