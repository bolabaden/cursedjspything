---
title: "feat: str __getitem__ slice and index parity (plan 849)"
type: feat
status: completed
date: 2026-05-24
origin: str getitem only accepts JS number; parseBoundIndex __index__ clamp bug
---

# str `__getitem__` slice + integer/`__index__` parity

## Summary

`str.__getitem__` only accepts raw JS `number` keys and rejects `pySlice`, `pyInt`, and `__index__` objects. CPython supports all three. Implement slice subscripting (mirror `bytes`), add `pyIndexAsInteger` for index resolution (distinct from `sequenceRepeatCount` clamp), fix `parseBoundIndex` in str/bytes, extend bytes single-byte `__getitem__` for `pyInt`/`__index__`, add Vitest + docs.

## Problem Frame

- `getItem(pyStr('abc'), pySlice(1,3))` → TypeError today.
- `getItem(pyStr('abc'), indexObj)` with `__index__` → TypeError.
- `parseBoundIndex` used `sequenceRepeatCount` which clamps negatives via `Math.max(0,…)`.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `pyIndexAsInteger` in `int.ts` (int/bool/`__index__`, signed) |
| R2 | `str.__getitem__`: slice → `pyStr`; integer/`__index__` → one-char `pyStr` |
| R3 | `bytes.__getitem__`: `pyInt`/`__index__` single-byte index |
| R4 | `parseBoundIndex` uses `pyIndexAsInteger` in str.ts and bytes.ts |
| R5 | `str-getitem-slice.test.ts` + validation-ladder + LIVING-PLAN |
| R6 | Merge PR #516; `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- No list/tuple getitem changes (already handle slice partially)
- Grapheme/cluster indexing out of scope (existing JS string code units)

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
