# Living plan — pyrt knowledgebase & runtime

**Active plan.** Update after each substantial pass using the 3-delta format below.

**Scope:** `pyrt` object-model runtime + `docs/knowledgebase/` + compatibility documentation.  
**Python reference range (pinned):** **3.9, 3.10, 3.11, 3.12, 3.13, 3.14**.

---

## Current objective

Maintain an evidence-backed knowledgebase and a honest compatibility contract: what pyrt implements, what is partial, what is out of scope, and how that maps to **CPython 3.9–3.14**.

---

## Delta update (2026-05-19, golden key-parity guard)

### Landed

- [REPO] Golden key-parity: `assertGoldenKeyParity` in `npm run golden`; `npm run golden:keys`; `test/golden/key-parity.test.ts`; `scripts/golden/expected/key-sets.json`.
- [REPO] Prior Tier-1 slice: `richCompareNe`, list/tuple `__eq__`, cpython-derived ports, golden `rich_lt_both_not_impl_raises` (142 Vitest tests green).

### Partial

- [SYNTH] `makeClass` ≠ full `type.__call__`; `pyInt` remains JS number; `dictKeyEq` parallel to `eq()` for dict keys.
- [REPO] Legacy `scripts/golden/expected.json` still value-only (no key-parity assert; thin key set).

### Next

1. Protocol-family golden expansion (contains → isinstance ladder).
2. More Tier A Lib/test ports via `cpython:mine`.
3. KB path sweep; optional retire or refresh legacy `expected.json`.

---

## Superseded guidance

- `.cursor/plans/python_runtime_js_94dc0fcc.plan.md` — historical; prefer this file + `docs/COMPATIBILITY_AND_GAPS.md` for shipped truth.
- Do not claim “zero discrepancies” or “complete Python” without narrowing to a tested subset in the compatibility matrix.
