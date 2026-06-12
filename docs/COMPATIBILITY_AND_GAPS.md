# pyrt: CPython parity, supported surface, gaps, and bibliography

This document is the **authoritative compatibility matrix** for the **`pyrt`** package in this repository: what is implemented, what is partial, what is intentionally out of scope, and where behavior **diverges from CPython 3.x**. It is written for readers who want **exhaustive** coverage and **traceability** to **CPython source** and **official Python documentation**.

> **Important scope statement:** `pyrt` is a **library-level object model / data-model emulation** (explicit helpers such as `eq`, `add`, `getAttr`). It is **not** a Python language implementation, not a bytecode VM, and not a full standard library port. Any claim of “complete Python” or “zero discrepancies with CPython” should be rejected unless explicitly narrowed to a **documented subset** of this file.

---

## Table of contents

1. [Bibliography and authoritative references](#1-bibliography-and-authoritative-references)
2. [CPython source map (where semantics live)](#2-cpython-source-map-where-semantics-live)
3. [Design of pyrt (what is being emulated)](#3-design-of-pyrt-what-is-being-emulated)
4. [Supported: public API inventory](#4-supported-public-api-inventory)
5. [Supported: `Slot` registry (81 names) vs dispatch](#5-supported-slot-registry-81-names-vs-dispatch)
6. [Supported: `Hook` registry (non-slot specials)](#6-supported-hook-registry-non-slot-specials)
7. [Supported: builtins shipped in `src/runtime/builtins/`](#7-supported-builtins-shipped-in-srcruntimebuiltinsts)
8. [Partially supported (works, but not CPython-identical)](#8-partially-supported-works-but-not-cpython-identical)
9. [Not supported: Python language and execution model](#9-not-supported-python-language-and-execution-model)
10. [Not supported: data model and stdlib (exhaustive checklist)](#10-not-supported-data-model-and-stdlib-exhaustive-checklist)
11. [JavaScript / ECMAScript limits relevant to parity](#11-javascript--ecmascript-limits-relevant-to-parity)
12. [Verification in this repository](#12-verification-in-this-repository)
13. [Maintainer guidance: how to extend without false claims](#13-maintainer-guidance-how-to-extend-without-false-claims)

---

## 1. Bibliography and authoritative references

The following are the **primary** external references used when describing CPython behavior, Python semantics, and JavaScript limits. Titles are given verbatim or near-verbatim for searchability.

### 1.1 Python language reference (data model)

1. **Python Language Reference — 3. Data model**  
   <https://docs.python.org/3/reference/datamodel.html>  
   Canonical definition of objects, types, the **descriptor protocol**, **`__slots__`**, **`__class__`**, special methods, and protocol semantics.

2. **Python Language Reference — 3.3.10. Special method lookup**  
   <https://docs.python.org/3/reference/datamodel.html#special-method-lookup>  
   Defines **implicit** special method lookup rules (type-based lookup that **does not** go through normal instance attribute access the way explicit `obj.__add__(...)` can).

3. **Python Language Reference — 3.3.6. Customizing class creation**  
   <https://docs.python.org/3/reference/datamodel.html#customizing-class-creation>  
   Documents **`__mro_entries__`**, **`__prepare__`**, **`__set_name__`**, **`__init_subclass__`**, **`__class_getitem__`**, **`__classcell__`**, and constraints around **`__class__`** assignment.

4. **Python Language Reference — 3.3.2. Customizing attribute access**  
   <https://docs.python.org/3/reference/datamodel.html#customizing-attribute-access>  
   Documents **`__getattribute__`**, **`__getattr__`**, **`__setattr__`**, **`__delattr__`**.

5. **Python Language Reference — 3.3.4. Customizing instance and subclass checks**  
   <https://docs.python.org/3/reference/datamodel.html#customizing-instance-and-subclass-checks>  
   Documents **`__instancecheck__`** and **`__subclasscheck__`**.

6. **Python Language Reference — 3.3.8. Emulating generic types**  
   <https://docs.python.org/3/reference/datamodel.html#emulating-generic-types>  
   Documents **`__class_getitem__`** for generic aliases.

### 1.2 Descriptor protocol (tutorial / explanatory)

7. **Python documentation — Descriptor How To Guide**  
   <https://docs.python.org/3/howto/descriptor.html>  
   Explains **data vs non-data descriptors** and attribute resolution precedence at a pedagogical level (still authoritative for intent).

### 1.3 CPython C API documentation (type slots and abstract protocol layer)

8. **Python/C API Reference Manual — Type Objects**  
   <https://docs.python.org/3/c-api/typeobj.html>  
   Describes the C-level type slots (`tp_*`, `nb_*`, `sq_*`, `mp_*`, …) that correspond to many Python special methods.

9. **Python/C API Reference Manual — Abstract Objects Layer**  
   <https://docs.python.org/3/c-api/abstract.html>  
   Describes C API entry points such as `PyObject_GetItem`, `PyNumber_Add`, etc., which correspond to Python operations and protocol dispatch.

10. **Python/C API Reference Manual — Calling conventions (vectorcall / `tp_call`)**  
    <https://docs.python.org/3/c-api/call.html>  
    Describes how callables are invoked in CPython’s C API (related to `tp_call`, `vectorcall`, and Python `__call__`).

11. **Python/C API Reference Manual — Buffer Protocol**  
    <https://docs.python.org/3/c-api/buffer.html>  
    Documents `Py_buffer`, exporter/importer lifecycle; relevant to `__buffer__` / `__release_buffer__` parity claims.

### 1.4 ECMAScript / MDN (JavaScript reality)

12. **ECMA-262 — Proxy Objects**  
    <https://tc39.es/ecma262/multipage/reflection.html#sec-proxy-objects>  
    Defines **Proxy** semantics, invariants, and why some objects cannot be faithfully “wrapped”.

13. **MDN — `Proxy`**  
    <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy>  
    Practical documentation of traps, invariants, and common interoperability caveats (private fields, exotic objects).

14. **TC39 proposal: operator overloading (withdrawn / archived)**  
    <https://github.com/tc39/proposal-operator-overloading>  
    Status: **withdrawn**; documents historical exploration of user-defined operators in JavaScript and clarifies why **JS operators are not extensible** like Python’s without a compiler or nonstandard dialect.

### 1.5 PEPs frequently adjacent to the data model (not implemented as runtime features in pyrt)

15. **PEP 443 — Single-dispatch generic functions (`functools.singledispatch`)**  
    <https://peps.python.org/pep-0443/>

16. **PEP 544 — Protocols: Structural subtyping (`typing.Protocol`)**  
    <https://peps.python.org/pep-0544/>

17. **PEP 585 — Type hinting generics in standard collections**  
    <https://peps.python.org/pep-0585/>

18. **PEP 634 / 635 / 636 — Structural pattern matching**  
    <https://peps.python.org/pep-0634/> (and related)

19. **PEP 646 / 692 / 698 (and others) — typing / generics evolution**  
    Use <https://peps.python.org/> search when needed; pyrt does not implement typing runtime semantics.

20. **PEP 3118 — Revising the buffer protocol**  
    <https://peps.python.org/pep-3118/>  
    Defines the buffer protocol that backs `memoryview`, `bytes`-like consumption, and `__buffer__` / `__release_buffer__` in modern Python; pyrt does not implement PEP 3118 object semantics end-to-end.

---

## 2. CPython source map (where semantics live)

These are the **primary CPython implementation files** most relevant to the subset pyrt emulates. Links point to the `main` branch on GitHub; for reproducible citations in papers, pin a **commit hash** or use a **release tag** (for example `v3.14.x`) instead of `main`.

| Topic | CPython file | URL |
|------|--------------|-----|
| Type object, `slotdefs[]`, slot installation, many special cases around slots | `Objects/typeobject.c` | <https://github.com/python/cpython/blob/main/Objects/typeobject.c> |
| Abstract protocol dispatch (`PyNumber_*`, `PyObject_GetItem`, …) | `Objects/abstract.c` | <https://github.com/python/cpython/blob/main/Objects/abstract.c> |
| Core object operations (`PyObject_RichCompare`, generic attribute access, …) | `Objects/object.c` | <https://github.com/python/cpython/blob/main/Objects/object.c> |
| Descriptor objects (`property`, method descriptors, member descriptors, …) | `Objects/descrobject.c` | <https://github.com/python/cpython/blob/main/Objects/descrobject.c> |
| Calling conventions (`PyObject_Call`, vectorcall pathways) | `Objects/call.c` | <https://github.com/python/cpython/blob/main/Objects/call.c> |
| Interpreter opcode dispatch (async/await, import, …) | `Python/ceval.c` (and related) | <https://github.com/python/cpython/blob/main/Python/ceval.c> |
| Bytecode definitions / special opcodes | `Python/bytecodes.c` | <https://github.com/python/cpython/blob/main/Python/bytecodes.c> |

**pyrt’s `Slot` registry** is explicitly aligned with the **slot table** narrative in `Objects/typeobject.c` (see comments in `src/runtime/slots.ts`). It is **not** automatically generated from CPython; it is a **curated mirror** and must be re-verified on CPython upgrades.

---

## 3. Design of pyrt (what is being emulated)

### 3.1 Core object representations

- **`PyObject`**: a heap object with stable numeric identity (`id`), a **`type`**, an instance namespace (`dict`: `Map`), and optional **`slotValues`** for `__slots__`-style layouts.  
  Source: `src/runtime/object.ts`.

- **`PyType`**: a **`PyObject`** that is also a type: bases, frozen **C3 MRO**, type namespace (`typeDict`), optional `slotNames`, and a `metaclass` reference.  
  Source: `src/runtime/object.ts`.

- **Bootstrap**: `objectType` and `typeType` are mutually referential like CPython’s bootstrap types.  
  Source: `src/runtime/object.ts`.

### 3.2 Two lookup channels (this is central to correctness claims)

1. **Normal attribute access** (`getAttr` / `setAttr` / `delAttr`): modeled after **`PyObject_GenericGetAttr`** / set/delete variants — data descriptor → instance dict / slot storage → non-data descriptor / plain class attribute → `__getattr__`.  
   Source: `src/runtime/core/lookup.ts`.  
   Python reference: **\[1\], \[2\], \[4\], \[7\]**.

2. **Special method lookup for implicit operations** (`lookupSpecial`): modeled after the **“special method lookup”** idea: search the **type MRO**’s type namespaces for a slot symbol; **do not** consult the instance mapping for the method’s storage location; bind descriptors if needed.  
   Source: `src/runtime/core/lookup.ts`.  
   Python reference: **\[2\]**.

### 3.3 Explicit operations instead of JS syntax

All “operator-like” behavior is implemented as **functions** exported from `src/index.ts` (implemented primarily in `src/runtime/dispatch/operators/` and `src/runtime/dispatch/protocols.ts`).  
JavaScript background: **\[12\], \[13\], \[14\]**.

---

## 4. Supported: public API inventory

This section mirrors **`src/index.ts`** exports (the package’s public contract).

### 4.1 Registry and introspection of symbols

| Export | Role |
|--------|------|
| `Slot` | Symbolic keys for **slot-backed** dunder names |
| `Hook` | Symbolic keys for **non-slot** dunder-like hooks |
| `ALL_SYMBOLS` | Combined lookup map |
| `dunderName(symbol)` | Debugging: map symbol → dunder string |
| `SLOTDEF_COUNT` | Count of `Slot` entries (expected 81) |
| `SLOT_DUNDER_NAMES` | Iterable of dunder strings derived from registry |

Source: `src/runtime/slots.ts`, exported via `src/index.ts`.

### 4.2 Object model

| Export | Role |
|--------|------|
| `PyObject`, `PyType` | Core representations |
| `objectType`, `typeType` | Bootstrap types |
| `computeC3` | C3 linearization helper |
| `NotImplemented`, `isNotImplemented` | `NotImplemented` sentinel behavior for operator fallbacks |

Source: `src/runtime/object.ts`.

### 4.3 Attribute access + errors

| Export | Role |
|--------|------|
| `getAttr`, `setAttr`, `delAttr` | Attribute protocol entry points |
| `defaultGetAttr`, `defaultSetAttr`, `defaultDelAttr` | Bypass custom dunder hooks when needed |
| `lookupInMro`, `lookupSpecial` | Introspection / advanced interop |
| `isDataDescriptor`, `hasGet` | Descriptor classification |
| `PyAttributeError`, `PyTypeError`, `PyKeyError`, `PyIndexError`, `PyStopIteration`, `PyValueError` | Small exception subset |

Source: `src/runtime/core/lookup.ts`.

### 4.4 Operators and conversions

Implemented in `src/runtime/dispatch/operators/` and exported from `src/index.ts`:

- Identity: `is`, `isNot`
- Truth and hashing: `boolProtocol`, `hash`
- Rich comparisons: `eq`, `ne`, `lt`, `le`, `gt`, `ge`
- Binary ops: `add`, `sub`, `mul`, `matmul`, `truediv`, `floordiv`, `mod`, `divmod`, `pow`, shifts, bitwise ops (and reflected fallbacks internally)
- In-place ops: `iadd`, `isub`, `imul`, `imatmul`, `itruediv`, `ifloordiv`, `imod`, `ipow`, `ilshift`, `irshift`, `iand`, `ixor`, `ior`
- Unary ops: `neg`, `pos`, `abs`, `invert`
- Conversions: `intProtocol`, `floatProtocol`, `boolProtocol`, `indexProtocol`, `complexProtocol`
- Rounding hooks: `round`, `trunc`, `floor`, `ceil`
- Representation: `repr`, `strProtocol`, `format`, `bytesProtocol`

### 4.5 Class system

Implemented in `src/runtime/class/class.ts`:

- `makeClass`, `instantiate`
- `pyClass`, `setPyClass`
- `classGetitem`
- `isinstance`, `issubclass`
- `resolveBases`, `calculateMetaclass`, `prepareNamespace`
- `MakeClassOpts` type

### 4.6 Protocols

Implemented in `src/runtime/dispatch/protocols.ts`:

- Callable: `call`
- Container: `len`, `lengthHint`, `getItem`, `setItem`, `delItem`, `contains`
- Iteration: `iter`, `next`, `reversed`
- Context managers: `enter`, `exit`
- Async surface: `pyAwait`, `aiter`, `anext`, `aenter`, `aexit`
- Introspection: `dir`
- Descriptor helpers: `descriptorGet`, `descriptorSet`, `descriptorDelete`
- Buffer surface: `getBuffer`, `releaseBuffer` (thin wrappers)

### 4.7 Builtin factories

Implemented in `src/runtime/builtins/`:

- `pyNone`, `noneType`
- `pyBool`, `pyTrue`, `pyFalse`, `boolType`
- `pyInt`, `intType`
- `pyFloat`, `floatType`
- `pyStr`, `strType`
- `pyList`, `listType`
- `pyTuple`, `tupleType`
- `pyDict`, `dictType`
- `pySet`, `setType`
- `unwrap`

---

## 5. Supported: `Slot` registry (81 names) vs dispatch

**Legend**

- **Registry**: present as a key in `Slot` (`src/runtime/slots.ts`).
- **Dispatch**: pyrt has runtime code that will call it via `lookupSpecial` / operator helpers / protocols for *some* objects.
- **User types**: user-defined `makeClass` types can attach callables to these symbols in `typeDict`.

> **Critical distinction:** “Registry + dispatch exists” does **not** mean “all edge cases match CPython”. See **Section 8**.

The 81 `Slot` dunders (as symbols) are defined in `src/runtime/slots.ts`. Dispatch coverage by subsystem:

| Subsystem file | What it dispatches |
|----------------|--------------------|
| `src/runtime/dispatch/operators/` | comparisons, numerics, unary, conversions, `repr`/`str`/`format`/`bytes`, rounding hooks |
| `src/runtime/dispatch/protocols.ts` | `call`, container ops, iteration, context managers, async entrypoints, buffer wrappers |
| `src/runtime/core/lookup.ts` | attribute hooks (`__getattribute__`, `__getattr__`, `__setattr__`, `__delattr__`) and descriptor `__get__`/`__set__`/`__delete__` during normal attribute access |
| `src/runtime/class/class.ts` | `__new__`, `__init__` for instantiation; metaclass-ish hooks are mostly `Hook` (see next section) |
| `src/runtime/builtins/` | concrete implementations for builtin wrappers (`pyInt`, …) |

### 5.1 `Slot.__del__` (`__del__`)

- **Registry:** yes (`Slot.del`).
- **Dispatch:** **not integrated** with object lifetime. There is **no** finalizer queue, no interpreter shutdown semantics, and no GC hook that calls `__del__`.

CPython background: finalization interacts with cycles, refcounts, and interpreter shutdown; see data model **\[1\]** and CPython runtime sources outside this document’s minimal list.

---

## 6. Supported: `Hook` registry (non-slot specials)

Defined in `src/runtime/slots.ts` under `Hook`. These are **not** necessarily installed into C-level slots; they correspond to Python features often implemented via **`_PyObject_LookupSpecial`**-style paths or bytecode.

| Hook symbol | Intended Python meaning | pyrt dispatch location |
|-------------|-------------------------|------------------------|
| `bytes`, `format`, `complex` | `__bytes__`, `__format__`, `__complex__` | `src/runtime/dispatch/operators/` |
| `round`, `trunc`, `floor`, `ceil` | `__round__`, `__trunc__`, `__floor__`, `__ceil__` | `src/runtime/dispatch/operators/` |
| `dir`, `lengthHint` | `__dir__`, `__length_hint__` | `src/runtime/dispatch/protocols.ts` |
| `enter`, `exit`, `aenter`, `aexit` | context manager protocols | `src/runtime/dispatch/protocols.ts` |
| `instancecheck`, `subclasscheck` | `__instancecheck__`, `__subclasscheck__` | `src/runtime/class/class.ts` (`isinstance` / `issubclass`) |
| `initSubclass`, `setName`, `prepare`, `mroEntries`, `classGetitem` | class creation / generics | `src/runtime/class/class.ts` |
| `missing`, `reversed` | `__missing__`, `__reversed__` | `src/runtime/dispatch/protocols.ts` |

---

## 7. Supported: builtins shipped in `src/runtime/builtins/`

These are **not** CPython-identical implementations of Python builtins; they are **JS-backed approximations** with many slot methods implemented to make examples/tests work.

| Type | Notes |
|------|------|
| `NoneType` (`pyNone`) | Minimal |
| `bool` | Based on JS boolean payload |
| `int` | **JS `number`**, not arbitrary precision |
| `float` | JS `number` |
| `str` | JS string; indexing returns single-code-unit strings (not Python’s full grapheme semantics) |
| `list`, `tuple` | JS arrays / frozen arrays |
| `dict` | JS `Map` |
| `set` | JS `Set` |

---

## 8. Partially supported (works, but not CPython-identical)

This section lists **known** mismatches that are easy to mistake for “bugs” but are actually **scope / representation** issues.

### 8.1 Class creation is not `type.__call__` / `type.__new__` faithful

`makeClass` constructs `new PyType(...)` directly and runs a **subset** of the class creation pipeline (`resolveBases`, `calculateMetaclass`, `prepareNamespace` exists but is not always composed the way a Python `class` statement is, `__set_name__`, `__init_subclass__`). Inconsistent C3 MRO raises **`PyTypeError`** (`Cannot create a consistent method resolution order (MRO)`), matching CPython's exception type.

CPython reference: **\[3\]**, implementation: [`Objects/typeobject.c`](https://github.com/python/cpython/blob/main/Objects/typeobject.c) (notably `type_new`, `type_call`, slot installation from `slotdefs[]`, and metaclass conflict resolution).

### 8.2 `hash` return normalization

`hash` coerces the return value with `| 0` in `src/runtime/dispatch/operators/`. Python’s `__hash__` rules include additional constraints (for example `hash` must be consistent with equality for hashable objects) and may use a different internal widening/narrowing strategy.

CPython reference: data model **`__hash__`** **\[1\]**.

### 8.3 `bool` requires a real JS boolean from `__bool__`

If `__bool__` returns a truthy/falsy non-boolean, pyrt raises. Python allows additional legacy behaviors in some cases; do not assume parity.

### 8.4 Numeric model: not arbitrary precision `int`

`pyInt` stores a JS number (`builtins/int.ts`), including `| 0` truncation in the factory. This diverges from Python `int` semantics for large integers, shifts, floor division, pow with huge exponents, etc.

### 8.5 `dict` / `set` key identity vs Python equality

Python dict keys use **rich equality** + **consistent hashing** rules. `[REPO]` **Hash strictness (plans 574–588):** `hash()` and `dictKeyHash` reject non-integer `__hash__` returns and unhashable types. **Dict** paths `dictSet`, `dictFindKey` (get/del/contains), and `pyDict()` construction validate PyObject keys. **`dictKeysEqual`** propagates hash `TypeError` (no silent `false`). **Set/frozenset membership (plans 590–592, 610, 612, 614, 616, 618):** `set-membership.ts` (`setFindMember`, `setAddMember`, `setDeleteMember`, `setMemberHas`) uses **`dictKeysEqual`** for lookup; wired through `contains`, mutation, inplace ops (`|=`, `&=`, `-=`, `^=`), **`set-algebra.ts`** (including `unionItems` via `setAddMember` and named algebra methods), **`issubset`/`issuperset`/`isdisjoint`** and **ordering comparisons** (`set-ordering.ts`), and **`pySet()`** / **`pyFrozenSet()`** construction (dedupe equal keys). Hash+eq evidence: `set-algebra-membership.test.ts` (592), `frozenset-set-algebra.test.ts` (618), `set-membership.test.ts`, `set-frozenset-inplace.test.ts` (616), `frozenset-set-methods.test.ts` (610), `frozenset-set-ordering.test.ts` (612), `frozenset-set-named-algebra.test.ts` (614), `dict-eq-hash-eq.test.ts` and `frozenset-set-eq.test.ts` (620) for **`dict.__eq__`** and set/frozenset cross-type **`__eq__`**. **Tuple** `__hash__` hashes each element via `hash()` (not `0` for missing `__hash__`). **Frozenset** `__hash__` is order-independent and uses stored members. Equal-but-distinct element hash evidence: `tuple-hash.test.ts`, `frozenset-hash.test.ts` (plan 630). Evidence: `dict-keys.test.ts`, `set-mutation.test.ts`, `set-membership.test.ts`, `hash-strictness-matrix.test.ts`. Embedders bypassing public factories with raw `Map`/`Set` mutation can still break parity — not supported.

`pyDict` uses JS `Map` with the rules above when built through the public factory; direct `Map` mutation remains embedder responsibility. **`dict`** supports **`|`** and **`|=`** merge with rhs overwriting (CPython 3.9+; plan 596; `dict-union.test.ts`) via `dictSet` so equal-but-distinct keys collapse like other dict operations. **`dict.get(key[, default])`** returns the value or **`None`** / the default without raising **`KeyError`** (plan 598; `dict-get.test.ts`; uses `dictGet`). **`dict.update()`** and **`|=`** merge another dict or an iterable of key/value pairs; **`dict.copy()`** shallow-copies via **`dictSet`** (plan 600; `dict-update-copy.test.ts`). **`dict.setdefault()`** inserts when missing (hash+eq lookup); **`dict.clear()`** empties the map (plan 602; `dict-setdefault-clear.test.ts`). **`dict.pop(key[, default])`** removes via `dictGet`/`dictDelete`; **`dict.popitem()`** removes the last inserted pair and returns a tuple (plan 604; `dict-pop-popitem.test.ts`). **`dict.keys()`** / **`values()`** / **`items()`** return live views with `len`, iteration, and `contains` (plan 606; `dict-keys-values-items-views.test.ts`). **`dict.fromkeys(iterable[, value])`** builds a new dict with `dictSet` dedupe (plan 608; `dict-fromkeys.test.ts`). **`dict.__eq__`** compares keys via `dictFindKey` and values with `eq()`; **`ne()`** negates that comparison (plan 620/626; `dict-eq-hash-eq.test.ts`). **`dict.__contains__`**, **`__getitem__`**, and **`__delitem__`** probe keys via `dictHas` / `dictGet` / `dictDelete` (plans 628, 632; `dict-contains-hash-eq.test.ts`, `dict-delitem-hash-eq.test.ts`). **`dict_values`** and **`dict_items`** view `__contains__` use rich `eq()` on values (plan 626; items value eq plan 632 in `dict-keys-values-items-views.test.ts`).

### 8.6 `list` / `tuple` containment and equality paths

`list` / `tuple` `__contains__` and the `contains()` protocol fallback use `eq()` for `PyObject` pairs (`src/runtime/builtins/list.ts`, `tuple.ts`, `dispatch/protocols.ts`). Sequence `__eq__` compares elements with `eq()` (rich-compare semantics per item); element-level `NotImplemented` is treated as unequal, matching CPython list/tuple equality. Hash+eq element evidence: `list-eq.test.ts` and `tuple-eq-hash-eq.test.ts` (plans 622, 624 — includes tuple `__contains__`). Cross-type **list↔tuple** and **list/tuple↔bytes** `eq`/`ne` do not coerce (plan 682; `sequence-eq-cross-type.test.ts`). Cross-type **list↔tuple** ordering (`lt`/`le`/`gt`/`ge`) raises **`TypeError`** (plan 684; `sequence-ordering-cross-type.test.ts`). **`list.__add__`** / **`tuple.__add__`** concatenate same-type sequences without dedupe (plan 634; `sequence-add.test.ts`); cross-type **`+`** rejects for list↔tuple/int/str/bytes/float/bool and tuple↔int/str/bytes/float/bool (plans 660–662, 674, 678; same file). **`list.__iadd__`** extends in place with another list or a tuple, returns `self`, no dedupe (plans 636, 672; `sequence-iadd.test.ts`); cross-type **`+=`** rejects for list↔int, list↔str, list↔bytes, list↔float, and list↔bool (plans 656–658, 686; same file). **`list.__imul__`** repeats in place for int/bool repeat counts (plan 717; `sequence-imul.test.ts`); cross-type **`*=`** rejects for list↔float, list↔list, and list↔tuple (plan 676; same file). **`list * str`** / **`str * list`**, list/tuple↔**bytes** `*`, **list↔tuple** `*`, and **list * list** (non-repeat) reject with **`TypeError`** (plans 664–670, 680; `sequence-mul-cross-type.test.ts`). **`int * list`** / **`int * tuple`** reject while **`list * int`** / **`tuple * int`** repeat (plan 709; same file). **`list.__sub__`** rejects **list − list** and cross-type **`-`** for list↔tuple/int/str/bytes/float/bool/dict (plans 680, 699–700); **`list -= list`** and cross-type **`-=`** reject for list↔int, list↔str, list↔tuple, list↔bytes, list↔float, list↔bool, and list↔dict (plans 694–696, 701; `sequence-sub.test.ts`). **`tuple.__sub__`** rejects tuple↔tuple, tuple↔int/str/bytes/float/bool/dict (plans 697–700; same file). **`dict_items`** view `__contains__` probes keys via `dictGet` (plan 624; `dict-keys-values-items-views.test.ts`). Cross-type builtin delegation may still return `NotImplemented` where CPython coerces further.

**Canonical §8.6 sequence evidence (plans 688, 690):** list/tuple operator Vitest lives in these files (supersedes removed `operator-list-tuple-cross-type.test.ts`):

| File | Coverage |
|------|----------|
| `sequence-add.test.ts` | `__add__` same-type + cross-type `+` rejects |
| `sequence-iadd.test.ts` | `__iadd__` extend + cross-type `+=` rejects |
| `sequence-imul.test.ts` | `list.__imul__` in-place int repeat (plan 717); cross-type `*=` rejects (plan 676) |
| `sequence-mul-cross-type.test.ts` | heterogeneous `*` + `list * list` rejects; `int * list`/`tuple` reject, `list`/`tuple * int` repeat (plan 709) |
| `sequence-sub.test.ts` | list/tuple `-` rejects; list `-=` same-type + cross-type rejects (plan 701) |
| `sequence-eq-cross-type.test.ts` | cross-type `eq`/`ne` |
| `sequence-ordering-cross-type.test.ts` | cross-type ordering rejects |

Related (not operator duplicates): `sequence-repeat-nonint.test.ts` (float repeat count), `sequence-repeat-bool.test.ts`, `sequence-index-type.test.ts`, `list-eq.test.ts`, `tuple-eq-hash-eq.test.ts`.

### 8.7 Slicing

`pySlice` and `sliceIndices` live in `src/runtime/collections/slice.ts`. `getItem` passes a slice object to `__getitem__` once. `pyList` / `pyTuple` implement `__getitem__(slice)` and return a new list/tuple; other types must implement slice subscripts themselves. Zero step raises **`PyValueError`** (`slice step cannot be zero`), matching CPython. Golden case `slice_list` compares against CPython.

### 8.8 Rich compare / `NotImplemented`

`richCompare` in `src/runtime/dispatch/operators/compare.ts` tries forward then reflected special methods and falls back to identity for `eq`/`ne`. Golden `rich_lt_reflected` checks `1 < Rev()` when `int.__lt__` returns `NotImplemented` and `Rev.__gt__` returns `True`. Golden `rich_lt_both_not_impl_raises` checks that `lt` between two `Incomparable` instances (both ordering ops return `NotImplemented`) raises `TypeError`, as in CPython. Vitest covers non-boolean `__bool__`, non-integer `__hash__`, and both-sides `NotImplemented` ordering.

### 8.9 `__missing__` integration

`getItem` only consults `Hook.missing` when `__getitem__` raises **`PyKeyError`** (`src/runtime/dispatch/protocols.ts`). Python’s `dict.__missing__` behavior is tied to mapping subclasses and `KeyError` propagation rules; do not assume full mapping subclass semantics.

### 8.10 Async protocols

`aenter` / `aexit` return **JavaScript Promises** in the TypeScript sense (`async` functions). CPython coroutine objects, `await` scheduling, `asyncio` tasks, and exception propagation are not modeled.

### 8.11 Buffer protocol

`getBuffer` / `releaseBuffer` forward to hooks if present, but there is **no** PEP-3118-style buffer manager, no exporter/importer lifecycle guarantees, and no `memoryview` type. See Python/C API **\[11\]** and **\[20\]**.

### 8.12 `__class__` assignment constraints

`setPyClass` implements a **narrow** compatibility check based on `slotNames` equality. CPython’s real `__class__` assignment rules interact with layout, `__slots__`, heap type allocation, and extension modules; see **\[3\]**.

### 8.13 `super()` / zero-argument `super` / `__classcell__`

Not implemented.

Python reference: class creation / compiler inserted cell discussion under **\[3\]**.

### 8.14 `__getattribute__` + `__getattr__` interaction

`getAttr` implements a simplified interaction: if `__getattribute__` raises `PyAttributeError`, it may fall through to `__getattr__`. CPython’s exact edge cases differ (exception types, `AttributeError` subclasses, suppressed tracebacks, etc.).

### 8.15 Builtin cross-type operator delegation

Built-in numeric types use **explicit type guards** in slot implementations rather than CPython’s full `PyNumber_*` tower. `[REPO]` Shared helpers `isNumericOperand` / `numericOperand` in `src/runtime/builtins/int.ts` treat **int**, **float**, and **bool** as JS numbers (bool as 0/1). `pyInt` and `pyFloat` slots accept all three; mixed int/float arithmetic promotes to `pyFloat` when either operand is a float; int↔bool and bool↔float pairs follow the same numeric compare and add paths (float `__radd__` covers `True + 1.0`). `[REPO]` `boolType` is created with `bases: [intType]` so `isinstance(pyTrue, intType)` and `issubclass(boolType, intType)` match CPython (plan 026). `[REPO]` `sequenceRepeatCount` (same module) lets **str**, **list**, **tuple**, and **bytes** `__mul__` and **`__rmul__`** accept **int**, **bool** (0/1), and **`__index__`** repeat counts like CPython `sequence_repeat` / `_PyIndex_Check` (plans 035–037; `sequence-repeat-bool.test.ts`; plan 845 restores **`int * sequence`** reflected repeat; plan 846 adds **`__index__`** objects). Non-index repeat counts (e.g. float) raise **`TypeError`** for all four sequence types (`sequence-repeat-nonint.test.ts`; bytes plan 642). `[REPO]` List and tuple repetition use `buildRepeatedArray` in `src/runtime/builtins/sequence-repeat.ts` (pre-sized indexed copy, no `push(...src)` spread) and attach results via direct `setNative` so large sequences do not hit V8 spread-argument limits (plan 045).

For **str↔scalar** and other non-numeric builtin pairs (for example `str` with `int`, `list` with unrelated types), slots return **`NotImplemented`** or raise **`TypeError`** directly (str `__contains__` requires a str operand). Rich compare / numeric dispatch then typically raises `TypeError` when no reflected method applies — there is no string↔int coercion (`"1" == 1` is `false`; `"a" + 1` raises). **int↔str** binary ops **`sub`**, **`truediv`**, **`floordiv`**, **`mod`**, **`divmod`**, and **`pow`** reject incompatible pairs in **both** operand orders; **`int * str`** and **`str * int`** repeat (`operator-int-str-remaining-binary.test.ts`, plan 845); **`int * list`** / **`int * tuple`** and forward **`list * int`** / **`tuple * int`** repeat (`sequence-mul-cross-type.test.ts`, plan 845); **str↔int** and **str↔bool** eq/ne (no coercion), **`add`**, contains (str operand type guard), and ordering in `operator-str-scalar.test.ts` (plans 384/406/468/470/474); **str+str** concatenation (new object) in `str-add.test.ts` (plan 638); **bytes+bytes** concatenation in `bytes-add.test.ts` (plan 654). bool↔str remaining binary in `operator-bool-str-remaining-binary.test.ts`. **float↔str** incompatible **`truediv`**, **`floordiv`**, **`mod`**, **`divmod`**, **`pow`**, and str-float **`sub`**/**`mul`** follow the same both-order pattern (`operator-float-str-remaining-binary.test.ts`); **str↔float** eq/ne, **`add`**, contains, and ordering in `operator-str-float.test.ts` (plans 388/466/476). **bytes↔int/float/str** **`add`**, **`sub`**, **`truediv`**, **`floordiv`**, and **`mod`** reject incompatible pairs in both orders (`operator-bytes-remaining-cross-type.test.ts`; eq/ne and **`int * bytes`** / **`bytes * int`** mul repeat in `operator-bytes-scalar-cross-type.test.ts`, plan 845; **str↔bytes** eq/ne, contains, and ordering in `operator-str-bytes-cross-type.test.ts`, plan 390/430/458/462/464). **bool↔str** **`sub`**, **`truediv`**, **`floordiv`**, **`mod`**, **`divmod`**, and **`pow`** use the same both-order **`TypeError`** pattern (`operator-bool-str-remaining-binary.test.ts`, plan 392/404/474). **`list.__iadd__`** accepts **tuple** operands (extend in place, plan 374; `sequence-iadd.test.ts`); **`list + tuple`** still raises via dispatch (`sequence-add.test.ts`). **List↔tuple** and **list/tuple↔bytes** cross-type **`+`**, **`*`**, **`+=`**, **`*=`**, **`eq`/`ne`**, ordering, and **`list - list`** are canonical in **`sequence-*`** files (plans 634–690; §8.6 table — supersedes removed `operator-list-tuple-cross-type.test.ts`). **Dict/list/tuple/slice/set/frozenset** container↔container add/eq/ordering/mul, set/frozenset↔bytes, list↔dict mul, and slice↔int ordering are in `operator-container-cross-type.test.ts` (plans 376–448). **Dict↔bytes/int/slice** eq/ne non-coercion is in `operator-container-scalar-cross-type.test.ts` (plans 436–438). Inplace **`+=`** on dict/list/set with incompatible container rhs is in `operator-inplace-cross-type.test.ts` (plan 432). Cross-type **`lt`/`le`/`gt`/`ge`** `TypeError` matrices for built-in pairs are registered via **`registerCrossTypeOrderingRejects`** in `test/cpython-derived/helpers/cross-type-ordering.ts` (plans 452–476): `operator-container-cross-type.test.ts`, `sequence-ordering-cross-type.test.ts` (list↔tuple), `operator-str-scalar.test.ts` (str↔int/bool ordering), `operator-str-float.test.ts`, `operator-bytes-remaining-cross-type.test.ts` (bytes↔int/float/bool ordering only), and `operator-str-bytes-cross-type.test.ts`. **`richcmp-incomparable.test.ts`** keeps a bespoke ordering loop for user types that return **`NotImplemented`** (distinct from built-in cross-type `TypeError` messages).

`[REPO]` Builtin **`__format__`** (plans 228–252, 900): **int**, **str**, **float**, **bool**, **bytes**, **complex**, **NoneType**, **list**, **tuple**, **dict**, **slice**, **set**, and **frozenset** implement explicit `Hook.format` — empty format spec returns `repr`-equivalent text; non-empty spec raises `TypeError: unsupported format string passed to ….__format__` (same pattern as `bytes.__format__`). Types without a hook fall back to `format()` repr-only path (`operator-format-evidence.test.ts` uses a repr-only user class). **`str.format`** / **`format_map`** field integration for bool/bytes and container empty-spec fields (including frozenset) is covered in `str-format.test.ts`. **`int`** implements explicit **`__bool__`**: 0 is falsy, any non-zero int is truthy (plan 338; `int-bool.test.ts`). **`float`** implements explicit **`__bool__`**: 0.0 is falsy, any non-zero float is truthy (plan 338; `float-bool.test.ts`). **`bool`** implements explicit **`__bool__`**: `False` is falsy, `True` is truthy (plan 338; `bool-bool.test.ts`). **`NoneType`** implements explicit **`__bool__`**: `None` is always falsy (plan 342; `none-bool.test.ts`). **`slice`** implements explicit **`__bool__`**: all slice objects are truthy, including empty-range and zero-step slices (plan 346; `slice-bool.test.ts`). **`str`** implements **`__reversed__`** via `makeReversedIterator`, yielding one-character strings from last index to first (plan 306; `str-reversed.test.ts`). **`str`** implements explicit **`__bool__`**: empty str is falsy, any non-empty str is truthy (plan 334; `str-bool.test.ts`). **`tuple`** implements **`__reversed__`** via `makeReversedIterator`, yielding elements from last index to first (plan 310; `tuple-reversed.test.ts`). **`tuple`** implements explicit **`__bool__`**: empty tuple is falsy, any non-empty tuple is truthy (plan 322; `tuple-bool.test.ts`). **`list`** implements **`__reversed__`** via `list_reverseiterator`, yielding elements from last index to first (plan 314; `list-reversed.test.ts`). **`list`** implements explicit **`__bool__`**: empty list is falsy, any non-empty list is truthy (plan 318; `list-bool.test.ts`). **`dict`** implements explicit **`__bool__`**: empty dict is falsy, any non-empty dict is truthy (plan 326; `dict-bool.test.ts`). **`set`** implements explicit **`__bool__`**: empty set is falsy, any non-empty set is truthy (plan 330; `set-bool.test.ts`). **`frozenset`** implements explicit **`__bool__`**: empty frozenset is falsy, any non-empty frozenset is truthy (plan 330; `frozenset-bool.test.ts`). **`frozenset`** and **`set`** compare equal when element-wise `eq()` matches (plan 254); see `frozenset-set-eq.test.ts`. **`frozenset`** is hashable via order-independent XOR mixing (plan 258; `set` remains unhashable). **`frozenset`** and **`set`** support `|`, `&`, `-`, `^` with cross-type operands; frozenset lhs yields frozenset, set lhs yields set (plan 260; `frozenset-set-algebra.test.ts`, including hash+eq equal keys plan 618). **`frozenset`** implements **`__iter__`** via `frozenset_iterator` (plan 264; `frozenset-iter.test.ts`). **`frozenset`** and **`set`** support subset/superset ordering (`<=`, `<`, `>=`, `>`) with cross-type set-like operands via shared helpers (plan 266; `frozenset-set-ordering.test.ts`, including hash+eq equal keys plan 612). **`set`** inplace `|=`, `&=`, `-=`, `^=` mutate the backing set in place and accept frozenset operands; frozenset has no inplace ops (plan 270; `set-frozenset-inplace.test.ts`, including hash+eq equal keys plan 616). **`set`** and **`frozenset`** expose **`issubset`**, **`issuperset`**, and **`isdisjoint`** with cross-type set-like operands; non-set-like rhs raises **`TypeError`** (plan 274; `frozenset-set-methods.test.ts`, including hash+eq equal keys plan 610). **`set`** supports **`add`**, **`remove`**, **`discard`**, **`pop`**, **`clear`**, **`copy`**, **`update`**, **`intersection_update`**, **`difference_update`**, and **`symmetric_difference_update`** (set/frozenset or iterable operands; inplace updates use hash+eq membership, plan 594; `set-named-update-methods.test.ts`); **`frozenset.copy()`** returns a shallow duplicate (plan 278; `set-mutation.test.ts`). **`set`** and **`frozenset`** expose **`union()`**, **`intersection()`**, **`difference()`**, and **`symmetric_difference()`** with cross-type operands; lhs type determines result type (plan 282; `frozenset-set-named-algebra.test.ts`, including hash+eq equal keys plan 614). **`bytes`** implements **`__iter__`** via `makeSequenceIterator`, yielding **`int`** elements (0–255) through the existing integer `__getitem__` path (plan 286; `bytes-iter.test.ts`). **`bytes`** is hashable via the same 31-polynomial rolling hash as **`str`**, applied to byte values; empty bytes hash to **`0`** (plan 290; `bytes-hash.test.ts`). **`bytes.__bytes__`** returns **`self`**, so the **`bytes()`** builtin accepts bytes objects with identity semantics (plan 294; `bytes-bytes.test.ts`). **`bytes`** implements explicit **`__bool__`**: empty bytes are falsy, any non-empty bytes (including **`b'\x00'`**) are truthy (plan 298; `bytes-bool.test.ts`). **`bytes`** implements **`__reversed__`** via `makeReversedIterator`, yielding **`int`** elements (0–255) from last index to first (plan 302; `bytes-reversed.test.ts`).

**Evidence** (repo-relative `test/cpython-derived/` paths; consolidated operator layout plans 384–454):

- **Cross-type ordering helper:** `helpers/cross-type-ordering.ts` — shared `lt`/`le`/`gt`/`ge` bidirectional `TypeError` registration (plans 452–476); consumers listed in §8.15 prose above. **`richcmp-incomparable.test.ts`** is intentionally not on this helper.
- **Operator cross-type:** `operator-bool-float.test.ts`, `operator-bool-str-remaining-binary.test.ts`, `operator-bytes-conversion.test.ts`, `operator-bytes-cross-type.test.ts`, `operator-bytes-remaining-cross-type.test.ts`, `operator-bytes-scalar-cross-type.test.ts`, `operator-container-cross-type.test.ts`, `operator-container-scalar-cross-type.test.ts`, `operator-float-str-remaining-binary.test.ts`, `operator-format-evidence.test.ts`, `operator-inplace-cross-type.test.ts`, `operator-int-bitwise-float.test.ts`, `operator-int-bool.test.ts`, `operator-int-float.test.ts`, `operator-int-shift.test.ts`, `operator-int-str-remaining-binary.test.ts`, `operator-matmul-evidence.test.ts`, `operator-numeric-conversion-evidence.test.ts`, `operator-pow-mod.test.ts`, `operator-rounding-evidence.test.ts`, `operator-str-bytes-cross-type.test.ts`, `operator-str-float.test.ts`, `operator-str-scalar.test.ts`, `operator-unary-evidence.test.ts`, `operator-zerodivision.test.ts`
- **Inplace operator evidence (plan 920 audit P3; plan 432):** augmented-assignment canonical homes — monolithic `operator-inplace-cross-type` split deferred per audit §4:
  - **`operator-inplace-cross-type.test.ts`** — scalar↔str/bytes inplace `TypeError` matrix (both orders); container dict/list/set `+=` rejects (plans 400–424, 432)
  - **`sequence-iadd.test.ts`** — list `+=` tuple extend (plan 374) and scalar `+=` rejects (plans 656–658, 686)
  - **`sequence-imul.test.ts`** — list `*=` in-place repeat and cross-type `*=` rejects (plans 717, 719)
  - **`sequence-sub.test.ts`** — list `-=` type mismatches (plans 694–701)
  - **`operator-complex-inplace-cross-type.test.ts`** — complex inplace cross-type rejects; bool `//=`/`%=` complex (plans 910, 914)
  - **`set-frozenset-inplace.test.ts`** — set `|=`, `&=`, `-=`, `^=` with frozenset operands (plans 270, 616)
- **Sequence operators (§8.6, plans 634–690):** `sequence-add.test.ts`, `sequence-iadd.test.ts`, `sequence-imul.test.ts`, `sequence-mul-cross-type.test.ts`, `sequence-sub.test.ts`, `sequence-eq-cross-type.test.ts`, `sequence-ordering-cross-type.test.ts` (supersedes removed `operator-list-tuple-cross-type.test.ts`, plan 690).
- **Sequence repeat / bool truthiness / reversed:** `sequence-repeat-bool.test.ts`, `sequence-repeat-index.test.ts`, `sequence-repeat-nonint.test.ts`, `dict-bool.test.ts`, `float-bool.test.ts`, `frozenset-bool.test.ts`, `int-bool.test.ts`, `list-bool.test.ts`, `list-reversed.test.ts`, `none-bool.test.ts`, `set-bool.test.ts`, `slice-bool.test.ts`, `tuple-bool.test.ts`, `tuple-reversed.test.ts`, `bool-bool.test.ts`
- **Codec argument guards (plans 478/482):** `str.encode` / `bytes.decode` require `str` `encoding` and `errors` kwargs; unknown encoding → `LookupError`; unknown handler → `ValueError` — `str-encode.test.ts`, `bytes-decode.test.ts`.
- **bytes.hex / fromhex errors (plans 480/482):** `bytes.fromhex` accepts `str` or `bytes`; arg type guard; `bytes.hex` sep length/type errors — `bytes-hex-fromhex.test.ts`.
- **str / bytes API:** `str-encode.test.ts`, `str-format.test.ts`, `str-reversed.test.ts`, `str-bool.test.ts`, `str-builtin.test.ts`, `bytes-builtin.test.ts`, `int-builtin.test.ts`, `int-bit-length.test.ts`, `int-bytes-conversion.test.ts`, `int-as-integer-ratio.test.ts`, `int-bit-count.test.ts`, `int-numeric-roundtrip.test.ts`, `bytes-iter.test.ts`, `bytes-hash.test.ts`, `bytes-bytes.test.ts`, `bytes-bool.test.ts`, `bytes-reversed.test.ts`, `bytes-decode.test.ts`, `bytes-join.test.ts`, `bytes-split.test.ts`, `bytes-rsplit.test.ts`, `bytes-startswith-endswith.test.ts`, `bytes-removeprefix-removesuffix.test.ts`, `bytes-expandtabs.test.ts`, `bytes-hex-fromhex.test.ts`, `bytes-predicates.test.ts`, `bytes-translate.test.ts`, `bytes-isascii-contains.test.ts`, `bytes-partition.test.ts`, `bytes-splitlines.test.ts`, `bytes-strip.test.ts`, `bytes-find.test.ts`, `bytes-index.test.ts`, `bytes-count.test.ts`, `bytes-replace.test.ts`, `bytes-upper-lower.test.ts`, `bytes-capitalize.test.ts`, `bytes-swapcase.test.ts`, `bytes-center.test.ts`, `bytes-ljust-rjust.test.ts`, `bytes-zfill.test.ts`, `bytes-title.test.ts`, `bytes-getitem-compare.test.ts`, `bytes-slice-index.test.ts`
- **Set / frozenset:** `frozenset-hash.test.ts`, `frozenset-set-algebra.test.ts`, `frozenset-set-eq.test.ts`, `frozenset-iter.test.ts`, `frozenset-set-ordering.test.ts`, `set-frozenset-inplace.test.ts`, `frozenset-set-methods.test.ts`, `set-mutation.test.ts`, `set-named-update-methods.test.ts`, `set-membership.test.ts`, `set-algebra-membership.test.ts`, `frozenset-set-named-algebra.test.ts`

Vitest files above port thin matrices from CPython `Lib/test/test_operator.py` / rich-compare spirit. Golden keys: `int_float_*`, `bool_int_*`, `bool_float_*`. **Remaining gap:** PEP 3118 buffer protocol not implemented; niche bytes/str API edge cases may still differ from CPython; float↔str pairs are not coerced beyond the evidenced binary slots.

### 8.16 `types.MappingProxyType` and readonly dict views

CPython exposes **readonly mapping views** on class and instance namespaces — notably `types.MappingProxyType` wrapping a dict (used for `type.__dict__`, `mappingproxy` objects in the descriptor tests, and similar). pyrt stores type and instance namespaces as mutable **`Map<string | symbol, unknown>`** on `PyType` and `PyObject`; there is no proxy object that blocks mutation while forwarding lookups.

**Status:** **Intentionally out of scope** unless a future shim is added. Embedders needing immutability should wrap or freeze their own dict-like structures before passing them to `makeClass`. **Reference mining:** CPython `Lib/test/test_descr.py` and `Lib/test/test_types.py` (see `docs/knowledgebase/50-execution/tier-b-lib-test-reference.md`); do not port mappingproxy wholesale.

**Golden evidence:** Class lifecycle hooks (`init_subclass_called`, `set_name_called`) and descriptor precedence (`descriptor_data_wins`, `descriptor_nodata_loses`) are covered in the golden harness; mappingproxy behavior is not.

### 8.17 Sequence subscript and numeric division exceptions

`str`, `bytes`, `list`, and `tuple` `__getitem__` / list `__setitem__` / `__delitem__` raise typed runtime exceptions rather than generic `Error`. **`list`** supports slice **`__setitem__`** (contiguous and extended step) and slice **`__delitem__`** with `pyList`/`pyTuple` RHS (plan 854; `list-slice-mutation.test.ts`). **`list.append`**, **`extend`**, **`insert`**, and **`pop`** (plan 855; `list-mutation-methods.test.ts`). **`list.index`**, **`count`**, **`clear`**, and **`copy`** (plan 856; `list-index-clear-copy.test.ts`). **`tuple.index`** and **`count`** (plan 861; `tuple-index-count.test.ts`). **`list.remove`** and **`reverse`** (plan 857; `list-remove-reverse.test.ts`). **`list.sort`** / builtin **`sorted`** with optional callable `key` and `reverse` (plans 858–860; `list-sort.test.ts`, `sorted-builtin.test.ts`). Builtin **`min`** / **`max`** with optional callable `key` and empty-sequence `default` (plans 862/867; `min-max-builtin.test.ts`). Builtin **`any`** / **`all`** (plan 863; `any-all-builtin.test.ts`). Builtin **`sum`** (plan 864; `sum-builtin.test.ts`). Builtin **`enumerate`** (plan 865; `enumerate-builtin.test.ts`). Builtin **`zip`** with optional trailing `strict` bool (plans 866/873; `zip-builtin.test.ts`). Builtin **`map`** (plan 868; `map-builtin.test.ts`). Builtin **`filter`** (plan 869; `filter-builtin.test.ts`). Builtin **`list`** / **`tuple`** constructors (plan 870; `list-tuple-builtin.test.ts`). Builtin **`set`** constructor (plan 871; `set-builtin.test.ts`). Builtin **`frozenset`** constructor (plan 872; `frozenset-builtin.test.ts`). Builtin **`dict`** constructor (plan 874; `dict-builtin.test.ts`). Builtin **`range`** with **`reversed(range)`** and **`range.__eq__`** (unhashable; plans 875–877; `range-builtin.test.ts`). Builtin **`chr`** / **`ord`** (plan 878; `chr-ord-builtin.test.ts`). Builtin **`bin`** / **`oct`** / **`hex`** (plan 879; `bin-oct-hex-builtin.test.ts`). Builtin **`ascii`** (plan 880; `ascii-builtin.test.ts`). **`str.__repr__`** CPython quoting/escapes (plan 881; `str-repr.test.ts`). Builtin **`str`** constructor with **`str(bytes, encoding[, errors])`** decode (plans 882–883; `str-builtin.test.ts`; protocol helper exported as **`strProtocol`**). Builtin **`bytes`** constructor with **`bytes(str, encoding[, errors])`** encode (plan 884; `bytes-builtin.test.ts`; protocol helper exported as **`bytesProtocol`**). Builtin **`int`** constructor (plan 885; `int-builtin.test.ts`; protocol helper **`intProtocol`**); non-finite float→int uses **`PyOverflowError`** for infinity and **`PyValueError`** for NaN (plan 890). **`int.bit_length()`** (plan 906; `int-bit-length.test.ts`). **`int.to_bytes()`** / **`int.from_bytes()`** (plan 907; `int-bytes-conversion.test.ts`). **`int.as_integer_ratio()`** (plan 911; `int-as-integer-ratio.test.ts`). **`int.bit_count()`** (plan 912; `int-bit-count.test.ts`). Int **`to_bytes`/`from_bytes`/`as_integer_ratio`** safe-integer roundtrip (plan 913; `int-numeric-roundtrip.test.ts`). Builtin **`float`** constructor (plan 889; `float-builtin.test.ts`; protocol helper **`floatProtocol`**). **`float.is_integer()`** and **`float.as_integer_ratio()`** including bigint components and repr for `0.1` (plans 905, 915, 917; `float-integer-ratio.test.ts`). **`float.hex()`** / **`float.fromhex()`** (plan 908; `float-hex-fromhex.test.ts`). Builtin **`bool`** constructor (plan 892; `bool-builtin.test.ts`; truthiness helper **`boolProtocol`**). Builtin **`complex`** constructor (plan 894; `complex-builtin.test.ts`; protocol helper **`complexProtocol`**). **`complex.real`** / **`complex.imag`** return **`float`**; **`conjugate()`** bound method; readonly member assignment (plan 903; `complex-attributes.test.ts`). Complex↔**`str`**/**`list`**/**`bytes`** binary ops reject with **`TypeError`**; complex-left **`//`**/**`%`** use floor message (plan 904; `operator-complex-cross-type-binary.test.ts`). Complex inplace cross-type rejects including bool `//=`/`%=` (plans 910, 914; `operator-complex-inplace-cross-type.test.ts`). Complex scalar **`+`** / **`-`** / **`*`** with int/float/bool and complex (plans 895, 916; `operator-complex-scalar.test.ts`). Complex **`/`** and unary **`+`**/`-`/`abs()` (plan 896; `operator-complex-div-unary.test.ts`). Complex **`==`**/**`!=`** and **`**`** with int/float/complex exponents (plans 897–899; `operator-complex-eq-pow.test.ts`, `operator-complex-pow-floordiv.test.ts`, `operator-complex-pow-complex.test.ts`). Complex **`//`**/**`%`** raise `can't take floor of complex number.` when complex is left operand; scalar `//`/`%` complex unsupported (plan 901; `operator-scalar-complex-pow-floordiv.test.ts`); int/float **`**`** complex via **`complex.__rpow__`** (plan 901); scalar **`**`** complex edge cases bool/`0**0j`/negative base (plan 909; `operator-scalar-complex-pow-edges.test.ts`); scalar **`/`** complex via **`complex.__rtruediv__`** (plan 902); three-arg **`pow(..., mod)`** with any complex operand → **`ValueError: complex modulo`** (plan 902); ordering unsupported; **`hash`** raises unhashable `TypeError` (plan 900; `complex-hash.test.ts`); empty-spec **`__format__`** (plan 900).

- Non-integer keys → **`PyTypeError`** (`list indices must be integers`, `tuple indices must be integers`, `string indices must be integers`, `byte indices must be integers or slices`; str `__contains__` with non-str operand uses CPython-style `'in <string>' requires string as left operand, not <typename>` (e.g. `int`, `bytes`; `operator-str-scalar.test.ts`, `operator-str-bytes-cross-type.test.ts`, plan 462). Integer subscripts accept **`pyInt`**, **`bool`**, and **`__index__`** on `str`, `bytes`, `list`, and `tuple` (plans 849–850; `str-getitem-slice.test.ts`, `sequence-index-type.test.ts`). **`slice`** bounds may use the same index types; resolved at subscript via `resolvedSliceFields` (plan 851; `slice-with.test.ts`). **`slice.indices(length)`** returns normalized `(start, stop, step)` as a tuple of ints (plan 852; `slice-indices.test.ts`). **`slice.start` / `stop` / `step`** attributes expose stored bounds (`None` when omitted; plan 853; `slice-attributes.test.ts`).
- Out-of-range integer keys → **`PyIndexError`** (`list index out of range`, `list assignment index out of range`, `list deletion index out of range` for `__delitem__`; `tuple index out of range`, `string index out of range`, bytes `index out of range`, etc.; plan 352 Vitest for list `delItem`; plan 358 docs for bytes `getitem`).
- Missing **`dict`** keys → **`PyKeyError`** with repr-shaped key text (`'missing'` for str keys, `2` for int keys; plan 368).
- Missing **`set.remove`** element → **`PyKeyError`** with repr-shaped item text (plan 370).

Int and float `__truediv__`, `__floordiv__`, and `__mod__` (plus int/float `__divmod__`) raise **`PyZeroDivisionError`** with CPython message text on zero divisors (float `divmod` uses `division by zero`; plan 350). Int three-arg `pow` with `mod == 0` raises **`PyValueError`** (`pow() 3rd argument cannot be 0`). Int `__lshift__` / `__rshift__` with negative shift count raise **`PyValueError`** (`negative shift count`).

**Evidence:** `test/cpython-derived/operator-str-scalar.test.ts`, `test/cpython-derived/bytes-getitem-compare.test.ts`, `test/cpython-derived/sequence-index-type.test.ts`, `test/cpython-derived/dict-keyerror.test.ts`, `test/cpython-derived/operator-zerodivision.test.ts`, `test/cpython-derived/operator-pow-mod.test.ts`, `test/cpython-derived/operator-int-shift.test.ts`, `test/core/method.test.ts` (pre-init `getMethodType` → **`PyRuntimeError`**, plan 460). **Golden harness:** `scripts/golden/errors.ts` — `GoldenHarnessError` / `KeyParityError` for harness failures (plan 472); not user-facing `Py*` types. **Remaining gap:** Vitest protocol mocks may still use plain JS `Error` for simulated `IndexError`; user-facing builtin slots and `getMethodType()` bootstrap use typed `Py*` exceptions where evidenced.

---

## 9. Not supported: Python language and execution model

This is intentionally exhaustive at the **category** level (listing every stdlib module would be infinite maintenance; the correct statement is: **stdlib is not included** except where a tiny builtin wrapper exists).

### 9.1 Parsing, compilation, modules, imports

- No tokenizer/parser for Python syntax.
- No `import`, `importlib`, packages, relative imports, namespace packages.
- No `sys.modules`, module objects as first-class runtime entities.
- No `__name__`, `__package__`, `__spec__`, `__path__`, `__loader__` module layout model.

### 9.2 Bytecode VM, frames, tracing, introspection of execution

- No Python bytecode interpreter.
- No `frame` objects, `f_locals`, `f_back`, `traceback` objects with Python semantics.
- No `sys.settrace`, `sys.setprofile`, `inspect` fidelity.

### 9.3 Exceptions as a language feature

- No `try` / `except` / `finally` / `else` as a runtime feature.
- No `raise`, `raise ... from`, exception chaining fields (`__context__`, `__cause__`).
- No `BaseExceptionGroup` / `except*` (PEP 654 ecosystem).

pyrt defines a **small** set of error classes for library signaling (`core/errors.ts`, re-exported from `core/lookup.ts`), but this is not Python’s hierarchy.

### 9.4 Generators and coroutines as Python objects

- No `yield`, `yield from`, generator objects, `GeneratorExit`, `close`, `throw`, `send` semantics.
- No `async def` as Python coroutine objects; no `await` bytecode; no `asyncio` event loop integration.

### 9.5 `eval`, `exec`, `compile`, `globals`, `locals`

Not supported.

### 9.6 Garbage collection, cycles, `weakref`, finalization ordering

JS GC is tracing; Python has reference counting + cycle GC + highly specified semantics around `__del__` and weakrefs. pyrt does not model this.

### 9.7 The entire Python standard library

Not supported: everything in the Python docs library reference unless explicitly reimplemented in this repo (it generally is not).

Use: <https://docs.python.org/3/library/index.html> as the umbrella reference.

---

## 10. Not supported: data model and stdlib (exhaustive checklist)

This section lists major **data model** items from Python’s reference **\[1\]** that are **not implemented** in pyrt (even if some names exist in Python docs). If an item is “partial”, it is listed in **Section 8** instead.

### 10.1 Type and object internals

- **`__dict__` on types as a full mapping object** with Python dict semantics: pyrt uses `Map` on `PyType.typeDict`, not a Python-like dict object.
- **`__weakref__` slot**, weak references, and weak-key dictionaries.
- **`__slots__` advanced features**: empty tuple semantics, extending slotted parents, `__dict__` slot string, copying/gc nuances — only a simplified `slotNames` + `slotValues` path exists.
- **`__getstate__` / `__setstate__` / `__reduce__` / `__reduce_ex__`**: pickling protocol not implemented.

### 10.2 Attribute access edge cases

- Full **`__getattribute__`** semantics matching all CPython C-level fast paths and exception normalization: partial/simplified.
- **`object.__getattribute__`** bypass patterns, `super()` proxy attribute access: not implemented.
- **`__slots__` and `__setattr__` interaction** beyond basic enforcement: partial.

### 10.3 Rich comparison completeness

- **`NotImplemented`** handling for comparisons beyond the implemented paths: partial.
- **`@functools.total_ordering`**: not applicable (stdlib decorator not present), and pyrt does not infer ordering methods.

### 10.4 Numeric tower completeness

- **`fractions.Fraction`**, **`decimal.Decimal`**, **`numbers` ABC registration**: not present.
- **`__divmod__` / `__rdivmod__` parity** for non-int builtin types: partial (depends on types involved).

### 10.5 Iterator protocol completeness

- **`StopIteration.value` propagation** through generators: not modeled as Python generators.
- **`Iterator` ABC / `collections.abc`**: not present.

### 10.6 Mapping / sequence completeness

- **`collections.UserDict` / `ChainMap` / `Counter` / …**: not present.
- **`keys()` / `values()` / `items()` views**: basic live views on `dict` (plan 606); full CPython view algebra / repr edge cases remain partial.
- **`types.MappingProxyType` / `mappingproxy`**: not implemented; see **§8.16**.
- **`__reversed__` for arbitrary mappings**: only what user types implement.

### 10.7 Context managers completeness

- Exception suppression rules (`__exit__` return true/false) are only as correct as the embedder uses `exit(...)`; there is no `with` statement runtime wrapping exceptions automatically.

### 10.8 Class and metaclass completeness

- **`type.__prepare__` default returning dict-like insertion ordering nuances**: simplified.
- **Metaclass `__call__` / `__new__` orchestration** for class statement: partial/incomplete vs CPython.
- **`__init_subclass__` keyword passing** from class headers: pyrt passes `opts.kwds` only at `makeClass` callsite; not a parser.

### 10.9 Pattern matching

- No `match` / `case`, no `__match_args__`, no pattern classes, no `MatchError` integration.

See: **\[18\]**.

### 10.10 Annotations

- No `__annotations__` / `__annotate__` (3.13+) wiring on types, no `typing` runtime generic instantiation beyond whatever user manually implements.

### 10.11 `__sizeof__`, `sys.getsizeof`

Not implemented.

### 10.12 `operator` module and `inspect` module

Not implemented as libraries; some operations exist as functions (`dispatch/operators/`, `dispatch/protocols.ts`) but are not drop-in compatible with Python’s `operator` module naming or edge cases.

---

## 11. JavaScript / ECMAScript limits relevant to parity

Even a perfect TS library cannot turn JS into Python without a compiler or interpreter:

- **Operators (`+`, `==`, `in`, `await`, …)** are language-defined and not user-overridable for arbitrary objects. See **\[12\], \[13\], \[14\]**.
- **Truthiness (`if (x)`)** is not customizable.
- **`typeof`**, primitive literals, and many syntactic forms have no Python-like dunder.
- **Proxies** can emulate some attribute behavior but cannot transparently emulate all exotic builtins and private fields semantics. See **\[12\], \[13\]**.

pyrt’s explicit-function approach is therefore aligned with JS reality.

---

## 12. Verification in this repository

- **Unit tests:** `test/**/*.test.ts` (Vitest). Run: `npm test`.
- **Golden harness:** `scripts/golden/` (CPython reference vs pyrt). Run: `npm run golden` (CI matrix: Python 3.10, 3.12, 3.14). **32 case keys per profile version** (3.9–3.14): MRO/`isinstance`, rich compare, slice, contains, int↔float / int↔bool / bool↔float ops, scalar non-coercion (`str_int_eq_false`, `str_bytes_eq_false`, `str_int_add_raises`), sequence bool repetition (`seq_bool_*`, `str_bool_*`, `tuple_bool_*`), descriptor precedence, class hooks (`init_subclass_called`, `set_name_called`), plus version-gated `match_args` (3.10+), buffer (3.12+), `annotate_x` (3.14+). Key parity: `npm run golden:keys`, `test/golden/key-parity.test.ts`.
- **Examples:** `examples/python-vs-js.ts`. Run: `npm run examples`.
- **Typecheck:** `npm run check`.

These verify **project intent**, not full CPython conformance.

---

## 13. Maintainer guidance: how to extend without false claims

1. **Treat `Slot`/`Hook` as a contract**, not a guarantee of CPython parity.
2. When adding a feature, cite **Python reference sections** **\[1–7\]** (and C API docs **\[8–11\]** where relevant) and the **CPython source file** implementing the behavior (see **Section 2**).
3. Add **golden tests** that compare against a pinned CPython version for the narrow behavior you claim.
4. Maintain this document: move items from “not supported” → “partial” → “supported” with explicit caveats.

---

## Appendix A — Complete `Slot` dunder inventory (81 strings)

These are the **dunder strings** keyed by `Slot.*` symbols in [`src/runtime/slots.ts`](../src/runtime/slots.ts). They are intended to mirror CPython’s `slotdefs[]` surface in [`Objects/typeobject.c`](https://github.com/python/cpython/blob/main/Objects/typeobject.c) (see **Section 2**).

Canonical alphabetical list (81 entries; matches `SLOT_DUNDER_NAMES` / `Object.keys(Slot).length` at `SLOTDEF_COUNT` in the same file):

- `__abs__`
- `__add__`
- `__aiter__`
- `__and__`
- `__anext__`
- `__await__`
- `__bool__`
- `__buffer__`
- `__call__`
- `__contains__`
- `__del__`
- `__delattr__`
- `__delete__`
- `__delitem__`
- `__divmod__`
- `__eq__`
- `__float__`
- `__floordiv__`
- `__ge__`
- `__get__`
- `__getattr__`
- `__getattribute__`
- `__getitem__`
- `__gt__`
- `__hash__`
- `__iadd__`
- `__iand__`
- `__ifloordiv__`
- `__ilshift__`
- `__imatmul__`
- `__imod__`
- `__imul__`
- `__index__`
- `__init__`
- `__int__`
- `__invert__`
- `__ior__`
- `__ipow__`
- `__irshift__`
- `__isub__`
- `__iter__`
- `__itruediv__`
- `__ixor__`
- `__le__`
- `__len__`
- `__lshift__`
- `__lt__`
- `__matmul__`
- `__mod__`
- `__mul__`
- `__ne__`
- `__neg__`
- `__new__`
- `__next__`
- `__or__`
- `__pos__`
- `__pow__`
- `__radd__`
- `__rand__`
- `__rdivmod__`
- `__release_buffer__`
- `__repr__`
- `__rfloordiv__`
- `__rlshift__`
- `__rmatmul__`
- `__rmod__`
- `__rmul__`
- `__ror__`
- `__rpow__`
- `__rrshift__`
- `__rshift__`
- `__rsub__`
- `__rtruediv__`
- `__rxor__`
- `__set__`
- `__setattr__`
- `__setitem__`
- `__str__`
- `__sub__`
- `__truediv__`
- `__xor__`

---

## Appendix B — `Hook` symbols (24 non-slot specials)

Defined in [`src/runtime/slots.ts`](../src/runtime/slots.ts) under `Hook` (each maps to a dunder string via `Symbol("...")`):

| `Hook` field | Python dunder |
|--------------|---------------|
| `bytes` | `__bytes__` |
| `format` | `__format__` |
| `complex` | `__complex__` |
| `round` | `__round__` |
| `trunc` | `__trunc__` |
| `floor` | `__floor__` |
| `ceil` | `__ceil__` |
| `dir` | `__dir__` |
| `lengthHint` | `__length_hint__` |
| `enter` | `__enter__` |
| `exit` | `__exit__` |
| `aenter` | `__aenter__` |
| `aexit` | `__aexit__` |
| `instancecheck` | `__instancecheck__` |
| `subclasscheck` | `__subclasscheck__` |
| `initSubclass` | `__init_subclass__` |
| `setName` | `__set_name__` |
| `prepare` | `__prepare__` |
| `mroEntries` | `__mro_entries__` |
| `classGetitem` | `__class_getitem__` |
| `missing` | `__missing__` |
| `reversed` | `__reversed__` |
| `matchArgs` | `__match_args__` (3.10+) |
| `annotate` | `__annotate__` (3.14+) |

---

## Appendix C — Python data model specials **not** represented as `Slot`/`Hook` keys in pyrt

This appendix is “exhaustive at the protocol-name level” for the **Language Reference’s special method namespace** that pyrt **does not** model as first-class `Symbol` registry entries. Some items can still be simulated manually (for example storing callables under arbitrary string keys in `typeDict`), but **there is no dedicated symbol, dispatch helper, or CPython-correct runtime** for them in this repository.

Names below are referenced from **Python Language Reference — Data model — Special method names** **\[1\]**, specifically the index section **Special method names** (<https://docs.python.org/3/reference/datamodel.html#special-method-names>).

### C.1 Lifecycle, allocation, and finalization

| Python method | pyrt status |
|----------------|------------|
| `__del__` | **Registry only** (`Slot.del`): **no** finalization/GC integration (see **Section 5.1**). |

### C.2 Copy/pickle-related protocols (stdlib-adjacent)

| Python method | pyrt status |
|----------------|------------|
| `__copy__`, `__deepcopy__` | **Not supported** (typically used via `copy` module). |
| `__getinitargs__`, `__getnewargs__`, `__getnewargs_ex__` | **Not supported** (pickle protocol). |
| `__reduce__`, `__reduce_ex__` | **Not supported** (pickle protocol). |
| `__getstate__`, `__setstate__` | **Not supported** (pickle protocol). |

### C.3 Introspection and debugging hooks

| Python method | pyrt status |
|----------------|------------|
| `__sizeof__` | **Not supported** (`sys.getsizeof` not modeled). |

### C.4 `super()` and compiler-inserted class cells

| Python concept | pyrt status |
|----------------|------------|
| `super()` / `super(type, obj)` / zero-argument `super` | **Not supported** (requires frames / `__classcell__` lowering). See **\[3\]**. |

### C.5 Pattern matching

| Python concept | pyrt status |
|----------------|------------|
| `__match_args__` and pattern matching behavior | **Not supported**. See **\[18\]**. |

### C.6 Annotations and typing runtime

| Python attribute / method | pyrt status |
|---------------------------|------------|
| `__annotations__`, `__annotate__` (3.13+), runtime generic instantiation as in `typing` | **Not supported** as type-system features. See PEP ecosystem **\[15–19\]**. |

### C.7 Coroutine object protocol beyond hooks

Python documents coroutine-specific behaviors beyond “has `__await__`”.

| Python method | pyrt status |
|----------------|------------|
| coroutine `send`, `throw`, `close` | **Not supported** as Python coroutine objects (no generator/coroutine VM). |

### C.8 Type and class introspection attributes (`__module__`, `__qualname__`, `__doc__`, …)

| Python attribute | pyrt status |
|------------------|------------|
| `__name__`, `__qualname__`, `__module__`, `__doc__` on classes/functions as language-managed metadata | **Not modeled** as CPython-managed fields; `PyType` has a `name` string only. |

### C.9 `types` / `abc` integration

| Python concept | pyrt status |
|----------------|------------|
| `types.FunctionType`, `types.MethodType`, `abc.ABCMeta` machinery | **Not supported** (you can approximate patterns manually). |
| `types.MappingProxyType`, readonly `mappingproxy` on namespaces | **Not supported**; see **§8.16**. |

### C.10 `__objclass__` (optional descriptor metadata)

| Python attribute | pyrt status |
|------------------|------------|
### C.11 Weak references and GC-visible resurrection

| Python concept | pyrt status |
|----------------|------------|
| `__weakref__` slot, `weakref` module behavior, resurrection during cyclic GC | **Not supported** (JavaScript `WeakMap`/`WeakRef` exist but are not wired to `PyObject` identity or `__del__`). |

---

## Appendix D — pyrt source index (where to read the implementation)

| Concern | Primary file |
|---------|----------------|
| Public exports | `src/index.ts` |
| Slot / hook symbol tables | `src/runtime/slots.ts` |
| `PyObject` / `PyType` / MRO | `src/runtime/object.ts` |
| Attribute + descriptor + `lookupSpecial` | `src/runtime/core/lookup.ts` |
| Operators / comparisons / conversions / repr | `src/runtime/dispatch/operators/` |
| Class creation / `isinstance` / `issubclass` / `setPyClass` | `src/runtime/class/class.ts` |
| Protocols (`call`, containers, iter, context, async surface) | `src/runtime/dispatch/protocols.ts` |
| Builtin wrappers (`pyInt`, …) | `src/runtime/builtins/` |
| Tests | `test/*.test.ts` |
| Narrative examples | `examples/python-vs-js.ts` |

---

## Document history

- **Initial exhaustive compatibility document** added for the `pyrt` repository, linking Python docs and CPython sources and enumerating major gaps.
