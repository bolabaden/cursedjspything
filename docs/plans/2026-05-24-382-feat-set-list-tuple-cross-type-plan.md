---
title: "feat: set↔list/tuple cross-type operator evidence (plan 382)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 381 next steps
deepened: 2026-05-24
---

# Set↔list/tuple cross-type operator evidence

## Summary

Close the §8.15 gap called out after plan 380: document **set↔list** and **set↔tuple** cross-type `add`, `eq`/`ne`, and ordering (`lt`/`le`/`gt`/`ge`) in both operand orders. Tests and documentation only — no runtime changes.

## Problem Frame

Plans 376–380 exhaust dict/slice/frozenset niche pairs. **set↔list** and **set↔tuple** behave like other container↔container pairs at runtime (TypeError on `+` and ordering; `==` false) but lack Vitest matrices, so dispatch drift would go unnoticed.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | set↔list: `add` TypeError both orders; `eq`/`ne` false; ordering TypeError both orders |
| R2 | set↔tuple: same matrix as R1 |
| R3 | §8.15 prose cites set↔list/tuple; LIVING-PLAN 3-delta prepended |
| R4 | `npm run check`, `npm test`, `npm run golden:keys` green |

## Key Technical Decisions

1. **Extend** `operator-container-cross-type.test.ts` using the dict↔set / set↔slice describe pattern (plan 378–380).
2. **No new test file** — keeps container cross-type evidence in one place.
3. **No golden key changes** — characterization only.

## Scope Boundaries

### In scope

- Vitest matrices, COMPATIBILITY §8.15, LIVING-PLAN delta

### Deferred to Follow-Up Work

- list↔tuple (covered in `operator-list-tuple-cross-type.test.ts`)
- set↔frozenset ordering beyond existing `frozenset-set-ordering.test.ts`
- int↔str bidirectional sub/div parity in `operator-int-str-remaining-binary.test.ts` (separate slice)

### Outside scope

- Runtime slot changes
- PEP 3118 buffer protocol

---

## Implementation Units

### U1. set↔list matrix

**Goal:** R1  
**Files:** `test/cpython-derived/operator-container-cross-type.test.ts`  
**Dependencies:** none  

**Test scenarios:**
- `add(set, list)` / `add(list, set)` → operand-type `TypeError`
- `eq` false, `ne` true
- Each ordering op both orders → `'op' not supported between instances of 'set' and 'list'` (and reverse type names)

**Verification:** New describe block passes.

### U2. set↔tuple matrix

**Goal:** R2  
**Files:** `test/cpython-derived/operator-container-cross-type.test.ts`  
**Dependencies:** U1  

**Test scenarios:** Same as U1 with tuple type names.

**Verification:** Both describe blocks mirror dict↔set structure.

### U3. Documentation sync

**Goal:** R3, R4  
**Files:** `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/LIVING-PLAN.md`  
**Dependencies:** U1–U2  

**Approach:** Add set↔list/tuple to §8.15 container paragraph (plans 376–382).

**Verification:** Full validation ladder green.

---

## Risks & Dependencies

- Low risk: tests document existing dispatch.
- Follow `operator-container-cross-type.test.ts` imports (`pySet`, `pyList`, `pyTuple` already exported).

## Sources & Research

- `docs/plans/2026-05-24-380-feat-container-niche-cross-type-plan.md` (deferred set↔list/tuple)
- `test/cpython-derived/operator-container-cross-type.test.ts`
- `docs/COMPATIBILITY_AND_GAPS.md` §8.15
