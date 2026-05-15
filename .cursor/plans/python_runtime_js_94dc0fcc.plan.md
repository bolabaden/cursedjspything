---
name: Python Runtime JS
overview: Build a high-performance TypeScript runtime that emulates CPython's object model and data-model hooks through explicit helper functions rather than native JavaScript operators. The implementation will target CPython 3.14 data-model semantics, pin the special-method inventory, and include exhaustive Python-to-TypeScript examples for metaclasses, descriptors, operators, containers, async/context protocols, and `__class__`-style reassignment.
todos:
  - id: scaffold
    content: Scaffold the TypeScript package, build/test scripts, public exports, and runtime folder layout.
    status: completed
  - id: slot-registry
    content: Create the exhaustive CPython slot and special-hook registry with idiomatic TypeScript names and source references.
    status: completed
  - id: object-model
    content: Implement `PyObject`, `PyType`, MRO/C3, descriptors, attribute lookup, and special lookup.
    status: completed
  - id: operators
    content: Implement rich comparison, identity, numeric, reflected, in-place, unary, conversion, hashing, and truthiness helpers.
    status: completed
  - id: class-system
    content: Implement metaclass/class creation hooks, `setName`, `initSubclass`, generic aliases, and `pyClass` reassignment constraints.
    status: completed
  - id: protocols
    content: Implement containers, item access, iteration, context managers, async protocols, call protocol, formatting, bytes, dir, and length hints.
    status: completed
  - id: examples-tests
    content: Write exhaustive Python-vs-TypeScript examples and targeted tests for every slot category and dispatch edge case.
    status: completed
isProject: false
---

# Python Object Model Runtime Plan

## Grounding
- Target CPython 3.14 data-model behavior as the compatibility reference.
- Verified from CPython `Objects/typeobject.c`: 94 slot table entries, 81 unique slot-backed special method names.
- Include non-slot special lookups from official docs/source: formatting, bytes, dir, length hints, context managers, class creation hooks, metaclass checks, descriptor/class attributes, annotations, pattern matching, and `__class__`/`__slots__` behavior.
- Use idiomatic TypeScript public names (`eq`, `is`, `add`, `getAttr`, `setAttr`, `pyClass`, `initSubclass`, `classGetItem`) while keeping an internal registry that maps exactly to CPython dunder names for documentation and examples.

## Implementation Shape
- Create a TypeScript package scaffold:
  - [package.json](package.json), [tsconfig.json](tsconfig.json), [vitest.config.ts](vitest.config.ts)
  - [src/index.ts](src/index.ts) public exports
  - [src/runtime/object.ts](src/runtime/object.ts) `PyObject`, `PyType`, identity, class metadata, instance dictionaries
  - [src/runtime/slots.ts](src/runtime/slots.ts) exhaustive slot registry and CPython mapping
  - [src/runtime/lookup.ts](src/runtime/lookup.ts) descriptor protocol, normal attribute lookup, and special-method lookup bypassing instance attrs
  - [src/runtime/operators.ts](src/runtime/operators.ts) `eq`, `lt`, `add`, `sub`, `mul`, `matmul`, reflected/in-place/unary/conversion helpers
  - [src/runtime/class.ts](src/runtime/class.ts) class creation, metaclass selection, MRO/C3, `__prepare__`, `__set_name__`, `__init_subclass__`, `__mro_entries__`, `__class__` reassignment constraints
  - [src/runtime/protocols.ts](src/runtime/protocols.ts) containers, iterators, context managers, async protocols, call protocol
  - [src/runtime/builtins.ts](src/runtime/builtins.ts) builtin object/type/bool/int/float/str/list/tuple/dict/set-ish behavior where required for examples
  - [examples/python-vs-js.ts](examples/python-vs-js.ts) exhaustive side-by-side examples
  - [test/*.test.ts](test) compatibility tests for every slot category

## Core Runtime Rules
- All runtime values become `PyValue`s; native JS primitives are wrapped at operation boundaries.
- Native operators are not used for Python semantics. For example, `eq(a, b)` implements rich comparison and `is(a, b)` implements Python identity.
- Special method lookup follows CPython's rule: implicit operations search the type/MRO and bypass instance dictionaries and normal `getAttribute` overrides.
- Normal attribute lookup follows descriptor precedence: data descriptor, instance dictionary, non-data descriptor, class attribute, `getAttrFallback`.
- Numeric dispatch implements left/reflected/subclass-priority/`NotImplemented` fallbacks, then in-place fallback rules.
- `pyClass(obj)` and `setPyClass(obj, newType)` provide idiomatic access to Python `__class__` behavior, including layout compatibility checks for slots.

## Exhaustive Coverage
- Slot-backed methods: implement all 81 unique CPython slot-backed dunders as registry entries and dispatchable hooks.
- Non-slot hooks: implement `bytes`, `format`, `dir`, `lengthHint`, `enter/exit`, `asyncEnter/asyncExit`, `instanceCheck`, `subclassCheck`, `classGetItem`, class creation hooks, descriptor hooks, annotation/pattern-match metadata access.
- Include examples for every category: lifecycle, class/metaclass creation, descriptors, attribute access, comparison, hashing, numeric ops, containers, iteration, async iteration, context managers, callable objects, conversion, formatting, and class reassignment.

## Verification
- Unit tests assert CPython-inspired dispatch order and fallback behavior for each protocol.
- Add generated inventory tests so the exported slot registry cannot omit any of the 81 verified slot-backed names.
- Add documentation examples that show Python source beside equivalent TypeScript helper calls.
- Explicitly document unavoidable non-goals: native JS operator interception, CPython refcount/finalizer timing, frame/traceback identity, C extension ABI, exact GC resurrection timing, and native host object semantics.