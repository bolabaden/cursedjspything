# Living plan — pyrt knowledgebase & runtime

**Active plan.** Update after each substantial pass using the 3-delta format below.

**Scope:** `pyrt` object-model runtime + `docs/knowledgebase/` + compatibility documentation.  
**Python reference range (pinned):** **3.9, 3.10, 3.11, 3.12, 3.13, 3.14**.

---

## Current objective

Maintain an evidence-backed knowledgebase and a honest compatibility contract: what pyrt implements, what is partial, what is out of scope, and how that maps to **CPython 3.9–3.14**.

---

## Delta update (2026-05-18)

### Landed

- [REPO] Full runtime slice: `src/runtime/*`, public API `src/index.ts`, 107 Vitest tests, 39 example sections.
- [REPO] Exhaustive compatibility doc: `docs/COMPATIBILITY_AND_GAPS.md` (81 `Slot` + 22 `Hook`, bibliography, CPython source map).
- [REPO] Layered knowledgebase scaffold under `docs/knowledgebase/` with **Python 3.9–3.14 pinned** version matrix and living plan.
- [OFFICIAL] Cross-version research synthesized: special method lookup stable 3.9–3.14; version gates for `__match_args__` (3.10+), buffer (3.12+), `__annotate__` (3.14 LR).

### Partial

- [REPO] `package.json` description still says “CPython 3.14” only; KB clarifies 3.9–3.14 reference vs 3.14 slot anchor.
- [REPO] No golden tests against real CPython per version; parity claims are architectural intent, not proven across 3.9–3.14.
- [REPO] Async protocols tested but not in `examples/python-vs-js.ts`.
- [OPEN] Context7 quota blocked automated doc fetch in orchestrator pass; KB used subagent + direct official URLs.

### Next

1. Add `LICENSE`, `.gitignore`, CI workflow running `npm test` + `npm run check`.
2. Add `docs/knowledgebase/20-domain-theory/version-gates-implementation-checklist.md` entries as features are implemented.
3. Optional: `scripts/golden/` harness comparing pyrt vs `python3.N` for a curated opcode/dunder list.
4. Align `package.json` description with KB version policy.
5. Implement version-gated `Hook` entries (`__match_args__`, full `__annotate__`) only when explicitly scoped.

---

## Superseded guidance

- `.cursor/plans/python_runtime_js_94dc0fcc.plan.md` — historical; prefer this file + `docs/COMPATIBILITY_AND_GAPS.md` for shipped truth.
- Do not claim “zero discrepancies” or “complete Python” without narrowing to a tested subset in the compatibility matrix.
