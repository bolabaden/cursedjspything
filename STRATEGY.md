---
name: pyrt
last_updated: 2026-05-18
---

# pyrt Strategy

## Target problem

Developers who think in Python’s object model hit a wall in TypeScript/JavaScript: there is no faithful `__getattr__` / descriptor / dunder dispatch layer, so “Pythonic” designs either lie about semantics or require embedding CPython. The crux is **predictable data-model behavior** (MRO, special-method lookup, containers) without running a full interpreter.

## Our approach

Implement CPython’s **two-channel lookup** explicitly in TypeScript—`getAttr` for attributes, `lookupSpecial` for implicit ops—anchored to the 3.14 slot registry, with **honest gaps** and tests/golden proof instead of claiming full Python.

## Who it's for

**Primary:** Python-first developers building libraries or tooling in TS/JS — they’re hiring pyrt to use **dunder-driven APIs** (`makeClass`, `eq`, `getItem`, descriptors) that behave like CPython’s data model where documented.

## Key metrics

- **Golden pass rate** — share of version-gated checks matching installed CPython (`npm run golden`)
- **Unit test regressions** — `npm test` stays green on dispatch, lookup, builtins
- **Documented parity coverage** — Tier-1 gaps in COMPATIBILITY shrink without silent semantic drift
- **Slot registry completeness** — `SLOTDEF_COUNT` stays aligned with CPython 3.14 `slotdefs[]` names

## Tracks

### Core dispatch fidelity

Close semantic gaps between pyrt and CPython (`contains`/`eq`, slice `__getitem__`, callable `lookupSpecial`, class creation).

_Why it serves the approach:_ Without this, the library is “Python-shaped” names only.

### Evidence & documentation

Golden harness, compatibility matrix, README/KB that state what is tested vs assumed.

_Why it serves the approach:_ Python-first users need trust, not slogans.

### Builtin & protocol surface

Minimal `pyList`/`pyDict`/… plus protocols (iter, context, buffer stubs) routed through the same dispatch layer.

_Why it serves the approach:_ Embeddable objects must exercise real lookup paths, not ad hoc JS.

## Not working on

- Python VM, `import`, bytecode, `super()`, `match`/`case`, full `asyncio`
- Arbitrary-precision `int` unless explicitly chosen later
- Claiming bit-identical CPython without citing tested subset

## Marketing

**One-liner:** CPython’s object model in TypeScript—explicit, testable, honest about the gaps.

**Key message:** Use `getAttr` and `add` like you’d use Python’s data model; read COMPATIBILITY before you assume `a + b` syntax or full stdlib.
