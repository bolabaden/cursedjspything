# Living plan — pyrt knowledgebase & runtime

**Active plan.** Update after each substantial pass using the 3-delta format below.

**Scope:** `pyrt` object-model runtime + `docs/knowledgebase/` + compatibility documentation.  
**Python reference range (pinned):** **3.9, 3.10, 3.11, 3.12, 3.13, 3.14**.

---

## Current objective

Maintain an evidence-backed knowledgebase and a honest compatibility contract: what pyrt implements, what is partial, what is out of scope, and how that maps to **CPython 3.9–3.14**.

---

## Delta update (2026-05-18, parity gaps pass)

### Landed

- [REPO] Parity gap inventory: `docs/knowledgebase/40-operational-risk/parity-gaps-priorities.md` (Tier 1–3, verification gaps).
- [REPO] `compatibility-summary.md` corrected for `__match_args__` (metadata only), slice/contains/`lookupSpecial` partial rows.

### Partial

- [SYNTH] Name coverage (81 slots) is strong; semantic parity gaps remain (identity `contains`, slice decomposition, callable lookup).
- [REPO] Golden + unit tests prove a thin slice (~9 golden checks, 118 tests); many operators untested against CPython.

### Next

1. Tier-1 parity fixes: `contains` → `eq()`, `getItem(slice)` → single `__getitem__(slice)`, broaden `lookupSpecial` for `__call__` PyObjects.
2. Expand golden harness + CI multi-Python matrix.
3. Examples + Tier-3 roadmap (VM, import) unchanged.

---

## Superseded guidance

- `.cursor/plans/python_runtime_js_94dc0fcc.plan.md` — historical; prefer this file + `docs/COMPATIBILITY_AND_GAPS.md` for shipped truth.
- Do not claim “zero discrepancies” or “complete Python” without narrowing to a tested subset in the compatibility matrix.
