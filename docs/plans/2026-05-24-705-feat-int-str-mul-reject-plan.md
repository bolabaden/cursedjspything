---
title: "feat: int * str mul reject + plan 704 merge (plan 705)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN §8.15; merge PR #372
---

# int * str `mul` reject + ops handoff

## Summary

Squash-merge PR #370 (plan 704). Align **`int * str`** with CPython 3.9–3.13: **`TypeError`**, while **`str * int`** and **`bool * str`** keep working. Add Vitest in **`operator-int-str-remaining-binary.test.ts`** and update §8.15 docs.

---

## Problem Frame

`float↔str` `mul` rejects are evidenced; **`int↔str` `mul`** is not. pyrt currently allows **`int * str`** via `str.__rmul__` + `sequenceRepeatCount`, but CPython rejects **`int * str`** (reflected **`str * int`** still works).

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | Merge PR #372 when green |
| R2 | `repeatStr` / `str.__rmul__`: reject plain **`int`** repeat count (allow **`bool`**) |
| R3 | `mul(int, str)` raises `PyTypeError` both orders message; `mul(str, int)` still repeats |
| R4 | Extend `operator-int-str-remaining-binary.test.ts` with `mul` cases |
| R5 | §8.15 COMPATIBILITY + `validation-ladder.md`; LIVING-PLAN merge + plan delta |
| R6 | `npm run check && npm test && npm run golden:keys` |

---

## Scope Boundaries

- Minimal runtime guard in `str.ts`; no broad numeric tower refactor
- Record plan 704 merge in LIVING-PLAN

---

## Implementation Units

- U0. Merge PR #372
- U1. `src/runtime/builtins/str.ts` — `repeatStr` int-vs-bool guard
- U2. `test/cpython-derived/operator-int-str-remaining-binary.test.ts`
- U3. Docs: `COMPATIBILITY_AND_GAPS.md`, `validation-ladder.md`, `LIVING-PLAN.md`

---

## Test Scenarios

- T1. `mul(pyInt(1), pyStr('a'))` → `PyTypeError` `/unsupported operand type\(s\) for \*: 'int' and 'str'/`
- T2. `mul(pyStr('a'), pyInt(1))` → `'a'`
- T3. `mul(pyTrue, pyStr('ab'))` unchanged (covered in str-scalar; smoke if needed)

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
