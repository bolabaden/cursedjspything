---
title: "perf: spread-safe pre-sized list/tuple repeat"
type: perf
status: active
date: 2026-05-24
origin: docs/plans/2026-05-24-043-refactor-sequence-mul-dedupe-plan.md
---

# Sequence repeat performance (plan 045)

## Summary

Fix list/tuple `__mul__`/`__rmul__` repeat: spread-safe indexed fill, pre-sized array, direct `setNative` (skip double copy via `pyList`/`pyTuple`).

---

## Problem Frame

performance-optimizer P0: `push(...src)` hits V8 spread limit (~126k). P1–P2: double copy and growth reallocations.

---

## Requirements

- R1. `buildRepeatedArray(src, n)` in `builtins/sequence-repeat.ts` (leaf, core import only)
- R2. Fast paths: `n === 0`, `src.length === 0`, `n === 1`
- R3. General path: `new Array(total)` + indexed copy (no spread into push)
- R4. `repeatList`/`repeatTuple`: direct `setNative`; tuple uses `Object.freeze`
- R5. Vitest: existing repeat tests + large `n` does not throw
- R6. `npm run check`, `npm test`, `npm run golden`

---

## Scope Boundaries

- No `pyList`/`pyTuple` API changes
- No MemoryError for overflow (no PyMemoryError in repo)
- str unchanged

---

## Review inputs

- performance-optimizer: P0 spread, P1 direct setNative, P2 pre-size
- ce-architecture-strategist: leaf `sequence-repeat.ts`
- ce-code-simplicity-reviewer: dedupe list/tuple loop

---
