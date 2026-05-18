# Living plan — pyrt knowledgebase & runtime

**Active plan.** Update after each substantial pass using the 3-delta format below.

**Scope:** `pyrt` object-model runtime + `docs/knowledgebase/` + compatibility documentation.  
**Python reference range (pinned):** **3.9, 3.10, 3.11, 3.12, 3.13, 3.14**.

---

## Current objective

Maintain an evidence-backed knowledgebase and a honest compatibility contract: what pyrt implements, what is partial, what is out of scope, and how that maps to **CPython 3.9–3.14**.

---

## Delta update (2026-05-18, remainder pass)

### Landed

- [REPO] Doc path sweep: KB + `COMPATIBILITY_AND_GAPS.md` reference layered `src/runtime/` layout and mirrored test paths.
- [REPO] `dict-keys.ts` uses `lookupSpecial` for key `__hash__` / `__eq__` (no `operators/` import).
- [REPO] Golden harness: per-version `scripts/golden/expected/{major.minor}.json`, version-gated cases (`match_args`, buffer, `annotate`).
- [REPO] `class/method.ts` + `initMethodType`: bound-method objects for plain functions in `lookupSpecial`.

### Partial

- [REPO] Golden matrix only validates interpreters present on the host (not all of 3.9–3.14 in CI).

### Next

1. CI matrix job with multiple Python versions when available.
2. Examples: async / with / slice sections in `examples/python-vs-js.ts`.
3. Tier-3 roadmap: VM, import system (see gaps plan).

---

## Superseded guidance

- `.cursor/plans/python_runtime_js_94dc0fcc.plan.md` — historical; prefer this file + `docs/COMPATIBILITY_AND_GAPS.md` for shipped truth.
- Do not claim “zero discrepancies” or “complete Python” without narrowing to a tested subset in the compatibility matrix.
