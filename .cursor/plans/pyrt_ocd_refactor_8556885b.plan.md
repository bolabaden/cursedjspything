---
name: pyrt OCD refactor
overview: Restructure pyrt into strict layers with smaller, single-purpose modules—split the 868-line `builtins.ts` monolith, extract shared dispatch/native/iterator utilities, trim the public barrel, and align tests with module boundaries—without changing runtime semantics.
todos:
  - id: phase1-extract
    content: Extract errors.ts, dispatch.ts, native.ts, iterators/; unify length/truthiness; fix protocols import order
    status: completed
  - id: phase2-builtins
    content: Split builtins.ts into builtins/{none,bool,int,float,str,list,tuple,dict,set}.ts + index.ts
    status: completed
  - id: phase3-folders
    content: Move modules into core/, dispatch/, class/, collections/, buffer/, builtins/; update all imports
    status: completed
  - id: phase4-api
    content: Trim index.ts exports to stable/advanced tiers; optional package.json imports/subpaths
    status: completed
  - id: phase5-tests
    content: Reorganize tests to mirror folders; split roadmap.test.ts; update validation-ladder + LIVING-PLAN
    status: completed
isProject: false
---

# pyrt: OCD-style code organization plan

## Goal

Make the codebase read like a **layered runtime library**: registry → core → lookup → dispatch → builtins, with **one obvious home per concern**, **no mid-file imports**, and a **small stable public API**. Behavior stays identical; this is structural refactor only.

**Evidence base:** [kb-repo-archaeologist](agent) found `builtins.ts` at 868 LOC (~29% of runtime), mixed concerns in `[protocols.ts](src/runtime/protocols.ts)`, and a 216-line manual barrel. [ce-best-practices-researcher](agent) recommends: single root export, optional `./core` / `./builtins` subpaths later, registry separate from dispatch, hybrid tests, block or omit internals from `package.json` `exports`.

```mermaid
flowchart TB
  subgraph public [Public]
    index[src/index.ts]
  end
  subgraph core [core - no builtins]
    slots[slots.ts]
    object[object.ts]
    errors[errors.ts]
    lookup[lookup.ts]
  end
  subgraph dispatch [dispatch]
    dispatchUtil[dispatch.ts]
    operators[operators.ts]
    protocols[protocols.ts]
  end
  subgraph types [builtins]
    builtinIndex[builtins/index.ts]
    none[bool int str list tuple dict set]
  end
  subgraph support [support]
    dictKeys[dict-keys.ts]
    slice[slice.ts]
    buffer[buffer.ts]
    iter[iterators/]
  end
  index --> core
  index --> dispatch
  index --> types
  index --> class[class.ts]
  class --> core
  class --> dispatch
  dispatch --> core
  types --> class
  types --> dispatch
  types --> dictKeys
  protocols --> iter
  protocols --> slice
  protocols --> buffer
```



---

## What an “OCD” pass fixes (current smells)


| Smell                                | Location                                             | Fix                                                                      |
| ------------------------------------ | ---------------------------------------------------- | ------------------------------------------------------------------------ |
| Monolith builtin types               | `[builtins.ts](src/runtime/builtins.ts)` (868 lines) | Split into `builtins/*.ts` + thin `builtins/index.ts`                    |
| Iterator types inside protocols      | `[protocols.ts](src/runtime/protocols.ts)` L320+     | Move to `iterators/sequence.ts`, `iterators/reversed.ts`                 |
| Mid-file import                      | `protocols.ts` imports `objectType` at ~L383         | Hoist imports; iterators use explicit deps                               |
| Repeated `lookupSpecial` boilerplate | `protocols.ts` (~20 functions)                       | Shared `callSlot` / `callSlotOrThrow` in `dispatch.ts`                   |
| Duplicate `__len__` paths            | `operators.bool` vs `protocols.len`                  | `bool` calls `len` from protocols (or shared `lengthOf`)                 |
| Scattered native storage             | `VAL` in builtins, `_slice`, `_bufferView`           | `[native.ts](src/runtime/native.ts)`: `nativeVal`, `setNative`, `unwrap` |
| Exceptions bundled with lookup       | `[lookup.ts](src/runtime/lookup.ts)`                 | `[errors.ts](src/runtime/errors.ts)` — five `Py*Error` classes           |
| Over-exported internals              | `[index.ts](src/index.ts)`                           | Tier exports: **stable** vs **advanced** (or drop from barrel)           |
| Flat tests                           | `test/*.test.ts`                                     | Mirror folders after split; fold `roadmap.test.ts` into domain tests     |
| Inconsistent file naming             | `dict-keys.ts` vs `operators.ts`                     | Pick one: **kebab-case files** under folders                             |


**Keep as-is (already good):** `[slots.ts](src/runtime/slots.ts)` registry-only, `[object.ts](src/runtime/object.ts)` core model, `[class.ts](src/runtime/class.ts)` pipeline, `[dict-keys.ts](src/runtime/dict-keys.ts)` / `[slice.ts](src/runtime/slice.ts)` / `[buffer.ts](src/runtime/buffer.ts)` size.

---

## Target layout (after refactor)

```
src/
  index.ts                    # public barrel only
  runtime/
    core/
      slots.ts
      object.ts
      errors.ts
      lookup.ts
    dispatch/
      dispatch.ts               # callSlot, requireCallable, etc.
      operators.ts
      protocols.ts              # protocols only; no iterator class defs
    class/
      class.ts
    builtins/
      native.ts                 # VAL, nativeVal, unwrap
      factory.ts                # optional: shared repr/iter helpers for builtins
      none.ts
      bool.ts
      int.ts
      float.ts
      str.ts
      list.ts
      tuple.ts
      dict.ts
      set.ts
      index.ts                  # re-exports all types + factories
    collections/
      dict-keys.ts
      slice.ts
    buffer/
      buffer.ts
    iterators/
      sequence-iterator.ts
      reversed-iterator.ts
```

**Dependency rule (enforce in review):**

- `core/`* imports nothing from `builtins`, `dispatch`, `class`
- `dispatch/`* imports `core` only
- `class/*` imports `core` + `dispatch` (minimal)
- `builtins/*` imports `core`, `class`, `dispatch`, `collections`
- `iterators/*` imports `core`, `dispatch`, `collections` — **not** `builtins`

Use `package.json` `"imports"` for contributor paths (optional Phase 4):

```json
"imports": {
  "#core/*": "./src/runtime/core/*",
  "#dispatch/*": "./src/runtime/dispatch/*"
}
```

---

## Phase 1 — Extract shared primitives (no folder moves yet)

**Risk: low.** Pure extractions + import rewires.

1. `**errors.ts`** — move `PyAttributeError`, `PyTypeError`, `PyKeyError`, `PyStopIteration`, `PyValueError` from `[lookup.ts](src/runtime/lookup.ts)`. Re-export from `lookup.ts` temporarily if needed to avoid a huge diff in tests.
2. `**dispatch.ts`** — add small helpers used by protocols (and optionally operators):

```ts
export function callSlot(obj: PyObject, slot: symbol, ...args: unknown[]): unknown
export function callSlotOrThrow(obj: PyObject, slot: symbol, msg: string, ...args: unknown[]): unknown
```

Replace repeated `lookupSpecial` + `if (!fn) throw` blocks in `protocols.ts`.

1. `**native.ts**` — `VAL`, `nativeVal`, `setNative`, `unwrap`; update `builtins.ts`, `slice.ts`, `buffer.ts` to import from here.
2. `**iterators/**` — move `seqIterType` / `revIterType` and factories out of `protocols.ts`; fix import order (no imports after function bodies).
3. **Unify length/truthiness** — `operators.bool` should delegate to `protocols.len` (import from protocols creates cycle: protocols → operators path). **Preferred:** put `lengthOf(obj): number` in `dispatch.ts` or `core/length.ts` used by both `bool` and `len`.

**Validation:** `npm run check`, `npm test`, `npm run golden`.

---

## Phase 2 — Split `builtins.ts` (biggest win)

**Risk: medium.** Mechanical split; keep identical `makeClass` dicts.


| New file            | Exports (examples)                        |
| ------------------- | ----------------------------------------- |
| `builtins/none.ts`  | `noneType`, `pyNone`                      |
| `builtins/bool.ts`  | `boolType`, `pyBool`, `pyTrue`, `pyFalse` |
| `builtins/int.ts`   | `intType`, `pyInt`                        |
| `builtins/float.ts` | `floatType`, `pyFloat`                    |
| `builtins/str.ts`   | `strType`, `pyStr`                        |
| `builtins/list.ts`  | `listType`, `pyList`                      |
| `builtins/tuple.ts` | `tupleType`, `pyTuple`                    |
| `builtins/dict.ts`  | `dictType`, `pyDict`                      |
| `builtins/set.ts`   | `setType`, `pySet`                        |
| `builtins/index.ts` | barrel re-export (same names as today)    |


**Optional DRY (only if it stays obvious):** `builtins/factory.ts` with helpers like `defineRepr(typeDict, fn)` — avoid a mini-framework; OCD means **boring repetition over clever abstraction**.

**Cross-builtin init order:** `dict.ts` may reference `pyInt` for tests — keep factory functions lazy or import only types, not instances, to avoid cycles.

**Validation:** same as Phase 1; add one smoke test importing every factory from root `index.ts`.

---

## Phase 3 — Physical folder moves (`core/`, `dispatch/`, etc.)

**Risk: medium-high.** Move files + update all relative imports + `tsconfig` if needed.

1. Move files into folders per target layout.
2. Add **folder-level `index.ts` barrels** only where they reduce import noise (e.g. `builtins/index.ts`, `core/index.ts`); avoid double-barrel drift with root `src/index.ts`.
3. Keep **single public entry** at `[src/index.ts](src/index.ts)` — re-export from new paths; **no change** to `package.json` `"."` export in this phase unless you add subpaths deliberately.

**Validation:** full test + golden + `npm run build`.

---

## Phase 4 — Public API hygiene (best-practice packaging)

**Risk: low for consumers if you only remove undocumented exports.**

1. **Audit `[src/index.ts](src/index.ts)`** — classify each export:


| Tier     | Keep at root        | Examples                                                                    |
| -------- | ------------------- | --------------------------------------------------------------------------- |
| Stable   | yes                 | `PyObject`, `eq`, `makeClass`, `Slot`, `Hook`, builtins factories           |
| Advanced | document or subpath | `lookupSpecial`, `computeC3`, `prepareNamespace`                            |
| Internal | remove from root    | `dictSet`, `attachBufferView`, `defaultGetAttr` unless you commit to semver |


1. `**package.json**` (when ready):

```json
"sideEffects": false,
"exports": {
  ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" },
  "./builtins": { ... }
}
```

Optional `./builtins` only after Phase 2 split — matches Effect/Zod pattern without exposing `dist/runtime/...` deep paths.

1. **Naming consistency (document, don’t churn unnecessarily):**

- Files: **kebab-case** under folders (`dict-keys.ts` stays in `collections/`)
- Factories: keep `pyInt` / `intType` pair (Python convention is clear)
- Async: either prefix all async protocol helpers with `py` or none — pick `**aiter` / `aenter` / `pyAwait`** and document in KB

---

## Phase 5 — Tests mirror modules

**Risk: low.**


| Current                  | After                                                                                                            |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `test/roadmap.test.ts`   | Split: class → `test/class/`, dict/slice → `test/collections/`, version gates → `test/class/` or `test/core/`    |
| `test/protocols.test.ts` | Add `test/iterators/` if iterators grow                                                                          |
| No `builtins` tests      | `test/builtins/dict.test.ts` for PyObject key equality                                                           |
| Golden                   | Keep `[scripts/golden/](scripts/golden/)`; optional `test/golden.test.ts` wrapper calling `npm run golden` in CI |


**Colocation rule:** new unit tests beside the file they guard once files are <200 LOC; keep cross-cutting tests in `test/`.

Update `[docs/knowledgebase/50-execution/validation-ladder.md](docs/knowledgebase/50-execution/validation-ladder.md)` with new paths.

---

## What we explicitly will NOT do (scope guard)

- No VM, import system, or new protocols (Tier 3 from [roadmap plan](.cursor/plans/pyrt_gaps_and_roadmap_e6884b17.plan.md))
- No “framework” for defining builtins (keeps code obvious)
- No renaming every public symbol (`eq` stays `eq`)
- **Do not edit** `[.cursor/plans/python_runtime_js_94dc0fcc.plan.md](.cursor/plans/python_runtime_js_94dc0fcc.plan.md)` or the attached roadmap plan file

---

## Suggested execution order

```mermaid
flowchart LR
  P1[Phase1 extract helpers] --> P2[Phase2 split builtins]
  P2 --> P3[Phase3 folder moves]
  P3 --> P4[Phase4 API trim]
  P4 --> P5[Phase5 tests mirror]
```



One PR per phase (or one PR with Phase 1+2 if you want fewer review rounds). Each phase must end green: **check + test + golden**.

---

## Success criteria

- No file under `src/runtime/` > ~350 LOC except generated/registry tables
- Acyclic imports matching the layer diagram
- Root `[src/index.ts](src/index.ts)` < 120 lines of re-exports
- `protocols.ts` contains only protocol dispatch + `withObject`*
- `[docs/knowledgebase/LIVING-PLAN.md](docs/knowledgebase/LIVING-PLAN.md)` 3-delta noting structural refactor (landed / partial / next)

---

## Optional follow-up (Tier 2, separate plan)

- `dict-keys` use `lookupSpecial` for `eq`/`hash` instead of importing full `[operators.ts](src/runtime/operators.ts)` (cuts coupling)
- Bound-method type (`types.MethodType` shape) in `core/method.ts`
- `package.json` `"./internal/*": null` if you add wildcard exports

