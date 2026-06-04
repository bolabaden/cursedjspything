---
title: "feat: hash strictness matrix and pyDict constructor guard (plan 588)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md; user request for exhaustive LFG pass
---

# Hash strictness matrix (exhaustive slice)

## Brainstorm

Plans **574–586** landed hash strictness piecemeal (dict keys, set/frozenset build & mutation, tuple `__hash__`). Gaps remain:

| Gap | Risk |
|-----|------|
| `pyDict([[k,v]])` uses raw `Map.set` | Unhashable keys bypass `dictSet` validation |
| `dictKeysEqual` swallows `TypeError` from `dictKeyHash` | Lookup can return “not found” instead of raising |
| No single evidence file / §8.5 doc | Hard to see full matrix; regressions slip through |

**Out of scope this slice:** CPython-identical hash-based `set` internals; PEP 3118; changing `dictKeysEqual` to hash keys that are equal but different identity beyond current eq+hash check.

## Summary

Close the `pyDict` bypass, make `dictKeysEqual` propagate hash `TypeError`, add `hash-strictness-matrix.test.ts` table-driven coverage across builtin/hash/dict/set/frozenset/tuple paths, and document the matrix in `COMPATIBILITY_AND_GAPS.md` §8.5.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `pyDict([[pyList([]), v]])` raises `unhashable type: 'list'` |
| R2 | `dictKeysEqual` re-raises `PyTypeError` from `dictKeyHash` (no silent `false`) |
| R3 | `hash-strictness-matrix.test.ts` covers: `hash()`, dict set/get/del/contains, set add/contains, `pySet`/`pyFrozenSet` ctor, tuple hash — list + invalid `__hash__` |
| R4 | `dict-keys.test.ts` asserts `pyDict` constructor guard |
| R5 | `COMPATIBILITY_AND_GAPS.md` §8.5 documents hash strictness paths (plans 574–588) |
| R6 | validation-ladder row for matrix test (plan 588) |
| R7 | `npm run check && npm test && npm run golden:keys` green |

## Implementation Units

### U1. Runtime

- `src/runtime/builtins/dict.ts` — build `pyDict` via `dictSet`
- `src/runtime/collections/dict-keys.ts` — `dictKeysEqual` propagate `PyTypeError`

### U2. Tests

- `test/cpython-derived/hash-strictness-matrix.test.ts`
- `test/builtins/dict-keys.test.ts`

### U3. Docs

- `docs/COMPATIBILITY_AND_GAPS.md`
- `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```

## Review / optimize checklist

- [x] No duplicate helpers beyond existing `requireHashableElement` / `dictKeyHash`
- [x] Matrix tests fail if any path regresses to silent accept
- [x] §8.5 prose matches actual runtime paths
