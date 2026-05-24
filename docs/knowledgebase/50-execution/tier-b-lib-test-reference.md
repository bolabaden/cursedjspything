# Tier B Lib/test reference (no bulk port)

**Purpose:** Maintainer guide for CPython `Lib/test` modules that are **reference-only** for pyrt — useful for golden case ideas and gap analysis, not for wholesale Vitest transpilation.

**Authoritative mining script:** `scripts/cpython/mine-lib-tests.sh`  
**Tier A status:** Complete on `main` (see `test/cpython-derived/` and golden 27 keys/version).

---

## Why Tier B exists

`[SYNTH]` Tier A modules (`test_richcmp`, `test_compare`, `test_operator`, `test_isinstance`, `test_contains`) exercise pyrt’s **data-model dispatch** with thin, portable cases. Tier B modules are large, depend heavily on `test.support`, C-API helpers, or CPython VM internals — running or porting them wholesale would not match pyrt’s library scope.

**Rule:** Use Tier B for **targeted** golden rows or one-off Vitest ports when a single test method maps cleanly to an existing pyrt surface.

---

## Module catalog

| Module | Lines (v3.14.0) | Primary CPython focus | pyrt overlap | Port stance |
|--------|-----------------|----------------------|--------------|-------------|
| `test_descr.py` | ~5,989 | Descriptors (`property`, `staticmethod`, `classmethod`), mappingproxy, slot wrappers, `__get__`/`__set__` edge cases | `getAttr`/`setAttr`, descriptor precedence in `lookup.ts`; partial property coverage in `test/core/object-model.test.ts` | **Reference.** Cherry-pick descriptor precedence cases for golden or Vitest; skip C-API slot wrapper tests. |
| `test_class.py` | ~1,022 | Type dict layout, inline values, specialization caches, `PyType` internals | `makeClass`, `__init_subclass__`, `__set_name__` in `class.ts`; not full `type.__call__` | **Reference.** Use for gap list (class dict materialization); do not port VM cache tests. |
| `test_types.py` | ~2,566 | `type()`, `MappingProxyType`, numeric type objects, formatting towers | Builtin types + `dispatch/operators/`; int/float cross-type covered in Tier A | **Reference.** Formatting/locale tests out of scope; type-object edge cases may inform COMPATIBILITY gaps only. |

---

## Suggested near-term uses (Tier 2)

`[SYNTH]` Ordered by payoff vs effort:

1. ~~**Descriptor golden row**~~ — **Done:** `descriptor_data_wins` + `descriptor_nodata_loses` on `main`.
2. **`__init_subclass__`** — **Done:** `init_subclass_called` golden key; Vitest coverage in `test/class/system.test.ts`.
3. ~~**`__set_name__`**~~ — **Done:** `set_name_called` golden key; Vitest in `test/class/system.test.ts`.
4. ~~**Mappingproxy / readonly dict views**~~ — **Documented:** `COMPATIBILITY_AND_GAPS.md` §8.16 (out of scope unless shim added).

---

## Explicit out of scope

- Bulk transpile of Tier B modules to Vitest
- `python -m test` / `regrtest` as CI gate
- Tests requiring `test.support`, `_testcapi`, `_ctypes`, or interpreter frames
- Locale-specific `__format__` matrices from `test_types.py`

---

## Workflow for maintainers

1. Run `npm run cpython:mine` (or `bash scripts/cpython/mine-lib-tests.sh`) after submodule init.
2. Pick a **single** test method; read CPython source in `vendor/cpython/Lib/test/…`.
3. Decide surface: golden JSON (cross-runtime) vs Vitest (pyrt-only) vs COMPATIBILITY gap note only.
4. If adding golden keys, update `cases.py` and `pyrt-cases.ts` in parallel (keep `# golden:*` sync comments). Reuse `version_gte` / `versionGte` for version gates and `owner_with_instance_attr` / `ownerWithInstanceAttr` for descriptor-owner fixtures when the pattern fits; then refresh expected JSON and run `npm run golden:keys`.

---

## Evidence labels

- `[REPO]` Line counts and file paths from `vendor/cpython` @ v3.14.0
- `[SYNTH]` Port stance and near-term priorities
- `[OPEN]` Mappingproxy / full `type.__call__` fidelity unchanged (mappingproxy gap documented in COMPATIBILITY §8.16)

See also: [cpython-reference-submodule.md](./cpython-reference-submodule.md), [validation-ladder.md](./validation-ladder.md).
