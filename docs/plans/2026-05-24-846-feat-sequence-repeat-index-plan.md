---
title: "feat: sequence repeat via __index__ protocol (plan 846)"
type: feat
status: completed
date: 2026-05-24
origin: CPython sequence_repeat _PyIndex_Check; LIVING-PLAN §8.15
---

# Sequence repeat `__index__` protocol parity

## Summary

CPython `sequence_repeat` accepts any operand with **`__index__`** (`_PyIndex_Check`) as a repeat count. pyrt `sequenceRepeatCount` only accepts **int** and **bool**, so `obj * 'ab'` and `'ab' * obj` fail for index-capable user types. Extend **`sequenceRepeatCount`** in `int.ts` to consult **`__index__`**, add Vitest coverage across str/bytes/list/tuple (forward and reflected), and sync §8.15 docs.

## Problem Frame

```python
class N:
    def __index__(self): return 2
N() * 'ab'  # => 'abab' on CPython 3.14
```

pyrt raises `unsupported operand type(s) for *`. The same helper feeds slice bound parsing (`parseBoundIndex`), so index objects also fail as slice bounds.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `sequenceRepeatCount` calls `__index__` when operand is not int/bool |
| R2 | Accept `number` or `pyInt` return; reject other types with `TypeError` |
| R3 | `mul(seq, indexObj)` and `mul(indexObj, seq)` repeat for str/bytes/list/tuple |
| R4 | Float repeat counts still reject (`sequence-repeat-nonint.test.ts` unchanged) |
| R5 | New `sequence-repeat-index.test.ts` + §8.15 + validation-ladder + LIVING-PLAN |
| R6 | Merge PR #513 (plan 845) before branching; `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- `int.ts` helper only — no `PyNumber_Multiply` dispatcher refactor
- Slice bound smoke optional (covered indirectly via shared helper)

## Implementation Units

- U1. `sequenceRepeatCount` + `repeatCountFromIndexResult` in `int.ts`
- U2. `test/cpython-derived/sequence-repeat-index.test.ts`
- U3. Docs sync

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
