---
title: "feat: dict key invalid __hash__ return evidence (plan 574)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 572
---

# dict key invalid __hash__ return

## Summary

CPython rejects keys whose `__hash__` does not return an integer when hashing for dict operations. pyrt already enforces this in `hash()` (`compare.ts`) and `dictKeyHash` (`dict-keys.ts`), but `dictSet` does not validate new PyObject keys before insert. Add tests for `hash()`, `setItem`, and `getItem`/`contains` lookup paths; fix `dictSet` if insert lacks validation.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | Custom class with `__hash__` returning non-number: `hash(obj)` raises `TypeError` with `__hash__ method should return an integer` |
| R2 | `setItem(pyDict(), badKey, val)` raises same `TypeError` (dict insert path) |
| R3 | Dict with a stored PyObject key: `getItem` / membership lookup that must hash the probe key raises same when probe has invalid `__hash__` |
| R4 | Extend `test/builtins/dict-keys.test.ts`; validation-ladder row (plan 574) |
| R5 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- PEP 3118; set/frozenset hash tables (separate internals); changing `dictKeysEqual` swallowing hash errors on equality compare.

## Implementation Units

### U1. Tests

**Files:** `test/builtins/dict-keys.test.ts`

### U2. Runtime (only if R2 fails)

**Files:** `src/runtime/collections/dict-keys.ts` — call `dictKeyHash` for `PyObject` keys in `dictSet` before `map.set`.

### U3. Docs

**Files:** `docs/knowledgebase/50-execution/validation-ladder.md` — note invalid-hash dict key coverage.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
