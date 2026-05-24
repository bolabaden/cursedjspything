# Repository signals

`[REPO]` Archaeology snapshot (2026-05-23). Re-verify on structural changes.

---

## Layout

| Path | Role |
|------|------|
| `src/runtime/` | Core implementation |
| `test/` | Vitest (223 tests, 28 files) |
| `test/cpython-derived/` | Curated CPython `Lib/test` ports |
| `test/golden/` | Golden key-parity snapshot tests |
| `examples/python-vs-js.ts` | 39 narrative sections |
| `docs/COMPATIBILITY_AND_GAPS.md` | Exhaustive compatibility |
| `docs/knowledgebase/` | Layered KB |
| `scripts/golden/` | CPython cross-check harness |
| `.github/workflows/ci.yml` | L1 + L2 + golden matrix |

---

## Test → module map

| Test file | Primary module |
|-----------|----------------|
| `test/core/slots.test.ts` | `core/slots.ts` |
| `test/core/object-model.test.ts` | `core/object.ts`, `core/lookup.ts` |
| `test/dispatch/operators.test.ts` | `dispatch/operators/` |
| `test/class/system.test.ts` | `class/class.ts` |
| `test/dispatch/protocols.test.ts` | `dispatch/protocols.ts` |
| `test/builtins/dict-keys.test.ts` | `collections/dict-keys.ts`, `builtins/dict.ts` |
| `test/cpython-derived/*.test.ts` | Tier A CPython evidence (operator, isinstance, contains, sequence index) |
| `test/golden/key-parity.test.ts` | `scripts/golden/keys.ts`, `pyrt-cases.ts` |
| `test/golden/pyrt-cases-version-gates.test.ts` | Offline `buildPyrtCases` version-gate semantics |

No dedicated `builtins.test.ts` — builtins covered via object/protocol tests.

---

## Gaps vs ideal OSS hygiene

| Item | Status |
|------|--------|
| `LICENSE` file | `[OPEN]` README says MIT; file may be missing |
| `.gitignore` | `[REPO]` present |
| CI | `[REPO]` `.github/workflows/ci.yml` — check + test + golden matrix |
| Golden vs CPython | `[REPO]` `npm run golden`; key-parity guard before value compare |
| `tsx` in devDependencies | `[OPEN]` examples use `npx tsx` |

Tracked in [../LIVING-PLAN.md](../LIVING-PLAN.md).

---

## Claims audit

| Source | Risk |
|--------|------|
| `.cursor/plans/python_runtime_js_94dc0fcc.plan.md` | May overstate vs shipped |
| `COMPATIBILITY_AND_GAPS.md` | Authoritative for API surface |
| KB version matrix | Authoritative for pinned 3.9–3.14 URLs |

Do not edit the plan file for KB sync; reference KB instead.
