# CPython data model reference (pyrt lens)

`[OFFICIAL]` behavior described here follows Python **3.9–3.14** language reference unless a minimum version is stated. Pinned index: [python-version-matrix-3.9-3.14.md](python-version-matrix-3.9-3.14.md).

`[REPO]` pyrt implements a **subset** via explicit TS APIs — see [../40-operational-risk/compatibility-summary.md](../40-operational-risk/compatibility-summary.md).

---

## Special method lookup (stable 3.9–3.14)

`[OFFICIAL]` For implicit special methods (e.g. `len(x)` → `type(x).__len__`):

1. Resolve on the **type**, following MRO.
2. **Do not** consult the instance `__dict__` for special methods.
3. Bypass `__getattribute__` for this lookup path (use “special lookup” / `lookupSpecial` in pyrt).

Pinned (example 3.14): https://docs.python.org/3.14/reference/datamodel.html#special-lookup

`[REPO]` `lookupSpecial()` in `src/runtime/core/lookup.ts` — type-only, no instance dict.

---

## Ordinary attribute access

`[OFFICIAL]` Order (simplified): data descriptor on type → instance dict → non-data descriptor → type dict → `__getattr__`.

`[REPO]` `getAttr` / `setAttr` / `delAttr` in `lookup.ts` with descriptor precedence.

---

## Slot vs non-slot specials in CPython

| CPython | pyrt |
|---------|------|
| `slotdefs[]` → `tp_*` slots + `__dunder__` names | `Slot` enum (81) + `slotValues` on `PyObject` |
| Class creation hooks, `__class_getitem__`, etc. | `Hook` enum (22) + `hookHandlers` on `PyType` |

`[REPO]` `SLOT_DUNDER_NAMES`, `SLOTDEF_COUNT` in `slots.ts`.

---

## Class creation (simplified in pyrt)

`[OFFICIAL]` Full pipeline: metaclass `__prepare__` → body exec → `__new__` → `__init__` → `__classcell__` / `__set_name__` / `__init_subclass__`.

`[REPO]` `makeClass`, `instantiate`, `setName`, `initSubclass` in `class.ts` — **not** full `type.__call__` emulation.

Pinned class creation (3.14): https://docs.python.org/3.14/reference/datamodel.html#customizing-class-creation

---

## Operators and protocols

`[OFFICIAL]` Rich comparison, numeric, containers, iteration, context managers, async protocols — defined per dunder in data model.

`[REPO]` `dispatch/operators/`, `dispatch/protocols.ts` — see test modules:

| Area | Tests |
|------|-------|
| Operators | `test/dispatch/operators.test.ts` |
| Protocols | `test/dispatch/protocols.test.ts` |
| Lookup / descriptors | `test/core/object-model.test.ts` |
| Class / MRO | `test/class/system.test.ts` |
| Slots registry | `test/core/slots.test.ts` |

---

## Version-specific hooks (documented, not all implemented)

| Method | Min Python | pyrt |
|--------|------------|------|
| `__match_args__` | 3.10 | `Hook.matchArgs`, `getMatchArgs()` |
| `__buffer__`, `__release_buffer__` | 3.12 | Partial (`getBuffer` / `releaseBuffer`) |
| `__annotate__` | 3.14 | Partial (`Hook.annotate`, `getAnnotations()`) |

---

## JavaScript boundary

`[SYNTH]` Python operators are **not** JS operators. Use `add(a,b)`, `eq(a,b)`, `getAttr(o, "x")`. Optional `Proxy` only covers a subset of attribute-style interception — see COMPATIBILITY §11.

---

## Further reading

- Exhaustive matrix: [../../COMPATIBILITY_AND_GAPS.md](../../COMPATIBILITY_AND_GAPS.md)
- Architecture: [../10-architecture-runtime/runtime-overview.md](../10-architecture-runtime/runtime-overview.md)
