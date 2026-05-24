# Living plan — pyrt knowledgebase & runtime

**Active plan.** Update after each substantial pass using the 3-delta format below.

**Scope:** `pyrt` object-model runtime + `docs/knowledgebase/` + compatibility documentation.  
**Python reference range (pinned):** **3.9, 3.10, 3.11, 3.12, 3.13, 3.14**.

---

## Delta update (2026-05-23, cross-type parity KB refresh)

### Landed

- [REPO] `parity-gaps-priorities.md` — row #8/#10 golden + §8.15 refs; 174 tests; MappingProxyType Tier 2 row.
- [REPO] `compatibility-summary.md` — int↔float partial, mappingproxy not supported, golden scale.
- [REPO] PR #16 merged: MappingProxyType §8.16 on `main`.

### Partial

- [REPO] Cross-type builtin ops beyond int/float still `NotImplemented`.

### Next

1. Tier B golden cherry-picks or runtime gaps as prioritized.
2. Tier-3 roadmap (VM, import) unchanged.

---

## Delta update (2026-05-23, MappingProxyType compat docs)

### Landed

- [REPO] `COMPATIBILITY_AND_GAPS.md` §8.16 — MappingProxyType / mappingproxy intentional out-of-scope.
- [REPO] Golden inventory sync in README, COMPATIBILITY §12, validation-ladder L5/L3b (~19 keys).
- [REPO] PR #15 merged: class lifecycle golden trio complete on `main`.

### Partial

- [REPO] Cross-type builtin ops beyond int/float still `NotImplemented`.

### Next

1. Further Tier B golden cherry-picks or COMPATIBILITY gaps (cross-type builtins doc refinement).
2. Tier-3 roadmap (VM, import) unchanged.

---

## Delta update (2026-05-23, golden __set_name__)

### Landed

- [REPO] Golden case `set_name_called` — descriptor `__set_name__` at class creation (~19 keys/version).
- [REPO] PR #14 merged: `init_subclass_called` on `main`.

### Partial

- [REPO] Cross-type builtin ops beyond int/float still `NotImplemented`.

### Next

1. More Tier B golden cherry-picks or COMPATIBILITY gap notes (mappingproxy doc-only).
2. Tier-3 roadmap (VM, import) unchanged.

---

## Delta update (2026-05-23, golden __init_subclass__)

### Landed

- [REPO] Golden case `init_subclass_called` — base `__init_subclass__` runs on subclass creation (~18 keys/version).
- [REPO] PR #13 merged: descriptor precedence pair complete on `main`.

### Partial

- [REPO] Cross-type builtin ops beyond int/float still `NotImplemented`.

### Next

1. More Tier B golden cherry-picks (`__set_name__`, mappingproxy doc-only, etc.).
2. Tier-3 roadmap (VM, import) unchanged.

---

## Delta update (2026-05-23, golden non-data descriptor precedence)

### Landed

- [REPO] Golden case `descriptor_nodata_loses` — instance dict beats non-data descriptor (~17 keys/version).
- [REPO] PR #12 merged: `descriptor_data_wins` on `main`.

### Partial

- [REPO] Cross-type builtin ops beyond int/float still `NotImplemented`.

### Next

1. More Tier B golden cherry-picks per mining guide.
2. Tier-3 roadmap (VM, import) unchanged.

---

## Delta update (2026-05-23, golden descriptor precedence)

### Landed

- [REPO] Golden case `descriptor_data_wins` — data descriptor beats instance dict (~16 keys/version).
- [REPO] PR #11 merged: Tier B Lib/test reference doc on `main`.

### Partial

- [REPO] Non-data descriptor precedence golden case still Vitest-only.
- [REPO] Cross-type builtin ops beyond int/float still `NotImplemented`.

### Next

1. Optional `descriptor_nodata_loses` golden row.
2. More Tier B cherry-picks per mining guide.
3. Tier-3 roadmap (VM, import) unchanged.

---

## Delta update (2026-05-23, Tier B mining reference doc)

### Landed

- [REPO] `tier-b-lib-test-reference.md` — Tier B module catalog and maintainer workflow.
- [REPO] PR #10 merged: golden ~15 keys/version (contains + int/float cases).
- [REPO] `mine-lib-tests.sh` robust under `set -e` when `rg` misses.

### Partial

- [REPO] Tier B modules reference-only; no descriptor golden row yet.
- [REPO] Cross-type builtin ops beyond int/float still `NotImplemented`.

### Next

1. Descriptor precedence golden row (single case from `test_descr.py`).
2. More golden / Vitest cherry-picks from Tier B guide.
3. Tier-3 roadmap (VM, import) unchanged.

---

## Delta update (2026-05-23, golden Tier A expansion)

### Landed

- [REPO] Golden cases: `contains_str`, `contains_list`, `int_float_eq`, `int_float_add` (~15 keys/version).
- [REPO] Updated expected fixtures and key snapshot.

### Partial

- [REPO] Cross-type builtin ops beyond int/float still `NotImplemented`.
- [REPO] Tier B `Lib/test` modules reference-only.

### Next

1. Tier B reference mining doc (`test_descr.py`, `test_class.py`).
2. More golden cases (descriptor / class creation).
3. Tier-3 roadmap (VM, import) unchanged.

---

## Delta update (2026-05-23, Tier A merged to main)

### Landed

- [REPO] PR #9 merged: golden key-parity guard + full Tier A cpython-derived stack on `main`.
- [REPO] KB doc sweep: `repo-signals.md`, `runtime-overview.md` test/CI/golden counts updated.

### Partial

- [REPO] Cross-type builtin ops beyond int/float still `NotImplemented`.
- [REPO] Tier B `Lib/test` modules reference-only (not bulk ported).

### Next

1. Tier B reference mining (`test_descr.py`, `test_class.py`) — no bulk port.
2. Golden harness expansion beyond ~11 keys/version.
3. Tier-3 roadmap (VM, import) unchanged.

---

## Delta update (2026-05-23, Tier A integration stack)

### Landed

- [REPO] Golden key-parity guard: `keys.ts`, `pyrt-cases.ts`, Vitest snapshot, `golden:keys`.
- [REPO] Tier A cpython-derived ports: richcmp Incomparable/Rev, operator int/float, contains (`__contains__ = null` guard), isinstance (nested tuple flatten).
- [REPO] `COMPATIBILITY_AND_GAPS.md` §8.15 — int↔float cross-type delegation docs.

### Partial

- [REPO] Cross-type builtin ops beyond int/float still `NotImplemented`.
- [REPO] Abstract metaclass / PEP 604 union / `test_nonreflexive` cases not ported.

### Next

1. ~~Merge `feat/tier-a-integration` to `main`.~~ Done via PR #9.
2. ~~Close superseded PR #4.~~ Done.
3. Tier-3 roadmap (VM, import) unchanged.

---

## Current objective

Maintain an evidence-backed knowledgebase and a honest compatibility contract: what pyrt implements, what is partial, what is out of scope, and how that maps to **CPython 3.9–3.14**.

---

---

## Delta update (2026-05-19, CPython ne delegation + mining)

### Landed

- [REPO] `richCompareNe`: CPython `object.__ne__` path (`__eq__` before reflected `__ne__` when type has no own `__ne__`; subclass `__ne__` first).
- [REPO] `test/cpython-derived/compare-ne.test.ts` (high/low priority from `test_compare.py`); improved `scripts/cpython/mine-lib-tests.sh` (Tier A only).
- [REPO] Prior slice: golden both-NotImplemented ordering, list/tuple `eq()`, Tier-1 docs + CPython submodule @ v3.14.0.

### Partial

- [REPO] Golden ~11 keys/version; curated `cpython-derived` ports only (not bulk `Lib/test`).
- [SYNTH] `makeClass` ≠ full `type.__call__`; `pyInt` remains JS number.

### Next

1. More Tier A ports (`test_richcmp` Incomparable/Rev, `test_operator` thin cases) + golden expansion.
2. KB doc path sweep (`operators.ts` paths).
3. Tier-3 roadmap (VM, import) unchanged.

---

## Superseded guidance

- `.cursor/plans/python_runtime_js_94dc0fcc.plan.md` — historical; prefer this file + `docs/COMPATIBILITY_AND_GAPS.md` for shipped truth.
- Do not claim “zero discrepancies” or “complete Python” without narrowing to a tested subset in the compatibility matrix.
