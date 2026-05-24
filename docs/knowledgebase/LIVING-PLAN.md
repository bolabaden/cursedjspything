# Living plan — pyrt knowledgebase & runtime

**Active plan.** Update after each substantial pass using the 3-delta format below.

**Scope:** `pyrt` object-model runtime + `docs/knowledgebase/` + compatibility documentation.  
**Python reference range (pinned):** **3.9, 3.10, 3.11, 3.12, 3.13, 3.14**.

---

## Current objective

Maintain an evidence-backed knowledgebase and a honest compatibility contract: what pyrt implements, what is partial, what is out of scope, and how that maps to **CPython 3.9–3.14**.

---

## Delta update (2026-05-23, NotImplemented rich compare golden)

### Landed

- [REPO] Golden case `rich_lt_both_not_impl_raises` + unit test + examples section for both-sides `NotImplemented` ordering → `TypeError`.
- [REPO] COMPATIBILITY §8.8 and parity-gaps doc updated.

### Partial

- [REPO] Golden runs all interpreters on host in one `npm run golden` invocation; CI matrix runs one Python per job.
- [SYNTH] `makeClass` still ≠ full `type.__call__`; `pyInt` remains JS number.

### Next

1. Remaining Tier-1: hash/bool strictness, builtin cross-type delegation.
2. Golden key-parity guard (PR #3) — merge when ready.
3. Tier-3 roadmap (VM, import) unchanged.

---

## Delta update (2026-05-18, Tier-1 parity + docs)

### Landed

- [REPO] Tier-1 parity: `contains` → `eq()`; slice `__getitem__(slice)` on list/tuple; `lookupSpecial` for callable `PyObject`; `instantiate` uses `lookupSpecial` for `__new__`/`__init__`.
- [REPO] `STRATEGY.md`, README refresh, COMPATIBILITY §8.6–8.7 updated; CI golden matrix 3.10 / 3.12 / 3.14.

### Partial

- [REPO] Golden runs all interpreters on host in one `npm run golden` invocation; CI matrix runs one Python per job.
- [SYNTH] `makeClass` still ≠ full `type.__call__`; `pyInt` remains JS number.

### Next

1. Golden cases for `NotImplemented` / rich compare; expand `examples/python-vs-js.ts`.
2. Remaining Tier-1: hash/bool strictness, builtin cross-type delegation.
3. Tier-3 roadmap (VM, import) unchanged.

---

## Superseded guidance

- `.cursor/plans/python_runtime_js_94dc0fcc.plan.md` — historical; prefer this file + `docs/COMPATIBILITY_AND_GAPS.md` for shipped truth.
- Do not claim “zero discrepancies” or “complete Python” without narrowing to a tested subset in the compatibility matrix.
