---
title: "feat: CPython-derived test_isinstance MRO ports"
type: feat
status: completed
date: 2026-05-23
origin: docs/knowledgebase/LIVING-PLAN.md
---

# CPython-derived test_isinstance MRO ports

## Summary

Port thin `isinstance` / `issubclass` cases from CPython `Lib/test/test_isinstance.py` (`TestIsInstanceIsSubclass` normal + tuple branches) into Vitest, with nested tuple flattening in `isinstance`/`issubclass` if required for parity.

---

## Problem Frame

LIVING-PLAN lists Tier A `test_isinstance.py` as next work after `test_contains`. pyrt already implements MRO-based `isinstance`/`issubclass` in `class.ts` with basic tuple support; this slice adds CPython-derived evidence for Super/Child hierarchies and nested tuple second arguments.

---

## Requirements

- R1. Port `test_isinstance_normal` and `test_subclass_normal` (Super/Child hierarchy, no abstract metaclass)
- R2. Port `test_subclass_tuple` flat and nested tuple cases
- R3. Fix `isinstance`/`issubclass` to flatten nested type tuples if R2 fails
- R4. Update `mine-lib-tests.sh`, `validation-ladder.md`, `LIVING-PLAN.md`

---

## Scope Boundaries

- Skip abstract metaclass cases (`AbstractSuper`/`AbstractChild`)
- Skip PEP 604 unions (`int | str`), generic aliases, recursion-limit stress
- Skip exception-masking whitebox tests (`TestIsInstanceExceptions`)
- No golden harness changes

---

## Implementation Units

- U1. `test/cpython-derived/isinstance-protocol.test.ts`
- U2. `src/runtime/class/class.ts` — nested tuple flatten helper (conditional)
- U3. Mining script + KB docs

---

## Test Scenarios

| Scenario | Expected |
|----------|----------|
| isinstance(Super(), Super) | true |
| isinstance(Super(), Child) | false |
| isinstance(Child(), Super) | true |
| issubclass(Child, Super) | true |
| issubclass(Super, Child) | false |
| issubclass(Child, [Super]) | true |
| issubclass(Super, [Child, Super]) | true |
| issubclass(Child, []) | false |
| issubclass(Super, [Child, [Super]]) | true (nested tuple) |
| isinstance(pyInt(1), intType) | true |

---

## Sources & References

- `vendor/cpython/Lib/test/test_isinstance.py`
- `src/runtime/class/class.ts` — `isinstance`, `issubclass`
- `test/class/system.test.ts` — existing MRO coverage
