# Living plan — pyrt knowledgebase & runtime

**Active plan.** Update after each substantial pass using the 3-delta format below.

**Scope:** `pyrt` object-model runtime + `docs/knowledgebase/` + compatibility documentation.  
**Python reference range (pinned):** **3.9, 3.10, 3.11, 3.12, 3.13, 3.14**.

---

## Delta update (2026-05-23, test_isinstance MRO ports)

### Landed

- [REPO] `test/cpython-derived/isinstance-protocol.test.ts` — Tier A ports from `test_isinstance.py` (normal + tuple branches).
- [REPO] `isinstance`/`issubclass` flatten nested type tuples (CPython `test_subclass_tuple`).

### Partial

- [REPO] Golden ~11 keys/version; golden key-parity guard in PR #3.
- [REPO] Abstract metaclass / PEP 604 union cases not ported.

### Next

1. Merge stacked PRs (#3–#7).
2. Close superseded PR #4.
3. Tier-3 roadmap (VM, import) unchanged.

---

## Current objective

Maintain an evidence-backed knowledgebase and a honest compatibility contract: what pyrt implements, what is partial, what is out of scope, and how that maps to **CPython 3.9–3.14**.

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
