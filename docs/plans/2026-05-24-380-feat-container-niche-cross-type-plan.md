---
title: "feat: container niche cross-type operator evidence (plan 380)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 379 next steps
deepened: 2026-05-24
---

# Container niche cross-type operator evidence

## Summary

Exhaust the remaining §8.15 **container↔container** and **inplace reject** gaps called out after plan 378: **dict↔frozenset**, **set↔slice**, **slice↔tuple** ordering/equality, bidirectional **dict+slice/bytes** `add`, and additional **iadd** rejects. Tests and documentation only — no runtime behavior changes.

## Problem Frame

Plans 376–378 documented dict/list/tuple/set/slice cross-type dispatch. Review residuals and LIVING-PLAN still list niche pairs without Vitest matrices. Missing evidence risks silent drift in `NotImplemented` → `TypeError` / `false` paths.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | dict↔frozenset: `add` TypeError both orders; `eq`/`ne` false; ordering (`lt`/`le`/`gt`/`ge`) TypeError both orders |
| R2 | set↔slice: same matrix as R1 |
| R3 | slice↔tuple: `eq` false; ordering TypeError both orders (add already covered in plan 378) |
| R4 | dict↔slice and dict↔bytes: `add` TypeError **both** orders (reverse paths missing) |
| R5 | Inplace rejects: `iadd` for dict+tuple, list+dict, set+dict, dict+set with CPython-style operand messages |
| R6 | §8.15 prose cites new pairs; LIVING-PLAN 3-delta prepended |

## Key Technical Decisions

1. **Extend** `operator-container-cross-type.test.ts` for R1–R4 — same describe/loop patterns as dict↔set (plan 378).
2. **Extend** inplace section in the same file for R5 (container-specific); keep scalar inplace in `operator-inplace-cross-type.test.ts`.
3. **No golden key changes** — characterization only; expect `golden:keys` snapshot unchanged in substance.

## Scope Boundaries

### In scope

- Vitest matrices, COMPATIBILITY_AND_GAPS §8.15, LIVING-PLAN delta

### Deferred to Follow-Up Work

- set↔list / set↔tuple generic ordering (frozenset-set-ordering covers set-like algebra; not required this slice)
- PEP 3118 buffer protocol
- Refactoring double `toThrow` assertion style repo-wide

### Outside scope

- Runtime slot implementation changes
- CPython concat error string parity beyond documented operand types

---

## Implementation Units

### U1. dict↔frozenset and set↔slice matrices

**Goal:** R1, R2  
**Files:** `test/cpython-derived/operator-container-cross-type.test.ts`  
**Dependencies:** none  

**Test scenarios:**
- dict+ frozenset / frozenset+dict `add` → `unsupported operand type(s) for +: 'dict' and 'frozenset'` (and reverse type names)
- dict vs frozenset `eq` false, `ne` true
- Each ordering op dict↔frozenset both orders → `'op' not supported between instances of 'dict' and 'frozenset'` (and reverse)
- set+slice / slice+set `add` TypeErrors both orders
- set vs slice `eq` false; ordering TypeErrors both orders

**Verification:** New describe blocks pass; file imports `pyFrozenSet`.

### U2. slice↔tuple completeness and dict scalar reverse adds

**Goal:** R3, R4  
**Files:** `test/cpython-derived/operator-container-cross-type.test.ts`  
**Dependencies:** U1  

**Test scenarios:**
- slice vs tuple `eq` false
- `lt`/`le`/`gt`/`ge` slice↔tuple both orders
- slice+dict, bytes+dict `add` TypeErrors (reverse of existing dict+slice/bytes)

**Verification:** slice cross-type describe covers tuple ordering loop.

### U3. Container inplace reject expansion

**Goal:** R5  
**Files:** `test/cpython-derived/operator-container-cross-type.test.ts`  
**Dependencies:** U1  

**Test scenarios:**
- `iadd(dict, tuple)` → `unsupported operand type(s) for +=: 'dict' and 'tuple'`
- `iadd(list, dict)` → `'list' and 'dict'`
- `iadd(set, dict)` → `'set' and 'dict'`
- `iadd(dict, set)` → `'dict' and 'set'`

**Verification:** inplace describe has ≥5 cases.

### U4. Documentation sync

**Goal:** R6  
**Files:** `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/LIVING-PLAN.md`  
**Dependencies:** U1–U3  

**Approach:** Add dict↔frozenset, set↔slice, slice↔tuple ordering to §8.15 paragraph; prepend LIVING-PLAN delta (landed/partial/next).

**Verification:** `npm run check && npm test && npm run golden:keys` green.

---

## Risks & Dependencies

- Low risk: tests document existing dispatch only.
- Import `pyFrozenSet` from `src/index.js` barrel (already exported).

## Sources & Research

- `docs/plans/2026-05-24-378-feat-container-remaining-cross-type-plan.md` (prior slice + review residuals)
- `test/cpython-derived/operator-container-cross-type.test.ts` (pattern source)
- `docs/COMPATIBILITY_AND_GAPS.md` §8.15
