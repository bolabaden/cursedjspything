# Living plan — pyrt knowledgebase & runtime

**Active plan.** Update after each substantial pass using the 3-delta format below.

**Scope:** `pyrt` object-model runtime + `docs/knowledgebase/` + compatibility documentation.  
**Python reference range (pinned):** **3.9, 3.10, 3.11, 3.12, 3.13, 3.14**.

---

## Current objective

Maintain an evidence-backed knowledgebase and a honest compatibility contract: what pyrt implements, what is partial, what is out of scope, and how that maps to **CPython 3.9–3.14**.

---

## Delta update (2026-05-19, Tier-1 semantics continuation)

### Landed

- [REPO] Golden `rich_lt_both_not_impl_raises` (both ordering ops `NotImplemented` → `TypeError`); list/tuple `__eq__` uses per-element `eq()`.
- [REPO] Vitest: hash/bool strictness, both-sides `NotImplemented` ordering, list `__eq__` edge cases (`test/dispatch/operators.test.ts`, `test/builtins/list-eq.test.ts`).
- [REPO] COMPATIBILITY §8.6/8.8 and parity-gaps Tier-1 table updated; plan `docs/plans/2026-05-19-tier1-semantics-continuation-plan.md`.

### Partial

- [REPO] Golden harness ~11 keys/version; not full slot surface. Builtin cross-type coercion still differs from CPython in edge cases.
- [SYNTH] `makeClass` still ≠ full `type.__call__`; `pyInt` remains JS number.

### Next

1. Broader golden by protocol family; optional `examples/python-vs-js.ts` rich-compare notes.
2. Doc path sweep (KB stale `operators.ts` paths) — separate pass.
3. Tier-3 roadmap (VM, import) unchanged.

---

## Superseded guidance

- `.cursor/plans/python_runtime_js_94dc0fcc.plan.md` — historical; prefer this file + `docs/COMPATIBILITY_AND_GAPS.md` for shipped truth.
- Do not claim “zero discrepancies” or “complete Python” without narrowing to a tested subset in the compatibility matrix.
