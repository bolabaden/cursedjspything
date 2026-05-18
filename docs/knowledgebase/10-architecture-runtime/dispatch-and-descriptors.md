# Dispatch and descriptors

## Attribute lookup (`getAttr`)

`[REPO]` `src/runtime/lookup.ts`

`[SYNTH]` Precedence aligned with [OFFICIAL] data model (3.9–3.14):

1. Data descriptor on type (e.g. `property.__get__`)
2. Instance `dict` entry
3. Non-data descriptor on type
4. Type `dict` entry
5. `__getattr__` if defined

`setAttr` / `delAttr` mirror descriptor `__set__` / `__delete__` rules where implemented.

Pinned reference (3.14): https://docs.python.org/3.14/reference/datamodel.html#object.__getattribute__

---

## Special lookup (`lookupSpecial`)

`[REPO]` Used by operators and protocols when resolving `__add__`, `__len__`, etc.

Properties:

- Walk **MRO** of the object's type
- Read from type dict / slot machinery only
- **Skip** instance dict for dunder name
- Does not route through `__getattribute__`

Pinned (3.14): https://docs.python.org/3.14/reference/datamodel.html#special-lookup

---

## Slotted instances

`[REPO]` When a type uses `slotNames`, `getAttr` reads/writes `slotValues[slotIndex]` for those dunders instead of only instance dict.

Constructor path uses `type?.slotNames` at instantiation (`object.ts`).

---

## Descriptors

`[OFFICIAL]` `property`, `classmethod`, `staticmethod` patterns supported via descriptor protocol on `PyObject` helpers.

`[REPO]` Descriptor objects expose `__get__`, `__set__`, `__delete__` as implemented in tests (`test/object-model.test.ts`).

CPython: https://github.com/python/cpython/blob/v3.14.0/Objects/descrobject.c

---

## Operators

`[REPO]` `operators.ts`:

- Identity: `is`, rich compare via `__lt__` chain + `__eq__`
- Numeric: binary, reflected, in-place where defined
- `NotImplemented` propagation for unsupported combinations
- `hash`, `bool`, `repr`, `str`, `format`, `bytes`

---

## Protocols

`[REPO]` `protocols.ts`:

- `call`, `len`,getitem/setitem/delitem
- Iteration (`__iter__`, `__next__`)
- Context managers (`__enter__`, `__exit__`)
- Async: `__aiter__`, `__anext__`, `__aenter__`, `__aexit__` (surface; see tests)
- `dir`, length hints, buffer stubs

---

## Edge cases documented in COMPATIBILITY

- `lookupSpecial` vs `getAttr(".__x__")` on instance
- `NotImplemented` vs exception
- JS `number` vs Python `int`

Full list: [../../COMPATIBILITY_AND_GAPS.md](../../COMPATIBILITY_AND_GAPS.md).
