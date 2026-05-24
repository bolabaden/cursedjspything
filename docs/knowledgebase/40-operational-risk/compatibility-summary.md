# Compatibility summary

**Authoritative detail:** [../../COMPATIBILITY_AND_GAPS.md](../../COMPATIBILITY_AND_GAPS.md) (~740+ lines, bibliography, appendices).

This page is the KB entry point for risk and scope. Python references use **pinned 3.9–3.14** URLs in [../20-domain-theory/python-version-matrix-3.9-3.14.md](../20-domain-theory/python-version-matrix-3.9-3.14.md).

---

## Scope statement

`[SYNTH]` pyrt provides **library-level** emulation of CPython's **object model** (types, MRO, descriptors, special methods). It does **not** provide a Python language implementation.

---

## Supported (high level)

`[REPO]` + `[SYNTH]`

| Area | Status |
|------|--------|
| `PyObject` / `PyType`, C3 MRO | Implemented |
| 81 `Slot` dunders (3.14 inventory) | Registered; invoke via helpers |
| 24 `Hook` symbols | Registered; partial handlers |
| Attribute lookup + descriptors | Implemented (tested) |
| Rich compare, numeric, identity | Implemented |
| Builtin int↔float / int↔bool / bool↔float cross-type | Partial — COMPATIBILITY §8.15; golden `int_float_*`, `bool_int_*`, `bool_float_*`; bool subclasses int (plan 026) |
| str↔scalar / sequence subscript errors | Partial — no coercion; `PyTypeError`/`PyIndexError` on str/list/tuple (§8.17); Vitest + golden `seq_bool_*`, `str_bool_*`, `tuple_bool_*` |
| Golden offline version gates | `pyrt-cases-version-gates.test.ts` — gate semantics without Python |
| Class creation hooks (subset) | `makeClass`, `setName`, `initSubclass` |
| Builtin types (minimal) | list/tuple/dict/set/str/int/float/bool/none |
| `isinstance` / `issubclass` | Implemented |

---

## Partial support

| Item | Gap |
|------|-----|
| `makeClass` | Not full metaclass `type.__call__` |
| `pyInt` | JS `number`, not arbitrary precision |
| `pyDict` / `pySet` | `Map` / `Set` semantics |
| Async protocols | Surface only; no real event loop |
| Buffer / PEP 688 | Minimal `wrapBuffer` / `getBuffer`; not full PEP 3118 |
| `makeClass` / `instantiate` | Subset of `type.__call__`; `instantiate` uses `lookupSpecial` for `__new__`/`__init__` |
| `pyInt` | JS `number`, not arbitrary precision |
| `Proxy` interop | Attribute subset only |

---

## Not supported (selected)

See COMPATIBILITY §9–10 for exhaustive list.

| Category | Examples |
|----------|----------|
| Language | `import`, bytecode, `exec`, `match`/`case` |
| Execution | generators, `yield`, full `asyncio`, `super()` |
| Runtime | GC, `__del__`, real weakref semantics |
| Stdlib | essentially all |
| Readonly namespace views | `types.MappingProxyType` — COMPATIBILITY §8.16 |
| 3.10+ | `match`/`case` VM (metadata `__match_args__` only — see version-gates checklist) |
| 3.14 | full `__annotate__` / PEP 649 evaluation timing |

---

## JavaScript limits

`[OFFICIAL]` ECMAScript has no user-defined operators.

`[SYNTH]` Use explicit functions (`add`, `eq`, …). TC39 operator overloading was withdrawn.

`[REPO]` `examples/python-vs-js.ts` documents patterns.

---

## Version honesty

| Claim | Safe? |
|-------|-------|
| “Follows 3.14 slotdefs names” | Yes `[REPO]` |
| “Documents 3.9–3.14 official behavior” | Yes with pinned URLs |
| “Matches CPython on all versions” | **No** — golden is 29 keys/profile per host Python `[REPO]` |
| “Complete Python compatibility” | **No** |

---

## Plan vs shipped

`[REPO]` `.cursor/plans/python_runtime_js_94dc0fcc.plan.md` may overstate features (annotations, pattern matching). Prefer this KB + `COMPATIBILITY_AND_GAPS.md` for shipped truth.

---

## Risk register (short)

| Risk | Mitigation |
|------|------------|
| User assumes `a+b` works | Document helper API; examples |
| Version drift in docs.python.org | Pin 3.N URLs; periodic audit |
| Slot count changes in 3.15+ | Diff `typeobject.c`; update `slots.ts` |
| Silent semantic drift vs CPython | Add golden tests per 3.N `[OPEN]` |
