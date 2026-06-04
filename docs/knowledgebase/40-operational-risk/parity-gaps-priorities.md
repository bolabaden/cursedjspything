# CPython parity gaps and priorities

**Purpose:** Actionable gap list for embedders who want behavior as close to CPython as practical within pyrt’s library scope.  
**Authoritative matrix:** [COMPATIBILITY_AND_GAPS.md](../../COMPATIBILITY_AND_GAPS.md).  
**Python reference range:** 3.9–3.14 (slot anchor 3.14).

---

## Scope reminder

`[SYNTH]` pyrt emulates the **data model** (types, MRO, descriptors, special-method dispatch), not the Python language (parser, bytecode, imports, `super()`, generators, `asyncio`, stdlib).

`[REPO]` The **81 `Slot` names** and **24 `Hook` symbols** in `src/runtime/core/slots.ts` are largely present; gaps are **semantics**, **representation**, and **unverified dispatch paths**.

---

## Tier 1 — highest impact for behavioral parity

| # | Gap | `[REPO]` evidence | CPython expectation |
|---|-----|-------------------|---------------------|
| 1 | **`contains` on types without `__contains__`** | Fixed in `protocols.ts`, `list.ts`, `tuple.ts` via `eq()` | Membership uses equality |
| 2 | **Slice via `getItem`** | Fixed: `__getitem__(slice)` on list/tuple; `getItem` passes slice through | One slice object per subscript |
| 3 | **`lookupSpecial` and exotic callables** | `lookup.ts` supports descriptor `__get__`, plain `function`, and `PyObject` with `__call__` | Full CPython callable-object edge cases may still differ |
| 4 | **`instantiate` / `makeClass`** | `instantiate` uses `lookupSpecial` for `__new__`/`__init__`; `makeClass` still ≠ full `type.__call__` | Full metaclass pipeline |
| 5 | **Rich compare / `NotImplemented` edge cases** | Golden `rich_lt_reflected`, `rich_lt_both_not_impl_raises`; Vitest ordering/`eq` cases | Exotic MRO/reflected chains beyond golden fixtures |
| 6 | **`hash` coercion `\| 0`** | `compare.ts`; Vitest `__hash__` type check | Full integer hash tower / `hash`∘`eq` invariants |
| 7 | **`__bool__` must return JS boolean** | `compare.ts`; Vitest non-boolean `__bool__` | CPython legacy truthy `__bool__` paths |
| 8 | **Builtin cross-type ops (partial)** | `[REPO]` int↔float, int↔bool, bool↔float + golden keys; `boolType` bases `[intType]` (plan 026); str↔scalar in `operator-str-scalar.test.ts`; list/tuple operators in canonical `sequence-*` Vitest (plans 634–690; §8.6 table); container/scalar matrices in `operator-container-*`, `operator-inplace-cross-type`; niche pairs may still differ | CPython `PyNumber_*` / rich-compare coercion tower |
| 9 | **`makeClass` ≠ `type.__call__`** | `class/class.ts`, COMPATIBILITY §8.1 | Metaclass `__new__`, full creation protocol |
| 10 | **Golden harness coverage** | `[REPO]` `scripts/golden/` **32 keys/profile**; CI matrix 3.10/3.12/3.14; offline gate semantics in `pyrt-cases-version-gates.test.ts`; Tier A + Tier B cherry-picks | Broader protocol proof across versions |

---

## Tier 2 — partial features and version gates

| Area | Status | Notes |
|------|--------|-------|
| `__match_args__` | `[REPO]` Partial | Stored + `getMatchArgs()`; **no** `match`/`case` VM |
| `__buffer__` / PEP 688 | `[REPO]` Partial | `wrapBuffer`, minimal view; not `memoryview` / full lifecycle |
| `__annotate__` (3.14) | `[REPO]` Partial | `getAnnotations()` on demand; not PEP 649 evaluation timing |
| Bound methods | `[REPO]` Partial | `class/method.ts` + `lookupSpecial` for plain `function` and descriptor binding |
| `pyDict` / `pySet` | `[REPO]` Partial | PyObject keys use `dict-keys.ts`; JS primitives use `Map`/`Set` identity |
| `pyInt` | `[REPO]` Partial | JS `number`; no arbitrary precision |
| Async protocols | `[REPO]` Partial | Hooks return `Promise`; not coroutine objects |
| Class hooks | `[REPO]` Partial | `__init_subclass__`, `__set_name__`, `mroEntries` in pipeline subset; golden `init_subclass_called`, `set_name_called` |
| `types.MappingProxyType` | `[REPO]` Out of scope | COMPATIBILITY §8.16; pyrt uses mutable `Map` namespaces |

---

## Tier 3 — explicit non-goals (do not chase for “same as CPython”)

`[REPO]` `docs/knowledgebase/00-intent/non-goals.md`, COMPATIBILITY §9–10:

- Import system, bytecode VM, `exec`/`eval`
- Generators, `yield`, `asyncio`, real `await` scheduling
- `super()`, `__classcell__`, pattern matching VM
- GC, `__del__`, weakrefs, resurrection
- Pickle/copy, `__sizeof__`, full stdlib
- `property` / `classmethod` / `staticmethod` helpers (not in `src/`)

---

## Verification gaps

`[REPO]` **1170** Vitest tests across **163** files; many exported operators still lack dedicated tests (`withObjectAsync`, etc.); `operator-matmul-evidence.test.ts` and bytes/str API files cover several former gaps.

`[REPO]` Golden harness: **29** case keys per profile (`scripts/golden/expected/key-sets.json`); includes `bool_int_*`, `bool_float_*`, `seq_bool_*`, `str_bool_*`, `tuple_bool_*`; key parity in `test/golden/key-parity.test.ts`; offline gate semantics in `pyrt-cases-version-gates.test.ts`. Vitest: **1170** tests (`npm test`).

`[REPO]` CI golden matrix runs Python **3.10, 3.12, and 3.14** (one version per job). Local `npm run golden` may exercise all interpreters on PATH (3.9–3.14).

---

## Prefer / defer / avoid

| Action | Guidance |
|--------|----------|
| **Prefer** | Fix identity-vs-equality in `contains`; slice `__getitem__` semantics; expand golden + tests for `NotImplemented` and dict keys |
| **Defer** | VM, import, `super()`, bigint tower unless product commits |
| **Avoid** | Claiming “CPython compatible” without citing a tested subset in COMPATIBILITY |

---

## Related docs

- [compatibility-summary.md](./compatibility-summary.md) — KB entry point
- [version-gates-implementation-checklist.md](../20-domain-theory/version-gates-implementation-checklist.md)
- [dispatch-and-descriptors.md](../10-architecture-runtime/dispatch-and-descriptors.md)
