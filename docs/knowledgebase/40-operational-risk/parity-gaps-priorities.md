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
| 1 | **`contains` fallback uses identity** | `protocols.ts` (`item === value`); `builtins/list.ts`, `tuple.ts` | Membership uses equality (`PyObject_RichCompareBool` / `==`) |
| 2 | **Slice via `getItem` decomposes indices** | `protocols.ts` expands `pySlice` into repeated `__getitem__(int)` | `__getitem__(slice)` receives one slice object |
| 3 | **`lookupSpecial` ignores non-function callables** | `lookup.ts` returns `undefined` if MRO value is `PyObject` without `__get__` | Callable objects with `__call__` can implement specials |
| 4 | **`instantiate` uses `lookupInMro` not `lookupSpecial`** | `class/class.ts` | `__new__` / `__init__` binding rules differ for descriptors |
| 5 | **Rich compare / `NotImplemented` edge cases** | Some tests in `test/dispatch/operators.test.ts`; not golden-tested | Full ordering when both sides return `NotImplemented` |
| 6 | **`hash` coercion `\| 0`** | `dispatch/operators/compare.ts` | Integer hash semantics and `hash` consistent with `eq` |
| 7 | **`__bool__` must return JS boolean** | `compare.ts` | CPython accepts truthy objects in some paths; stricter here |
| 8 | **Builtin cross-type ops return `NotImplemented`** | `builtins/*.ts` type guards | CPython may delegate or coerce |
| 9 | **`makeClass` ≠ `type.__call__`** | `class/class.ts`, COMPATIBILITY §8.1 | Metaclass `__new__`, full creation protocol |
| 10 | **Golden harness is thin** | `scripts/golden/` ~9 checks; CI pins one Python | Proof of parity across versions and protocols |

---

## Tier 2 — partial features and version gates

| Area | Status | Notes |
|------|--------|-------|
| `__match_args__` | `[REPO]` Partial | Stored + `getMatchArgs()`; **no** `match`/`case` VM |
| `__buffer__` / PEP 688 | `[REPO]` Partial | `wrapBuffer`, minimal view; not `memoryview` / full lifecycle |
| `__annotate__` (3.14) | `[REPO]` Partial | `getAnnotations()` on demand; not PEP 649 evaluation timing |
| Bound methods | `[REPO]` Partial | `class/method.ts` + `lookupSpecial` for plain `function` only |
| `pyDict` / `pySet` | `[REPO]` Partial | PyObject keys use `dict-keys.ts`; JS primitives use `Map`/`Set` identity |
| `pyInt` | `[REPO]` Partial | JS `number`; no arbitrary precision |
| Async protocols | `[REPO]` Partial | Hooks return `Promise`; not coroutine objects |
| Class hooks | `[REPO]` Partial | `__init_subclass__`, `__set_name__`, `mroEntries` in pipeline subset |

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

`[REPO]` **118** Vitest tests; many exported operators lack dedicated tests (`matmul`, `bytes`, `withObjectAsync`, etc.).

`[OPEN]` Multi-version golden (3.9–3.14) depends on interpreters installed locally; CI may run a single Python version.

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
