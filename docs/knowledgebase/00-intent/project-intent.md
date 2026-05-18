# Project intent

## What pyrt is

`[SYNTH]` **pyrt** is a TypeScript library that emulates the **CPython object model** (types, MRO, descriptors, special-method dispatch) for use from JavaScript/TypeScript. Callers use explicit helpers (`getAttr`, `add`, `eq`, `makeClass`, …) rather than a Python parser or bytecode VM.

`[REPO]` Package name: `pyrt`. Entry: `src/index.ts`. Runtime: `src/runtime/`.

## What pyrt is not

`[SYNTH]` pyrt is **not**:

- A Python interpreter or compiler
- A substitute for CPython stdlib, imports, or packaging
- “Everything Python has that JavaScript lacks”
- Syntax-identical to Python (no `a + b` operator overloading in plain TS)

See [../40-operational-risk/compatibility-summary.md](../40-operational-risk/compatibility-summary.md) and [../../COMPATIBILITY_AND_GAPS.md](../../COMPATIBILITY_AND_GAPS.md).

## Primary users

`[SYNTH]`

- Library authors building Python-like APIs in TS/JS
- Tooling that needs predictable dunder dispatch without embedding CPython
- Educators comparing Python’s data model to JS

## Success criteria

`[SYNTH]`

1. **Correct dispatch shape** for attribute access, descriptors, and special methods per [OFFICIAL] Python 3.9–3.14 data model (with documented gaps).
2. **Exhaustive registry** of CPython 3.14 `slotdefs[]` names mapped to `Slot` / `Hook` in `src/runtime/slots.ts`.
3. **Test-backed** behavior for implemented paths (`npm test`).
4. **Honest documentation** — version-pinned official links and explicit non-goals.

## Python version stance

`[SYNTH]`

| Policy | Version(s) |
|--------|------------|
| Document & cite official behavior | **3.9, 3.10, 3.11, 3.12, 3.13, 3.14** (pinned URLs) |
| Slot / dunder inventory alignment | **3.14** CPython `slotdefs[]` |
| Runtime implementation | Single TS codebase; version features gated in docs until implemented |

Details: [../20-domain-theory/python-version-matrix-3.9-3.14.md](../20-domain-theory/python-version-matrix-3.9-3.14.md).
