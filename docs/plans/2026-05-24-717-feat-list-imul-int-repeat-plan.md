---
title: "feat: list __imul__ int repeat + merge PR #384 (plan 717)"
type: feat
status: completed
date: 2026-05-24
origin: plan 676 gaps; merge PR #384
---

# list `__imul__` in-place int repeat + ops handoff

## Summary

Squash-merge PR #384 (plan 716). Add **`list.__imul__`** so **`list *= int`** mutates in place (CPython parity); today `imul` falls back to **`__mul__`** and returns a new list without updating `self`. Cross-type **`*=`** rejects stay in `sequence-imul.test.ts`.

---

## Problem Frame

No builtin defines **`Slot.imul`** (`[REPO]` grep). `imul(list, n)` uses **`list.__mul__`**, which returns a new list — not in-place `*=`. Plan 676 only tests cross-type **`*=`** rejects, not successful **`list *= int`**.

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | Merge PR #384 when green |
| R2 | `list.ts`: `imulList` uses `sequenceRepeatCount` + `buildRepeatedArray` + `setNative(self, …)`; returns `self` |
| R3 | Vitest: `list *= int` in place; existing reject cases unchanged |
| R4 | §8.6/§8.15 + LIVING-PLAN (716 merge + 717) |
| R5 | `npm run check && npm test && npm run golden:keys` |

---

## Scope Boundaries

- **list** only (tuple is immutable — no `__imul__`)
- Do not add `__imul__` on str/bytes unless needed

---

## Implementation Units

- U0. Merge PR #384
- U1. `src/runtime/builtins/list.ts`
- U2. `test/cpython-derived/sequence-imul.test.ts`
- U3. Docs

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
