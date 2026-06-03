---
title: "feat: list↔dict mul and set↔bytes container cross-type (plan 442)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 441
---

# Container mul and set↔bytes cross-type evidence

## Summary

Close §8.15 container gaps from LIVING-PLAN: bidirectional `mul` rejects for list↔dict, and full add/eq/ordering/mul evidence for set↔bytes in `operator-container-cross-type.test.ts`.

## Problem Frame

Plan 440 completed slice↔int and dict↔slice ordering. LIVING-PLAN still lists list↔dict `mul` and set↔bytes as missing container cross-type coverage. Other container pairs already use both-order `add`/`eq`/`ordering`/`mul` patterns in the same file.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | list↔dict `mul` TypeError both operand orders in `test/cpython-derived/operator-container-cross-type.test.ts` |
| R2 | set↔bytes `add`, `eq`/`ne`, `mul`, and `lt`/`le`/`gt`/`ge` both orders in same file |
| R3 | `docs/knowledgebase/50-execution/validation-ladder.md` row updated for container cross-type |
| R4 | `npm run check`, `npm test`, `npm run golden:keys` pass |

## Scope Boundaries

### In scope

- Test-only evidence; validation-ladder sync.

### Outside scope

- Runtime changes; golden key expansion; PEP 3118; ops/LIVING-PLAN (post-merge handoff).

## Key Technical Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| KTD1 | Extend existing describes rather than new operator file | Matches plans 432–440 consolidation; container file is canonical for dict/list/set cross-type. |
| KTD2 | set↔bytes as new `describe` block | No existing set↔bytes block; mirror set/list structure. |

## Implementation Units

### U1. list↔dict mul

**Files:** `test/cpython-derived/operator-container-cross-type.test.ts`

**Test scenarios:**

- TS-U1-1: `mul(dict, list)` raises `PyTypeError` with `'dict' and 'list'`.
- TS-U1-2: `mul(list, dict)` raises `PyTypeError` with `'list' and 'dict'`.

### U2. set↔bytes cross-type

**Files:** `test/cpython-derived/operator-container-cross-type.test.ts`

**Test scenarios:**

- TS-U2-1: `add` both orders TypeError.
- TS-U2-2: `eq` false and `ne` true (single direction sufficient for eq; both orders for symmetry optional — use both like other blocks).
- TS-U2-3: `mul` both orders TypeError.
- TS-U2-4: `lt`/`le`/`gt`/`ge` both orders TypeError.

### U3. Docs

**Files:** `docs/knowledgebase/50-execution/validation-ladder.md`

**Test scenarios:**

- TS-U3-1: Ladder row mentions list↔dict mul and set↔bytes (plan 442).

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
