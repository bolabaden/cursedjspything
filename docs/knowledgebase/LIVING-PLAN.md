# Living plan — pyrt knowledgebase & runtime

**Active plan.** Update after each substantial pass using the 3-delta format below.

**Scope:** `pyrt` object-model runtime + `docs/knowledgebase/` + compatibility documentation.  
**Python reference range (pinned):** **3.9, 3.10, 3.11, 3.12, 3.13, 3.14**.

---

## Current objective

Maintain an evidence-backed knowledgebase and a honest compatibility contract: what pyrt implements, what is partial, what is out of scope, and how that maps to **CPython 3.9–3.14**.

---

## Delta update (2026-05-19, Tier-1 LFG continuation complete)

### Landed

- [REPO] Golden `rich_lt_both_not_impl_raises`; list/tuple `__eq__` via per-element `eq()`; Vitest hash/bool/both-NotImplemented ordering.
- [REPO] `richCompareNe` / `tryNeSide`: full CPython `!=` delegation (subclass `__ne__`, MRO `__ne__`, `object.__ne__` `__eq__` probe, reverse-subclass case).
- [REPO] `test/cpython-derived/*`, `list-eq.test.ts`, `tuple-eq.test.ts`; CPython submodule @ v3.14.0 + `cpython:mine`.
- [REPO] Plan `docs/plans/2026-05-19-tier1-semantics-continuation-plan.md` completed; COMPATIBILITY §8.6/8.8 + parity-gaps updated.

### Partial

- [REPO] Golden ~11 keys/version; U5 key-parity guard optional/not done.
- [SYNTH] `makeClass` ≠ full `type.__call__`; `pyInt` remains JS number.

### Next

1. More Tier A Lib/test ports + golden expansion by protocol family.
2. KB path sweep (`operators.ts` stale paths in older KB pages).
3. Tier-3 roadmap (VM, import) unchanged.

---

## Superseded guidance

- `.cursor/plans/python_runtime_js_94dc0fcc.plan.md` — historical; prefer this file + `docs/COMPATIBILITY_AND_GAPS.md` for shipped truth.
- Do not claim “zero discrepancies” or “complete Python” without narrowing to a tested subset in the compatibility matrix.
